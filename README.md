# 🚀 Enterprise Discord.js Boilerplate

> A production-ready, highly scalable Discord.js bot framework. Built on Feature-Sliced Design principles, powered by Bun, Prisma, and BullMQ.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)

## ✨ Key Architectural Features

- 🧩 **Feature-Sliced Modules** - Instead of monolithic `commands/` and `events/` folders, code is encapsulated by domain (e.g., `economy`, `moderation`). Delete a module folder, and all its associated features are cleanly removed.
- 📁 **Smart Command Routing** - Complex command trees (Commands → Groups → Subcommands) are built dynamically from your directory structure. Say goodbye to massive `SlashCommandBuilder` chains.
- ⚡ **Fast Boot (Command Caching)** - Generates an MD5 hash of your command configurations. Bypasses the slow Discord API registration entirely if you only modified execution logic (`run`), reducing boot times to milliseconds.
- ⏳ **Distributed Background Jobs** - Ships with **BullMQ** and a central Worker-Router. Perfect for giveaways, timed unbans, or reminders that survive bot crashes and container restarts.
- �️ **Database Event System** - Built-in, fully type-safe event emitters for Prisma CRUD operations.
- 🛡️ **Explicit Declarations** - Events, UI Components, and Workers use explicit wrapper functions (`createDiscordEvent`, etc.) for maximum TypeScript safety and predictability (*Explicit over Implicit*).

## 🏗️ Project Structure

```text
src/
├── handlers/             # Core system orchestrators (Commands, Events, Workers, Components)
├── lib/                  # Utilities (Queue, Prisma client, Discord client)
└── modules/              # 🧩 DOMAIN-DRIVEN MODULES
    └── [feature-name]/
        ├── commands/     # Directory-Based Command Routing
        │   ├── ping.command.ts       # Resolves to: /ping
        │   └── bank/                 # Resolves to: /bank
        │       ├── index.command.ts  # Base config for /bank
        │       ├── deposit.sub.ts    # Resolves to: /bank deposit
        │       └── admin/            # Subcommand Group
        │           └── reset.sub.ts  # Resolves to: /bank admin reset
        ├── events/       # Explicit Event Handlers
        │   ├── discord/              # Discord API Events
        │   │   └── message-logger.djs.ts
        │   └── db/                   # Database Events
        │       └── post-create.db.ts
        ├── workers/      # BullMQ Background Job Processors
        │   └── remind.worker.ts      # Logic executed in the background by the Central Worker
        ├── buttons/      # Button Handlers
        └── dropdowns/    # Select Menu Handlers
```

## 🚀 Getting Started

### 1. **Clone & Install**

```bash
git clone https://github.com/fakejsdev/djs-template.git
cd djs-template

bun install
```

### 2. **Infrastructure Setup (Redis)**

This template requires a Redis instance for the BullMQ background worker system. A ready-to-use `docker-compose.services.yml` is provided.

```bash
# Copy environment file
cp .env.example .env

# Spin up the Redis container for background jobs
bun run services:up
```

*Ensure you fill in your `BOT_TOKEN` and `DATABASE_URL` in the `.env` file.*

### 3. **Development**

```bash
# Push schema to SQLite/Postgres and generate the Prisma Client
bun run db:push
bun run db:generate

# Start development server with Fast-Boot hot-reloading
bun run dev
```

## 📝 Writing Modules

### **1. Advanced Directory-Based Commands**

Commands are automatically constructed based on their directory layout.

```typescript
// 1. BASE COMMAND: src/modules/economy/commands/bank/index.command.ts
import { SlashCommandBuilder } from 'discord.js';

export const config: CommandConfig = new SlashCommandBuilder()
  .setName('bank')
  .setDescription('Central banking system');
```

```typescript
// 2. SUBCOMMAND: src/modules/economy/commands/bank/deposit.sub.ts
export const config: SubcommandConfig = (sub) => sub
  .setDescription('Deposit cash into your account')
  .addIntegerOption(o => o.setName('amount').setDescription('Amount').setRequired(true));

export const run: CommandRun = async (interaction) => {
  const amount = interaction.options.getInteger('amount', true);
  await interaction.reply({ content: `Deposited ${amount} coins! 🏦`, ephemeral: true });
};
```

### **2. Explicit Discord & Database Events**

Events use strongly-typed wrapper functions to enforce strict type checking and avoid magic filename guessing.

**Discord Events:**
```typescript
// src/modules/logger/events/discord/message-logger.djs.ts
import { createDiscordEvent } from "@/lib/helpers/createDiscordEvent";

export const { config, run } = createDiscordEvent(
  {
    name: 'Message Logger',
    on: 'messageCreate',
    description: 'Logs messages to the console.',
  },
  async (message) => {
    if (message.author.bot) return;
    console.log(`[${message.author.tag}] ${message.content}`);
  }
);
```

**Database Events (Prisma):**
```typescript
// src/modules/logger/events/db/post-create.db.ts
import { createDatabaseEvent } from '@/lib/helpers/createDatabaseEvent';
import { Console } from '@/lib/utils';

export const { config, run } = createDatabaseEvent(
  {
    name: 'Post Create Logger',
    on: 'Post.Create',
    description: 'Console Logs once a post is created',
  },
  async (payload) => {
    // 'payload' is automatically typed to your Prisma Post model!
    Console.Log('Post created with payload:', payload);
  },
);
```

### **3. Background Jobs (BullMQ)**

Schedule reliable tasks that persist even if your bot crashes. Perfect for scheduled actions.

**Step 1: Create the Worker Logic**
```typescript
// src/modules/reminders/workers/send-reminder.worker.ts
import type { Job } from 'bullmq';

export const config: WorkerConfig = {
  name: 'send-reminder' // Unique job identifier mapped by the Central Router
};

export const run: WorkerRun = async (job: Job) => {
  const { channelId, content } = job.data;
  // Execute scheduled logic...
};
```

**Step 2: Dispatch the Job (From anywhere in your bot)**
```typescript
import { queue } from '@/lib/queue';

// Queue a job to run exactly 1 hour from now
await queue.add('send-reminder', { channelId: '123', content: 'Ping!' }, {
  delay: 60 * 60 * 1000 
});
```

### **4. UI Components (Buttons & Dropdowns)**

Explicitly define your components and handle them gracefully.

```typescript
// src/modules/verification/buttons/verify.button.ts
export const config: ButtonConfig = {
  customId: "verify_btn",
  name: "Verification Button",
};

export const run: ButtonRun = async (interaction) => {
  await interaction.reply({ content: "You are now verified! 🎉", ephemeral: true });
};
```

## 🛠️ Available Scripts

```bash
bun run dev             # ⚡ Start development mode with Fast Boot cache
bun run build           # 🏗️ Compile TypeScript for production
bun run start           # 🚀 Run the production build
bun run services:up     # 🐋 Start Redis & Infrastructure via Docker Compose
bun run services:down   # 🛑 Stop infrastructure containers
bun run db:generate     # 🗄️ Generate Prisma client types
bun run db:push         # 🔄 Synchronize database schema 
bun run db:studio       # 📊 Open Prisma database GUI
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow the Feature-Sliced module structure**
4. **Test your changes**
5. **Submit a pull request**

## 📝 License

MIT © [fakejsdev](https://github.com/fakejsdev)
