import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  extractPaymentTransactionId,
  getPaymentResultViewModel,
} from "./payment-result";
import { PAYMENT_RESULT_COPY } from "./payment.constants";

describe("payment result helpers", () => {
  it("extracts payment id from supported query names", () => {
    assert.equal(
      extractPaymentTransactionId(new URLSearchParams("OrderId=payment_1")),
      "payment_1",
    );
    assert.equal(
      extractPaymentTransactionId(new URLSearchParams("paymentTransactionId=payment_2")),
      "payment_2",
    );
  });

  it("renders successful status as completed mission", () => {
    const viewModel = getPaymentResultViewModel("SUCCESSFUL");

    assert.equal(viewModel.tone, "success");
    assert.equal(viewModel.title, PAYMENT_RESULT_COPY.statuses.success.title);
    assert.equal(viewModel.canRetry, false);
  });

  it("renders failed and pending states without claiming completion", () => {
    assert.equal(getPaymentResultViewModel("FAILED").tone, "danger");
    assert.equal(getPaymentResultViewModel("CANCELLED").canRetry, true);
    assert.equal(getPaymentResultViewModel("VERIFICATION_PENDING").tone, "pending");
    assert.equal(
      getPaymentResultViewModel("PENDING").description,
      PAYMENT_RESULT_COPY.statuses.pending.description,
    );
  });
});
