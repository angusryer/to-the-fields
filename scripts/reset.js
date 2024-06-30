const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const libsDir = path.join(rootDir, "libs");

// Function to execute a command in a given directory
function runCommand(command, directory) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: directory, shell: "/bin/bash" }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command in ${directory}: ${error.message}; ${stderr}`);
        reject(error);
      } else {
        console.log(`Clean complete for directory: ${directory}`);
        resolve();
      }
    });
  });
}

async function cleanup() {
  const directories = [rootDir];

  for (const dir of directories) {
    // Find and remove all node_modules directories
    const findNodeModulesCommand = 'find . -name "node_modules" -type d -prune -exec rm -rf "{}" +';
    await runCommand(findNodeModulesCommand, dir);

    // Find and remove all yarn.lock files
    const findYarnLockCommand = 'find . -name "yarn.lock" -type f -exec rm -f "{}" +';
    await runCommand(findYarnLockCommand, dir);

    // Find and remove all dist directories
    const findDistCommand = 'find . -name "dist" -type d -exec rm -rf "{}" +';
    await runCommand(findDistCommand, dir);
  }

  console.log("Cleanup completed.");
}

async function main() {
  try {
    // Clean up all the files and directories that we want to reinstall
    await cleanup();

    // Run yarn install in the root directory
    console.log("Running yarn install in the root directory...");
    await runCommand("yarn install", rootDir);

    // Get all directories in the libs directory
    fs.readdir(libsDir, { withFileTypes: true }, async (err, files) => {
      if (err) {
        console.error(`Error reading libs directory: ${err.message}`);
        process.exit(1);
      }

      const directories = files
        .filter((file) => file.isDirectory() && !file.name.startsWith("."))
        .map((dir) => path.join(libsDir, dir.name));

      // Run yarn install in each directory
      try {
        await Promise.all(directories.map((dir) => runCommand("yarn install", dir)));
        console.log("Yarn install completed in all lib directories.");
      } catch (error) {
        console.error(`Failed to install dependencies in all lib directories: ${error.message}`);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error(`Cleanup failed: ${error.message}`);
    process.exit(1);
  }
}

main();
