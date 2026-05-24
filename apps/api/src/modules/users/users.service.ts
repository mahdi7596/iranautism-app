import { Inject, Injectable } from "@nestjs/common";

import { PrismaService } from "../../infrastructure/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  findByMobile(mobile: string) {
    return this.prisma.user.findUnique({
      where: { mobile },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOrCreateByMobile(mobile: string) {
    const existingUser = await this.findByMobile(mobile);

    if (existingUser) {
      return existingUser;
    }

    return this.prisma.user.create({
      data: {
        mobile,
        status: "ACTIVE",
      },
    });
  }
}
