import { Controller, Get, Headers, Inject } from "@nestjs/common";

import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import { AuthService } from "./auth.service";

@Controller("/api/account")
export class AccountController {
  constructor(
    @Inject(AuthService)
    private readonly auth: AuthService,
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  @Get("/pump-missions/history")
  async getPumpMissionHistory(@Headers("authorization") authorizationHeader?: string) {
    const { user } = await this.auth.getCurrentUser(authorizationHeader);
    const completions = await this.prisma.partnerMissionCompletion.findMany({
      where: {
        userId: user.id,
      },
      include: {
        mission: true,
      },
      orderBy: {
        lastQualifiedAt: "desc",
      },
    });

    return {
      items: completions.map((completion) => ({
        missionId: completion.mission.missionKey,
        completed: completion.completed,
        completionCount: completion.completionCount,
        completedAt: completion.lastQualifiedAt?.toISOString(),
      })),
    };
  }
}
