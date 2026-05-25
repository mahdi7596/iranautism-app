import type { Metadata } from "next";

import { AUTH_COPY } from "../../../../features/auth/auth.constants";
import { LoginForm } from "../../../../features/auth/login-form";

export const metadata: Metadata = {
  title: AUTH_COPY.metadata.title,
  description: AUTH_COPY.metadata.description,
};

export default function LoginPage() {
  return <LoginForm />;
}
