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
