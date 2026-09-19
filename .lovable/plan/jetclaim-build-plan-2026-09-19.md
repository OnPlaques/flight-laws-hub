# JetClaim build plan

## Goal
Create a distinctive, simple JetClaim flight-compensation website using the uploaded landing-page image as visual reference and the uploaded codebase as the source for routes, regulations, claim workflows, and admin features.

## Public website
- Build the home page around the reference composition: strong airport imagery, eligibility form, compensation categories, a four-step process, trust points, testimonials, and a compact footer.
- Keep the JetClaim identity unique through a cleaner editorial layout, deep navy, bright aviation blue, white space, and restrained motion.
- Retain separate pages for How It Works, Passenger Rights, Regulations, About, FAQs, Contact, Claim Submission, and Claim Confirmation.
- Preserve the supplied international regulation and route matching coverage: EU261, UK261, US DOT, Canada APPR, India DGCA, Brazil ANAC, Turkey SHY, and the Montreal Convention.

## Claim experience
- Keep the guided claim form for flight details, disruption details, evidence uploads, contact details, authorization, and review.
- Store submitted claims and uploaded evidence securely in Lovable Cloud.
- Give each claim a reference number and show a clear confirmation page.

## Admin console
- Add a dedicated admin login protected by the supplied shared password, stored only as an encrypted server secret.
- Use a secure server-managed session so refreshing and navigating keeps the console unlocked.
- Provide a responsive admin console with overview metrics, claims queue, claim detail/status management, airlines and regulations, payments, and settings.
- Do not create admin profiles or individual admin accounts.

## Technical details
- Adapt only the needed source files from the archive; exclude its Git metadata, generated output, and dependencies.
- Replace account-based admin checks with a server-side shared-password gate and timing-safe comparison.
- Create Cloud tables with explicit grants and row-level security, plus private document storage policies.
- Add unique metadata for every public page and `noindex` metadata for private admin pages.
- Validate desktop and mobile layouts, claim submission, admin login, and console navigation.

## Assumption
The exact password entered in the request, including the leading `@` and internal space, is the intended shared admin password.
