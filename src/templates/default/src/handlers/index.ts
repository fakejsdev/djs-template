import { Console } from "@/lib/utils";
import { initCommandHandler } from "./command";

export class HandlersManager {
  private setupTasks: (() => Promise<void>)[] = [];
  private queuedHandlers: Set<string> = new Set();

  public setupCommandHandler() {
    if (this.queuedHandlers.has("commands")) {
      Console.Warn("Command handler already queued");
      return this;
    }

    this.queuedHandlers.add("commands");
    this.setupTasks.push(async () => {
      await initCommandHandler();
    });
    return this;
  }

  public setupEventHandler() {
    if (this.queuedHandlers.has("events")) {
      Console.Warn("Event handler already queued");
      return this;
    }

    this.queuedHandlers.add("events");
    this.setupTasks.push(async () => {
      Console.Log("Event handler setup is not implemented yet.");
    });
    return this;
  }

  public setupComponentHandler() {
    if (this.queuedHandlers.has("components")) {
      Console.Warn("Component handler already queued");
      return this;
    }

    this.queuedHandlers.add("components");
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
    this.queuedHandlers.clear();
  }
}
