//
// Mock data provider for app sections if the backend is unreachable
//

// PUBLIC_INTERFACE
export const MOCK_REVIEW_RESULT = {
  meta: {
    owner: "octocat",
    repo: "hello-world",
    branch: "main",
    description:
      "A sample GitHub repository for demonstrating code review UI fallback. Contains code that needs review and improvements."
  },
  files: [
    {
      filename: "src/utils/math.js",
      issues: [
        "Avoid using 'var', prefer 'let' or 'const'.",
        "Function multiply is missing JSDoc comment.",
        "Potential risk for NaN in division when b is zero."
      ],
      orig_code: `// src/utils/math.js
var add = (a, b) => {
  return a + b;
}

var multiply = function(a, b) {
  return a * b;
}

var divide = (a, b) => {
  return a / b;
}

// TODO: optimize math utils
`,
      reviewed_code: `// src/utils/math.js
// Improved by code review: replaced 'var' with 'const', added JSDoc comments

/**
 * Adds two numbers.
 */
const add = (a, b) => a + b;

/**
 * Multiplies two numbers.
 */
const multiply = (a, b) => a * b;

/**
 * Divides a by b. Throws if b is zero.
 */
const divide = (a, b) => {
  if (b === 0) throw new Error("Division by zero.");
  return a / b;
};
`,
      diff: `@@ -1,12 +1,23 @@
-var add = (a, b) => {
-  return a + b;
-}
-
-var multiply = function(a, b) {
-  return a * b;
-}
-
-var divide = (a, b) => {
-  return a / b;
-}
+/**
+ * Adds two numbers.
+ */
+const add = (a, b) => a + b;
+
+/**
+ * Multiplies two numbers.
+ */
+const multiply = (a, b) => a * b;
+
+/**
+ * Divides a by b. Throws if b is zero.
+ */
+const divide = (a, b) => {
+  if (b === 0) throw new Error("Division by zero.");
+  return a / b;
+};
 // TODO: optimize math utils
`
    },
    {
      filename: "README.md",
      issues: [
        "Header formatting inconsistent.",
        "Missing usage instructions section."
      ],
      orig_code: `# hello-world

A sample repo.

###Install

npm install

#Missing blank line
`,
      reviewed_code: `# hello-world

A sample repo.

### Install

\`\`\`bash
npm install
\`\`\`

> Usage details coming soon.
`,
      diff: `@@ -3,8 +3,13 @@
-A sample repo.
-
-###Install
-
-npm install
-
-#Missing blank line
+A sample repo.
+
+### Install
+
+\`\`\`bash
+npm install
+\`\`\`
+
+> Usage details coming soon.
`
    },
    {
      filename: "src/server.js",
      issues: [
        "Unused variable 'server'.",
        "Consider using async/await for request handler."
      ],
      orig_code: `const http = require('http');

const server = http.createServer(function(req, res){
  res.writeHead(200);
  res.end("OK");
});

server.listen(8000);
`,
      reviewed_code: `const http = require('http');

const server = http.createServer(async function(req, res){
  res.writeHead(200);
  res.end("OK");
});

server.listen(8000);
`,
      diff: `@@ -1,7 +1,8 @@
-const http = require('http');
-
-const server = http.createServer(function(req, res){
-  res.writeHead(200);
-  res.end("OK");
-});
-
-server.listen(8000);
+const http = require('http');
+
+const server = http.createServer(async function(req, res){
+  res.writeHead(200);
+  res.end("OK");
+});
+
+server.listen(8000);
`
    }
  ]
};

// For simulating 'apply reviewed code' per file
export function mockApplyReviewedCode(filename, reviewed_code) {
  // Find file and return its diff as a sample apply result
  const file = MOCK_REVIEW_RESULT.files.find(f => f.filename === filename);
  return {
    ok: true,
    diff: (file && file.diff) || "// (No diff for example file.)"
  };
}
