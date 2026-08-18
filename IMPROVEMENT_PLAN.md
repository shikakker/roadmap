# Completion plan

1. Establish provenance before portfolio claims: the compact Next.js/Tailwind/Redis product-feedback roadmap implementation may originate from a public starter/example. Identify upstream/version and document the custom delta.
2. Document the actual domain model implied by `CardNew`, `CardRelease`, list/create/publish/remove/vote APIs and Redis keys: suggestion ID, text, vote count, publication/release state, ordering and timestamps if present.
3. Audit `.env.local.example`, `lib/authenticate.ts` and `lib/redis.ts`. Admin credentials/tokens and Redis connection strings must remain server-only; use constant-time/robust auth where appropriate and never rely on a client flag for publish/remove authorization.
4. Validate every mutation API server-side: method, schema/length, duplicate submissions, unknown IDs and malformed Redis values. Return consistent status codes without leaking credentials or backend internals.
5. Make voting abuse-resistant enough for the documented scope: define whether votes are anonymous, per-session or authenticated; add rate limiting/deduplication if public, and do not claim trustworthy prioritization without an identity model.
6. Make publish/remove transitions atomic and idempotent so concurrent requests cannot lose votes, duplicate releases or resurrect removed suggestions. Use Redis transactions/scripts where the current data layout requires it.
7. Improve product states: optimistic vote rollback, loading/skeleton, empty backlog, failed create/vote/publish/remove, offline/retry and clear distinction between proposed and released items.
8. Accessibility/responsive pass for cards/forms/actions: semantic buttons/forms, labels/errors, focus, keyboard operation, reduced motion and clear status announcements after mutations.
9. Add tests for auth, validation, voting concurrency/dedup semantics and publish/remove transitions using a test Redis/mock; CI runs lint/typecheck/tests/build with no production Redis credentials.
10. Rewrite README with provenance, verified feedback-to-release workflow, Redis data model, admin/security model, setup, screenshots and explicit limitations versus a multi-user product-management platform.
