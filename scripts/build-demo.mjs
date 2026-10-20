// Builds a static client-review copy of the site (both hero versions + switcher)
// into demo-builds/<name>/ and zips it. Upload the folder to any static host
// (e.g. Netlify Drop) or send the zip.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const name = `wedo-demo-${new Date().toISOString().slice(0, 10)}`;
const outDir = path.join(root, "out");
const target = path.join(root, "demo-builds", name);

const run = (cmd, args, env = {}, cwd = root) => {
  const r = spawnSync(cmd, args, { cwd, stdio: "inherit", shell: true, env: { ...process.env, ...env } });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

rmSync(outDir, { recursive: true, force: true });
run("npx", ["next", "build"], { DEMO_EXPORT: "1", NEXT_PUBLIC_DEMO: "1" });
if (!existsSync(path.join(outDir, "index.html"))) {
  console.error("Static export did not produce out/index.html");
  process.exit(1);
}

rmSync(target, { recursive: true, force: true });
mkdirSync(path.dirname(target), { recursive: true });
cpSync(outDir, target, { recursive: true });

const zip = `${target}.zip`;
rmSync(zip, { force: true });
if (process.platform === "win32") {
  run("powershell", ["-NoProfile", "-Command", `Compress-Archive -Path '${target}\*' -DestinationPath '${zip}'`]);
} else {
  run("zip", ["-qr", zip, "."], {}, target);
}
console.log(`\nDemo ready:\n  folder: ${target}\n  zip:    ${zip}`);
