# 🚀 Discord.js Template

> A powerful, modular Discord.js bot template with TypeScript support and modern development practices.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🧩 **Modular Architecture** - Organized by modules for better maintainability
- ⚡ **Hot Reload Development** - Instant feedback during development
- 📦 **TypeScript Ready** - Full TypeScript support with proper types
- 🎯 **Slash Commands** - Modern Discord slash command implementation
- 🎨 **Component Handlers** - Buttons, dropdowns, and modals support
- 📝 **Event System** - Clean event handling with type safety
- 🔧 **Multi-Package Manager** - Works with bun, npm, and yarn

## 🏗️ Project Structure

### 📁 **Recommended Module Structure**

```
src/
├── handlers/              # Core handlers
│   ├── command/          # Command handler logic
│   ├── components/       # Component handler logic
│   └── events/           # Event handler logic
├── modules/              # 🧩 MODULAR APPROACH (Recommended)
│   └── [module-name]/    # Each feature as a module
│       ├── commands/     # Slash commands for this module
│       ├── events/       # Events specific to this module
│       └── components/   # Components for this module
│           ├── buttons/  # Button interactions
│           ├── dropdowns/# Select menu interactions
│           └── modals/   # Modal form interactions
├── lib/                  # Utility libraries
│   ├── client.ts        # Discord client setup
│   ├── createEvent.ts   # Event creation helper
│   └── utils.ts         # General utilities
└── index.ts             # Main entry point
```

### 🧩 **Module-Based Organization** (Recommended)

Each module represents a specific feature or functionality:

```
modules/
├── user-management/      # User-related features
│   ├── commands/
│   │   ├── profile.ts   # /profile command
│   │   └── settings.ts  # /settings command
│   ├── events/
│   │   └── userJoin.ts  # Welcome new users
│   └── components/
│       ├── buttons/
│       │   └── edit-profile.ts
│       ├── dropdowns/
│       │   └── timezone-select.ts
│       └── modals/
│           └── profile-edit.ts
├── moderation/           # Moderation features
│   ├── commands/
│   │   ├── ban.ts
│   │   ├── kick.ts
│   │   └── timeout.ts
│   ├── events/
│   │   └── automod.ts
│   └── components/
│       └── buttons/
│           └── appeal-button.ts
└── entertainment/        # Fun commands
    ├── commands/
    │   ├── meme.ts
    │   └── game.ts
    └── components/
        ├── buttons/
        │   └── play-again.ts
        └── dropdowns/
            └── game-select.ts
```

## 🚀 Getting Started

### 1. **Clone & Install**

```bash
# Clone the repository
git clone https://github.com/fakejsdev/djs-template.git
cd djs-template

# Install dependencies
bun install
# or npm install
# or yarn install
```

### 2. **Environment Setup**

```bash
# Copy environment file
cp .env.example .env

# Add your bot token
BOT_TOKEN=your_discord_bot_token_here
```

### 3. **Development**

```bash
# Start development server with hot reload
bun run dev
# or npm run dev
# or yarn dev
```

## 📝 Creating Modules

### **Step 1: Create Module Structure**

```bash
# Create a new module
mkdir -p src/modules/my-feature/{commands,events,components/{buttons,dropdowns,modals}}
```

### **Step 2: Add Commands**

```typescript
// src/modules/my-feature/commands/hello.ts
import { SlashCommandBuilder } from "discord.js";
import type { Command } from "@/handlers/commands/types";

export default {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Say hello to the world!"),

  async execute(interaction) {
    await interaction.reply("Hello, World! 👋");
  },
} satisfies Command;
```

### **Step 3: Add Components**

```typescript
// src/modules/my-feature/components/buttons/hello-button.ts
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

### **Step 4: Add Events**

```typescript
// src/modules/my-feature/events/message-logger.ts
import { createEvent } from "@/lib/createEvent";

export default createEvent("messageCreate", async (message) => {
  if (message.author.bot) return;

  console.log(`Message from ${message.author.tag}: ${message.content}`);
});
```

## 🛠️ Available Scripts

### **With Bun (Recommended)**

```bash
bun run dev      # ⚡ Development with hot reload
bun run build    # 🏗️ Build for production
bun run start    # 🚀 Run the application
```

### **With npm/yarn**

```bash
npm run dev      # ⚡ Development with tsx watch
npm run build    # 🏗️ Build TypeScript to JavaScript
npm run start    # 🚀 Run the built application
```

## 🎯 Module Benefits

### **🧩 Better Organization**

- Each feature is self-contained
- Easy to enable/disable modules
- Clear separation of concerns

### **👥 Team Collaboration**

- Multiple developers can work on different modules
- Reduced merge conflicts
- Clear ownership of features

### **🔧 Maintainability**

- Easy to debug module-specific issues
- Simple to add/remove features
- Clean upgrade paths

### **📦 Reusability**

- Modules can be shared between projects
- Template modules for common features
- Community module marketplace potential

## 📚 Example Module: Ping Command

```
src/modules/example-module/
├── commands/
│   └── ping.ts              # /ping command
├── components/
│   ├── buttons/
│   │   └── ping-button.ts   # Interactive ping button
│   ├── dropdowns/
│   │   └── example-dropdown.ts
│   └── modals/
│       └── example-modal.ts
└── events/
    └── message-logger.ts    # Log messages
```

## 🎨 Component Types

### **Buttons**

```typescript
// Interactive buttons in messages
export const config: ButtonConfig = {
  customId: "my_button",
  name: "My Button",
  description: "Example button description",
};

export const run: ButtonRun = async (interaction) => {
  // Handle button click
};
```

### **Dropdowns**

```typescript
// Select menus
export const config: DropdownConfig = {
  customId: "my_dropdown",
  name: "My Dropdown",
  description: "Example dropdown description",
};

export const run: DropdownRun = async (interaction) => {
  // Handle selection
};
```

### **Modals**

```typescript
// Form modals
export const config: ModalConfig = {
  customId: "my_modal",
  name: "My Modal",
  description: "Example modal description",
};

export const run: ModalRun = async (interaction) => {
  // Handle form submission
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

## 🔗 Links

- [Discord.js Documentation](https://discord.js.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Discord Developer Portal](https://discord.com/developers/applications)

---

<div align="center">

**[⭐ Star this project](https://github.com/fakejsdev/djs-template)** if you find it helpful!

Made with ❤️ for the Discord.js community

</div>
