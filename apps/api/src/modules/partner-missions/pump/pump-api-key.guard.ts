import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class PumpApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const configuredApiKey = process.env.PUMP_PARTNER_API_KEY;
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
    }>();
    const providedApiKey = request.headers["x-pump-api-key"];

    if (
      !configuredApiKey ||
      Array.isArray(providedApiKey) ||
      providedApiKey !== configuredApiKey
    ) {
      throw new UnauthorizedException("Invalid Pump partner API key.");
    }

    return true;
  }
}
