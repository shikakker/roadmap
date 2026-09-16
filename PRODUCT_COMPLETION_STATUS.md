# Product Completion Status — roadmap

Canonical branch: `portfolio-improvements-2026-08`
Canonical PR: `#1`

Product boundary: public roadmap backed by Upstash Redis with Auth0-authenticated voting and privileged create/publish/remove mutations. This branch hardens authentication, mutation integrity, runtime dependencies and deterministic verification; it is not automatically promoted to production.

## Core tasks

| ID | Status | Task |
| --- | --- | --- |
| T01 | DONE | Inspect current repository, runtime, APIs and Vercel history |
| T02 | DONE | Pin supported Node 24 and pnpm 9.15.9 toolchain |
| T03 | DONE | Regenerate and verify a deterministic pnpm lockfile |
| T04 | DONE | Move vulnerable Next 12 runtime to patched Next.js 15.5.24 / React 18.2 |
| T05 | DONE | Make Auth0 middleware fail closed on invalid/missing provider responses and identities |
| T06 | DONE | Add regression contracts plus frozen install/typecheck/build/security verification boundaries |
| T07 | DONE | Prevent authenticated vote calls from fabricating new roadmap members |
| T08 | DONE | Harden create/remove/publish methods, validation, authorization, not-found/conflict/provider errors and error redaction |
| T09 | DONE | Prior runtime commit has a READY Vercel preview and HTTP 200 homepage smoke |
| T10 | BLOCKED | Exact-head hosted mutation/browser verification requires Vercel build capacity plus intended Auth0/Redis configuration |

## Improvements

| ID | Status | Improvement |
| --- | --- | --- |
| I01 | DONE | Validate Auth0 `/userinfo` HTTP success before trusting JSON |
| I02 | DONE | Require a non-empty Auth0 `sub` before mutation handlers run |
| I03 | DONE | Return controlled 401/502/503 auth failures instead of passing provider error payloads downstream |
| I04 | DONE | Replace incompatible historical pnpm lock state with a verified pnpm 9 lock |
| I05 | DONE | Make high-severity production dependency audit a permanent blocking Quality step |
| I06 | DONE | Pin patched PostCSS 8.5.28 across the runtime dependency graph |
| I07 | DONE | Verify Next.js 15.5.24 build compatibility on the existing Pages Router app |
| I08 | DONE | Check roadmap-member existence before writing vote identity or incrementing score |
| I09 | DONE | Normalize HTTP methods, bounded input and status/error classes on create/remove/publish APIs |
| I10 | PARTIAL | Responsive/keyboard and provider-backed authenticated flows still need exact-head hosted browser QA |

## Product features

| ID | Status | Feature |
| --- | --- | --- |
| F01 | DONE | Existing roadmap listing retained |
| F02 | DONE | Existing feature creation flow retained with bounded title validation |
| F03 | DONE | Authenticated voting retained behind fail-closed identity verification |
| F04 | DONE | Duplicate-vote prevention retained with explicit 409 conflict behavior |
| F05 | DONE | Privileged publish retained with explicit admin/config/payload/existence checks and compensating restore on release-write failure |
| F06 | DONE | Privileged remove retained with explicit admin/config/payload/not-found/provider error semantics |
| F07 | DONE | Auth0 sign-in integration retained at compile/runtime boundary |
| F08 | PARTIAL | Hosted provider-error UX requires intended Auth0/Redis environment smoke |
| F09 | DEFERRED WITH REASON | New roadmap features are deferred until the existing provider-backed mutation flow is hosted-verified |
| F10 | DEFERRED WITH REASON | Production promotion is intentionally not performed automatically |

## Verification evidence

The authentication and vote-integrity regressions were defined first and then fixed: invalid Auth0 `/userinfo` responses are rejected, a non-empty subject is required, missing provider configuration is controlled, vote targets must already exist, duplicate votes return 409, and arbitrary provider exceptions are not leaked.

The privileged-mutation regression was committed first at `47572133e6f7d091086436816a151ad7067f2775`. Quality run `35097298787` was RED exactly on the 13 new create/remove/publish assertions while the existing 9 tests remained green.

The implementation then made all three mutations POST-only, added bounded validation and controlled status classes, removed raw exception/log leakage, and added admin/config checks to privileged routes. `publish` checks existence before mutation and attempts to restore the original sorted-set member if the release write fails after removal.

Code head `551a094f83112bc892275e614c30a0978798c183` passed the new contracts, frozen install, TypeScript and production build in Quality run `35097408831`.

Final release-gate head `694a83616cc3cd0f1536eac71c0676433526cf77` also corrected the permanent CI truth boundary: Actions v7 / Node 24, frozen install, `pnpm audit --prod --audit-level high`, 22 regression tests, TypeScript and Next production build. Push run `35097511185` and PR run `35097515389` both PASS end-to-end.

The latest available READY Vercel preview is still `dpl_E4VM8PvPDMZyVzsswowTbdoTLgb6` on runtime commit `4f2ab78938524477d5a13582f0cdbc45bb5fe065`; its homepage previously returned HTTP 200. Vercel did not create an exact-head preview for `694a836...`: GitHub's Vercel status explicitly reports `Deployment rate limited — retry in 24 hours.`

No merge, production promotion, Auth0/Redis credential mutation, destructive data migration, billing action or live roadmap data mutation has been performed.

**BLOCKED ONLY BY:** Vercel accepting a new exact-head preview after the Hobby deployment-rate window clears, then intended Auth0/Redis configuration for provider-backed authenticated mutation/browser QA.

Status: **PARTIAL — current code/release gates are green and privileged API consistency is complete; exact-head hosted/provider verification remains external.**
