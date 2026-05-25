import { Module } from "@nestjs/common";

import {
  FakePaymentGateway,
  PAYMENT_GATEWAY,
} from "../../infrastructure/payment-gateways/payment-gateway";
import { readSadadConfig } from "../../infrastructure/payment-gateways/sadad.config";
import { SadadPaymentGateway } from "../../infrastructure/payment-gateways/sadad-payment.gateway";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    {
      provide: PAYMENT_GATEWAY,
      useFactory: () => {
        const sadadConfig = readSadadConfig(process.env);

        return sadadConfig.configured
          ? new SadadPaymentGateway(sadadConfig)
          : new FakePaymentGateway();
      },
    },
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
