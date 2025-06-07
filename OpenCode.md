# OpenCode Guidelines

## Scripts & Commands
- `npm run dev`             : Next.js dev (port 9002)
- `npm run genkit:dev`      : AI generator dev mode
- `npm run genkit:watch`    : AI generator watch mode
- `npm run build`           : Production build
- `npm run start`           : Start production server
- `npm run lint`            : ESLint (Next.js config)
- `npx next lint --file <path>` : Lint a single file
- `npm run typecheck`       : TypeScript check
- `npm test -- -t "<pattern>"` : Run single test (configure test runner)

## Imports & Formatting
- Use absolute imports (`@/…`) per `tsconfig.json` paths
- Order imports: 1) core/node 2) external packages 3) `@/` aliases 4) relative paths
- Adhere to Prettier/ESLint defaults: 2 spaces, single quotes, trailing commas

## Types & Naming
- Strict TS: explicit return types on all exported functions/components
- Use `interface` for React props, `type` for domain/utility models
- PascalCase for components; camelCase for variables/functions; UPPER_SNAKE for constants
- Hooks prefixed `useXxx`

## Error Handling
- Wrap async calls in `try/catch`; surface errors via `useToast` or Radix `Toast`
- Validate inputs with Zod schemas before processing