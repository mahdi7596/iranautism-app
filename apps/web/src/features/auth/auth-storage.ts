"use client";

const accessTokenKey = "iranautism.accessToken";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getStoredAccessToken() {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(accessTokenKey);
}

export function storeAccessToken(accessToken: string) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(accessTokenKey, accessToken);
}

export function clearStoredAccessToken() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(accessTokenKey);
}
