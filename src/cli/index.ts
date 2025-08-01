import prompts from "prompts";

export const runCli = async () => {
  console.clear();

  const projectName: string =
    process.argv[2] ||
    (
      await prompts({
        type: "text",
        name: "name",
        message: "🤖 What is the name of your project?",
        initial: "djs-bot",
      })
    ).name;

  if (!projectName) throw new Error("Project name is required.");

  const { template }: { template: string } = await prompts({
    type: "select",
    name: "template",
    message: "📦 Which template do you want to use?",
    choices: [
      {
        title: "📚 Default Modules",
        description: "The default template with essential features.",
        value: "default",
      },
    ],
  });

  if (!template) throw new Error("Template selection is required.");

  const { packageManager }: { packageManager: string } = await prompts({
    type: "select",
    name: "packageManager",
    message: "📦 Which package manager do you want to use?",
    choices: [
      { title: "📦 npm", value: "npm" },
      { title: "🧶 yarn", value: "yarn" },
      { title: "⚡ pnpm", value: "pnpm" },
      { title: "🔥 bun", value: "bun" },
    ],
  });

  if (!packageManager)
    throw new Error("Package manager selection is required.");

  return {
    projectName,
    template,
    packageManager,
  };
};
