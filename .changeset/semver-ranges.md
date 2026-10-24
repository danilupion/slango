---
'@slango.configs/lint-staged': patch
'@slango.configs/oxlint': patch
'@slango.configs/vitest': patch
'@slango/mangusta': patch
'@slango/ristretto': patch
---

Dependencies use SemVer ranges instead of exact versions, so a patch release of one of them (a CVE fix, say) reaches
consumers through their own lockfile, without waiting for a new release of this package.
