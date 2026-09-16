# Product Completion Status — roadmap

Canonical branch: `portfolio-improvements-2026-08`
Canonical PR: `#1`

Product boundary: public roadmap backed by Upstash Redis with Auth0-authenticated voting and privileged publish/remove operations. This branch hardens authentication, mutation integrity, runtime dependencies and deterministic verification; it is not automatically promoted to production.

## Core tasks

| ID | Status | Task |
| --- | --- | --- |
| T01 | DONE | Inspect current repository, runtime, APIs and Vercel history |
| T02 | DONE | Pin supported Node 24 and pnpm 9.15.9 toolchain |
| T03 | DONE | Regenerate and verify a deterministic pnpm lockfile |
| T04 | DONE | Move vulnerable Next 12 runtime to patched Next.js 15.5.24 / React 18.2 |
| T05 | DONE | Make Auth0 middleware fail closed on invalid/missing provider responses and identities |
| T06 | DONE | Add regression contracts plus install/typecheck/build/security verification boundaries |
| T07 | DONE | Prevent authenticated vote calls from fabricating new roadmap members |
| T08 | PARTIAL | Create/remove/publish API method and input/status consistency still needs the same hardening pass |
| T09 | DONE | Current runtime commit has a READY Vercel preview and HTTP 200 homepage smoke |
| T10 | BLOCKED | Authenticated Auth0/Redis mutation smoke requires intended provider credentials/configuration; production promotion also requires explicit approval |

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
| I10 | PARTIAL | Responsive/keyboard and provider-backed authenticated flows still need browser QA beyond the public homepage smoke |

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
| F10 | DEFERRED WITH REASON | Production promotion is intentionally not performed automatically |

## Verification evidence

The authentication regression was defined first and then fixed: invalid Auth0 `/userinfo` responses are rejected, a non-empty subject is required, missing provider configuration is controlled, and provider failures do not enter mutation handlers as users.

The original pnpm 5.3-era lockfile was incompatible with pnpm 9. A guarded regeneration proved frozen install, TypeScript and the production build, then exposed the more important release blocker: Next.js 12.3.7 carried current critical/high production advisories. The runtime was moved to Next.js 15.5.24 / React 18.2 and PostCSS 8.5.28 was pinned through pnpm overrides. The dependency state was then regenerated and verified.

Vercel subsequently rejected Node 20 because that runtime is deprecated for new builds. A RED toolchain contract was added first, then `package.json`, Quality CI and lock-sync CI were moved to Node 24. Exact branch head `5d6d11dfb4a2042455817f251f4cd71aa0ee4606` passed Quality run `35037850194`: contracts, frozen pnpm install, TypeScript and production build all PASS. The current runtime commit `4f2ab78938524477d5eea93e1f022e4a99f70b77c` has READY Vercel preview `dpl_E4VM8PvPDMZyVzsswowTbdoTLgb6`; its homepage returned HTTP 200 and rendered the roadmap UI. The later commits only align CI with the same Node 24 runtime contract.

Vote integrity was handled test-first. The implementation rejects non-POST mutations, verifies the feature already exists before writing the voter set, returns 404 for a nonexistent feature and 409 for a duplicate vote, and no longer leaks arbitrary exception text.

No merge, production promotion, Auth0/Redis credential mutation, destructive data migration, billing action or live roadmap data mutation has been performed.

Status: **PARTIAL** — build/runtime delivery is recovered and current preview evidence is GREEN; the remaining product blocker is provider-backed authenticated mutation/browser QA plus remaining privileged-API consistency work.
