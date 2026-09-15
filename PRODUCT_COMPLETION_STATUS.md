# Product Completion Status — roadmap

Canonical branch: `portfolio-improvements-2026-08`
Canonical PR: `#1`

Product boundary: public roadmap backed by Upstash Redis with Auth0-authenticated voting and privileged publish/remove operations. This branch hardens authentication, mutation integrity, runtime dependencies and deterministic verification; it is not automatically promoted to production.

## Core tasks

| ID | Status | Task |
| --- | --- | --- |
| T01 | DONE | Inspect current repository, runtime, APIs and Vercel history |
| T02 | DONE | Pin supported Node 20 and pnpm 9.15.9 toolchain |
| T03 | DONE | Regenerate and verify a deterministic pnpm lockfile |
| T04 | DONE | Move vulnerable Next 12 runtime to patched Next.js 15.5.24 / React 18.2 |
| T05 | DONE | Make Auth0 middleware fail closed on invalid/missing provider responses and identities |
| T06 | DONE | Add regression contracts plus install/typecheck/build/security verification boundaries |
| T07 | DONE | Prevent authenticated vote calls from fabricating new roadmap members |
| T08 | PARTIAL | Create/remove/publish API method and input/status consistency still needs the same hardening pass |
| T09 | PARTIAL | Exact-current-head Vercel preview and interactive Auth0/Redis smoke remain to be verified |
| T10 | BLOCKED | Production promotion requires explicit approval and intended provider configuration |

## Improvements

| ID | Status | Improvement |
| --- | --- | --- |
| I01 | DONE | Validate Auth0 `/userinfo` HTTP success before trusting JSON |
| I02 | DONE | Require a non-empty Auth0 `sub` before mutation handlers run |
| I03 | DONE | Return controlled 401/502/503 auth failures instead of passing provider error payloads downstream |
| I04 | DONE | Replace incompatible historical pnpm lock state with a verified pnpm 9 lock |
| I05 | DONE | Use a high/critical production dependency audit as a release gate |
| I06 | DONE | Pin patched PostCSS 8.5.28 across the runtime dependency graph |
| I07 | DONE | Verify Next.js 15.5.24 build compatibility on the existing Pages Router app |
| I08 | DONE | Check roadmap-member existence before writing vote identity or incrementing score |
| I09 | PARTIAL | Normalize HTTP methods, validation and error classes on remaining mutation APIs |
| I10 | PARTIAL | Responsive, keyboard and authenticated hosted QA requires a current READY preview |

## Product features

| ID | Status | Feature |
| --- | --- | --- |
| F01 | DONE | Existing roadmap listing retained |
| F02 | DONE | Existing feature creation flow retained |
| F03 | DONE | Authenticated voting retained behind fail-closed identity verification |
| F04 | DONE | Duplicate-vote prevention retained with explicit 409 conflict behavior |
| F05 | DONE | Existing privileged publish behavior retained |
| F06 | DONE | Existing privileged remove behavior retained |
| F07 | DONE | Auth0 sign-in integration retained at compile/runtime boundary |
| F08 | PARTIAL | Hosted provider-error UX requires intended Auth0/Redis environment smoke |
| F09 | DEFERRED WITH REASON | New roadmap features are deferred until the existing privileged mutation/provider boundary is fully hosted-verified |
| F10 | BLOCKED | Production release requires exact-head preview verification and explicit approval |

## Verification evidence

The authentication regression was defined first and then fixed: invalid Auth0 `/userinfo` responses are rejected, a non-empty subject is required, missing provider configuration is controlled, and provider failures do not enter mutation handlers as users.

The original pnpm 5.3-era lockfile was incompatible with pnpm 9. A guarded regeneration proved frozen install, TypeScript and the production build, then exposed the more important release blocker: Next.js 12.3.7 carried current critical/high production advisories. The runtime was moved to Next.js 15.5.24 / React 18.2. The resulting build passed, and the remaining high findings were isolated to Next's transitive PostCSS 8.4.31. A test-first pnpm override pins PostCSS 8.5.28. Guarded sync run `35031102575` then passed regression contracts, dependency regeneration, frozen install, TypeScript, Next.js 15.5.24 production build, high/critical production dependency audit, and the verified lockfile commit. The generated dependency-state commit is `117bc4a68f16a48d7991c424f2afaf1208d3969c`.

Vote integrity was also handled test-first. The RED contract proved the original route could increment a client-constructed sorted-set member. The implementation now rejects non-POST mutations, verifies the feature already exists with `zscore` before writing the voter set, returns 404 for a nonexistent feature and 409 for a duplicate vote, and no longer leaks arbitrary exception text.

Historical Vercel branch deployments are not evidence for this final runtime: the latest inspected branch deployment before these fixes was `dpl_BbM7KPLWKrivwg2zBUbtZbkWTsiH`, which failed on the deliberately RED runtime-security test commit. The old `main` production deployment remains READY but predates this hardening. A current branch deployment must be observed before hosted completion is claimed.

No merge, production promotion, Auth0/Redis credential mutation, destructive data migration, billing action or live roadmap data mutation has been performed.

Status: **PARTIAL** — the highest-priority auth/runtime/dependency/vote-integrity code boundaries are fixed and locally/CI verified; remaining release gates are exact-head Vercel/provider smoke, remaining privileged-API consistency, and explicit production approval.
