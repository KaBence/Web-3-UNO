import { MemoryStore } from "./memoryStore";

/** 
 * ✅ Singleton wrapper to guarantee all resolvers use the same MemoryStore.
 */
let instance: MemoryStore | null = null;

export function getMemoryStore(): MemoryStore {
  if (!instance) {
    instance = new MemoryStore();
    console.log("🧠 MemoryStore initialized (shared globally)");
  }
  return instance;
}
