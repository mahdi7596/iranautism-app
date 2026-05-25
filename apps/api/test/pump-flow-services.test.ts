import assert from "node:assert/strict";
import { test } from "node:test";

import { DonationsService } from "../src/modules/donations/donations.service";
import { PartnerMissionsService } from "../src/modules/partner-missions/partner-missions.service";
import { PumpMissionFlowService } from "../src/modules/partner-missions/pump/pump-mission-flow.service";
import { PaymentsService } from "../src/modules/payments/payments.service";

test("DonationsService creates a pending Pump donation intent", async () => {
  const calls: unknown[] = [];
  const service = new DonationsService({
    donation: {
      create: async (input: unknown) => {
        calls.push(input);
        return { id: "donation_1" };
      },
    },
  } as never);

  const donation = await service.createPumpDonationIntent({
    mobile: "09123456789",
    missionId: "iran-autism-general-donation",
    amountIrr: 2_000_000n,
    donorDisplayName: "Test Donor",
    correlationId: "corr_1",
  });

  assert.deepEqual(donation, { id: "donation_1" });
  assert.deepEqual(calls, [
    {
      data: {
        userId: null,
        donorKind: "GUEST",
        donorDisplayName: "Test Donor",
        mobileSnapshot: "09123456789",
        publicVisibility: "ANONYMOUS",
        targetType: "CAMPAIGN",
        targetLabelSnapshot: "iran-autism-general-donation",
        status: "PENDING",
        amount: 2_000_000n,
        currency: "IRR",
      },
    },
  ]);
});

test("DonationsService creates registered Pump donation intents with user ownership", async () => {
  const calls: unknown[] = [];
  const service = new DonationsService({
    donation: {
      create: async (input: unknown) => {
        calls.push(input);
        return { id: "donation_1" };
      },
    },
  } as never);

  await service.createPumpDonationIntent({
    identity: {
      kind: "REGISTERED",
      userId: "user_1",
      mobile: "09123456789",
    },
    missionId: "iran-autism-general-donation",
    amountIrr: 2_000_000n,
  });

  assert.deepEqual(calls, [
    {
      data: {
        userId: "user_1",
        donorKind: "REGISTERED",
        donorDisplayName: undefined,
        mobileSnapshot: "09123456789",
        publicVisibility: "ANONYMOUS",
        targetType: "CAMPAIGN",
        targetLabelSnapshot: "iran-autism-general-donation",
        status: "PENDING",
        amount: 2_000_000n,
        currency: "IRR",
      },
    },
  ]);
});

test("DonationsService creates mobile-only Pump donation intents without user ownership", async () => {
  const calls: unknown[] = [];
  const service = new DonationsService({
    donation: {
      create: async (input: unknown) => {
        calls.push(input);
        return { id: "donation_1" };
      },
    },
  } as never);

  await service.createPumpDonationIntent({
    identity: {
      kind: "MOBILE_ONLY",
      mobile: "09123456789",
    },
    missionId: "iran-autism-general-donation",
    amountIrr: 2_000_000n,
  });

  assert.deepEqual(calls, [
    {
      data: {
        userId: null,
        donorKind: "GUEST",
        donorDisplayName: undefined,
        mobileSnapshot: "09123456789",
        publicVisibility: "ANONYMOUS",
        targetType: "CAMPAIGN",
        targetLabelSnapshot: "iran-autism-general-donation",
        status: "PENDING",
        amount: 2_000_000n,
        currency: "IRR",
      },
    },
  ]);
});

test("PaymentsService records a pending payment transaction attempt", async () => {
  const calls: unknown[] = [];
  const service = new PaymentsService({
    paymentTransaction: {
      create: async (input: unknown) => {
        calls.push(input);
        return { id: "payment_1" };
      },
    },
  } as never);

  const payment = await service.createDonationPaymentAttempt({
    donationId: "donation_1",
    gateway: "stub",
    amountIrr: 2_000_000n,
    idempotencyKey: "idem_1",
    correlationId: "corr_1",
  });

  assert.deepEqual(payment, { id: "payment_1" });
  assert.deepEqual(calls, [
    {
      data: {
        donationId: "donation_1",
        gateway: "stub",
        status: "PENDING",
        amount: 2_000_000n,
        currency: "IRR",
        idempotencyKey: "idem_1",
        correlationId: "corr_1",
      },
    },
  ]);
});

test("PaymentsService starts a pending payment and stores gateway redirect data", async () => {
  const updates: unknown[] = [];
  const service = new PaymentsService(
    {
      paymentTransaction: {
        findUnique: async () => ({
          id: "payment_1",
          amount: 2_000_000n,
          status: "PENDING",
        }),
        update: async (input: unknown) => {
          updates.push(input);
          return { id: "payment_1" };
        },
      },
    } as never,
    {
      startPayment: async () => ({
        providerAuthority: "authority_1",
        redirectUrl: "https://sadad.example.test/redirect",
      }),
      verifyPayment: async () => {
        throw new Error("verifyPayment should not be called");
      },
    },
  );

  assert.deepEqual(
    await service.startPayment({
      paymentTransactionId: "payment_1",
      callbackUrl: "https://example.test/api/payments/sadad/callback",
    }),
    {
      paymentTransactionId: "payment_1",
      providerAuthority: "authority_1",
      redirectUrl: "https://sadad.example.test/redirect",
      status: "REDIRECTED",
    },
  );
  assert.equal((updates[0] as { where: { id: string } }).where.id, "payment_1");
  assert.equal(
    (updates[0] as { data: { providerAuthority: string } }).data
      .providerAuthority,
    "authority_1",
  );
  assert.equal(
    (updates[0] as { data: { status: string } }).data.status,
    "REDIRECTED",
  );
});

test("PaymentsService records Sadad callback and confirms donation after verified success", async () => {
  const paymentUpdates: unknown[] = [];
  const donationUpdates: unknown[] = [];
  const service = new PaymentsService(
    {
      paymentTransaction: {
        findFirst: async () => ({
          id: "payment_1",
          donationId: "donation_1",
          amount: 2_000_000n,
        }),
        update: async (input: unknown) => {
          paymentUpdates.push(input);
          return { id: "payment_1" };
        },
      },
      donation: {
        update: async (input: unknown) => {
          donationUpdates.push(input);
          return { id: "donation_1" };
        },
      },
    } as never,
    {
      startPayment: async () => {
        throw new Error("startPayment should not be called");
      },
      verifyPayment: async () => ({
        status: "SUCCESSFUL",
        providerReference: "reference_1",
        amountIrr: 2_000_000n,
      }),
    },
  );

  assert.deepEqual(
    await service.verifySadadCallback({
      providerAuthority: "authority_1",
      providerStatusCode: "0",
      orderId: "payment_1",
    }),
    {
      paymentTransactionId: "payment_1",
      donationId: "donation_1",
      status: "SUCCESSFUL",
    },
  );
  assert.equal(
    (paymentUpdates[0] as { data: { status: string } }).data.status,
    "VERIFICATION_PENDING",
  );
  assert.equal(
    (paymentUpdates[1] as { data: { providerReference: string } }).data
      .providerReference,
    "reference_1",
  );
  assert.equal(
    (donationUpdates[0] as { data: { status: string } }).data.status,
    "CONFIRMED",
  );
});

test("PaymentsService does not confirm donation after failed Sadad verification", async () => {
  const paymentUpdates: unknown[] = [];
  const donationUpdates: unknown[] = [];
  const service = new PaymentsService(
    {
      paymentTransaction: {
        findFirst: async () => ({
          id: "payment_1",
          donationId: "donation_1",
          amount: 2_000_000n,
        }),
        update: async (input: unknown) => {
          paymentUpdates.push(input);
          return { id: "payment_1" };
        },
      },
      donation: {
        update: async (input: unknown) => {
          donationUpdates.push(input);
          return { id: "donation_1" };
        },
      },
    } as never,
    {
      startPayment: async () => {
        throw new Error("startPayment should not be called");
      },
      verifyPayment: async () => ({
        status: "FAILED",
        failureCode: "SADAD_RES_CODE_17",
      }),
    },
  );

  assert.deepEqual(
    await service.verifySadadCallback({
      providerAuthority: "authority_1",
      providerStatusCode: "17",
      orderId: "payment_1",
    }),
    {
      paymentTransactionId: "payment_1",
      donationId: "donation_1",
      status: "FAILED",
      failureCode: "SADAD_RES_CODE_17",
    },
  );
  assert.equal(
    (paymentUpdates[1] as { data: { status: string } }).data.status,
    "FAILED",
  );
  assert.deepEqual(donationUpdates, []);
});

test("PartnerMissionsService returns count-based Pump verification responses", async () => {
  const service = new PartnerMissionsService({
    partnerMission: {
      findUnique: async () => ({
        id: "mission_uuid",
        missionKey: "iran-autism-general-donation",
        resultType: "COUNT_BASED",
      }),
    },
    partnerMissionCompletion: {
      findUnique: async () => ({
        completionCount: 3,
        completed: true,
      }),
    },
  } as never);

  assert.deepEqual(
    await service.getPumpVerificationResult({
      missionId: "iran-autism-general-donation",
      mobile: "09123456789",
    }),
    {
      mobile: "09123456789",
      missionId: "iran-autism-general-donation",
      count: 3,
    },
  );
});

test("PumpMissionFlowService creates donation and payment records together", async () => {
  const service = new PumpMissionFlowService(
    {
      createPumpDonationIntent: async () => ({ id: "donation_1" }),
    } as never,
    {
      createDonationPaymentAttempt: async () => ({ id: "payment_1" }),
    } as never,
    {} as never,
  );

  assert.deepEqual(
    await service.startDonationIntent({
      mobile: "09123456789",
      missionId: "iran-autism-general-donation",
      amountIrr: 2_000_000n,
      gateway: "stub",
      idempotencyKey: "idem_1",
      correlationId: "corr_1",
    }),
    {
      donationId: "donation_1",
      paymentTransactionId: "payment_1",
      status: "PENDING",
    },
  );
});

test("PumpMissionFlowService confirms a donation mission and returns verification", async () => {
  const calls: string[] = [];
  const service = new PumpMissionFlowService(
    {
      markDonationConfirmed: async () => {
        calls.push("donation");
      },
    } as never,
    {
      markPaymentSuccessful: async () => {
        calls.push("payment");
      },
    } as never,
    {
      recordPumpDonationCompletion: async () => {
        calls.push("completion");
      },
      getPumpVerificationResult: async () => ({
        mobile: "09123456789",
        missionId: "iran-autism-general-donation",
        completed: true,
      }),
    } as never,
  );

  assert.deepEqual(
    await service.confirmDonationMission({
      missionId: "iran-autism-general-donation",
      mobile: "09123456789",
      donationId: "donation_1",
      paymentTransactionId: "payment_1",
      providerReference: "ref_1",
    }),
    {
      mobile: "09123456789",
      missionId: "iran-autism-general-donation",
      completed: true,
    },
  );
  assert.deepEqual(calls, ["payment", "donation", "completion"]);
});
