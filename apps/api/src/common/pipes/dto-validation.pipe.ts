import {
  BadRequestException,
  Injectable,
  PipeTransform,
  Type,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

@Injectable()
export class DtoValidationPipe<T extends object> implements PipeTransform {
  constructor(private readonly dtoClass: Type<T>) {}

  transform(value: unknown): T {
    const instance = plainToInstance(this.dtoClass, value);
    const errors = validateSync(instance, {
      forbidNonWhitelisted: true,
      whitelist: true,
    });

    if (errors.length > 0) {
      throw new BadRequestException("ورودی درخواست نامعتبر است.");
    }

    return instance;
  }
}
