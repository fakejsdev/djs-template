import { EventEmitter } from "node:events";

class DatabaseEmitter extends EventEmitter {}
export const dbEmitter = new DatabaseEmitter();
