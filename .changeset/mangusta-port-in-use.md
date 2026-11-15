---
'@slango/mangusta': patch
---

Test utils: retry starting the in-memory MongoDB when its port was taken before mongod bound it (`Port "N" already
in use`, a race between parallel test workers), and no longer mask a failed start with a TypeError on teardown
