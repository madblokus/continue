const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const isPreRelease = args.includes("--pre-release");

if (!fs.existsSync("build")) {
  fs.mkdirSync("build");
}

const command = isPreRelease
  ? "npx vsce package --out ./build --pre-release --no-dependencies"
  : "npx vsce package --out ./build --no-dependencies";

<<<<<<< HEAD
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${stderr}`);
    throw error;
  }
  console.log(stdout);

  const vsixFileMatch = stdout.match(/Packaged:\s+(.*\.vsix)/);
  if (!vsixFileMatch || !vsixFileMatch[1]) {
    console.error("Could not determine VSIX file name from vsce output");
    return;
  }
  const vsixFile = vsixFileMatch[1];
  const vsixPath = path.resolve(vsixFile);

  console.log(`VSIX package created: ${vsixPath}`);
});
=======
let command = isPreRelease
  ? "npx vsce package --out ./build --pre-release --no-dependencies" // --yarn"
  : "npx vsce package --out ./build --no-dependencies"; // --yarn";

if (target) {
  command += ` --target ${target}`;
}

exec(command, (error) => {
  if (error) {
    throw error;
  }
  console.log(
    "vsce package completed - extension created at extensions/vscode/build/continue-{version}.vsix",
  );
});
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
