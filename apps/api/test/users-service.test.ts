import assert from "node:assert/strict";
import { test } from "node:test";

import { UsersService } from "../src/modules/users/users.service";

test("UsersService finds a user by mobile", async () => {
  const service = new UsersService({
    user: {
      findUnique: async (input: unknown) => {
        assert.deepEqual(input, {
          where: { mobile: "09123456789" },
        });
        return { id: "user_1", mobile: "09123456789" };
      },
    },
  } as never);

  assert.deepEqual(await service.findByMobile("09123456789"), {
    id: "user_1",
    mobile: "09123456789",
  });
});

test("UsersService creates a mobile identity when no user exists", async () => {
  const calls: unknown[] = [];
  const service = new UsersService({
    user: {
      findUnique: async (input: unknown) => {
        calls.push(input);
        return null;
      },
      create: async (input: unknown) => {
        calls.push(input);
        return { id: "user_1", mobile: "09123456789" };
      },
    },
  } as never);

  assert.deepEqual(await service.findOrCreateByMobile("09123456789"), {
    id: "user_1",
    mobile: "09123456789",
  });
  assert.deepEqual(calls, [
    {
      where: { mobile: "09123456789" },
    },
    {
      data: {
        mobile: "09123456789",
        status: "ACTIVE",
      },
    },
  ]);
});

test("UsersService returns the existing mobile identity when it exists", async () => {
  const calls: unknown[] = [];
  const service = new UsersService({
    user: {
      findUnique: async (input: unknown) => {
        calls.push(input);
        return { id: "user_1", mobile: "09123456789" };
      },
      create: async () => {
        throw new Error("Should not create a duplicate user");
      },
    },
  } as never);

  assert.deepEqual(await service.findOrCreateByMobile("09123456789"), {
    id: "user_1",
    mobile: "09123456789",
  });
  assert.deepEqual(calls, [
    {
      where: { mobile: "09123456789" },
    },
  ]);
});
