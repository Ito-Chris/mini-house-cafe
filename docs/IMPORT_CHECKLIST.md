# Original Emergent import checklist

This repository contains a reconstructed, working baseline derived from the public README. It is **not** an export of the original Emergent source.

Before replacing any baseline content, preserve the incoming export in a separate branch and compare it with this checklist:

- `frontend/src/`, dependency manifest and lockfile
- `backend/`, including routes, models, requirements and migrations/seeds
- all uploaded menu, gallery, coffee and hero photographs
- original logo, favicon and social-sharing images
- complete translations for Japanese, English, Spanish, Chinese, Hindi, Portuguese, Tagalog and Korean
- approved menu data, current prices, opening hours and reservation policies
- MongoDB export or an approved data-migration plan
- production domain, CORS origins and deployment configuration

Never import `.env` files, database credentials, access tokens, OAuth secrets or private keys into Git. Copy only the variable names into the relevant `.env.example` file.
