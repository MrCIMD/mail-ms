# AGENTS.md

## What this is
NestJS 11 RabbitMQ microservice that consumes the `mailing_queue` and sends
emails through AWS SESv2. No HTTP surface — exposed only via AMQP. Templates
are Handlebars `.hbs` files rendered with `nodemailer` for MIME building; SESv2
receives the resulting raw message.

## Entrypoints (real ones)
- Bootstrap: `src/main.ts` — creates a `Transport.RMQ` microservice on
  `mailing_queue` (durable, `noAck: false`).
- Message handler: `src/mail/mail.controller.ts` — `@EventPattern('send.one.email')`.
- Wiring: `src/app.module.ts` loads `ConfigModule.forRoot({ load: [configuration], validationSchema })`.
- Config source of truth: `src/common/config/` (Joi schema, env keys via `ConfigEnum`).

## Commands
- `pnpm run build` — `nest build` (note `nest-cli.json` has `deleteOutDir: true`, so `dist/` is wiped every time).
- `pnpm run start:dev` — `nest start --watch`. Requires a reachable RabbitMQ and a valid `.env`, otherwise Joi validation aborts startup.
- `pnpm run start:prod` — `node dist/main` (do not run with `node dist/main.ts`; output is `main.js`).
- `pnpm run lint` — ESLint with `--fix`; rewrites files in place.
- `pnpm test` — Jest with `rootDir: src`, `testRegex: .*\\.spec\\.ts$`. There are currently no `*.spec.ts` files; the suite runs empty.
- `pnpm run test:e2e` — Jest with `test/jest-e2e.json`. `test/app.e2e-spec.ts` is the stock Nest scaffold (HTTP `GET /` returning `Hello World!`); it does **not** exercise the RMQ flow and will fail because the app does not expose HTTP.

Toolchain: Node 24.21.0, pnpm 11.1.1 (activate via Corepack — `corepack enable && corepack prepare pnpm@11.1.1 --activate`).

## Environment variables
All required (Joi schema in `src/common/config/validation.schema.ts` rejects the process if any are missing):
- `AMQP_SERVERS` — **comma-separated string** (e.g. `amqp://h:5672,amqp://h2:5672`); `configuration.ts` splits it into an array.
- `IAM_ACCESS_KEY`, `IAM_SECRET_KEY`, `AWS_REGION`, `IDENTITY_NAME` — AWS SESv2 creds and verified sender identity.
- `TEMPLATE_DIR` — absolute or workspace-relative directory containing the Handlebars templates. **`TEMPLATE_DIR` is required by the Joi schema but is missing from `.env.example`** — copy/extend `.env.example` before running, or startup will fail with a Joi validation error.

## Conventions and gotchas
- `src/main.ts` uses a global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })`. Extra/unknown keys in incoming payloads raise an error — keep DTOs in sync with producers.
- `SendEmailPayload.to` is a single `@IsString()`; `cc` is `string[]`. `lang` must be exactly `'es'` or `'en'` (`@IsEnum`). Templates are looked up as `${template}-${lang}.hbs` under `TEMPLATE_DIR`.
- `nodemailer` is used **only** to assemble the MIME stream (see `template.service.ts` — `streamTransport: true`, `buffer: true`). Sending happens via `SESv2Service.client.send(SendEmailCommand)`. Do not add SMTP transport here.
- `tsconfig.json` deliberately relaxes Nest defaults: `strictNullChecks: false`, `noImplicitAny: false`, `strictBindCallApply: false`, `noFallthroughCasesInSwitch: false`. Don't "fix" these without coordinating — many existing files rely on them.
- ESLint uses flat config (`eslint.config.mjs`) with `typescript-eslint` `recommendedTypeChecked`; type-aware rules depend on `parserOptions.projectService`.
- `tsconfig.build.json` excludes `**/*spec.ts`, so spec files are not emitted to `dist/`.
- `pnpm-workspace.yaml` declares `allowBuilds` for native packages (`@parcel/watcher`, `@swc/core`, `unrs-resolver`) — do not remove these.
- The default `dockerfile` is a dev image; production builds use `dockerfile.prod` (`docker build -f dockerfile.prod -t mail-ms:tag .`). The container runs as the non-root `node` user and starts `node dist/main.js`.