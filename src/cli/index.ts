import { ProjectGenerator } from "./generator";
import prompts from "prompts";

export const runCli = async () => {
  const projectName =
    process.argv[2] ||
    (
      await prompts({
        type: "text",
        name: "projectName",
        message: "🤖 What is the name of your project?",
        initial: "my-project",
      })
    ).projectName;

  if (!projectName || typeof projectName !== "string")
    throw new Error("Project name is invalid.");

  const { projectTemplate } = await prompts({
    type: "select",
    name: "projectTemplate",
    message: "⚡ Which template would you like to use?",
    choices: [{ title: "🧩 Default Modular", value: "default" }],
  });

  if (!projectTemplate) throw new Error("Project template is invalid.");

  const { packageManager } = await prompts({
    type: "select",
    name: "packageManager",
    message: "📦 Which package manager would you like to use?",
    choices: [
      { title: "🔥 bun", value: "bun" },
      { title: "💚 npm", value: "npm" },
      { title: "🧶 yarn", value: "yarn" },
    ],
  });

  if (!packageManager) throw new Error("Package manager is invalid.");

  const generator = new ProjectGenerator(
    projectName,
    projectTemplate,
    packageManager
  );

  await generator.generate();
};
