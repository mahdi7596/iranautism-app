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
      mobileSnapshot: mobile,
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
  await prisma.partnerMission.deleteMany({
    where: {
      partner: PUMP_PARTNER_KEY,
      missionKey: missionId,
    },
  });
  await prisma.$disconnect();
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
