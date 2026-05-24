-- CreateEnum
CREATE TYPE "DonationDonorKind" AS ENUM ('REGISTERED', 'GUEST');

-- CreateEnum
CREATE TYPE "DonationPublicVisibility" AS ENUM ('ANONYMOUS', 'DISPLAY_NAME', 'INITIALS', 'HIDDEN');

-- CreateEnum
CREATE TYPE "DonationTargetType" AS ENUM ('GENERAL', 'PROJECT', 'PHASE', 'ITEM', 'CAMPAIGN');

-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED', 'CANCELLED', 'EXPIRED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentTransactionStatus" AS ENUM ('PENDING', 'REDIRECTED', 'VERIFICATION_PENDING', 'SUCCESSFUL', 'FAILED', 'CANCELLED', 'MISMATCH', 'EXPIRED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PartnerMissionResultType" AS ENUM ('COUNT_BASED', 'STATUS_BASED');

-- CreateTable
CREATE TABLE "donations" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "donor_kind" "DonationDonorKind" NOT NULL,
    "donor_display_name" VARCHAR(160),
    "mobile_snapshot" VARCHAR(20),
    "public_visibility" "DonationPublicVisibility" NOT NULL DEFAULT 'ANONYMOUS',
    "target_type" "DonationTargetType" NOT NULL DEFAULT 'GENERAL',
    "target_id" UUID,
    "target_label_snapshot" VARCHAR(200),
    "status" "DonationStatus" NOT NULL DEFAULT 'PENDING',
    "amount" BIGINT NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'IRR',
    "confirmed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" UUID NOT NULL,
    "donation_id" UUID NOT NULL,
    "gateway" VARCHAR(80) NOT NULL,
    "status" "PaymentTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "amount" BIGINT NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'IRR',
    "provider_authority" VARCHAR(160),
    "provider_reference" VARCHAR(160),
    "idempotency_key" VARCHAR(160),
    "correlation_id" VARCHAR(160),
    "callback_received_at" TIMESTAMP(3),
    "verified_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),
    "failure_code" VARCHAR(120),
    "provider_response_summary" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_missions" (
    "id" UUID NOT NULL,
    "partner" VARCHAR(80) NOT NULL,
    "mission_key" VARCHAR(120) NOT NULL,
    "result_type" "PartnerMissionResultType" NOT NULL,
    "campaign_starts_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_mission_completions" (
    "id" UUID NOT NULL,
    "mission_id" UUID NOT NULL,
    "user_id" UUID,
    "qualifying_donation_id" UUID,
    "mobile_snapshot" VARCHAR(20) NOT NULL,
    "completion_count" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "last_qualified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_mission_completions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "donations_user_id_idx" ON "donations"("user_id");

-- CreateIndex
CREATE INDEX "donations_donor_kind_idx" ON "donations"("donor_kind");

-- CreateIndex
CREATE INDEX "donations_status_idx" ON "donations"("status");

-- CreateIndex
CREATE INDEX "donations_target_type_target_id_idx" ON "donations"("target_type", "target_id");

-- CreateIndex
CREATE INDEX "donations_created_at_idx" ON "donations"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_idempotency_key_key" ON "payment_transactions"("idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_gateway_provider_authority_key" ON "payment_transactions"("gateway", "provider_authority");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_gateway_provider_reference_key" ON "payment_transactions"("gateway", "provider_reference");

-- CreateIndex
CREATE INDEX "payment_transactions_donation_id_idx" ON "payment_transactions"("donation_id");

-- CreateIndex
CREATE INDEX "payment_transactions_status_idx" ON "payment_transactions"("status");

-- CreateIndex
CREATE INDEX "payment_transactions_gateway_idx" ON "payment_transactions"("gateway");

-- CreateIndex
CREATE INDEX "payment_transactions_correlation_id_idx" ON "payment_transactions"("correlation_id");

-- CreateIndex
CREATE INDEX "payment_transactions_created_at_idx" ON "payment_transactions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "partner_missions_partner_mission_key_key" ON "partner_missions"("partner", "mission_key");

-- CreateIndex
CREATE INDEX "partner_missions_partner_idx" ON "partner_missions"("partner");

-- CreateIndex
CREATE INDEX "partner_missions_result_type_idx" ON "partner_missions"("result_type");

-- CreateIndex
CREATE UNIQUE INDEX "partner_mission_completions_mission_id_mobile_snapshot_key" ON "partner_mission_completions"("mission_id", "mobile_snapshot");

-- CreateIndex
CREATE INDEX "partner_mission_completions_user_id_idx" ON "partner_mission_completions"("user_id");

-- CreateIndex
CREATE INDEX "partner_mission_completions_qualifying_donation_id_idx" ON "partner_mission_completions"("qualifying_donation_id");

-- CreateIndex
CREATE INDEX "partner_mission_completions_last_qualified_at_idx" ON "partner_mission_completions"("last_qualified_at");

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_donation_id_fkey" FOREIGN KEY ("donation_id") REFERENCES "donations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_mission_completions" ADD CONSTRAINT "partner_mission_completions_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "partner_missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_mission_completions" ADD CONSTRAINT "partner_mission_completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_mission_completions" ADD CONSTRAINT "partner_mission_completions_qualifying_donation_id_fkey" FOREIGN KEY ("qualifying_donation_id") REFERENCES "donations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
