# LifeOS

## Workspace

- Modules
  - Core
    - AI - Core AI service serving as the entry point for most AI interactions
    - DB - Core database storing accounts and sessions
    - Schemas - Data validation schemas
    - Web - Core Web UI client
  - Health
    - Workouts
      - DB - Workouts database storing exercises, workouts, plans
- Packages
  - AI - Core of agent apps, modules, LLM clients
  - Config - Utilities for managing source configs
  - DB - Utilities for database management
  - DI - Dependency injection container
  - Logger - Core of logging
  - Utils - Primitive utilities
- Tooling
  - LlamaStack - Local LlamaStack server manager
  - MailHog - Local MailHog server manager
- ML
  - Intent - Intent classification models
  - Entity - Entity classification models

## Module ideas

- [ ] Workouts
- [ ] Diet
- [ ] Tasks + Events
- [ ] Sleep
- [ ] Smart home
- [ ] Language learning
- [ ] Career
- [ ] Personal finance

## Usage

```bash
pnpm install
pnpm build
pnpm lint
pnpm format
pnpm test
pnpm dev
```
