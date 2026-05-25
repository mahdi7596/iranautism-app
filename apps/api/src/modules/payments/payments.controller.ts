import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from "@nestjs/common";

import { DtoValidationPipe } from "../../common/pipes/dto-validation.pipe";
import {
  SadadCallbackDto,
  SadadCallbackInput,
  StartPaymentDto,
} from "./payment.dto";
import { PaymentsService } from "./payments.service";

@Controller()
export class PaymentsController {
  constructor(
    @Inject(PaymentsService)
    private readonly payments: PaymentsService,
  ) {}

  @Post("/api/payments/:paymentTransactionId/start")
  startPayment(
    @Param("paymentTransactionId") paymentTransactionId: string,
    @Body(new DtoValidationPipe(StartPaymentDto)) body: StartPaymentDto,
  ) {
    return this.payments.startPayment({
      paymentTransactionId,
      callbackUrl: body.callbackUrl,
    });
  }

  @Get("/api/payments/:paymentTransactionId/status")
  getPaymentStatus(@Param("paymentTransactionId") paymentTransactionId: string) {
    return this.payments.getPaymentResultStatus(paymentTransactionId);
  }

  @Post("/api/payments/sadad/callback")
  handleSadadPostCallback(
    @Body(new DtoValidationPipe(SadadCallbackDto)) body: SadadCallbackDto,
  ) {
    return this.handleSadadCallback(body);
  }

  @Get("/api/payments/sadad/callback")
  handleSadadGetCallback(
    @Query(new DtoValidationPipe(SadadCallbackDto)) query: SadadCallbackDto,
  ) {
    return this.handleSadadCallback(query);
  }

  private handleSadadCallback(input: SadadCallbackInput) {
    const token = input.Token || input.token;
    const providerStatusCode = input.ResCode || input.resCode;
    const orderId = input.OrderId || input.orderId;

    if (!token) {
      throw new BadRequestException("توکن پرداخت سداد ارسال نشده است.");
    }

    if (!providerStatusCode) {
      throw new BadRequestException("وضعیت پرداخت سداد ارسال نشده است.");
    }

    return this.payments.verifySadadCallback({
      providerAuthority: token,
      providerStatusCode,
      orderId,
    });
  }
}
