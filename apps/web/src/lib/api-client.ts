"use client";

import { createApiClient } from "@iranautism/api-client";

import { appConfig } from "../config/app";
import { getStoredAccessToken } from "../features/auth/auth-storage";

export function createBrowserApiClient() {
  return createApiClient({
    baseUrl: appConfig.apiBaseUrl,
    getAccessToken: getStoredAccessToken,
  });
}
