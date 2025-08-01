import fs from "fs";
import path from "path";

export class ProjectGenerator {
  private projectName: string;
  private projectTemplate: string;
  private packageManager: string;

  constructor(
    projectName: string,
    projectTemplate: string,
    packageManager: string
  ) {
    this.projectName = projectName;
    this.projectTemplate = projectTemplate;
    this.packageManager = packageManager;
  }

  private async createProjectDirectory() {
    const projectPath = path.join(process.cwd(), this.projectName);
    if (fs.existsSync(projectPath)) {
      throw new Error(
        `Project directory "${this.projectName}" already exists.`
      );
    }

    fs.mkdirSync(projectPath);
    return projectPath;
  }

  private async copyTemplateFiles(projectPath: string) {
    const templatePath = path.join(
      __dirname,
      "../../templates",
      this.projectTemplate
    );

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template "${this.projectTemplate}" does not exist.`);
    }

    this.copyRecursive(templatePath, projectPath);
  }

  private copyRecursive(src: string, dest: string) {
    const stats = fs.statSync(src);

    if (stats.isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }

      fs.readdirSync(src).forEach((file) => {
        this.copyRecursive(path.join(src, file), path.join(dest, file));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  }

  private getBunScripts() {
    return {
      start: "bun run src/index.ts",
      dev: "bun run --watch src/index.ts",
      build: "bun build src/index.ts --outdir ./dist --target node",
    };
  }

  private getNpmScripts() {
    return {
      start: "node dist/index.js",
      dev: "npx tsx watch src/index.ts",
      build: "tsc",
    };
  }

  private getYarnScripts() {
    return {
      start: "node dist/index.js",
      dev: "yarn tsx watch src/index.ts",
      build: "tsc",
    };
  }

  private getScriptsForPackageManager() {
    switch (this.packageManager) {
      case "bun":
        return this.getBunScripts();
      case "npm":
        return this.getNpmScripts();
      case "yarn":
        return this.getYarnScripts();
      default:
        return this.getNpmScripts();
    }
  }

  private async updatePackageJson(projectPath: string) {
    const packageJsonPath = path.join(projectPath, "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error("package.json not found in project directory.");
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    packageJson.name = this.projectName;

    packageJson.scripts = this.getScriptsForPackageManager();

    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      "utf-8"
    );
  }

  private async installDependencies(projectPath: string) {
    const { spawn } = require("child_process");

    console.log(`\n📦 Installing dependencies with ${this.packageManager}...`);
    console.log(`⏳ This might take a moment...\n`);

    const command = this.packageManager;
    const args = ["install"];

    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: projectPath,
        stdio: "inherit",
      });

      child.on("close", async (code: number) => {
        if (code === 0) {
          console.log(
            `\n✅ Dependencies installed successfully with ${this.packageManager}!`
          );

          if (this.packageManager !== "bun") {
            await this.installDevDependencies(projectPath);
          }

          resolve(true);
        } else {
          reject(new Error(`Package installation failed with code ${code}`));
        }
      });

      child.on("error", (error: Error) => {
        reject(
          new Error(`Failed to run ${this.packageManager}: ${error.message}`)
        );
      });
    });
  }

  private async installDevDependencies(projectPath: string): Promise<void> {
    const { spawn } = require("child_process");

    console.log(`📦 Installing development dependencies...`);

    const command = this.packageManager;
    const args =
      this.packageManager === "npm"
        ? ["install", "--save-dev", "tsx", "@types/node", "typescript"]
        : ["add", "--dev", "tsx", "@types/node", "typescript"];

    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: projectPath,
        stdio: "inherit",
      });

      child.on("close", (code: number) => {
        if (code === 0) {
          console.log(`✅ Development dependencies installed successfully!`);
          resolve();
        } else {
          reject(
            new Error(`Dev dependencies installation failed with code ${code}`)
          );
        }
      });

      child.on("error", (error: Error) => {
        reject(
          new Error(`Failed to install dev dependencies: ${error.message}`)
        );
      });
    });
  }

  public async generate() {
    try {
      console.log(
        `\n🚀 Creating project "${this.projectName}" with ${this.packageManager}...`
      );
      console.log(`═══════════════════════════════════════════════════════\n`);

      const projectPath = await this.createProjectDirectory();
      console.log(`📁 Created project directory: ${this.projectName}`);

      await this.copyTemplateFiles(projectPath);
      console.log(`📋 Copied template files successfully`);

      await this.updatePackageJson(projectPath);
      console.log(
        `📝 Updated package.json with ${this.packageManager}-optimized scripts`
      );

      await this.installDependencies(projectPath);

      console.log(`\n🎉 Project "${this.projectName}" created successfully!`);
      console.log(`═══════════════════════════════════════════════════════\n`);

      console.log(`📋 Available scripts:`);
      console.log(
        `   ${this.packageManager} run dev     ⚡ Start development with hot reload`
      );
      console.log(
        `   ${this.packageManager} run build   🏗️  Build for production`
      );
      console.log(
        `   ${this.packageManager} run start   🚀 Run the application`
      );

      console.log(`\n🚀 Next steps:`);
      console.log(`   cd ${this.projectName}`);
      console.log(`   ${this.packageManager} run dev`);
      console.log(`\n✨ Happy coding!\n`);
    } catch (error) {
      console.error(`\n❌ Error creating project: ${error}`);
      console.error(`\n💡 Please check the error above and try again.\n`);
      throw error;
    }
  }
}
