import assert from "node:assert/strict";
import { after, before, test } from "node:test";

process.env.DATABASE_URL ??=
  "postgresql://iranautism:change-me-local-only@127.0.0.1:55434/iranautism_test?schema=public";

import { PrismaService } from "../src/infrastructure/prisma/prisma.service";
import { DonationsService } from "../src/modules/donations/donations.service";
import { PartnerMissionsService } from "../src/modules/partner-missions/partner-missions.service";
import { PUMP_PARTNER_KEY } from "../src/modules/partner-missions/pump/pump.contracts";
import { PumpMissionFlowService } from "../src/modules/partner-missions/pump/pump-mission-flow.service";
import { PaymentsService } from "../src/modules/payments/payments.service";

const missionId = `pump-db-${Date.now()}`;
const mobile = "09123456789";
const registeredMobile = "09123456780";
const mobileOnlyMobile = "09123456781";
const verifiedRegisteredMobile = "09123456782";
const verifiedMobileOnlyMobile = "09123456783";

const prisma = new PrismaService();
const flow = new PumpMissionFlowService(
  new DonationsService(prisma),
  new PaymentsService(prisma),
  new PartnerMissionsService(prisma),
);

before(async () => {
  await prisma.$connect();
  await prisma.partnerMission.create({
    data: {
      partner: PUMP_PARTNER_KEY,
      missionKey: missionId,
      resultType: "COUNT_BASED",
      campaignStartsAt: new Date("2026-05-24T00:00:00.000Z"),
    },
  });
});

after(async () => {
  await prisma.partnerMissionCompletion.deleteMany({
    where: {
      mission: {
        missionKey: missionId,
      },
    },
  });
  await prisma.paymentTransaction.deleteMany({
    where: {
      donation: {
        targetLabelSnapshot: missionId,
      },
    },
  });
  await prisma.donation.deleteMany({
    where: {
      targetLabelSnapshot: missionId,
    },
  });
  await prisma.user.deleteMany({
    where: {
      mobile: {
        in: [registeredMobile, verifiedRegisteredMobile],
      },
    },
  });
  await prisma.partnerMission.deleteMany({
    where: {
      partner: PUMP_PARTNER_KEY,
      missionKey: missionId,
    },
  });
  await prisma.$disconnect();
});

test("Registered Pump donation completes after verified Sadad payment", async () => {
  const donations = new DonationsService(prisma);
  const payments = new PaymentsService(prisma);
  const partnerMissions = new PartnerMissionsService(prisma);
  const user = await prisma.user.create({
    data: {
      mobile: verifiedRegisteredMobile,
      status: "ACTIVE",
    },
  });
  const donation = await donations.createPumpDonationIntent({
    identity: {
      kind: "REGISTERED",
      userId: user.id,
      mobile: verifiedRegisteredMobile,
    },
    missionId,
    amountIrr: 4_000_000n,
  });
  const payment = await payments.createDonationPaymentAttempt({
    donationId: donation.id,
    gateway: "sadad",
    amountIrr: 4_000_000n,
    idempotencyKey: `${missionId}-registered-sadad`,
  });
  const started = await payments.startPayment({
    paymentTransactionId: payment.id,
    callbackUrl: "https://example.test/api/payments/sadad/callback",
  });

  assert.equal(started.status, "REDIRECTED");
  assert.deepEqual(
    await payments.verifySadadCallback({
      providerAuthority: started.providerAuthority,
      providerStatusCode: "0",
      orderId: payment.id,
    }),
    {
      paymentTransactionId: payment.id,
      donationId: donation.id,
      status: "SUCCESSFUL",
    },
  );

  const persistedDonation = await prisma.donation.findUniqueOrThrow({
    where: { id: donation.id },
  });
  const persistedPayment = await prisma.paymentTransaction.findUniqueOrThrow({
    where: { id: payment.id },
  });

  assert.equal(persistedDonation.status, "CONFIRMED");
  assert.equal(persistedPayment.status, "SUCCESSFUL");
  assert.deepEqual(
    await partnerMissions.getPumpVerificationResult({
      missionId,
      mobile: verifiedRegisteredMobile,
    }),
    {
      mobile: verifiedRegisteredMobile,
      missionId,
      count: 1,
    },
  );
});

test("Mobile-only Pump donation completes after verified Sadad payment", async () => {
  const payments = new PaymentsService(prisma);
  const partnerMissions = new PartnerMissionsService(prisma);
  const startedIntent = await flow.startDonationIntent({
    mobile: verifiedMobileOnlyMobile,
    missionId,
    amountIrr: 5_000_000n,
    gateway: "sadad",
    idempotencyKey: `${missionId}-mobile-only-sadad`,
  });
  const startedPayment = await payments.startPayment({
    paymentTransactionId: startedIntent.paymentTransactionId,
    callbackUrl: "https://example.test/api/payments/sadad/callback",
  });

  assert.deepEqual(
    await payments.verifySadadCallback({
      providerAuthority: startedPayment.providerAuthority,
      providerStatusCode: "0",
      orderId: startedIntent.paymentTransactionId,
    }),
    {
      paymentTransactionId: startedIntent.paymentTransactionId,
      donationId: startedIntent.donationId,
      status: "SUCCESSFUL",
    },
  );

  assert.deepEqual(
    await partnerMissions.getPumpVerificationResult({
      missionId,
      mobile: verifiedMobileOnlyMobile,
    }),
    {
      mobile: verifiedMobileOnlyMobile,
      missionId,
      count: 1,
    },
  );
});

test("Repeated Sadad callbacks do not duplicate Pump completion count", async () => {
  const payments = new PaymentsService(prisma);
  const partnerMissions = new PartnerMissionsService(prisma);
  const startedIntent = await flow.startDonationIntent({
    mobile: `${mobile.slice(0, 9)}84`,
    missionId,
    amountIrr: 6_000_000n,
    gateway: "sadad",
    idempotencyKey: `${missionId}-duplicate-callback`,
  });
  const startedPayment = await payments.startPayment({
    paymentTransactionId: startedIntent.paymentTransactionId,
    callbackUrl: "https://example.test/api/payments/sadad/callback",
  });

  await payments.verifySadadCallback({
    providerAuthority: startedPayment.providerAuthority,
    providerStatusCode: "0",
    orderId: startedIntent.paymentTransactionId,
  });
  await payments.verifySadadCallback({
    providerAuthority: startedPayment.providerAuthority,
    providerStatusCode: "0",
    orderId: startedIntent.paymentTransactionId,
  });

  assert.deepEqual(
    await partnerMissions.getPumpVerificationResult({
      missionId,
      mobile: `${mobile.slice(0, 9)}84`,
    }),
    {
      mobile: `${mobile.slice(0, 9)}84`,
      missionId,
      count: 1,
    },
  );
});

test("Registered Pump donation intent persists user ownership", async () => {
  const donations = new DonationsService(prisma);
  const user = await prisma.user.create({
    data: {
      mobile: registeredMobile,
      status: "ACTIVE",
    },
  });

  const donation = await donations.createPumpDonationIntent({
    identity: {
      kind: "REGISTERED",
      userId: user.id,
      mobile: registeredMobile,
    },
    missionId,
    amountIrr: 3_000_000n,
  });
  const persisted = await prisma.donation.findUniqueOrThrow({
    where: {
      id: donation.id,
    },
  });

  assert.equal(persisted.userId, user.id);
  assert.equal(persisted.donorKind, "REGISTERED");
  assert.equal(persisted.mobileSnapshot, registeredMobile);
  assert.equal(persisted.targetLabelSnapshot, missionId);
});

test("Mobile-only Pump donation intent persists without user ownership", async () => {
  const donations = new DonationsService(prisma);

  const donation = await donations.createPumpDonationIntent({
    identity: {
      kind: "MOBILE_ONLY",
      mobile: mobileOnlyMobile,
    },
    missionId,
    amountIrr: 3_000_000n,
  });
  const persisted = await prisma.donation.findUniqueOrThrow({
    where: {
      id: donation.id,
    },
  });

  assert.equal(persisted.userId, null);
  assert.equal(persisted.donorKind, "GUEST");
  assert.equal(persisted.mobileSnapshot, mobileOnlyMobile);
  assert.equal(persisted.targetLabelSnapshot, missionId);
});

test("Pump donation mission flow persists donation, payment, and completion rows", async () => {
  const started = await flow.startDonationIntent({
    mobile,
    missionId,
    amountIrr: 2_500_000n,
    donorDisplayName: "Database Test Donor",
    gateway: "stub",
    idempotencyKey: `${missionId}-idem`,
    correlationId: `${missionId}-corr`,
  });

  assert.equal(started.status, "PENDING");

  const pendingDonation = await prisma.donation.findUniqueOrThrow({
    where: {
      id: started.donationId,
    },
  });
  const pendingPayment = await prisma.paymentTransaction.findUniqueOrThrow({
    where: {
      id: started.paymentTransactionId,
    },
  });

  assert.equal(pendingDonation.status, "PENDING");
  assert.equal(pendingDonation.mobileSnapshot, mobile);
  assert.equal(pendingDonation.targetLabelSnapshot, missionId);
  assert.equal(pendingDonation.amount, 2_500_000n);
  assert.equal(pendingPayment.status, "PENDING");
  assert.equal(pendingPayment.donationId, started.donationId);
  assert.equal(pendingPayment.amount, 2_500_000n);

  assert.deepEqual(
    await flow.confirmDonationMission({
      missionId,
      mobile,
      donationId: started.donationId,
      paymentTransactionId: started.paymentTransactionId,
      providerReference: `${missionId}-provider-ref`,
    }),
    {
      mobile,
      missionId,
      count: 1,
    },
  );

  const confirmedDonation = await prisma.donation.findUniqueOrThrow({
    where: {
      id: started.donationId,
    },
  });
  const successfulPayment = await prisma.paymentTransaction.findUniqueOrThrow({
    where: {
      id: started.paymentTransactionId,
    },
  });
  const completion = await prisma.partnerMissionCompletion.findFirstOrThrow({
    where: {
      mobileSnapshot: mobile,
      mission: {
        missionKey: missionId,
      },
    },
  });

  assert.equal(confirmedDonation.status, "CONFIRMED");
  assert.ok(confirmedDonation.confirmedAt);
  assert.equal(successfulPayment.status, "SUCCESSFUL");
  assert.equal(successfulPayment.providerReference, `${missionId}-provider-ref`);
  assert.ok(successfulPayment.verifiedAt);
  assert.equal(completion.qualifyingDonationId, started.donationId);
  assert.equal(completion.completionCount, 1);
  assert.equal(completion.completed, true);

  assert.deepEqual(await flow.getVerificationResult({ missionId, mobile }), {
    mobile,
    missionId,
    count: 1,
  });
});
