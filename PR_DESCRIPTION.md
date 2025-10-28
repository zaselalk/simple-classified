Title: Improve validation, session config, and harden controllers

Summary
-------
This change set improves application security, stability, and developer experience by:

- Ensuring the session middleware always receives a defined `secret` (with a development fallback).
- Removing deprecated mongoose connection options that produced driver warnings.
- Adding server-side validation for user registration with sanitization.
- Hardening ad controllers to guard against missing file uploads and to handle Cloudinary deletion errors gracefully.
- Fixing middleware and controller edge-cases (null checks, variable renames, Passport logout compatibility).

Files changed (high-level)
-------------------------
- `app.js`
  - Added a fallback session secret and removed deprecated mongoose options.

- `schemas.js`
  - Added `UserSchema` for registration input validation (email, username, password) using the existing Joi HTML-sanitizing extension.

- `middleware.js`
  - Added `validateUser` middleware that validates registration payloads using `UserSchema`.
  - Renamed `Campground` to `Ad` and added guards in `isAuthor` to avoid runtime errors when the ad or author is missing.

- `routes/users.js`
  - Hooked `validateUser` into the `/register` POST handler so invalid registrations are rejected early.

- `controllers/users.js`
  - Updated `logout` to use the callback form `req.logout(cb)` for compatibility with newer Passport versions and to correctly propagate errors to Express.

- `controllers/ads.js`
  - Guarded `req.files` mapping to avoid crashes when no files are uploaded.
  - Ensured `ad.images` exists before pushing new items.
  - Wrapped Cloudinary `destroy` calls in try/catch so a single failed deletion doesn't break the request.

Rationale
---------
- Session secret: `express-session` throws if `secret` is not provided. A dev fallback prevents crashes during local development; however, a strong secret must be set in production via env vars.
- Mongoose/deprecation: Removing `useNewUrlParser` and `useUnifiedTopology` removes noisy driver warnings introduced by older Mongoose examples.
- Validation: Adding `UserSchema` reduces malformed or malicious input and standardizes sanitization at the server edge.
- Robustness: Guarding file handling and Cloudinary deletes prevents partial failures from crashing requests and allows more graceful recovery/logging.

How to create the PR locally (Windows `cmd.exe`)
----------------------------------------------
Run these commands from the repository root.

1) Create a branch, commit, and push:

   git checkout -b improve-validation-and-safety
   git add -A
   git commit -m "Improve validation, session config, and harden controllers"
   git push -u origin improve-validation-and-safety

2) Create the PR using GitHub CLI (optional but recommended):

   gh pr create --title "Improve validation, session config, and harden controllers" --body-file PR_DESCRIPTION.md --base main

If you don't use the GitHub CLI, open a PR on GitHub and paste the contents of `PR_DESCRIPTION.md` into the PR description.

Testing notes
-------------
1) Start MongoDB (Docker Compose or local mongod) and run the app locally:

   docker compose up -d
   node app.js

2) Test user registration validation:
   - Try registering with missing fields or HTML in the username/email to verify Joi validation and sanitization.

3) Test ad creation/edit flows with and without file uploads then try deleting images to verify Cloudinary deletion errors are logged but do not break the request.

Follow-ups (recommended)
------------------------
- Add unit/integration tests (jest + supertest) for register/login and ad flows.
- Add CI (GitHub Actions) to run tests and linting on PRs.
- Move secrets out of repo and into environment secrets or a secrets manager for production.
- Add stricter rate-limiting for auth endpoints (login/register) and consider captcha for public-facing endpoints.

If you'd like, I can open the PR for you (I can provide the git/gh commands or attempt to run them if you permit me to run terminal commands here).

-- End of PR description
