import { Console } from "@/lib/utils";
import { initCommandHandler } from "./command";

export class HandlersManager {
  private setupTasks: (() => Promise<void>)[] = [];

  public setupCommandHandler() {
    this.setupTasks.push(async () => {
      await initCommandHandler();
    });
    return this;
  }

  public setupEventHandler() {
    this.setupTasks.push(async () => {
      Console.Log("Event handler setup is not implemented yet.");
    });
    return this;
  }

  public setupComponentHandler() {
    this.setupTasks.push(async () => {
      Console.Log("Component handler setup is not implemented yet.");
    });
    return this;
  }

  public async build() {
    for (const task of this.setupTasks) {
      await task();
    }
    Console.Log("All handlers have been set up successfully.");
    this.setupTasks = [];
  }
}
