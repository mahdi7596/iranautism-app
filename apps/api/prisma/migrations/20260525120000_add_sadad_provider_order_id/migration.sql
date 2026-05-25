-- Add Sadad-compatible numeric provider order IDs while preserving UUID primary keys.
CREATE SEQUENCE "payment_transactions_provider_order_id_seq";

ALTER TABLE "payment_transactions"
ADD COLUMN "provider_order_id" BIGINT NOT NULL DEFAULT nextval('"payment_transactions_provider_order_id_seq"');

ALTER SEQUENCE "payment_transactions_provider_order_id_seq"
OWNED BY "payment_transactions"."provider_order_id";

CREATE UNIQUE INDEX "payment_transactions_provider_order_id_key"
ON "payment_transactions"("provider_order_id");
