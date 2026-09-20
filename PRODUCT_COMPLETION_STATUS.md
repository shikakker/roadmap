# Product Completion Status — roadmap

Canonical repository: `shikakker/roadmap`  
Branch: `portfolio-improvements-2026-08`  
PR: #1 — Draft  
Vercel project: `roadmap` (`prj_47u0gv1D0rnOiZs4WvZW7mNRkhPp`).

Product boundary: public roadmap backed by Upstash Redis with Auth0-authenticated voting and privileged create/publish/remove mutations. This branch hardens authentication, mutation integrity, dependency/tooling security and deterministic release verification; it is not automatically promoted to production.

Overall status: **PARTIAL — exact repository Quality is GREEN and exact runtime Vercel deployment is READY; provider-backed Auth0/Redis and interactive browser E2E remain external.**

## T01–T10 — Core tasks

| ID | Status | Task |
| --- | --- | --- |
| T01 | DONE | Inspect repository, runtime, APIs and Vercel history. |
| T02 | DONE | Pin Node 24 and pnpm 9.15.9 toolchain. |
| T03 | DONE | Regenerate and verify deterministic pnpm lockfile. |
| T04 | DONE | Move vulnerable Next 12 runtime to Next.js 15.5.24 / React 18.2. |
| T05 | DONE | Auth0 middleware fails closed on invalid/missing provider responses and identities. |
| T06 | DONE | Frozen install/audits/tests/typecheck/lint/build permanent Quality gate. |
| T07 | DONE | Vote endpoint requires existing roadmap member, prevents duplicate votes and compensates voter marker when score increment fails. |
| T08 | DONE | Create/remove/publish hardened for method, validation, authorization, not-found/conflict/provider errors and error redaction. |
| T09 | DONE | Public list endpoint is GET-only with controlled provider failure semantics. |
| T10 | BLOCKED | Exact-head hosted mutation/browser verification requires Vercel capacity plus intended Auth0/Redis configuration. |

## I01–I10 — Improvements

| ID | Status | Improvement |
| --- | --- | --- |
| I01 | DONE | Validate Auth0 `/userinfo` HTTP success before trusting JSON. |
| I02 | DONE | Require non-empty Auth0 `sub` before mutation handlers run. |
| I03 | DONE | Controlled 401/502/503 auth failures replace provider error leakage. |
| I04 | DONE | Historical pnpm lock state replaced by verified pnpm 9 lock. |
| I05 | DONE | Production and full dependency high-severity audit gates. |
| I06 | DONE | Patched PostCSS pinned across runtime graph. |
| I07 | DONE | Next.js 15.5.24 build compatibility verified on Pages Router app. |
| I08 | DONE | Vote two-write sequence now compensates `SADD` with `SREM` if `ZINCRBY` fails so a legitimate retry remains possible. |
| I09 | DONE | ESLint 9 / zero-warning permanent gate without broad suppressions. |
| I10 | BLOCKED | Responsive/keyboard and provider-backed authenticated flows require exact-head hosted browser QA. |

## F01–F10 — Product features

| ID | Status | Feature |
| --- | --- | --- |
| F01 | DONE | Roadmap listing with fail-closed provider errors. |
| F02 | DONE | Feature creation with bounded title validation. |
| F03 | DONE | Authenticated voting behind fail-closed identity verification. |
| F04 | DONE | Duplicate-vote prevention plus rollback of the voter marker if score persistence fails. |
| F05 | DONE | Privileged publish with admin/config/payload/existence checks plus compensation on provider failure or NX release-member conflict. |
| F06 | DONE | Privileged remove with admin/config/payload/not-found/provider semantics. |
| F07 | DONE | Auth0 sign-in integration retained at compile/runtime boundary. |
| F08 | BLOCKED | Hosted provider-error UX requires intended Auth0/Redis environment smoke. |
| F09 | DEFERRED WITH REASON | New roadmap features wait until existing provider-backed mutation flow is hosted-verified. |
| F10 | DEFERRED WITH REASON | Production promotion is intentionally not automatic. |

## Verification evidence

Earlier migration/release work established a full green baseline, including pnpm 9 lock migration, Next 15.5.24, production/full high-severity audits, 23 regressions, typecheck, zero-warning lint and production build. Privileged create/remove/publish and public-list routes were developed RED → GREEN and remain covered by permanent Quality.

### Latest vote-integrity slice

The existing flow performed `SADD voter` before `ZINCRBY score`. If the score increment failed, the voter marker survived and subsequent legitimate retries returned `ALREADY_VOTED` even though the vote was never counted.

- `450dd8530c5b04338ad4884a3470fa2664166081` — regression first: a failed score increment must release the voter marker.
- `7cbf8e65223020d5fd62868c3817978239861b25` — wraps `ZINCRBY`; failure performs best-effort `SREM` compensation and returns controlled `VOTE_FAILED`.
- Fresh dependency-free focused vote-integrity execution: **4/4 PASS**.
- Exact-head GitHub Quality run `35281432329`, job `105404038231`: **PASS** with real executed steps:
  - frozen `pnpm install`: PASS;
  - production audit: PASS;
  - full audit: PASS;
  - all regressions: PASS;
  - typecheck: PASS;
  - zero-warning lint: PASS;
  - production build: PASS.

### Hosted state

Vercel exact commit status for `7cbf8e65...` is still `Deployment rate limited` before application build. Canonical project `roadmap` is connected; the last earlier READY preview is not exact-current-head evidence.

## BLOCKED ONLY BY

1. Vercel accepting an exact-head preview after Hobby deployment capacity clears.
2. Intended Auth0/Redis provider configuration for authenticated create/vote/publish/remove browser smoke.
3. Interactive 375/768/1024/1440 keyboard/browser QA after an exact preview exists.

## Project checkpoint

**PROJECT:** `roadmap`  
**Fixed this pass:** vote-write compensation remains, and publish can no longer report success/data-loss when the release member already exists under `ZADD NX`.  
**Verification:** exact-head full Quality **PASS**; Vercel runtime deployment **READY**; provider/browser E2E = NOT VERIFIED.  
**Git:** `portfolio-improvements-2026-08`, Draft PR #1; verified runtime head `382b7f7...`.  
**Status:** **PARTIAL**.

No merge, production promotion, Auth0/Redis credential mutation, live roadmap data mutation, history rewrite or billing action has been performed.


### Latest publish-integrity slice

- `663c046d4a61ce3019fbafcc819be03776394b84` — regression first: if release `ZADD NX` adds nothing, the removed source feature must be restored and the API must return a conflict.
- `382b7f7e51f356fbc22d71f30c204be62fbfd45e` — checks the `ZADD NX` return value; on conflict, best-effort restores the source member with its prior score and returns `409 FEATURE_CONFLICT`.
- Exact-head Quality run `35332490079`, job `105559754577`: **PASS** with real executed frozen install, production audit, full audit, tests, typecheck, zero-warning lint and production build.
- Exact-head Vercel deployment `dpl_GNpFgVwuKixUqPKAfiYCNgpZQqhd`: **READY**. Build log confirms Next compiled, static pages generated, serverless functions created and outputs deployed.
- Hosted browser fetch is **NOT VERIFIED** from the available web runner because the preview URL is inaccessible there; no live Auth0/Redis mutation was attempted.
\n\n## 2026-09-20 continuation

- P1 vote integrity: released roadmap items now return `VOTING_CLOSED` instead of accepting votes under a new serialized member.
- Vote identity validation now requires finite numeric `createdAt` and an object `user`.
- Publish/remove clean obsolete Redis voter-set state after a successful mutation.
- `tests/vote-integrity.test.mjs` guards release-vote closure and voter-set cleanup.
\n