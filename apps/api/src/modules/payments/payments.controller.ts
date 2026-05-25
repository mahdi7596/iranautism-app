import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";

import { DtoValidationPipe } from "../../common/pipes/dto-validation.pipe";
import {
  SadadCallbackDto,
  SadadCallbackInput,
  StartPaymentDto,
} from "./payment.dto";
import { PaymentsService } from "./payments.service";

type HeaderRequest = {
  headers: Record<string, string | string[] | undefined>;
};

type RedirectResponse = {
  status: (code: number) => unknown;
  setHeader: (name: string, value: string) => unknown;
};

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
      resultUrl: body.resultUrl,
    });
  }

  @Get("/api/payments/:paymentTransactionId/status")
  getPaymentStatus(@Param("paymentTransactionId") paymentTransactionId: string) {
    return this.payments.getPaymentResultStatus(paymentTransactionId);
  }

  @Post("/api/payments/sadad/callback")
  handleSadadPostCallback(
    @Body(new DtoValidationPipe(SadadCallbackDto)) body: SadadCallbackDto,
    @Req() request: HeaderRequest,
    @Res({ passthrough: true })
    response: RedirectResponse,
  ) {
    return this.handleSadadCallback(body, request, response);
  }

  @Get("/api/payments/sadad/callback")
  handleSadadGetCallback(
    @Query(new DtoValidationPipe(SadadCallbackDto)) query: SadadCallbackDto,
  ) {
    return this.handleSadadCallback(query);
  }

  private async handleSadadCallback(
    input: SadadCallbackInput,
    request?: HeaderRequest,
    response?: RedirectResponse,
  ) {
    const token = input.Token || input.token;
    const providerStatusCode = input.ResCode || input.resCode;
    const orderId = input.OrderId || input.orderId;

    if (!token) {
      throw new BadRequestException("توکن پرداخت سداد ارسال نشده است.");
    }

    if (!providerStatusCode) {
      throw new BadRequestException("وضعیت پرداخت سداد ارسال نشده است.");
    }

    const result = await this.payments.verifySadadCallback({
      providerAuthority: token,
      providerStatusCode,
      orderId,
      providerOrderId: input.providerOrderId,
    });

    if (response && prefersHtml(request) && "resultUrl" in result) {
      response.status(302);
      response.setHeader("Location", result.resultUrl);
      return undefined;
    }

    const { resultUrl: _resultUrl, ...apiResult } = result;

    return apiResult;
  }
}

function prefersHtml(request?: HeaderRequest) {
  const accept = request?.headers.accept;
  const acceptHeader = Array.isArray(accept) ? accept.join(",") : accept;

  return acceptHeader?.includes("text/html") ?? false;
}
