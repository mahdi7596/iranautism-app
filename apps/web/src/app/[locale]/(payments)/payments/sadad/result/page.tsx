import type { Metadata } from "next";

import { PAYMENT_RESULT_COPY } from "../../../../../../features/payments/payment.constants";
import { SadadResult } from "../../../../../../features/payments/sadad-result";

export const metadata: Metadata = {
  title: PAYMENT_RESULT_COPY.metadata.title,
  description: PAYMENT_RESULT_COPY.metadata.description,
};

export default function SadadResultPage() {
  return <SadadResult />;
}
