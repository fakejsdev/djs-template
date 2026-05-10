# 🚀 Discord.js Template

> A powerful, modular Discord.js bot template with TypeScript support, modern development practices, and a built-in Database Event System.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🧩 **Modular Architecture** - Organized by modules for better maintainability
- 🗄️ **Database Event System** - Fully type-safe events for Prisma CRUD operations (Create, Update, Delete).
- ⚡ **Hot Reload Development** - Instant feedback during development
- 📦 **TypeScript Ready** - Full TypeScript support with proper types
- 🎯 **Slash Commands** - Modern Discord slash commands via Named Exports (`config` & `run`)
- 🎨 **Component Handlers** - Advanced and easy-to-use Buttons and Select Menus (Dropdown) routing
- 📝 **Dual Event System** - Clean handling for both Discord API events and Database lifecycle events.
- 🔧 **Multi-Package Manager** - Works with bun, npm, and yarn

## 🏗️ Project Structure

### 📁 **Recommended Module Structure**

```
src/
├── db/                   # Database & Prisma configuration
│   └── schema.prisma     # Prisma schema definition
├── handlers/             # Core handlers
│   ├── commands/         # Command handler logic
│   ├── components/       # Component handler logic
│   └── events/           # Event loader logic
│       ├── db/           # Database event handler
│       └── discord/      # Discord event handler
├── modules/              # 🧩 MODULAR APPROACH (Recommended)
│   └── [module-name]/    # Each feature as a module
│       ├── commands/     # Source for **/*.command.ts files
│       ├── events/       # Events specific to this module
│       │   ├── [event].db.ts   # Database events
│       │   └── [event].djs.ts  # Discord API events
│       ├── buttons/      # Source for **/*.button.ts files
│       └── dropdown/     # Dropdown logic files
│           ├── example.fallback.ts # Base/fallback handler for the entire menu
│           ├── example.dropdown.ts # Alternative base handler (same as .fallback.ts)
│           └── option1.option.ts   # Dedicated handler for a specific option value
├── lib/                  # Utility libraries
│   ├── helpers/          # Event helpers
│   ├── prisma/           # Generated Prisma client
│   └── utils.ts          # General utilities
└── index.ts              # Main entry point
```

## 🚀 Getting Started

### 1. **Clone & Install**

```bash
# Clone the repository
git clone https://github.com/fakejsdev/djs-template.git
cd djs-template

# Install dependencies
bun install
```

### 2. **Environment Setup**

```bash
# Copy environment file
cp .env.example .env

# Add your bot token and database URL
BOT_TOKEN=your_discord_bot_token_here
DATABASE_URL="file:./src/db/discord.db"
```

### 3. **Development**

```bash
# Generate the DB client to enable Prisma types
bun run db:generate

# Start development server with hot reload
bun run dev
```

## 📝 Creating Modules

### **Step 1: Create Module Structure**

```bash
# Create a new module with flat substructures
mkdir -p src/modules/my-feature/{commands,buttons,dropdown,events}
```

### **Step 2: Add Commands**

Commands use Discord.js Builders through Named Exports — no wrapper function needed.

```typescript
// src/modules/my-feature/commands/hello.command.ts
import { SlashCommandBuilder } from "discord.js";

export const config: CommandConfig = new SlashCommandBuilder()
  .setName("hello")
  .setDescription("Say hello to the world!");

export const run: CommandRun = async (interaction) => {
  await interaction.reply("Hello, World! 👋");
};
```

### **Step 3: Add Components**

```typescript
// src/modules/my-feature/buttons/hello.button.ts
export const config: ButtonConfig = {
  customId: "hello_button",
  name: "Hello Button",
  description: "A button that says hello!",
};

export const run: ButtonRun = async (interaction) => {
  await interaction.reply({
    content: "Button clicked! 🎉",
    ephemeral: true,
  });
};
```

### **Step 4: Add Discord Events**

Use `createDiscordEvent` for full type support.

```typescript
// src/modules/my-feature/events/message-logger.djs.ts
import { createDiscordEvent } from "@/lib/helpers/createDiscordEvent";

export default createDiscordEvent(
  {
    name: "Message Logger",
    on: "messageCreate",
    description: "Logs every message sent in the server",
  },
  async (message) => {
    if (message.author.bot) return;
    console.log(`[${message.author.tag}] ${message.content}`);
  }
);
```

### **Step 5: Add Database Events**

Database events are automatically typed based on your Prisma schema.

```typescript
// src/modules/my-feature/events/post-create.db.ts
import { createDatabaseEvent } from "@/lib/helpers/createDatabaseEvent";

export default createDatabaseEvent(
  {
    name: "Post Creation Logger",
    on: "Post.Create",
    description: "Triggers when a new post is created in the database",
  },
  async (data) => {
    // 'data' is strictly typed to your Post model!
    console.log(`New post created with ID: ${data.id}`);
  }
);
```

## 🛠️ Available Scripts

### **With Bun (Recommended)**

```bash
bun run dev             # ⚡ Development with hot reload
bun run build           # 🏗️ Build for production
bun run start           # 🚀 Run the application
bun run db:generate     # 🗄️ Generate Prisma client
bun run db:push         # 🔄 Synchronize database schema (SQLite)
bun run db:studio       # 📊 Open Prisma database GUI
```

## 📚 Example Module Structure

```
src/modules/example-module/
├── commands/
│   └── ping.command.ts
├── buttons/
│   └── example.button.ts
├── dropdown/
│   ├── example-dropdown.fallback.ts  # Triggered as fallback for the dropdown
│   ├── option1.option.ts             # Handled via dedicated option file
│   └── option2.option.ts
└── events/
    ├── message-logger.djs.ts         # Discord API events
    └── post-create.db.ts             # Database events
```

## 🎨 Component Types

### **Buttons**

```typescript
// Interactive buttons in messages (**/*.button.ts)
export const config: ButtonConfig = {
  customId: "my_button",
  name: "My Button",
  description: "Example button description",
};

export const run: ButtonRun = async (interaction) => {
  // Handle button click
};
```

### **Dropdowns / Select Menus**

The component routing provides an elegant way to resolve selected menu options via distinct file mapping.

```typescript
// 1. Base/Fallback Dropdown (**/*.fallback.ts or **/*.dropdown.ts)
// Triggered when no dedicated .option.ts file matches the selected value.
export const config: DropdownConfig = {
  customId: "my_dropdown",
  name: "My Dropdown",
  description: "Handles all unmatched selections",
};

export const run: DropdownRun = async (interaction) => {
  // Handle selections lacking a dedicated option file
};
```

```typescript
// 2. Specific Option Route (**/*.option.ts)
export const config: DropdownConfig = {
  parentCustomId: "my_dropdown", // ID of the parent select menu
  value: "specific_option",      // The exact value of the option selected
  name: "My Dropdown - Specific Option",
};

export const run: DropdownRun = async (interaction) => {
  // Triggered ONLY when 'specific_option' is selected in 'my_dropdown'
};
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow the module structure** for new features
4. **Add proper TypeScript types**
5. **Test your changes**
6. **Submit a pull request**

## 📝 License

MIT © [fakejsdev](https://github.com/fakejsdev)
