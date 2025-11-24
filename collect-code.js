import fs from "fs";
import path from "path";

const OUTPUT_FILE = "all-code.txt";
const IGNORE_DIRS = ["node_modules", ".next", "dist", "build", ".git"];

const allowedExtensions = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".css",
  ".scss",
  ".json",
  ".md",
  ".txt",
  ".yml",
  ".yaml",
  ".config.js",
];

function shouldIncludeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return allowedExtensions.includes(ext);
}

function collectFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        fileList = collectFiles(filePath, fileList);
      }
    } else {
      if (shouldIncludeFile(filePath)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

function readAndFormatFiles(fileList) {
  let output = "PROJECT CODE COLLECTION\n";
  output += "=".repeat(50) + "\n\n";

  fileList.forEach((filePath) => {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      output += `FILE: ${filePath}\n`;
      output += "-".repeat(40) + "\n";
      output += content;
      output += "\n\n" + "=".repeat(50) + "\n\n";
    } catch (error) {
      console.log(`Error reading ${filePath}:`, error.message);
    }
  });

  return output;
}

// Main execution
console.log("Collecting project files...");
const allFiles = collectFiles(".");
console.log(`Found ${allFiles.length} files`);

const formattedContent = readAndFormatFiles(allFiles);

fs.writeFileSync(OUTPUT_FILE, formattedContent, "utf8");
console.log(`All code has been saved to ${OUTPUT_FILE}`);
