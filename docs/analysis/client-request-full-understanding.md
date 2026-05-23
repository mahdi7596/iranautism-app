# Iran Autism Platform - Full Client Request Understanding

## Executive Summary

The requested product is a custom, multi-module Iran Autism digital platform. It is not only a public website. Across the client PowerPoint, the product specification documents, and the Persian developer proposal, the requested scope is best understood as a combination of:

- A public website for Iran Autism content, services, news, storytelling, and trust-building.
- A multi-project crowdfunding platform for autism-related initiatives.
- A construction-phase donation and progress transparency system for the first major project, the comprehensive autism center.
- A donation and payment system with domestic Iranian payment gateway integration.
- A CMS and media management system so Iran Autism staff can update content without developer dependency.
- An admin panel for managing projects, phases, donations, users, transactions, reports, media, blog content, menus, and platform settings.
- A media/storytelling experience including galleries, short videos, timelapse/progress content, and a Reels/TikTok-style vertical video page.

The strongest client-origin evidence is the PowerPoint, which focuses on the first public experience: header items, an 8-image slider, recent news, timeline, collected and required donation amounts, construction phases, phase stories with photos/timelapses, center services from childhood to independence/employment, a video story page, and a people/effort gallery. The broader platform documents expand this into a full crowdfunding/CMS/admin/payment product.

The MVP/core scope appears to include the public website, multi-project crowdfunding, construction phase model, donation/payment flow, transparency timeline, CMS, blog/content, media/gallery/video, user OTP authentication, user profile/donation history, and admin reporting. Some items appear proposed by the developer or recommended for future/optional scope and must be confirmed before being treated as contractual MVP: international donations, recurring donations, donation certificates, tickets/support, comments/ratings, full Donation Wall behavior, product/store-related ratings, and advanced community/appointment features.

## Source Documents Reviewed

| Priority | Source | Type | Role in understanding |
|---|---|---|---|
| 1 | `my-understandings/Autism Support Platform.docx` | Product specification | Most complete English product scope covering MVP, modules, admin, CMS, media, security, and future vision. |
| 1 | `my-understandings/time-estimation-iran-autism.docx` | Persian timeline/phasing | Defines a 18-week phased delivery plan and separates core modules, payment, CMS/media, reporting, and out-of-scope change requests. |
| 1 | `my-understandings/main-description.pdf` | Detailed specification | Confirms SPA crowdfunding platform, project types, donation models, admin panel, CMS, special video page, proposed tech stack, and future phase features. |
| 1 | `my-understandings/aa81a759-76f1-4ccf-8539-3269580b32de.pdf` | Persian product specification | Confirms Persian product intent, user roles, projects, phases, donation/payment, transparency timeline, CMS, blog, media, admin, OTP, architecture, security, reporting, design, support, and future features. |
| 2 | `given-powerpoint-by-client.pptx` | Client-provided PowerPoint | Direct client evidence for homepage/content expectations, construction phases, center service narrative, video story page, and people/effort gallery. |
| 3 | `iran-autism-developer-proposal-fa.pdf` | Persian developer proposal | Developer-side commercial/technical proposal, including proposed modules, financial portal, international/recurring payment considerations, tickets, comments/ratings, delivery assumptions, support, and cost. |

## Product Vision

The product vision is a trustworthy, emotionally human, transparent platform for Iran Autism that lets the public understand the mission, see real progress, and contribute financially to concrete autism-support initiatives.

The platform should support the immediate campaign around building or equipping a comprehensive autism center, while being structured to support future initiatives such as therapy centers, equipment funding, educational services, general support programs, events, and community programs.

The platform's core trust mechanism is transparency: donors and visitors should be able to see how much money has been collected, how much is still needed, which phase or item it supports, what physical progress has happened, and what media evidence exists.

## What the Client Appears to Want Built

| Product area | Interpretation | Evidence level |
|---|---|---|
| Public website | Required. Includes homepage, about, contact, services, news/blog, gallery, video/storytelling, project listing and details. | Explicit in all product documents and PowerPoint. |
| Crowdfunding platform | Required. Multi-project donation system, not a single static donation page. | Explicit in `my-understandings` documents and developer proposal. |
| Construction phase system | Required for the first major initiative. Client PowerPoint lists nine construction phases and asks for timeline/progress storytelling. | Explicit in PowerPoint and all scope docs. |
| Donation/payment system | Required. Must handle registered and anonymous donations, domestic gateway, transaction states, verification, reporting. | Explicit in product docs and proposal. |
| CMS | Required. Admin team must manage pages, menus, footer/header, logo, blog, media, gallery, videos, and project content. | Explicit in product docs and proposal. |
| Admin panel | Required. Operational control center for projects, phases, donations, transactions, reports, users, content, and media. | Explicit in product docs and proposal. |
| Media/storytelling platform | Required. Gallery, videos, short videos page, timelapse/progress media, people/effort gallery. | Explicit in PowerPoint and product docs. |
| User accounts/profiles | Required for registered donations and tracking history; anonymous donation also appears required. | Explicit, but proposal conflicts on whether donation requires registration. |
| International/recurring donations | Proposed/possible, not clearly client-origin MVP. Needs confirmation. | Developer proposal and recommended features, with legal/provider caveats. |
| Appointment booking, doctor profiles, Q&A, play center reservation | Future phase, out of MVP. | Explicitly listed as future/phase 2. |

## Core MVP Scope

The core MVP should be treated as a working platform, not a brochure site. A practical MVP includes:

| Module | MVP inclusion | Notes |
|---|---|---|
| Public website shell | Included | Homepage, header/footer, navigation, basic pages. |
| CMS for editable pages | Included | About, contact, services, header/footer, logo/favicon, menus. |
| Multi-project crowdfunding | Included | Project list/detail, types, target/current amount, status, donor count, progress. |
| Construction phases | Included | For major building projects, with budget, status, progress, media, timeline. |
| Donation flow | Included | Anonymous and registered donation need confirmation due proposal conflict. |
| Domestic payment gateway | Included | Iranian gateway such as Zarinpal or similar, selected by client. |
| Transaction records | Included | Status tracking, callback verification, admin monitoring. |
| Transparency timeline | Included | Dated updates with description, category, photos/videos. |
| Admin dashboard | Included | Donation metrics, active projects, user growth, donation trends. |
| Reports/export | Included | Excel/CSV export for transactions and project summaries. |
| Blog/news | Included | Categories, tags, author, publish date, featured image, SEO fields. |
| Media manager | Included | Upload, preview, categorize/album, search/filter, reuse media. |
| Gallery | Included | Public gallery for images/videos with event tags/categories. |
| Short video page | Included | Mobile-first vertical video browsing, infinite scroll, sharing/caption/admin management. |
| User OTP authentication | Included | Mobile number + one-time password. |
| User profile | Included | Basic profile and donation history. |
| UI/UX design system | Included | Wireframes, high-fidelity screens, responsive layouts. |

## Public Website Experience

### What It Is

The public website is the first layer of the platform. It introduces Iran Autism, explains the comprehensive center and its services, publishes news/stories, exposes project progress, and routes users into donation flows.

### Why It Is Needed

It builds public trust and gives donors enough context to support campaigns. The PowerPoint specifically asks for communication elements around the center, phases, services, videos, and people involved.

### Who Uses It

- General visitors
- Potential donors
- Families looking for autism-related services and information
- Media/PR visitors
- Existing supporters checking progress

### Main Features

| Feature | Required behavior | Source/evidence |
|---|---|---|
| Header navigation | Includes press kit, logo, comprehensive center information, public relations, licenses, and small/large support options. | Client PowerPoint. |
| Homepage slider | 8 images in the slider. | Client PowerPoint. |
| Recent news | Show latest news/content. | Client PowerPoint and blog docs. |
| Timeline | Show project or campaign activity timeline. | Client PowerPoint and specs. |
| Donation progress | Display collected amount and required amount, described as "خشت به خشت" in the PowerPoint. | Client PowerPoint. |
| Services narrative | Explain what will happen in the comprehensive autism center, service list, childhood to rehabilitation, interaction to social independence, care center to empowerment/employment. | Client PowerPoint. |
| Public pages | Home, About Us, Contact Us, Services, Blog, Project listing/detail, Gallery. | Product docs and proposal. |
| Social sharing | Project sharing appears in proposal/product docs. | Developer proposal and product docs. |

### Admin Controls Required

- Edit homepage sections, slider images, headlines, service content, and calls to action.
- Manage header/footer menus and nested navigation.
- Upload and replace logo/favicon.
- Manage press kit/license/public relations links and assets.
- Publish/unpublish news, pages, gallery items, and projects.

### Likely Data/Entities

- `Page`
- `Menu`
- `MenuItem`
- `SiteSetting`
- `HomepageSection`
- `SliderItem`
- `Service`
- `NewsArticle`
- `PressKitAsset`
- `LicenseDocument`

### Open Questions or Risks

- Does "press kit / PR / licenses" mean static pages, downloadable files, or specific structured entities?
- Should homepage content be fully block-based CMS content or controlled through predefined editable sections?
- Which exact public pages are mandatory for launch beyond Home, About, Contact, Services, Projects, Blog, Gallery, and Videos?

## Crowdfunding and Donation System

### What It Is

A multi-project fundraising system that allows users to donate to general support, specific projects, construction phases, equipment/items, or possibly full sponsorship of an item.

### Why It Is Needed

The platform's main purpose is collecting support transparently. The documents repeatedly describe crowdfunding as the core system.

### Who Uses It

- Public donors
- Registered donors
- Iran Autism finance/admin team
- Content/project managers

### Main Features

| Feature | Scope status | Details |
|---|---|---|
| Multi-project campaigns | Core | Multiple active projects/campaigns at the same time. |
| Project types | Core | Construction phases, equipment funding, general donations. |
| Project details | Core | Title, description, cover, gallery, target amount, collected amount, donor count, progress percentage, status, updates, media. |
| Donation to project | Core | Donate to a selected project. |
| Donation to phase | Core | Donate to a construction phase. |
| Donation to item/equipment | Core or near-core | Supported by specifications; exact MVP behavior needs confirmation. |
| Anonymous donation | Core in product specs | Donor can contribute without account; transaction still stored internally. |
| Registered donation | Core | Mobile OTP login, donation history in profile. |
| Donor message | Core/proposed | Mentioned in product docs/proposal; publication rules need confirmation. |
| Donation Wall | Proposed/needs confirmation | Time plan includes it in phase 2; proposal says project supporter wall if client approves. |
| Full item sponsorship | Proposed/needs confirmation | Mentioned in product docs; needs exact business rules. |
| Donation certificate | Recommended/needs confirmation | Mentioned as recommended or "if needed" in proposal. |

### Admin Controls Required

- Create/edit/archive projects and campaign types.
- Define donation targets: project, phase, item, general fund.
- Set target amounts, statuses, start/end dates, display order, and visibility.
- Review donations and transaction details.
- Manage donor visibility and messages.
- Export donation records.
- Approve public publication of donation/progress data.

### Likely Data/Entities

- `Project`
- `ProjectType`
- `ProjectPhase`
- `FundingItem`
- `Donation`
- `DonationTarget`
- `DonorMessage`
- `DonorVisibilityPreference`
- `DonationWallEntry`
- `Transaction`
- `PaymentGateway`

### Open Questions or Risks

- Anonymous donations conflict with the developer proposal line saying users must have an account for donation and comments. The client/product specs clearly mention anonymous donations. This must be confirmed.
- Should donation totals update immediately after payment success, or only after admin approval/reconciliation?
- Does the platform need manual/offline donation entry for bank transfers or non-online contributions?
- Are donations in Toman or Rial? Documents mention both "تومان یا ریال".
- What are the legal and accounting requirements for public donation collection in Iran?

## Project and Construction Phase System

### What It Is

A project management and public progress system for large and small fundraising initiatives. For construction projects, the system supports phases with independent budgets, status, media, and progress reporting.

### Why It Is Needed

The first major initiative appears to be construction/development of a comprehensive autism center. The PowerPoint lists a nine-phase construction narrative and asks for phase stories, autism-related context, photos, and timelapses.

### Who Uses It

- Public visitors and donors
- Registered donors tracking progress
- Admin/project team publishing updates
- Finance/admin team tracking phase funding

### Main Features

| Feature | Required behavior |
|---|---|
| Project list | Public list of active/completed/upcoming campaigns. |
| Project detail | Goal, story, media, amount required, amount collected, donor count, progress, timeline, updates, share. |
| Project statuses | Active/collecting, in progress, completed, upcoming/waiting. Exact status taxonomy needs confirmation. |
| Phase list per construction project | Multiple phases under one project. |
| Phase budget | Each phase has target budget and collected amount. |
| Phase progress | Show percentage and operational/construction status. |
| Phase media | Images, videos, timelapse, progress reports. |
| Overall progress | Display total project progress and per-phase progress separately. |

### Client PowerPoint Construction Phases

| Phase number | Persian label from PowerPoint | English interpretation |
|---|---|---|
| 1 | فاز اول: مهندسی | Engineering |
| 2 | فاز دوم: تصرف و تجهیز کارگاه | Site possession and workshop/site setup |
| 3 | فاز سوم: گودبرداری | Excavation |
| 4 | فاز چهارم: فونداسیون | Foundation |
| 5 | فاز پنحم: سفت کاری | Structural/rough construction |
| 6 | فاز ششم: نازک کاری | Finishing |
| 7 | فاز هفتم: تاسیسات مکانیکی | Mechanical installations |
| 8 | فاز هشتم: تجهیزات و تاسیسات | Equipment and installations |
| 9 | فاز نهم: پایانی | Final phase |

### Admin Controls Required

- Create and order construction phases.
- Set phase title, description, goal amount, status, start/end dates, and progress.
- Attach phase-specific galleries, videos, documents, and timelapses.
- Publish timeline updates per phase.
- Mark phase completion and control public visibility.

### Likely Data/Entities

- `Project`
- `ProjectPhase`
- `PhaseMilestone`
- `PhaseUpdate`
- `PhaseMedia`
- `ProgressMetric`
- `ConstructionStatus`

### Open Questions or Risks

- Should phase progress be calculated from donations, manually entered construction progress, or both?
- Does each phase accept donations independently, or are donations allocated by admin after collection?
- Are the nine phases fixed for the first center only, or configurable for any construction project?
- Should there be public financial spend reporting per phase, not only amount collected?

## Transparency, Timeline, and Progress Reporting

### What It Is

A public and admin-managed transparency layer showing what activities happened, when they happened, and what evidence supports them.

### Why It Is Needed

Transparency is a repeated requirement and the main trust mechanism. The documents explicitly state that each project should have activity timelines with dates, descriptions, images/videos, categories, and reports.

### Who Uses It

- Donors deciding whether to trust and donate.
- Existing supporters checking impact.
- Admin/content team publishing updates.
- Finance/project team documenting use of funds.

### Main Features

| Feature | Required behavior |
|---|---|
| Project timeline | Dated sequence of updates for each project. |
| Phase timeline | Updates can belong to a phase where relevant. |
| Update content | Title, date, description, category, images, videos. |
| Categories | Examples include financial, construction, event/report. |
| Media evidence | Photos, videos, timelapse, documents if needed. |
| Progress display | Overall and per-phase progress percentages. |
| Public visibility control | Proposal states public publication after admin approval. |

### Admin Controls Required

- Create/edit/delete updates.
- Associate updates with project, phase, event, or gallery.
- Upload/link media evidence.
- Publish/unpublish or approve updates.
- Control whether donation/progress data is public.

### Likely Data/Entities

- `TimelineEntry`
- `TimelineCategory`
- `ProjectUpdate`
- `MediaAsset`
- `ApprovalStatus`
- `ProgressSnapshot`

### Open Questions or Risks

- What does "live" or "real-time" reporting mean in practice: immediate admin entry, automated donation totals, or integration with project management/accounting systems?
- Are financial expenditures/spend receipts required, or only funding and progress updates?
- Should timeline dates use Gregorian, Jalali, or both?

## Media, Gallery, Video, and Storytelling Features

### What It Is

A media and storytelling layer for images, videos, timelapses, project updates, autism education, and human stories.

### Why It Is Needed

The PowerPoint emphasizes storytelling: "داستان اتیسم را بشنو", videos, people and efforts, random images with related videos, phase photos, and timelapses. The product docs add gallery and special short-video pages.

### Who Uses It

- Public visitors
- Families and supporters
- Content/media admins
- Project team documenting progress

### Main Features

| Feature | Scope status | Details |
|---|---|---|
| Gallery page | Core | Images/videos with title, description, event tag, upload date, filters. |
| Media manager | Core | Upload, preview, reuse, albums/categories, search/filter, validation. |
| Short video page | Core | Mobile-first vertical video, full-screen playback, infinite scroll, captions/descriptions, sharing. |
| Video likes | Mentioned in Persian spec | Needs confirmation whether MVP includes likes. |
| Video story page | Explicit in PowerPoint | "Hear the autism story" page with video slides and descriptions. |
| People and efforts gallery | Explicit in PowerPoint | Randomly selected uploaded photos; each photo has video playback on click and person's title/name under it. |
| Timelapse media | Explicit in PowerPoint | Phase-related photos/timelapses. |

### Admin Controls Required

- Upload images/videos/documents.
- Set media title, description, tags, event, category, album, and visibility.
- Attach media to projects, phases, timeline entries, pages, blog posts, gallery, and video page.
- Manage short video metadata: caption, description, order, status, publish date.
- Configure random/featured media behavior for the "people and efforts" section.

### Likely Data/Entities

- `MediaAsset`
- `MediaAlbum`
- `GalleryItem`
- `VideoItem`
- `VideoLike`
- `VideoCategory`
- `PersonStory`
- `TimelapseAsset`
- `EventTag`

### Open Questions or Risks

- Will videos be uploaded directly to the platform, embedded from Aparat/YouTube/Instagram, or stored on a CDN/object storage?
- What are the maximum file size, format, compression, and storage requirements?
- Does "random" people/efforts gallery mean random on each load, admin-curated random pool, or algorithmic selection?
- Is video liking required for MVP or optional engagement scope?

## CMS and Editable Content Requirements

### What It Is

An admin-managed content system for website pages, menus, blog/news, media, and reusable content blocks.

### Why It Is Needed

The developer proposal explicitly says the goal is to reduce daily dependency on developers for content changes. The product docs require page creation/editing/deletion, menu management, footer management, logo upload, blog, and media reuse.

### Who Uses It

- Iran Autism content/admin team
- PR/media team
- Project update publishers
- Site administrators

### Main Features

| Feature | Required behavior |
|---|---|
| Static/dynamic pages | Create/edit pages such as About, Contact, Services, Rules/Privacy. |
| Menus | Header/footer menu management, nested/tree structure. |
| Header/footer content | Manage logos, footer, slogan/slider/header content where applicable. |
| Blog/news | Articles, categories, subcategories, tags, author, publish date, featured image. |
| SEO fields | Meta title/description and likely basic discovery fields. |
| Media reuse | Use uploaded media across pages, articles, projects, phases, galleries, and videos. |
| Content approval | Needs confirmation; admin publication approval appears in proposal. |

### Admin Controls Required

- CRUD for pages, articles, categories, tags, menus, media, and settings.
- Draft/publish workflow if required.
- SEO fields per page/article/project.
- Role-based permissions for editors vs admins, if confirmed.

### Likely Data/Entities

- `Page`
- `ContentBlock`
- `Article`
- `Category`
- `Tag`
- `Author`
- `Menu`
- `SiteSetting`
- `SEOFields`
- `Redirect` or `Slug`

### Open Questions or Risks

- Is a full flexible page builder required, or only predefined editable sections?
- Does the CMS need multilingual support now? The documents are Persian/English, but explicit multilingual delivery is not confirmed.
- Should articles support comments and ratings in MVP? Proposal includes comments/ratings; core product docs treat blog primarily as content.

## Admin Panel Requirements

### What It Is

The operational control center for platform administration, content publishing, project management, donation tracking, reporting, users, media, and platform settings.

### Why It Is Needed

This is a financial and content-heavy platform. Admins need daily operational control without developer intervention.

### Who Uses It

- Super admins
- Content managers
- Finance/reporting admins
- Project managers
- Support admins if ticketing is included

### Main Features

| Area | Required capabilities |
|---|---|
| Dashboard | Total donations, donations by project, active projects, donation trends, user growth, payment success rate, donor stats. |
| Project management | CRUD projects, types, phases, statuses, media, updates. |
| Donation management | View donations, donor details, targets, messages, status, filters, exports. |
| Transaction monitoring | Real-time/payment status view, gateway refs, callback status, logs, mismatch review. |
| User management | Registered users, profiles, donation history, roles/permissions where needed. |
| CMS management | Pages, menus, footer/header content, logo/favicon, blog, categories, tags. |
| Media management | Upload, preview, reuse, albums/categories, validation. |
| Gallery/video management | Gallery items, short videos, captions, publishing. |
| Reports/exports | Excel/CSV export for transactions and project summaries. |
| Platform settings | Payment providers, SEO basics, notification provider settings, admin users. |

### Developer-Proposed Admin Features Needing Confirmation

| Feature | Why it needs confirmation |
|---|---|
| Ticketing/support | Included in developer proposal, but not strongly present in client PowerPoint or MVP specs. |
| Comments/ratings | Included in proposal and Persian spec; exact target objects and moderation effort need confirmation. |
| Admin role hierarchy | Mentioned as role-based access/admin management; exact roles and permissions need definition. |
| Manual financial reconciliation tools | Proposal mentions manual reconciliation. Need confirm required workflow and accounting expectations. |

### Likely Data/Entities

- `AdminUser`
- `Role`
- `Permission`
- `AuditLog`
- `DashboardMetric`
- `ReportExport`
- `SystemSetting`
- `SupportTicket` if included
- `Comment` and `Rating` if included

### Open Questions or Risks

- How many admin roles are needed at launch?
- Should admin actions be audited for financial and publication changes?
- Is "real-time transaction monitoring" truly live, or just current-state lists with refresh?
- Are ticketing and comments/ratings contractual MVP scope or developer-added options?

## Payment, Transactions, and Financial Reporting

### What It Is

A secure payment orchestration and transaction management layer for donations and potentially other future payments.

### Why It Is Needed

Donations involve real money, public trust, and failure cases around gateway callbacks, transaction verification, and reconciliation.

### Who Uses It

- Donors during checkout/payment.
- Admin/finance users monitoring and exporting transactions.
- System services handling callbacks and verification.

### Main Features

| Feature | Required behavior |
|---|---|
| Domestic payment gateway | Integration with an Iranian gateway such as Zarinpal or similar, final provider selected by client. |
| Payment initiation | Create internal transaction before redirecting to gateway. |
| Callback validation | Verify callback authenticity and payment result. |
| Transaction states | Pending, successful, failed, cancelled, verification pending; exact taxonomy to confirm. |
| Retry/failure handling | Handle interruption, failed payment, duplicate callback, mismatch, gateway error. |
| Gateway references | Store gateway transaction/reference IDs. |
| Reports | Filters by date, gateway, status, payment type, project, user, amount; export to Excel/CSV. |
| Manual reconciliation | Proposed by developer; likely valuable but needs exact definition. |

### Proposed or Conditional Payment Scope

| Feature | Status | Notes |
|---|---|---|
| International donations | Proposed/conditional | Developer proposal says possible via international provider/intermediary subject to legal/operational feasibility; full multi-currency not included in this phase. |
| Recurring donations | Proposed/needs confirmation | Mentioned in proposal and recommended features. Requires provider support and safe storage of only provider tokens/mandates, not card/bank data. |
| Donation certificates | Recommended/optional | Mentioned as "if needed". |
| SMS confirmation | Recommended/depends on provider | Requires SMS provider selection and cost. |

### Admin Controls Required

- View transaction list and detail.
- Filter/search by project, phase, user, date, amount, gateway, status, payment type.
- Export reports.
- See payment logs/errors.
- Manually reconcile or flag mismatches if included.
- Configure gateway/provider credentials securely.

### Likely Data/Entities

- `PaymentTransaction`
- `PaymentAttempt`
- `PaymentGateway`
- `GatewayCallbackLog`
- `PaymentVerification`
- `FinancialReport`
- `RecurringMandate` if included
- `InternationalPaymentRecord` if included

### Open Questions or Risks

- Which domestic gateway will be used, and does it support required callbacks, refunds, recurring donations, and settlement reports?
- Are refunds required?
- Are international payments legally and operationally possible for Iran Autism?
- Is multi-currency display/conversion needed or explicitly excluded for MVP?
- How will offline/manual donations be represented, if at all?

## User Accounts, Authentication, and Profiles

### What It Is

A user account system based primarily on mobile number and OTP login, with profiles and donation history.

### Why It Is Needed

Registered users need traceable donation history, updates, profile management, and possibly comments/follows.

### Who Uses It

- Registered donors
- Families/community members if later features are added
- Admins managing user accounts

### Main Features

| Feature | Required behavior |
|---|---|
| Mobile OTP login/register | User enters mobile, receives OTP, verifies, then logs in or completes registration. |
| Basic profile | First name, last name, mobile number, settings as needed. |
| Donation history | Registered users can see previous donations and statuses. |
| Follow/favorite projects | Mentioned in Persian spec as following favorite projects; needs confirmation for MVP. |
| Receive updates | Mentioned in product docs; implementation depends on notification provider. |
| Comments interaction | Mentioned in Persian spec/proposal; needs confirmation. |

### Admin Controls Required

- View registered users.
- View user donation history.
- Manage accounts/roles if needed.
- Rate-limit or block suspicious accounts if required.

### Likely Data/Entities

- `User`
- `UserProfile`
- `OTPCode`
- `Session`
- `UserDonationHistory`
- `ProjectFollow`
- `NotificationPreference`

### Open Questions or Risks

- Are anonymous donors allowed to donate without mobile OTP? Product docs say yes; proposal implies donations may require account. Must confirm.
- Which SMS/OTP provider will be used, and who pays provider costs?
- Are email addresses required, or mobile-only?
- What user data retention/privacy policy is required?

## UI/UX and Design Requirements

### What It Is

The platform requires UX analysis, wireframes, UI design, design system, responsive layouts, and mobile-first implementation.

### Why It Is Needed

The donation flow must feel trustworthy, simple, and emotionally appropriate. The media/video features are interaction-heavy and must be designed intentionally.

### Who Uses It

- Public visitors and donors on mobile/desktop.
- Registered users.
- Admin users managing complex operations.

### Main Features and Design Deliverables

| Deliverable | Details |
|---|---|
| UX flows | Donation flow, project viewing, phase progress, video browsing, login/profile, admin operations. |
| Wireframes | Key public and admin screens. |
| UI design | High-fidelity screens for mobile/tablet/desktop. |
| Design system | Brand direction, color palette, typography, reusable components. |
| Mobile-first design | Special emphasis on donation and short-video experience. |
| Responsive admin | Admin dashboard, finance portal, CMS, media manager, reports. |

### Key Screens Mentioned

- Home page
- Donation flow
- Project list and project detail
- Construction phase progress
- Timeline/progress reporting
- Blog list and article detail
- Gallery
- Short video explorer/Reels page
- User login
- User profile/dashboard
- Admin dashboard
- Financial portal/transaction list
- CMS/content editor

### Open Questions or Risks

- Is Figma required as a final deliverable? Product docs say Figma wireframes/high-fidelity screens; proposal text is partially garbled but indicates design files/components.
- Does the visual design need to follow an existing Iran Autism brand guide?
- Should the design support RTL Persian only, or both RTL Persian and LTR English?

## Technical Architecture Requirements or Suggestions

### What It Is

The documents suggest a modern SPA/web application architecture with separate frontend/backend, relational database, ORM, queue/cache, Dockerized deployment, and production operations.

### Suggested Stack from Documents

| Layer | Suggested technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | TailwindCSS, DaisyUI in one document |
| State management | Context API or Zustand |
| Backend | NestJS |
| Database | PostgreSQL |
| ORM | Prisma |
| Queue/cache | Redis and BullMQ |
| Deployment | Dockerized environment |
| CI/CD | Initial CI/CD or safe deployment process as needed |

### Required/Recommended Technical Qualities

- Secure payment verification and transaction logging.
- HTTPS across the platform.
- Input validation and sanitization.
- Rate limiting, especially for OTP and sensitive endpoints.
- Admin access control and role-based permissions.
- File type/size validation for media uploads.
- Audit logs for sensitive admin/payment actions.
- Error monitoring/logging in production.
- Backup strategy.
- Scalable structure for adding new project types and future features.

### Open Questions or Risks

- The documents call the public product an SPA, but Next.js can be SSR/SSG/hybrid. Final architecture should prioritize SEO and performance, especially for public content.
- Hosting/server environment is not specified and client is responsible for infrastructure costs.
- Storage strategy for large videos and uploads must be defined early.
- Provider selections for gateway, SMS, international payment, recurring payment, and notifications affect architecture and timeline.

## Timeline and Delivery Phases

### 18-Week Plan from `time-estimation-iran-autism.docx`

| Phase | Weeks | Main delivery |
|---|---:|---|
| Phase 1 | 1-6 | Infrastructure, Docker/deployment setup, user accounts, base pages, multi-project structure, project list/detail initial version, base admin panel, UX/wireframes/UI foundation. |
| Phase 2 | 7-10 | Donation models, domestic bank gateway, transaction statuses, Donation Wall, donation admin management. |
| Phase 3 | 11-14 | CMS, blog, events page, special Reels/Explorer-style video page, content management. |
| Phase 4 | 15-18 | Header/footer menu management, analytics dashboard, Excel exports, real-time transaction monitoring, logs for payment errors/mismatches. |

### Other Timeline Signals

| Source | Timeline |
|---|---|
| Persian product spec | 4 months total development, with month 1 design, month 2 core development, month 3 full projects/phases/admin/timeline, month 4 testing/security/performance/release prep. |
| Developer proposal | 5 working months from finalizing contract, content, accesses, and providers. |

### Interpretation

There is a timeline conflict: 18 weeks, 4 months, and 5 working months all appear in the documents. The safest implementation understanding is that delivery is roughly 4 to 5 months, dependent on content, provider access, payment/SMS setup, design approvals, and scope confirmation.

## Future Features / Out of Scope

The documents repeatedly identify the following as future or separately quoted scope:

| Feature | Status |
|---|---|
| Appointment booking with doctors/therapists/rooms | Future/phase 2, separately quoted. |
| Doctor/therapist profiles | Future/phase 2. |
| Ratings/reviews for doctors | Future in one doc; comments/ratings for articles/products appear proposed elsewhere and need separation. |
| Community Q&A like StackOverflow | Future/phase 2. |
| Play center reservation | Future/phase 2. |
| Store/products | Not in MVP; proposal only mentions product ratings if a store is added. |
| Full multi-currency international payments | Not included in current phase according to proposal; international provider connection is conditional. |
| Any new feature outside agreed scope | Change request with separate estimate and agreement. |

## Assumptions

- The MVP language/content is primarily Persian and RTL unless client confirms multilingual support.
- The first highlighted campaign is the construction/equipment of a comprehensive autism center.
- The platform must be reusable for future campaigns, not hard-coded only for one building project.
- The admin team needs to manage most public content without developer assistance.
- Client will provide official content, images, videos, legal text, branding assets, server/domain/payment/SMS/provider access, and required approvals.
- Infrastructure, domain, server, gateway, SMS, storage/CDN, and third-party provider costs are outside development cost unless explicitly agreed otherwise.
- Payment totals and project progress should not be publicly published without admin-approved settings/workflow.
- Source code and documentation delivery terms are part of the commercial agreement and tied to payment completion in the proposal.

## Risks and Ambiguities

| Risk/Ambiguity | Why it matters | Recommendation |
|---|---|---|
| Anonymous vs registered-only donation conflict | Product docs require anonymous donation; proposal says users must have account for donation/comment. | Confirm donation policy before designing checkout and transaction model. |
| Donation Wall status | Time plan includes Donation Wall; proposal says if client approves. | Decide whether MVP includes it, and what donor privacy controls exist. |
| International donations | Legal/provider feasibility is uncertain; full multi-currency excluded. | Treat as conditional or phase 2 unless client explicitly requires MVP. |
| Recurring donations | Requires provider support and more complex mandate/cancellation flows. | Confirm provider and MVP status early. |
| Video storage and delivery | Reels-style video can become expensive and technically heavy. | Define upload limits, hosting/CDN, compression, and embed strategy. |
| Construction progress calculation | Could be donation-based, manual construction progress, or both. | Define separate financial progress and operational progress fields. |
| Public financial transparency depth | Docs mention collected amounts and progress, but not detailed spend/receipt disclosure. | Confirm whether spending reports/receipts are required. |
| Timeline conflict | Documents mention 18 weeks, 4 months, and 5 working months. | Align on one contractual timeline after provider/content dependencies are clear. |
| CMS flexibility | Full page builder vs predefined editable sections affects cost and risk. | Define CMS editing model before implementation. |
| Admin roles and audit logs | Financial platform needs accountability; roles are only broadly described. | Define roles, permissions, and audit requirements. |
| Tickets/comments/ratings | Present in proposal/spec but not PowerPoint; can expand scope. | Confirm if included in MVP or deferred. |
| SEO/multilingual | Basic SEO is mentioned, multilingual is not clearly specified. | Confirm required locales, slugs, metadata, and RTL/LTR behavior. |

## Questions to Confirm With the Client

1. Is anonymous donation definitely required at launch, or must every donor verify by mobile OTP?
2. Should users be able to donate to the whole project, a phase, a specific equipment/item, and general support at launch?
3. Is the Donation Wall part of MVP? If yes, should donors opt in/out, show names, initials, amount, message, or anonymous labels?
4. Should project progress have two separate values: financial progress and construction/operational progress?
5. Are phase budgets and donation allocation managed manually by admins or calculated only from payment targets?
6. Which currency should be used publicly and internally: Toman, Rial, or both?
7. Which domestic payment gateway should be integrated first?
8. Are refunds, manual/offline donations, and manual reconciliation required at launch?
9. Are international donations required for MVP, or only architecture-ready/future?
10. Are recurring monthly donations required for MVP?
11. Which SMS/OTP provider will be used, and who manages credits/costs?
12. Is the website Persian-only at launch, or should English/multilingual support be implemented?
13. Should the CMS be a flexible page builder or a controlled set of editable sections?
14. What exact pages must launch on day one?
15. Does the "press kit / PR / licenses" header content require downloadable file management?
16. How should videos be hosted: direct upload, object storage/CDN, Aparat, YouTube, Instagram embeds, or a mix?
17. Is video liking required for MVP?
18. What exactly is the "people and efforts" gallery: staff, donors, volunteers, children/stories, or project participants?
19. Are comments and ratings required for articles in MVP?
20. Is ticketing/support required in MVP, or was it a developer-added proposal item?
21. What admin roles are required: super admin, content editor, finance admin, project manager, support?
22. Should public donation/progress data require admin approval before publication?
23. What reports must be exportable besides transaction list and project summary?
24. Are legal pages, privacy policy, terms, donation rules, and charity license pages provided by the client?
25. Which delivery timeline should be treated as contractual: 18 weeks, 4 months, or 5 working months?

## Final Scope Checklist

Based on the reviewed documents, the requested platform includes:

- [ ] Public Iran Autism website with editable homepage, header, footer, menus, logo, services, about, contact, news, projects, gallery, and videos.
- [ ] Homepage content aligned with client PowerPoint: 8-image slider, recent news, timeline, donation progress, construction phases, and center-service narrative.
- [ ] Multi-project crowdfunding system for construction, equipment, and general donation campaigns.
- [ ] Project listing and detail pages with target amount, collected amount, donor count, progress, status, media, updates, and sharing.
- [ ] Construction-phase system for the comprehensive center, including the nine client-listed phases.
- [ ] Phase-level budgets, progress, statuses, images, videos, timelapses, and updates.
- [ ] Transparency timeline for each project/phase with dated activity updates and media evidence.
- [ ] Donation flow for project/phase/item/general support, with anonymous donation requiring final confirmation.
- [ ] Registered user donation flow with mobile OTP, profile, and donation history.
- [ ] Domestic Iranian payment gateway integration with transaction verification, callback handling, failure states, and logs.
- [ ] Admin donation and transaction management with filters, details, monitoring, and Excel/CSV exports.
- [ ] Admin dashboard with donation totals, project stats, user growth, donation trends, and payment success/reporting metrics.
- [ ] CMS for pages, menus, footer/header content, logo/favicon, blog/news, SEO fields, and media reuse.
- [ ] Blog/news system with categories, subcategories, tags, authors, publish dates, featured images, search/filter, and SEO fields.
- [ ] Media manager for images, videos, documents/files, albums/categories, preview, validation, search, filtering, and reuse.
- [ ] Gallery page for images/videos with title, description, event/category tagging, date, and filters.
- [ ] Special mobile-first short video page with vertical/full-screen playback, infinite scroll, captions/descriptions, sharing, and admin control.
- [ ] Client-requested storytelling sections: "Hear the autism story" videos and "people and efforts" image/video experience.
- [ ] UI/UX design work including flows, wireframes, high-fidelity screens, responsive layouts, and design system.
- [ ] Security basics: HTTPS, secure OTP/authentication, rate limiting, input validation, payment verification, admin access control, logs, monitoring, backups.
- [ ] Deployment/infrastructure setup including Dockerized environment and basic safe deployment process.
- [ ] Future-ready architecture for appointment booking, doctor profiles, Q&A, ratings/reviews, and play center reservation, without treating those as MVP.
- [ ] Needs confirmation before MVP commitment: international donations, recurring donations, Donation Wall details, donation certificates, SMS/email progress notifications, comments/ratings, support tickets, full multilingual support, manual reconciliation, and offline donations.
