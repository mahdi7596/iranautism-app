# User, Admin, Auth, And Log Database Design

Date: 2026-05-23

Status: Draft decision for first database slice

Related architecture topics:

- AR-02: Prisma and data ownership rules
- AR-04: Admin API, public API, account API, and webhook boundaries
- AR-05: Auth, RBAC, permissions, and audit logging
- AR-14: Background jobs, queues, retries, and idempotency
- AR-20: Security, privacy, and data-retention posture

## 1. Documents Read And Constraints

The design is based on these project documents:

- `AGENTS.md`
- `docs/analysis/client-request-full-understanding.md`
- `docs/product/module-registry.md`
- `docs/decisions/backend-architecture.md`
- `docs/decisions/backend-module-boundaries.md`
- `docs/decisions/repository-architecture.md`
- `docs/product/modules/partner-missions-pump.md`
- `docs/product/modules/recurring-donations-peyman.md`
- `docs/architecture-rules/deep-dive-agenda.md`
- `docs/architecture-rules/progress.md`
- `docs/decisions/change-log.md`
- `docs/analysis/iranautism-database-design-playground.mmd`

Important constraints from those documents:

- The backend is a TypeScript/NestJS modular monolith.
- PostgreSQL is the single primary database.
- Prisma owns migrations and typed database access.
- Redis/BullMQ should handle OTP delivery, short-lived OTP verification state, retries, exports, and background jobs.
- Admin UI lives inside `apps/web` for v1, but all admin authorization is enforced by the NestJS backend.
- Public, account, admin, partner, and webhook API families must stay separate.
- Backend module boundaries should remain strict enough that future domains can grow without tangling identity, financial, CMS, and partner-integration logic.
- Mobile OTP is the preferred user identity path.
- Admin auth, RBAC, permission checks, and audit logs are mandatory.
- Pump partner missions depend on normalized mobile identity and mission verification logs.
- Peyman recurring donations depend on logged-in users, normalized mobile numbers, national code handling, sensitive financial actions, and audit logging.
- Donations, payments, CMS, media, reports, projects, and construction progress are future consumers of this identity and audit layer, but their full schemas should not be designed here.

## 2. Recommended Architecture

Use one shared human identity table for public users and admins, with a separate admin membership/profile table for admin capability.

The first database slice should be owned by these modules:

| Module | Owns |
|---|---|
| `Users` | `users`, `user_profiles`, user status, normalized mobile identity, user-facing profile data |
| `Auth` | OTP challenges, sessions, refresh tokens, devices, login attempts, auth security events |
| `Admin/RBAC` | admin membership, roles, permissions, role assignments |
| `Audit Log` | immutable admin/system audit records |
| `Activity Log` | user-facing activity and account timeline events |

Recommended API posture:

- `/api/public/*`: no user session required unless a route explicitly upgrades into account behavior.
- `/api/account/*`: public user session required.
- `/api/admin/*`: admin membership, active admin status, and permission guard required.
- `/api/partners/*`: partner/API-key security and rate limits, not browser sessions.
- `/api/webhooks/*`: provider verification, idempotency, and dedicated callback logging.

Authorization should use a hybrid RBAC model:

- Roles group permissions for human administration.
- Permissions are the real enforcement primitive in code.
- Guards check permission keys, not role names, except for bootstrap/super-admin behavior.

## 3. Admin Identity Decision

Recommendation: admins should be regular `users` with an `admin_accounts` membership record, not totally separate identities.

Why:

- Mobile-first identity stays consistent across public, donor, Pump, Peyman, and admin flows.
- One person can donate publicly and also act as an admin without duplicate mobile records.
- Session, OTP, device, and security-event handling can be reused.
- Audit logs can reference one stable `actorUserId` while optionally referencing the admin membership used for the action.
- Future admin extraction to `apps/admin` remains possible because backend admin access depends on `admin_accounts`, roles, permissions, and guards, not frontend placement.

Tradeoff:

- A shared `users` table means admin-only fields must not leak into public user APIs. This is handled by keeping admin data in `admin_accounts` and by using route-specific DTOs.

Rejected alternative: totally separate `admin_users`.

- This isolates admin data strongly, but duplicates mobile identity, OTP/session logic, and person-level security state.
- It creates awkward cases when an admin is also a donor or when Peyman/Pump features identify a person by mobile.
- It can still be introduced later only if a hard operational requirement appears.

## 4. Proposed PostgreSQL/Prisma Models

The following models are Prisma-shaped design proposals. Names use PascalCase for Prisma models and explicit table names through `@@map`.

### Users And Profiles

```prisma
model User {
  id                    String              @id @default(uuid()) @db.Uuid
  mobileCountryCode     String              @default("98") @db.VarChar(4)
  mobileNationalNumber  String              @db.VarChar(16)
  mobileE164            String              @unique @db.VarChar(20)
  mobileVerifiedAt      DateTime?
  status                UserStatus          @default(ACTIVE)
  identityType          UserIdentityType    @default(MOBILE)
  lastLoginAt           DateTime?
  blockedAt             DateTime?
  blockedReason         String?             @db.VarChar(500)
  createdAt             DateTime            @default(now())
  updatedAt             DateTime            @updatedAt
  deletedAt             DateTime?

  profile               UserProfile?
  adminAccount          AdminAccount?
  sessions              AuthSession[]
  devices               UserDevice[]
  otpChallenges         OtpChallenge[]
  roles                 UserRoleAssignment[]
  activityLogs          UserActivityLog[]
  authEvents            AuthSecurityEvent[]
  auditLogs             AuditLog[]

  @@index([status])
  @@index([createdAt])
  @@index([deletedAt])
  @@map("users")
}

model UserProfile {
  id                    String      @id @default(uuid()) @db.Uuid
  userId                String      @unique @db.Uuid
  firstName             String?     @db.VarChar(100)
  lastName              String?     @db.VarChar(100)
  displayName           String?     @db.VarChar(160)
  nationalCodeEncrypted String?     @db.Text
  birthDate             DateTime?   @db.Date
  email                 String?     @db.VarChar(255)
  emailVerifiedAt       DateTime?
  city                  String?     @db.VarChar(120)
  province              String?     @db.VarChar(120)
  postalAddress         String?     @db.Text
  marketingOptIn        Boolean     @default(false)
  smsOptIn              Boolean     @default(true)
  metadata              Json?
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt

  user                  User        @relation(fields: [userId], references: [id], onDelete: Restrict)

  @@index([email])
  @@map("user_profiles")
}
```

Notes:

- `mobileE164` is the canonical unique identity key.
- `nationalCodeEncrypted` is optional here because it is not needed for simple OTP login, but Peyman may require it later.
- `deletedAt` supports soft deletion while preserving financial and audit references. Real hard deletion must be a privacy/legal decision, not a default behavior.

### OTP Authentication

```prisma
model OtpChallenge {
  id                 String             @id @default(uuid()) @db.Uuid
  purpose            OtpPurpose
  channel            OtpChannel         @default(SMS)
  mobileE164         String             @db.VarChar(20)
  userId             String?            @db.Uuid
  codeHash           String             @db.Text
  codeSalt           String?            @db.Text
  status             OtpChallengeStatus @default(PENDING)
  requestIp          String?            @db.Inet
  requestUserAgent   String?            @db.Text
  requestFingerprint String?            @db.VarChar(255)
  provider           String?            @db.VarChar(80)
  providerMessageId  String?            @db.VarChar(160)
  sendStatus         OtpSendStatus      @default(QUEUED)
  attemptsCount      Int                @default(0)
  maxAttempts        Int                @default(5)
  expiresAt          DateTime
  verifiedAt         DateTime?
  consumedAt         DateTime?
  lockedUntil        DateTime?
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt

  user               User?              @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([mobileE164, purpose, status])
  @@index([expiresAt])
  @@index([createdAt])
  @@map("otp_challenges")
}

model AuthRateLimitBucket {
  id              String              @id @default(uuid()) @db.Uuid
  scope           AuthRateLimitScope
  key             String              @db.VarChar(255)
  purpose         OtpPurpose?
  windowStartedAt DateTime
  windowEndsAt    DateTime
  attemptsCount   Int                 @default(0)
  blockedUntil    DateTime?
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt

  @@unique([scope, key, purpose, windowStartedAt])
  @@index([blockedUntil])
  @@index([windowEndsAt])
  @@map("auth_rate_limit_buckets")
}
```

Notes:

- OTP values are never stored in plain text.
- Redis should hold short-lived active OTP and throttling state for speed; PostgreSQL keeps durable challenge/security records for investigation.
- Old expired challenges may be retained for a defined security window, then pruned or summarized by a background job.

### Sessions, Refresh Tokens, And Devices

```prisma
model UserDevice {
  id                 String           @id @default(uuid()) @db.Uuid
  userId             String           @db.Uuid
  deviceFingerprint  String?          @db.VarChar(255)
  label              String?          @db.VarChar(120)
  platform           DevicePlatform   @default(UNKNOWN)
  userAgent          String?          @db.Text
  firstIp            String?          @db.Inet
  lastIp             String?          @db.Inet
  lastSeenAt         DateTime?
  trustedAt          DateTime?
  revokedAt          DateTime?
  createdAt          DateTime         @default(now())
  updatedAt          DateTime         @updatedAt

  user               User             @relation(fields: [userId], references: [id], onDelete: Restrict)
  sessions           AuthSession[]

  @@index([userId, lastSeenAt])
  @@index([deviceFingerprint])
  @@map("user_devices")
}

model AuthSession {
  id                    String            @id @default(uuid()) @db.Uuid
  userId                String            @db.Uuid
  deviceId              String?           @db.Uuid
  sessionType           AuthSessionType   @default(USER)
  status                AuthSessionStatus @default(ACTIVE)
  refreshTokenHash      String            @unique @db.Text
  refreshTokenFamilyId  String            @db.Uuid
  parentSessionId       String?           @db.Uuid
  issuedAt              DateTime          @default(now())
  expiresAt             DateTime
  lastUsedAt            DateTime?
  revokedAt             DateTime?
  revokedReason         SessionRevokedReason?
  ipAddress             String?           @db.Inet
  userAgent             String?           @db.Text
  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt

  user                  User              @relation(fields: [userId], references: [id], onDelete: Restrict)
  device                UserDevice?       @relation(fields: [deviceId], references: [id], onDelete: SetNull)

  @@index([userId, status])
  @@index([sessionType, status])
  @@index([refreshTokenFamilyId])
  @@index([expiresAt])
  @@map("auth_sessions")
}
```

Notes:

- Access tokens should be short-lived JWTs or opaque tokens issued by the API.
- Refresh tokens are stored only as hashes.
- Refresh token rotation should revoke a token family when reuse is detected.
- Admin sessions may use the same table with `sessionType = ADMIN`, but admin endpoints must still check active `AdminAccount` and permissions on every request.

### Admin Membership, Roles, And Permissions

```prisma
model AdminAccount {
  id                  String       @id @default(uuid()) @db.Uuid
  userId              String       @unique @db.Uuid
  status              AdminStatus  @default(INVITED)
  title               String?      @db.VarChar(120)
  department          String?      @db.VarChar(120)
  invitedByAdminId    String?      @db.Uuid
  invitedAt           DateTime?
  activatedAt         DateTime?
  suspendedAt         DateTime?
  suspendedReason     String?      @db.VarChar(500)
  lastAdminLoginAt    DateTime?
  requireStepUp       Boolean      @default(false)
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt

  user                User         @relation(fields: [userId], references: [id], onDelete: Restrict)
  roles               AdminRoleAssignment[]
  auditLogs           AuditLog[]   @relation("AuditActorAdmin")
  authSecurityEvents  AuthSecurityEvent[]

  @@index([status])
  @@map("admin_accounts")
}

model Role {
  id                  String       @id @default(uuid()) @db.Uuid
  key                 String       @unique @db.VarChar(100)
  name                String       @db.VarChar(160)
  description         String?      @db.Text
  scope               RoleScope
  status              RoleStatus   @default(ACTIVE)
  isSystem            Boolean      @default(false)
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt

  adminAssignments    AdminRoleAssignment[]
  userAssignments     UserRoleAssignment[]
  permissions         RolePermission[]

  @@index([scope, status])
  @@map("roles")
}

model Permission {
  id                  String       @id @default(uuid()) @db.Uuid
  key                 String       @unique @db.VarChar(140)
  name                String       @db.VarChar(160)
  description         String?      @db.Text
  domain              PermissionDomain
  action              PermissionAction
  status              PermissionStatus @default(ACTIVE)
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt

  roles               RolePermission[]

  @@index([domain, action])
  @@map("permissions")
}

model RolePermission {
  roleId              String       @db.Uuid
  permissionId        String       @db.Uuid
  createdAt           DateTime     @default(now())
  createdByAdminId    String?      @db.Uuid

  role                Role         @relation(fields: [roleId], references: [id], onDelete: Restrict)
  permission          Permission   @relation(fields: [permissionId], references: [id], onDelete: Restrict)

  @@id([roleId, permissionId])
  @@index([permissionId])
  @@map("role_permissions")
}

model AdminRoleAssignment {
  adminAccountId      String       @db.Uuid
  roleId              String       @db.Uuid
  status              AssignmentStatus @default(ACTIVE)
  assignedByAdminId   String?      @db.Uuid
  assignedAt          DateTime     @default(now())
  revokedAt           DateTime?
  revokedByAdminId    String?      @db.Uuid

  adminAccount        AdminAccount @relation(fields: [adminAccountId], references: [id], onDelete: Restrict)
  role                Role         @relation(fields: [roleId], references: [id], onDelete: Restrict)

  @@id([adminAccountId, roleId])
  @@index([roleId])
  @@index([status])
  @@map("admin_role_assignments")
}

model UserRoleAssignment {
  userId              String       @db.Uuid
  roleId              String       @db.Uuid
  status              AssignmentStatus @default(ACTIVE)
  assignedByAdminId   String?      @db.Uuid
  assignedAt          DateTime     @default(now())
  revokedAt           DateTime?
  revokedByAdminId    String?      @db.Uuid

  user                User         @relation(fields: [userId], references: [id], onDelete: Restrict)
  role                Role         @relation(fields: [roleId], references: [id], onDelete: Restrict)

  @@id([userId, roleId])
  @@index([roleId])
  @@index([status])
  @@map("user_role_assignments")
}
```

Notes:

- `AdminRoleAssignment` is for backend admin access.
- `UserRoleAssignment` is reserved for future non-admin user roles such as donor groups, partner-linked users, volunteers, or future service accounts. It should not grant admin API access.
- System roles and permissions should be seeded through migrations or seed scripts, then changed carefully through admin APIs with audit logging.

Suggested launch admin roles:

- `super_admin`
- `content_manager`
- `finance_manager`
- `project_manager`
- `media_manager`
- `support_manager`

Suggested permission naming convention:

- `<domain>.<resource>.<action>`
- Examples: `cms.article.publish`, `donations.donation.read`, `payments.transaction.reconcile`, `projects.project.update`, `media.asset.delete`, `admin.user.manage`, `settings.provider.update`, `audit.log.read`, `partner_missions.case.resolve`.

### Audit, Activity, And Security Logs

```prisma
model AuditLog {
  id                  String          @id @default(uuid()) @db.Uuid
  occurredAt          DateTime        @default(now())
  actorType           AuditActorType
  actorUserId         String?         @db.Uuid
  actorAdminAccountId String?         @db.Uuid
  actorDisplay        String?         @db.VarChar(180)
  action              String          @db.VarChar(160)
  outcome             AuditOutcome    @default(SUCCESS)
  targetType          String          @db.VarChar(120)
  targetId            String?         @db.VarChar(120)
  targetDisplay       String?         @db.VarChar(180)
  module              String          @db.VarChar(80)
  permissionKey       String?         @db.VarChar(140)
  requestId           String?         @db.VarChar(120)
  correlationId       String?         @db.VarChar(120)
  ipAddress           String?         @db.Inet
  userAgent           String?         @db.Text
  before              Json?
  after               Json?
  metadata            Json?

  actorUser           User?           @relation(fields: [actorUserId], references: [id], onDelete: SetNull)
  actorAdminAccount   AdminAccount?   @relation("AuditActorAdmin", fields: [actorAdminAccountId], references: [id], onDelete: SetNull)

  @@index([occurredAt])
  @@index([actorType, actorUserId, occurredAt])
  @@index([actorAdminAccountId, occurredAt])
  @@index([module, action, occurredAt])
  @@index([targetType, targetId])
  @@index([correlationId])
  @@map("audit_logs")
}

model UserActivityLog {
  id                  String              @id @default(uuid()) @db.Uuid
  userId              String?             @db.Uuid
  occurredAt          DateTime            @default(now())
  activityType        UserActivityType
  outcome             ActivityOutcome     @default(SUCCESS)
  targetType          String?             @db.VarChar(120)
  targetId            String?             @db.VarChar(120)
  requestId           String?             @db.VarChar(120)
  correlationId       String?             @db.VarChar(120)
  ipAddress           String?             @db.Inet
  userAgent           String?             @db.Text
  metadata            Json?

  user                User?               @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId, occurredAt])
  @@index([activityType, occurredAt])
  @@index([targetType, targetId])
  @@map("user_activity_logs")
}

model AuthSecurityEvent {
  id                  String              @id @default(uuid()) @db.Uuid
  userId              String?             @db.Uuid
  occurredAt          DateTime            @default(now())
  eventType           AuthSecurityEventType
  outcome             AuthEventOutcome
  mobileE164          String?             @db.VarChar(20)
  adminAccountId      String?             @db.Uuid
  sessionId           String?             @db.Uuid
  otpChallengeId      String?             @db.Uuid
  failureReason       String?             @db.VarChar(500)
  riskScore           Int?
  requestId           String?             @db.VarChar(120)
  correlationId       String?             @db.VarChar(120)
  ipAddress           String?             @db.Inet
  userAgent           String?             @db.Text
  metadata            Json?

  user                User?               @relation(fields: [userId], references: [id], onDelete: SetNull)
  adminAccount        AdminAccount?       @relation(fields: [adminAccountId], references: [id], onDelete: SetNull)

  @@index([userId, occurredAt])
  @@index([adminAccountId, occurredAt])
  @@index([mobileE164, occurredAt])
  @@index([eventType, outcome, occurredAt])
  @@index([ipAddress, occurredAt])
  @@map("auth_security_events")
}
```

Notes:

- `audit_logs` are for accountability of privileged, financial, content, settings, and support actions.
- `user_activity_logs` are for useful account history and product analytics. They should not become a dumping ground for every technical event.
- `auth_security_events` are security-sensitive records for login, OTP, session, device, abuse, and failed-auth investigation.
- Audit logs should be append-only at the application level. No update/delete API should exist for them.
- For stronger immutability later, add database triggers that reject update/delete on audit tables except under a controlled maintenance role.

### Future-Safe External References

Do not design donation, Pump, Peyman, CMS, payment, or media tables here. Use generic target references in logs:

- `targetType`: stable resource type such as `donation`, `payment_transaction`, `project`, `project_phase`, `cms_article`, `media_asset`, `pump_mission`, `peyman_mandate`.
- `targetId`: the future module's primary key as a string.
- `correlationId`: cross-request or cross-job trace, useful for payment callbacks, Pump verification, Peyman mandates, report exports, and background jobs.
- `metadata`: small structured context, never raw secrets, OTP codes, provider tokens, or full sensitive payloads.

This keeps this first slice compatible with future modules without creating premature foreign keys to tables that do not exist yet.

## 5. Key Relationships

- One `User` has one `UserProfile`.
- One `User` may have one `AdminAccount`.
- One `User` may have many `AuthSession`, `UserDevice`, `OtpChallenge`, `AuthSecurityEvent`, and `UserActivityLog` records.
- One `AdminAccount` may have many `AdminRoleAssignment` records.
- One `Role` has many `RolePermission` records.
- One `Permission` can belong to many roles.
- `UserRoleAssignment` supports future non-admin user roles, but admin access depends only on `AdminAccount` plus active admin role assignments.
- `AuditLog` can reference both `actorUserId` and `actorAdminAccountId` when the actor is an admin.
- Logs reference future domain records through `targetType` and `targetId`, not hard foreign keys in this first slice.

## 6. Enums And Statuses

```prisma
enum UserStatus {
  ACTIVE
  BLOCKED
  PENDING_VERIFICATION
  DEACTIVATED
}

enum UserIdentityType {
  MOBILE
  IMPORTED
  SYSTEM
}

enum AdminStatus {
  INVITED
  ACTIVE
  SUSPENDED
  DEACTIVATED
}

enum RoleScope {
  ADMIN
  USER
  SYSTEM
}

enum RoleStatus {
  ACTIVE
  DISABLED
}

enum PermissionStatus {
  ACTIVE
  DISABLED
}

enum PermissionDomain {
  ADMIN
  AUTH
  USERS
  CMS
  MEDIA
  PROJECTS
  DONATIONS
  PAYMENTS
  TRANSACTIONS
  REPORTS
  PARTNER_MISSIONS
  SETTINGS
  AUDIT
  SYSTEM
}

enum PermissionAction {
  CREATE
  READ
  UPDATE
  DELETE
  PUBLISH
  APPROVE
  EXPORT
  RECONCILE
  MANAGE
  IMPERSONATE
  SUSPEND
  VIEW_SENSITIVE
}

enum AssignmentStatus {
  ACTIVE
  REVOKED
}

enum OtpPurpose {
  LOGIN
  REGISTER
  ADMIN_LOGIN
  MOBILE_CHANGE
  PEYMAN_MANDATE
  SECURITY_STEP_UP
}

enum OtpChannel {
  SMS
}

enum OtpChallengeStatus {
  PENDING
  VERIFIED
  CONSUMED
  EXPIRED
  LOCKED
  CANCELLED
}

enum OtpSendStatus {
  QUEUED
  SENT
  FAILED
  DELIVERED
  UNKNOWN
}

enum AuthRateLimitScope {
  MOBILE
  IP
  DEVICE
  USER
}

enum DevicePlatform {
  WEB
  MOBILE_WEB
  ADMIN_WEB
  UNKNOWN
}

enum AuthSessionType {
  USER
  ADMIN
}

enum AuthSessionStatus {
  ACTIVE
  EXPIRED
  REVOKED
  ROTATED
  COMPROMISED
}

enum SessionRevokedReason {
  LOGOUT
  ADMIN_REVOKED
  TOKEN_REUSE_DETECTED
  USER_BLOCKED
  PASSWORD_OR_SECURITY_CHANGE
  EXPIRED
}

enum AuditActorType {
  ADMIN
  USER
  SYSTEM
  PARTNER
  WEBHOOK
}

enum AuditOutcome {
  SUCCESS
  FAILURE
  DENIED
  PARTIAL
}

enum UserActivityType {
  PROFILE_UPDATED
  MOBILE_VERIFIED
  DONATION_STARTED
  DONATION_CONFIRMED
  RECURRING_DONATION_STARTED
  RECURRING_DONATION_CANCELLED
  PUMP_MISSION_STARTED
  PUMP_MISSION_COMPLETED
  CMS_COMMENT_CREATED
}

enum ActivityOutcome {
  SUCCESS
  FAILURE
  CANCELLED
}

enum AuthSecurityEventType {
  OTP_REQUESTED
  OTP_SENT
  OTP_SEND_FAILED
  OTP_VERIFIED
  OTP_FAILED
  OTP_EXPIRED
  LOGIN_SUCCESS
  LOGIN_FAILED
  ADMIN_LOGIN_SUCCESS
  ADMIN_LOGIN_FAILED
  SESSION_REFRESHED
  SESSION_REVOKED
  REFRESH_TOKEN_REUSE_DETECTED
  RATE_LIMITED
  USER_BLOCKED
  ADMIN_SUSPENDED
  STEP_UP_REQUIRED
  STEP_UP_SUCCESS
  STEP_UP_FAILED
}

enum AuthEventOutcome {
  SUCCESS
  FAILURE
  DENIED
  INFO
}
```

## 7. Indexes And Unique Constraints

Critical unique constraints:

- `users.mobileE164` unique.
- `user_profiles.userId` unique.
- `admin_accounts.userId` unique.
- `roles.key` unique.
- `permissions.key` unique.
- `role_permissions(roleId, permissionId)` composite primary key.
- `admin_role_assignments(adminAccountId, roleId)` composite primary key.
- `user_role_assignments(userId, roleId)` composite primary key.
- `auth_sessions.refreshTokenHash` unique.
- `auth_rate_limit_buckets(scope, key, purpose, windowStartedAt)` unique.

Critical lookup indexes:

- Users by `status`, `createdAt`, and `deletedAt`.
- OTP challenges by `mobileE164`, `purpose`, `status`, `expiresAt`, and `createdAt`.
- Sessions by `userId/status`, `sessionType/status`, `refreshTokenFamilyId`, and `expiresAt`.
- Admin accounts by `status`.
- Roles by `scope/status`.
- Permissions by `domain/action`.
- Audit logs by `occurredAt`, `actor`, `module/action`, `targetType/targetId`, and `correlationId`.
- Auth security events by `userId/occurredAt`, `mobileE164/occurredAt`, `eventType/outcome/occurredAt`, and `ipAddress/occurredAt`.

Recommended partial indexes in PostgreSQL after Prisma migration generation:

- Active admin role assignments: `WHERE status = 'ACTIVE'`.
- Active sessions: `WHERE status = 'ACTIVE'`.
- Active users: `WHERE deleted_at IS NULL`.
- Pending OTP challenges: `WHERE status = 'PENDING'`.

Prisma does not fully express all partial indexes portably. Add them through SQL migrations when needed.

## 8. Audit Logging Strategy

Audit logs must be immutable, structured, and security-conscious.

Actions that must be audit logged:

- Admin login success/failure and admin step-up auth.
- Admin creation, invitation, activation, suspension, deactivation, and role changes.
- Role and permission changes.
- User blocking, unblocking, profile edits by admin, and sensitive user-data reads.
- CMS create/update/delete/publish/unpublish actions.
- Media deletion, visibility changes, and sensitive uploads.
- Project, phase, transparency update, and public progress changes.
- Donation, payment, transaction, refund, reconciliation, export, and manual finance actions.
- Pump mission configuration changes, support overrides, and manual investigation resolutions.
- Peyman mandate create/update/cancel/retry/reconciliation actions.
- Settings changes, especially provider credentials, gateway config, SMS config, feature flags, and rate-limit policy.
- Report exports and reads of sensitive financial reports.

Audit record shape:

- `actorType`: admin, user, system, partner, webhook.
- `actorUserId`: person identity when available.
- `actorAdminAccountId`: admin membership when an admin performs the action.
- `action`: stable event name, such as `admin.role.assign` or `cms.article.publish`.
- `targetType` and `targetId`: resource being changed.
- `module`: owning module.
- `permissionKey`: permission checked for the action when applicable.
- `before` and `after`: redacted summaries only.
- `metadata`: small structured details such as reason, status transition, gateway name, or export filters.
- `ipAddress`, `userAgent`, `requestId`, and `correlationId`.

Do not store:

- Raw OTP codes.
- Refresh tokens.
- SMS provider secrets.
- Payment gateway secrets.
- Peyman credentials or bearer tokens.
- Full national code in plaintext.
- Full provider callback payloads if they contain sensitive data. Store redacted summaries and keep raw provider logs in the provider-specific module only if needed and protected.

## 9. OTP, Session, And Security Strategy

OTP:

- Normalize Iranian mobile numbers into `mobileE164` before creating users or OTP challenges.
- Generate short-lived numeric OTPs.
- Store only a hash, ideally HMAC or Argon2/bcrypt depending on operational cost.
- Use Redis for active OTP state and throttling.
- Use PostgreSQL `otp_challenges` and `auth_security_events` for durable investigation records.
- Limit OTP requests by mobile, IP, and device fingerprint.
- Limit OTP verification attempts per challenge.
- Expire challenges quickly.
- Invalidate older pending challenges for the same mobile/purpose when a new one is issued, or accept only the newest challenge.

Sessions:

- Use short-lived access tokens and rotating refresh tokens.
- Store refresh token hashes, not raw tokens.
- Track token family IDs to detect reuse.
- Revoke all sessions when a user is blocked or an admin is suspended.
- Admin sessions should be shorter-lived than public user sessions.
- Sensitive admin/finance/settings actions should support step-up OTP.

Security logs:

- Log failed OTP attempts, failed admin login, rate-limit blocks, refresh token reuse, blocked users, suspended admins, and step-up failures.
- Keep enough IP/user-agent/device data for abuse investigation.
- Define a retention policy before production. Longer retention may be needed for financial and admin audit records than for routine login telemetry.

Rate limits and abuse prevention:

- Use Redis for real-time counters.
- Persist bucket summaries or active blocks in `auth_rate_limit_buckets`.
- Use separate limits for OTP request, OTP verify, admin login, session refresh, Pump verification API, and Peyman callback handling.
- Escalate repeated failures to temporary block, step-up requirement, or admin review.

## 10. Future Compatibility Notes

Donations:

- `users.id` becomes the stable donor account reference for registered donations.
- Anonymous donation support should not require a `User`, but if a mobile number is provided it should be normalized and can later be linked to a user after OTP verification.
- Donation history is read from the Donations module, not stored inside Users.

Pump missions:

- Pump should verify users through normalized `mobileE164`.
- Partner mission logs can use `userId` when known and mobile snapshot when verification happens by mobile.
- Support/admin overrides must write audit logs.
- Logs should use `targetType = 'pump_mission'`, `pump_mission_completion`, or `pump_verification_request` when those tables exist.

Peyman recurring donations:

- Peyman user flows require logged-in mobile OTP users.
- National code belongs in profile or a future Peyman mandate table as encrypted data, depending on final privacy rules.
- Mandate activation, cancellation, withdrawal, retry, and reconciliation must be audit logged.
- User mobile changes need careful handling because Peyman, banks, and Pump may depend on the mobile number used at authorization time.

CMS:

- Admin publishing requires permissions such as `cms.article.publish`.
- Content edits and publish/unpublish transitions must be audited.
- Authors can reference `users.id` or `admin_accounts.id` depending on whether public author profiles are needed.

Admin workflows:

- Admin UI can be inside `apps/web`, but each admin API call checks active admin status and permissions.
- Admin dashboard/report reads must avoid leaking more user/payment data than the role permits.
- Super-admin bootstrap should be explicit, seeded, and audited after first production setup.

Media:

- Media deletion and visibility changes should be audited.
- Upload ownership can reference `actorUserId` and optionally `actorAdminAccountId`.

Financial reports:

- Report exports need `reports.export.create` or similar permission.
- Export jobs should record `correlationId`, filters summary, generated file reference, and audit log.

Construction progress:

- Project and phase public progress changes should be admin-audited because they affect donor trust.
- Operational progress and financial progress remain separate future domains.

## 11. Open Questions / Needs Confirmation

- Needs confirmation: Are anonymous donations allowed without mobile OTP? Current product docs suggest yes; some proposal language suggests account-required donation.
- Needs confirmation: Which SMS/OTP provider will be used, and what delivery callbacks/statuses are available?
- Needs confirmation: Should admin login be mobile OTP only, or mobile OTP plus password/passkey later?
- Needs confirmation: Is step-up OTP required for all finance/settings actions at launch or only for highest-risk actions?
- Needs confirmation: What is the required retention period for audit logs, auth security logs, OTP challenge records, and user activity logs?
- Needs confirmation: What privacy/legal process is required for deleting or anonymizing user profiles while preserving financial and audit records?
- Needs confirmation: Should admin roles be exactly the launch roles listed above, or should support/admin/reporting roles be split further?
- Needs confirmation: Can national code be stored on `user_profiles`, or should it only live inside financial/Peyman-specific tables after the user starts a financial mandate flow?
- Needs confirmation: Should public users have non-admin roles at launch, or should `UserRoleAssignment` remain dormant until a future need appears?
- Needs confirmation: Should admin impersonation ever be allowed? Recommendation is to avoid it for MVP unless a strict support requirement appears.

## 12. Recommended Implementation Order

1. Create Prisma enums and base identity models: `User`, `UserProfile`.
2. Add mobile normalization utilities and database constraints for `mobileE164`.
3. Add OTP challenge model, Redis-backed OTP flow, and durable auth security events.
4. Add session, refresh token rotation, and device tracking.
5. Add `AdminAccount`, `Role`, `Permission`, and assignment models.
6. Seed system roles and permissions.
7. Build NestJS guards for user auth, admin auth, and permission checks.
8. Add append-only `AuditLog` service and integrate it with admin/RBAC changes first.
9. Add `UserActivityLog` only for user-visible account events and future product analytics.
10. Add rate-limit persistence and cleanup jobs.
11. Add admin APIs for user/admin/role management with audit logs.
12. Add tests for mobile uniqueness, OTP verification limits, refresh rotation/reuse, admin permission checks, and immutable audit behavior.

## 13. Documentation Decision

Needs ADR: yes, this file acts as the focused decision record for the first user/admin/auth/log database slice.

Needs docs update: yes.

Reason: This design creates durable identity, admin, authorization, audit, and logging rules that future donation, payment, CMS, Pump, Peyman, media, report, and admin workflows will depend on.

Recommended file: `docs/decisions/user-admin-auth-log-database-design.md`.
