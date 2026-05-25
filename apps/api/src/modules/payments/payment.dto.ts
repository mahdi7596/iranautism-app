import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class StartPaymentDto {
  @IsString()
  @IsNotEmpty()
  callbackUrl!: string;
}

export type SadadCallbackInput = {
  Token?: string;
  token?: string;
  ResCode?: string;
  resCode?: string;
  OrderId?: string;
  orderId?: string;
};

export class SadadCallbackDto {
  @IsOptional()
  @IsString()
  Token?: string;

  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  ResCode?: string;

  @IsOptional()
  @IsString()
  resCode?: string;

  @IsOptional()
  @IsString()
  OrderId?: string;

  @IsOptional()
  @IsString()
  orderId?: string;
}
