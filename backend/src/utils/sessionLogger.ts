import { appendFile, mkdir } from "fs/promises";
import path from "path";

const startTimestamp = new Date().toISOString().replace(/[:.]/g, "-");
const logDir = path.resolve(process.cwd(), "logs");
const logFile = path.join(logDir, `${startTimestamp}.log`);

// Create log file as soon as the module loads so we always have a session file.
const ready = (async () => {
  await mkdir(logDir, { recursive: true });
  await appendFile(
    logFile,
    `Session started at ${new Date().toISOString()}\n`
  );
})();

const logBuffer: string[] = [];
let flushPromise: Promise<void> | null = null;

const stripAnsi = (text: string) =>
  text.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, "");

type LogMethod = "log" | "info" | "warn" | "error";

async function writeBuffered() {
  if (!logBuffer.length) return;
  const entries = logBuffer.splice(0);
  await ready;
  await appendFile(logFile, entries.map((line) => `${line}\n`).join(""));
}

function scheduleFlush() {
  if (flushPromise) return;
  flushPromise = (async () => {
    while (logBuffer.length) {
      await writeBuffered();
    }
    flushPromise = null;
  })().catch((err) => {
    // Avoid infinite recursion by writing directly to stderr.
    process.stderr.write(`Failed to write log: ${err}\n`);
    flushPromise = null;
  });
}

function intercept(method: LogMethod) {
  const original = console[method];
  console[method] = (...args: unknown[]) => {
    original(...args);
    const line = args
      .map((arg) =>
        typeof arg === "string" ? arg : JSON.stringify(arg, null, 2)
      ).join(" ");
    logBuffer.push(stripAnsi(line));
    scheduleFlush();
  };
}

intercept("log");
intercept("info");
intercept("warn");
intercept("error");

export async function flushLogs() {
  if (flushPromise) await flushPromise;
  await writeBuffered();
}
