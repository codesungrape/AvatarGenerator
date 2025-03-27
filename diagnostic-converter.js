import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import istanbulLibCoverage from "istanbul-lib-coverage";
const { createCoverageMap } = istanbulLibCoverage;

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to convert Playwright coverage format to Istanbul format
function convertToIstanbulFormat(playwrightCoverage) {
  const coverageMap = createCoverageMap({});

  // Project root directory
  const projectRoot = __dirname;
  console.log(`\n📁 Project root: ${projectRoot}`);
  console.log(`📁 Source directory: ${path.join(projectRoot, "src")}`);

  // List all source files to help with debugging
  console.log("\n🔍 Source files in your project:");
  try {
    const srcDir = path.join(projectRoot, "src");
    if (fs.existsSync(srcDir)) {
      listFilesRecursively(srcDir);
    } else {
      console.log(`❌ src directory not found at ${srcDir}`);
    }
  } catch (error) {
    console.error("Error listing source files:", error.message);
  }

  console.log("\n📊 Processing coverage entries:");
  playwrightCoverage.forEach((entry, index) => {
    console.log(`\n➡️ Entry #${index + 1}:`);
    console.log(`   URL: ${entry.url}`);

    // Extract the file path from the URL
    let rawPath = entry.url;
    let resolvedPath = "";

    console.log(`   Processing path: ${rawPath}`);

    if (rawPath.startsWith("file://")) {
      // For file:// URLs, extract the path
      rawPath = decodeURIComponent(rawPath.replace(/^file:\/\//, ""));
      console.log(`   Decoded file:// path: ${rawPath}`);
    } else if (rawPath.startsWith("http")) {
      // For http URLs, extract the path portion
      const urlPath = new URL(rawPath).pathname;
      rawPath = urlPath === "/" ? "index.js" : urlPath;
      console.log(`   Extracted HTTP path: ${rawPath}`);
    }

    // Try multiple path resolution strategies
    const pathOptions = [
      // Strategy 1: Use raw path as is
      rawPath,

      // Strategy 2: If path starts with /src, append to project root
      rawPath.startsWith("/src") ? path.join(projectRoot, rawPath) : null,

      // Strategy 3: If path starts with /src, remove the leading / and append to project root
      rawPath.startsWith("/src")
        ? path.join(projectRoot, rawPath.substring(1))
        : null,

      // Strategy 4: Try to use just the base file name in the src directory
      path.join(projectRoot, "src", path.basename(rawPath)),

      // Strategy 5: If it ends with .vue, try to find it in components dir
      rawPath.endsWith(".vue")
        ? path.join(projectRoot, "src", "components", path.basename(rawPath))
        : null,
    ].filter(Boolean); // Remove null entries

    // Try each path strategy
    let fileFound = false;
    for (const potentialPath of pathOptions) {
      console.log(`   Trying path: ${potentialPath}`);

      if (fs.existsSync(potentialPath)) {
        console.log(`   ✅ File found at: ${potentialPath}`);
        resolvedPath = potentialPath;
        fileFound = true;
        break;
      }
    }

    if (!fileFound) {
      console.log("   ❌ File not found with any path strategy");
      return; // Skip this entry
    }

    // Skip node_modules, test files and non-source files
    if (
      resolvedPath.includes("node_modules") ||
      resolvedPath.includes("test") ||
      resolvedPath.includes("tests") ||
      (!resolvedPath.endsWith(".js") &&
        !resolvedPath.endsWith(".ts") &&
        !resolvedPath.endsWith(".vue"))
    ) {
      console.log(
        "   ⏭️ Skipping file (node_modules, test, or non-source file)",
      );
      return;
    }

    console.log(`   💼 Creating coverage data for: ${resolvedPath}`);
    console.log(`   Functions: ${entry.functions.length}`);

    const fnMap = {};
    const branchMap = {};
    const statementMap = {};
    const fnCovered = {};
    const branchCovered = {};
    const statementCovered = {};

    let statementId = 0;
    let coveredFunctions = 0;

    // Map functions to statements and function coverage
    entry.functions.forEach((fn, fnId) => {
      // Create function mapping
      fnMap[fnId] = {
        name: fn.functionName || `(anonymous_${fnId})`,
        decl: {
          start: {
            line: fn.ranges[0].startLine,
            column: fn.ranges[0].startColumn,
          },
          end: { line: fn.ranges[0].endLine, column: fn.ranges[0].endColumn },
        },
        loc: {
          start: {
            line: fn.ranges[0].startLine,
            column: fn.ranges[0].startColumn,
          },
          end: { line: fn.ranges[0].endLine, column: fn.ranges[0].endColumn },
        },
      };

      // Set function coverage
      const isCovered = fn.count > 0;
      fnCovered[fnId] = isCovered ? 1 : 0;
      if (isCovered) coveredFunctions++;

      // Map function ranges to statements
      fn.ranges.forEach((range) => {
        statementMap[statementId] = {
          start: { line: range.startLine, column: range.startColumn },
          end: { line: range.endLine, column: range.endColumn },
        };
        statementCovered[statementId] = fn.count > 0 ? 1 : 0;
        statementId++;
      });
    });

    console.log(
      `   📊 Covered functions: ${coveredFunctions}/${entry.functions.length}`,
    );
    console.log(`   📊 Total statements mapped: ${statementId}`);

    // Create coverage data structure
    const fileCoverage = {
      path: resolvedPath,
      statementMap,
      fnMap,
      branchMap,
      s: statementCovered,
      f: fnCovered,
      b: branchCovered,
    };

    // Add this file's coverage to the map
    coverageMap.addFileCoverage(fileCoverage);
    console.log("   ✅ Coverage data added to map");
  });

  return coverageMap;
}

// Helper function to list all files in a directory recursively
function listFilesRecursively(dir, depth = 0, maxDepth = 3) {
  if (depth > maxDepth) return;

  const indent = "  ".repeat(depth);
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      console.log(`${indent}📁 ${file}/`);
      listFilesRecursively(filePath, depth + 1, maxDepth);
    } else if (
      file.endsWith(".vue") ||
      file.endsWith(".js") ||
      file.endsWith(".ts")
    ) {
      console.log(`${indent}📄 ${file}`);
    }
  });
}

// Main function to process the coverage file
async function convertCoverage() {
  try {
    console.log("🔍 Starting diagnostic coverage conversion");

    // Read the Playwright coverage file
    const playwrightCoveragePath = path.join(
      __dirname,
      "playwright-coverage",
      "coverage-data.json",
    );

    if (!fs.existsSync(playwrightCoveragePath)) {
      console.error(`❌ Coverage file not found at: ${playwrightCoveragePath}`);
      return;
    }

    console.log(`✅ Found coverage file at: ${playwrightCoveragePath}`);
    const rawData = fs.readFileSync(playwrightCoveragePath, "utf8");
    console.log(
      `📊 Coverage file size: ${(rawData.length / 1024).toFixed(2)} KB`,
    );

    const playwrightCoverage = JSON.parse(rawData);
    console.log(`📊 Found ${playwrightCoverage.length} coverage entries`);

    // Convert to Istanbul format
    console.log("\n🔄 Converting to Istanbul format...");
    const istanbulCoverage = convertToIstanbulFormat(playwrightCoverage);

    // Create output directory
    const nycOutputDir = path.join(__dirname, ".nyc_output");
    if (!fs.existsSync(nycOutputDir)) {
      fs.mkdirSync(nycOutputDir, { recursive: true });
      console.log(`📁 Created directory: ${nycOutputDir}`);
    }

    // Write Istanbul-formatted coverage
    const outputPath = path.join(nycOutputDir, "out.json");

    const coverageData = istanbulCoverage.toJSON();
    console.log(
      `\n📊 Final coverage data contains ${Object.keys(coverageData).length} files`,
    );

    // Check if we have any actual coverage data
    if (Object.keys(coverageData).length === 0) {
      console.log(
        "⚠️ WARNING: No files were successfully mapped for coverage!",
      );
    } else {
      // List the files that were successfully mapped
      console.log("\n✅ Files with coverage data:");
      Object.keys(coverageData).forEach((file) => {
        console.log(`   - ${file}`);
      });
    }

    fs.writeFileSync(outputPath, JSON.stringify(coverageData), "utf8");
    console.log(`\n✅ Converted coverage data written to ${outputPath}`);

    // Display next steps
    console.log("\n📋 Next steps:");
    console.log("1. Run: npx nyc report");
    console.log("2. Check the coverage report in the coverage/ directory");
    console.log(
      "3. If issues persist, use the debug information above to adjust path mapping",
    );
  } catch (error) {
    console.error("❌ Error converting coverage:", error);
    console.error(error.stack);
  }
}

// Execute the main function
convertCoverage();
