import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const ENSHELL_DIR = join(homedir(), ".enshell");
const SESSION_FILE = join(ENSHELL_DIR, "wc-session.json");

function ensureDir(): void {
  if (!existsSync(ENSHELL_DIR)) {
    mkdirSync(ENSHELL_DIR, { recursive: true });
  }
}

/**
 * File-based key-value storage for WalletConnect session persistence.
 * Stores data in ~/.enshell/wc-session.json.
 * Implements the KeyValueStorage interface expected by WalletConnect.
 */
export class FileStorage {
  private data: Record<string, unknown>;

  constructor() {
    ensureDir();
    if (existsSync(SESSION_FILE)) {
      try {
        this.data = JSON.parse(readFileSync(SESSION_FILE, "utf-8"));
      } catch {
        this.data = {};
      }
    } else {
      this.data = {};
    }
  }

  private save(): void {
    ensureDir();
    writeFileSync(SESSION_FILE, JSON.stringify(this.data, null, 2));
  }

  async getItem<T = unknown>(key: string): Promise<T | undefined> {
    return this.data[key] as T | undefined;
  }

  async setItem<T = unknown>(key: string, value: T): Promise<void> {
    this.data[key] = value;
    this.save();
  }

  async removeItem(key: string): Promise<void> {
    delete this.data[key];
    this.save();
  }

  async getKeys(): Promise<string[]> {
    return Object.keys(this.data);
  }

  async getEntries<T = unknown>(): Promise<Array<[string, T]>> {
    return Object.entries(this.data) as Array<[string, T]>;
  }

  /**
   * Delete the entire session file.
   */
  static clear(): void {
    if (existsSync(SESSION_FILE)) {
      writeFileSync(SESSION_FILE, "{}");
    }
  }
}
