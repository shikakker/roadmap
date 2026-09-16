# Product Completion Status — roadmap

Canonical branch: `portfolio-improvements-2026-08`  
Canonical PR: `#1`  
Vercel project: `roadmap` (`prj_47u0gv1D0rnOiZs4WvZW7mNRkhPp`).

Product boundary: public roadmap backed by Upstash Redis with Auth0-authenticated voting and privileged create/publish/remove mutations. This branch hardens authentication, mutation integrity, dependency/tooling security and deterministic release verification; it is not automatically promoted to production.

## Core tasks

| ID | Status | Task |
| --- | --- | --- |
| T01 | DONE | Inspect current repository, runtime, APIs and Vercel history. |
| T02 | DONE | Pin supported Node 24 and pnpm 9.15.9 toolchain. |
| T03 | DONE | Regenerate and verify a deterministic pnpm lockfile. |
| T04 | DONE | Move vulnerable Next 12 runtime to Next.js 15.5.24 / React 18.2. |
| T05 | DONE | Make Auth0 middleware fail closed on invalid/missing provider responses and identities. |
| T06 | DONE | Add regression contracts plus frozen install/typecheck/build/security verification boundaries. |
| T07 | DONE | Prevent authenticated vote calls from fabricating new roadmap members. |
| T08 | DONE | Harden create/remove/publish methods, validation, authorization, not-found/conflict/provider errors and error redaction. |
| T09 | DONE | Harden the public list API as GET-only and replace raw Redis error bodies with controlled `LIST_FAILED`. |
| T10 | BLOCKED | Exact-head hosted mutation/browser verification requires Vercel capacity plus intended Auth0/Redis configuration. |

## Improvements

| ID | Status | Improvement |
| --- | --- | --- |
| I01 | DONE | Validate Auth0 `/userinfo` HTTP success before trusting JSON. |
| I02 | DONE | Require a non-empty Auth0 `sub` before mutation handlers run. |
| I03 | DONE | Return controlled 401/502/503 auth failures instead of passing provider error payloads downstream. |
| I04 | DONE | Replace incompatible historical pnpm lock state with a verified pnpm 9 lock. |
| I05 | DONE | Block both production and full dependency high-severity audit findings in permanent CI. |
| I06 | DONE | Pin patched PostCSS across the runtime dependency graph. |
| I07 | DONE | Verify Next.js 15.5.24 build compatibility on the existing Pages Router app. |
| I08 | DONE | Check roadmap-member existence before writing vote identity or incrementing score. |
| I09 | DONE | Add explicit ESLint 9 / Next lint boundary with zero-warning permanent gate and remove all discovered lint violations. |
| I10 | BLOCKED | Responsive/keyboard and provider-backed authenticated flows still need exact-head hosted browser QA. |

## Product features

| ID | Status | Feature |
| --- | --- | --- |
| F01 | DONE | Roadmap listing with fail-closed provider error semantics. |
| F02 | DONE | Feature creation with bounded title validation. |
| F03 | DONE | Authenticated voting behind fail-closed identity verification. |
| F04 | DONE | Duplicate-vote prevention with explicit 409 conflict behavior. |
| F05 | DONE | Privileged publish with admin/config/payload/existence checks and compensating restore on release-write failure. |
| F06 | DONE | Privileged remove with admin/config/payload/not-found/provider error semantics. |
| F07 | DONE | Auth0 sign-in integration retained at compile/runtime boundary. |
| F08 | BLOCKED | Hosted provider-error UX requires intended Auth0/Redis environment smoke. |
| F09 | DEFERRED WITH REASON | New roadmap features are deferred until the existing provider-backed mutation flow is hosted-verified. |
| F10 | DEFERRED WITH REASON | Production promotion is intentionally not performed automatically. |

## Verification evidence

Initial hardening added fail-closed Auth0 handling, vote integrity and privileged mutation contracts. The privileged-mutation RED head `47572133e6f7d091086436816a151ad7067f2775` failed exactly on the new create/remove/publish assertions before the production fixes were applied.

Second sweep upgraded the release gate rather than adding cosmetic features:

- guarded quality-upgrade run `35121145314`, job `104878945382`: full dependency audit PASS / 0 high findings, 22 tests PASS, typecheck PASS, zero-warning lint PASS, production build PASS, verified lint/tooling state committed only after all gates were green;
- real lint findings fixed without suppressions: unused auth/user bindings, raw image usage, mutable locals, anonymous handler/config exports and CommonJS Tailwind config;
- `FormCreate` now uses an initials avatar instead of loading an external Auth0 image URL;
- local header logo uses `next/image`;
- Tailwind config is ESM;
- permanent read-only Quality now enforces frozen install, production audit, full audit, tests, typecheck, zero-warning lint and build.

The public list endpoint was then hardened test-first:

- RED head `8371e1ac83a492fc63714e7755a122cfc20858c5`, Quality run `35121476026`: production/full audits PASS, then the new list-endpoint regression failed as expected;
- GREEN code head `5c30f3d5cf5c1c7c4acba467b47ddf9914572290`, Quality run `35121584915`, job `104880428185`: frozen install PASS, production audit PASS, full audit PASS, **23 tests PASS**, typecheck PASS, zero-warning lint PASS, production build PASS.

Vercel exact status on `5c30f3d...` explicitly reports `Deployment rate limited — retry in 24 hours.` Canonical project `roadmap` is connected; its latest available READY preview remains `dpl_E4VM8PvPDMZyVzsswowTbdoTLgb6` on an earlier runtime commit and is not exact-head browser evidence.

No merge, production promotion, Auth0/Redis credential mutation, destructive data migration, billing action or live roadmap data mutation has been performed.

**BLOCKED ONLY BY:** Vercel accepting a new exact-head preview after the Hobby deployment-rate window clears, then intended Auth0/Redis configuration for provider-backed authenticated mutation/browser QA.

Status: **PARTIAL — repository security/release gates are green; exact-head hosted/provider verification remains external.**
