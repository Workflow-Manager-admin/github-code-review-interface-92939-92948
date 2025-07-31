import React, { useState, useEffect } from "react";
import "./App.css";
import { MOCK_REVIEW_RESULT, mockApplyReviewedCode } from "./mockData";
import { GitHubDiffViewer } from "./GitHubDiffViewer";

// Component: Shows final summary of applied diffs and result of push (uses mock/sample data if in sample mode)
function DiffSummaryPage({ appliedFiles, reviewResult, sampleMode, onBackToDashboard }) {
  // Prepare file-level info
  const files = (reviewResult && Array.isArray(reviewResult.files))
    ? reviewResult.files.filter(f => appliedFiles.includes(f.filename))
    : [];
  return (
    <section style={{ maxWidth: 1200, margin: "35px auto" }}>
      <div style={{marginBottom: 28}}>
        <h2 style={{color: "#0366d6", fontSize: 26, letterSpacing: 0.02, marginBottom: 8, marginTop: 0}}>
          <span role="img" aria-label="push">&#128228;</span> Diff Summary: Applied Changes
        </h2>
        {sampleMode && (
          <MiniNotice type="warn">
            <b>Sample Data Mode:</b> No backend detected. This summary uses hardcoded diffs and local UI state.
          </MiniNotice>
        )}
        <MiniNotice type="success">
          All proposed changes pushed to repository! (Simulated{sampleMode ? " – sample mode" : ""})
        </MiniNotice>
        <button
          style={{
            background: "#0366d6",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "11px 28px",
            fontWeight: 600,
            fontSize: 16.5,
            marginTop: 9,
            boxShadow: "0 0.5px 2px 0 #0366d630",
            cursor: "pointer"
          }}
          onClick={onBackToDashboard}
        >
          &larr; Back to Dashboard
        </button>
      </div>

      <div>
        {files.length === 0 && (
          <MiniNotice type="warn">No files were applied/changed.</MiniNotice>
        )}
        {files.map((f, idx) => (
          <div key={f.filename} style={{
              marginBottom: 32
          }}>
            <GitHubDiffViewer 
              filename={f.filename}
              diffText={f.diff || "// No diff data available"}
              viewType="unified"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Modern, minimal GitHub Code Review UI
 * - Step 1: Repo input form
 * - Step 2: Dashboard with repo info & file analysis
 */

// Color theme token mapping (provided by requirements)
const COLORS = {
  accent: "#28a745",
  primary: "#0366d6",
  secondary: "#24292e",
};

function TopNav() {
  return (
    <nav
      style={{
        background: COLORS.secondary,
        color: "#fff",
        padding: "0.75rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 8px 0 rgb(36 41 46 / 5%)",
      }}
      data-testid="topnav"
    >
      <div style={{ fontWeight: 600, fontSize: 21, letterSpacing: 0.5 }}>
        <span
          aria-label="Octo"
          role="img"
          style={{
            marginRight: 10,
            verticalAlign: -2,
            fontSize: 26,
          }}
        >
          🦑
        </span>
        GitHub Code Review
      </div>
      <a
        href="https://github.com/"
        style={{
          color: COLORS.primary,
          padding: "7px 20px",
          background: "#fff",
          borderRadius: 20,
          textDecoration: "none",
          fontWeight: 500,
          border: "1px solid #cfd6dc",
          fontSize: 15,
        }}
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
    </nav>
  );
}

function StepRepoInput({ onStartReview, loading }) {
  // GitHub repo: owner/name, branch
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [branch, setBranch] = useState("main");
  const [error, setError] = useState("");

  // PUBLIC_INTERFACE
  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!owner.trim() || !repo.trim() || !branch.trim()) {
      setError("Fill in all required fields.");
      return;
    }
    onStartReview({ owner: owner.trim(), repo: repo.trim(), branch: branch.trim() });
  }

  return (
    <section
      style={{
        maxWidth: 400,
        margin: "48px auto 0",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 6px 36px 0 #e2eaf6",
        padding: "28px 32px 22px 32px",
        border: `1.5px solid ${COLORS.primary}10`,
      }}
      data-testid="repo-input"
    >
      <h2 style={{ textAlign: "center", color: COLORS.primary, margin: 0 }}>
        Start a Review
      </h2>
      <form onSubmit={handleSubmit} style={{ marginTop: 30 }}>
        <label style={{ fontSize: 15, marginBottom: 14, color: "#666" }}>
          Owner
          <input
            type="text"
            className="input"
            required
            disabled={loading}
            value={owner}
            spellCheck={false}
            placeholder="octocat"
            style={{
              width: "100%",
              margin: "6px 0 14px 0",
              padding: "7px 11px",
              borderRadius: 6,
              border: `1px solid ${COLORS.primary}30`,
              fontSize: 15,
            }}
            onChange={(e) => setOwner(e.target.value)}
            autoComplete="off"
          />
        </label>
        <label style={{ fontSize: 15, marginBottom: 14, color: "#666" }}>
          Repository
          <input
            type="text"
            className="input"
            required
            disabled={loading}
            value={repo}
            spellCheck={false}
            placeholder="hello-world"
            style={{
              width: "100%",
              margin: "6px 0 14px 0",
              padding: "7px 11px",
              borderRadius: 6,
              border: `1.5px solid ${COLORS.primary}30`,
              fontSize: 15,
            }}
            onChange={(e) => setRepo(e.target.value)}
            autoComplete="off"
          />
        </label>
        <label style={{ fontSize: 15, marginBottom: 20, color: "#666" }}>
          Branch
          <input
            type="text"
            className="input"
            required
            disabled={loading}
            value={branch}
            spellCheck={false}
            placeholder="main"
            style={{
              width: "100%",
              margin: "6px 0 18px 0",
              padding: "7px 11px",
              borderRadius: 6,
              border: `1.5px solid ${COLORS.primary}30`,
              fontSize: 15,
            }}
            onChange={(e) => setBranch(e.target.value)}
            autoComplete="off"
          />
        </label>
        {error && (
          <div style={{ color: "#b00", marginTop: 1, marginBottom: 10, fontSize: 13 }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          style={{
            background: loading ? "#d2d6dc" : COLORS.accent,
            color: "#fff",
            border: "none",
            borderRadius: 7,
            padding: "10px 0",
            width: "100%",
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? "wait" : "pointer",
            marginTop: 8,
            boxShadow: "0 0.5px 1.5px 0 #b6e6ce2c",
            transition: "background .2s",
            letterSpacing: 0.02,
          }}
          disabled={loading}
          data-testid="clone-review"
        >
          {loading ? "Cloning & Analyzing..." : "Clone & Review"}
        </button>
      </form>
    </section>
  );
}

// Mini status or error notification
function MiniNotice({ children, type }) {
  const color =
    type === "success"
      ? COLORS.accent
      : type === "warn"
      ? "#ffe698"
      : type === "error"
      ? "#b3261e"
      : COLORS.primary;
  const bg =
    type === "success"
      ? "#e6fbee"
      : type === "warn"
      ? "#fff8e1"
      : type === "error"
      ? "#ffedf0"
      : "#eaf1fd";
  return (
    <div
      style={{
        margin: "18px auto 0",
        background: bg,
        color: color,
        border: `1px solid ${color}22`,
        padding: "12px 15px",
        borderRadius: 6,
        maxWidth: 560,
        fontSize: 15,
        wordBreak: "break-word",
        fontWeight: 500,
      }}
      data-testid="mininotice"
    >
      {children}
    </div>
  );
}

function FileCard({
  file,
  issues,
  origCode,
  reviewedCode,
  onEditReviewed,
  reviewing,
  onApplyReviewed,
  applyResult,
  diff,
  isApplying,
  applied = false,
  sampleMode = false,
}) {
  // Tabs: "Issues", "Original", "Reviewed", "Diff Preview"
  const [tab, setTab] = useState("Issues");
  const tabs = [];
  if (issues && issues.length) tabs.push("Issues");
  tabs.push("Original");
  tabs.push("Reviewed");
  if (diff) tabs.push("Diff Preview");

  // Show applied tick if already applied
  const appliedIndicator = applied
    ? (
      <span style={{
        marginLeft: 14, background: "#e4fde2", color: "#299755",
        fontWeight: 600, fontSize: 13, borderRadius: 8, padding: "2px 11px"
      }}>Applied</span>
    ) : null;

  return (
    <div
      style={{
        marginBottom: 32,
        border: applied
          ? "2px solid #b0ebb7"
          : `1px solid #dbe4ee`,
        borderRadius: 12,
        background: applied ? "#f9fffa" : "#fcfcff",
        boxShadow: applied
            ? "0 2px 12px 0 #d6fae78a"
            : "0 2px 12px 0 #e8eefb3c",
        padding: "0 0 22px 0",
        maxWidth: 950,
        marginLeft: "auto",
        marginRight: "auto",
        transition: "box-shadow .16s, border .18s, background .18s"
      }}
      data-testid={`file-card-${file.replaceAll("/", "_")}`}
    >
      <div style={{ padding: "16px 28px 8px 28px", fontSize: 18, fontWeight: 500, color: COLORS.secondary }}>
        <span style={{ marginRight: 10, fontFamily: "monospace", fontSize: 15 }}>📄</span> {file}
        {appliedIndicator}
        {sampleMode && (
          <span style={{
            marginLeft: 13, background: "#fff7e2", color: "#b77e24",
            fontWeight: 500, fontSize: 12.5, borderRadius: 7, padding: "2px 10px"
          }}>sample mode</span>
        )}
      </div>
      <div style={{ borderBottom: "1px solid #f2f5fa", marginBottom: 0, marginTop: 10, padding: "0 20px" }}>
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            style={{
              background: tab === t ? COLORS.primary : "#f4f8fa",
              color: tab === t ? "#fff" : "#24292e",
              border: "none",
              borderRadius: "12px 12px 0 0",
              padding: "9px 28px 7px 28px",
              marginRight: 10,
              fontWeight: 500,
              boxShadow: tab === t ? "0 2px 8px 0 #0366d630" : "",
              transition: "background .13s, color .13s",
              fontSize: 15.2,
              cursor: "pointer",
              marginTop: 0,
            }}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div style={{ padding: "4px 28px 0 28px", minHeight: 88 }}>
        {tab === "Issues" && (
          <>
            {issues && issues.length > 0 ? (
              <ul style={{ paddingLeft: 21, margin: "17px 0 7px 0" }}>
                {issues.map((iss, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontSize: 15.5,
                      color: "#c44811",
                      marginBottom: issues.length > 4 ? 7 : 12,
                      background: "#fff9e8",
                      padding: "5px 12px",
                      borderRadius: 6,
                      letterSpacing: 0.01,
                      fontWeight: 500,
                      listStyle: "disc inside",
                    }}
                  >
                    {iss}
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ color: COLORS.accent, fontSize: 15, margin: "27px 0", textAlign: "center" }}>
                ✅ No issues found in this file.
              </div>
            )}
          </>
        )}

        {tab === "Original" && (
          <pre
            style={{
              marginTop: 14,
              background: "#f8fafb",
              color: "#22292f",
              fontSize: 14,
              fontFamily: "Menlo, Monaco, monospace",
              borderRadius: 7,
              padding: "18px 13px",
              lineHeight: 1.62,
              overflowX: "auto",
              border: `1px solid #e3eaf4`,
              minHeight: 70,
            }}
          >
            {origCode}
          </pre>
        )}

        {tab === "Reviewed" && (
          <div style={{ marginTop: 10 }}>
            <textarea
              style={{
                width: "100%",
                minHeight: 100,
                maxHeight: 480,
                background: "#fffef9",
                border: `1.5px solid ${COLORS.accent}22`,
                borderRadius: 8,
                fontFamily: "Menlo, Monaco, monospace",
                fontSize: 14.1,
                color: "#2c2a20",
                padding: "13px 10px",
                boxSizing: "border-box",
                transition: "border .13s",
                marginBottom: 8,
                outlineColor: COLORS.accent,
              }}
              value={reviewedCode ?? ""}
              onChange={(e) => onEditReviewed(e.target.value)}
              spellCheck={false}
              aria-label="Reviewed code (editable)"
              disabled={!!reviewing || applied}
              autoComplete="off"
            ></textarea>
            <button
              style={{
                background: applied ? "#b6e6ce" :
                  ((reviewing || isApplying) ? "#c6e6cd" : COLORS.accent),
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "9px 24px",
                fontSize: 15.3,
                fontWeight: 600,
                cursor: applied
                  ? "not-allowed"
                  : ((reviewing || isApplying) ? "wait" : "pointer"),
                boxShadow: "0 0.5px 1.5px 0 #28a74511",
                letterSpacing: 0.01,
                marginRight: 10,
                opacity: applied ? 0.68 : 1,
                transition: "background .17s, opacity .16s"
              }}
              disabled={reviewing || isApplying || applied}
              onClick={onApplyReviewed}
              data-testid={`apply-reviewed-btn-${file.replaceAll("/", "_")}`}
            >
              {applied
                ? "Applied"
                : (isApplying ? "Applying..." : "Apply This Change")}
            </button>
            {applyResult && (
              <span style={{ marginLeft: 17, fontSize: 14.5, color: applyResult.ok ? COLORS.accent : "#b00" }}>
                {applyResult.ok ? "Applied!" : "Failed: " + (applyResult.error || "unknown error")}
              </span>
            )}
          </div>
        )}

        {tab === "Diff Preview" && diff && (
          <div style={{ marginTop: 8 }}>
            <GitHubDiffViewer 
              filename={file} 
              diffText={diff}
              viewType="unified"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function RepoOverview({ meta }) {
  if (!meta) return null;
  return (
    <div
      style={{
        background: COLORS.primary,
        color: "#fff",
        padding: "20px 32px 19px 32px",
        borderRadius: 13,
        maxWidth: 820,
        margin: "33px auto 26px auto",
        boxShadow: "0 3px 16px 0 #d2ebff",
      }}
      data-testid="repo-overview"
    >
      <div style={{ fontWeight: 500, fontSize: 18 }}>
        <span style={{ fontFamily: "monospace", marginRight: 8 }}>📁</span>
        {meta.owner}/{meta.repo}
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            marginLeft: 15,
            background: COLORS.secondary,
            color: "#fff",
            borderRadius: 6,
            padding: "2px 16px",
            letterSpacing: 0.06,
            marginRight: 8,
          }}
        >
          Branch: {meta.branch}
        </span>
      </div>
      {meta.description && (
        <div
          style={{
            marginTop: 8,
            fontSize: 15.4,
            fontWeight: 400,
            color: "#e8f3ff",
            maxWidth: 700,
            opacity: 0.89,
          }}
        >
          {meta.description}
        </div>
      )}
    </div>
  );
}

function Dashboard({
  reviewResult,
  reviewing,
  onEditReviewedCode,
  onApplyReviewedCode,
  applyingFile,
  applyResults,
  stepNotice,
  appliedFiles = [],
  sampleMode = false,
  onApplyAllChanges,
  allChangesApplied = false
}) {
  // reviewResult structure
  // { meta: { owner, repo, branch, ...}, files: [ { filename, issues, orig_code, reviewed_code, diff } ] }
  if (!reviewResult) return null;
  const { meta, files } = reviewResult;

  // Decide whether all files are applied
  const allApplied = Array.isArray(files)
    ? files.every(f => appliedFiles.includes(f.filename))
    : false;

  return (
    <section style={{ maxWidth: 1100, margin: "0 auto" }}>
      <RepoOverview meta={meta} />
      {sampleMode && (
        <div style={{marginBottom: 5}}>
        <MiniNotice type="warn">
          <span style={{ color: "#b77e24", fontWeight: 700, marginRight: 7 }}>Sample Mode:</span>
          No backend connection. Applying changes is simulated.<br />
        </MiniNotice>
        </div>
      )}
      {stepNotice}
      {files.length === 0 ? (
        <MiniNotice type="warn">No files found in this repository.</MiniNotice>
      ) : (
        <>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "20px 0 18px 5px"
          }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: COLORS.primary }}>
              Files
            </div>
            <button
              style={{
                background: allApplied ? "#b6e6ce" : "#0366d6",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "11px 20px",
                fontWeight: 600,
                fontSize: 17,
                letterSpacing: 0.08,
                boxShadow: "0 0.5px 2px 0 #0366d630",
                cursor: allApplied || reviewing ? "not-allowed" : "pointer",
                opacity: allApplied ? 0.65 : 1,
                marginRight: 2,
                transition: "background .18s"
              }}
              disabled={allApplied || reviewing}
              onClick={onApplyAllChanges}
              data-testid="apply-all-changes"
            >
              {allApplied
                ? "All Changes Applied"
                : (allChangesApplied ? "Applying..." : "Apply All Changes")}
            </button>
          </div>
          {files.map((f, idx) => (
            <FileCard
              key={f.filename}
              file={f.filename}
              issues={f.issues}
              origCode={f.orig_code}
              reviewedCode={f.reviewed_code}
              onEditReviewed={(code) => onEditReviewedCode(f.filename, code)}
              reviewing={reviewing}
              onApplyReviewed={() => onApplyReviewedCode(f.filename)}
              applyResult={applyResults[f.filename]}
              diff={f.diff}
              isApplying={applyingFile === f.filename}
              applied={appliedFiles.includes(f.filename)}
              sampleMode={sampleMode}
            />
          ))}
        </>
      )}
    </section>
  );
}

// Helper fetch call with JSON body/response
async function postJson(url, body) {
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  let respJson = null;
  try {
    respJson = await resp.json();
  } catch (e) {}
  if (!resp.ok) {
    throw new Error(respJson?.error || `Request failed (${resp.status})`);
  }
  return respJson;
}

/**
 * PUBLIC_INTERFACE
 * Main App - handles steps, global state, integration
 */
export default function App() {
  // App state
  const [step, setStep] = useState(1); // 1: repo input, 2: dashboard, 3: diff-summary
  const [reviewing, setReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState(null); // shape: {meta, files: [...]}
  const [repoInput, setRepoInput] = useState(null);
  const [error, setError] = useState("");
  const [editedReviewed, setEditedReviewed] = useState({}); // { filename: code }
  const [applyingFile, setApplyingFile] = useState("");
  const [applyResults, setApplyResults] = useState({}); // { [filename]: { ok, error, ...} }
  const [stepNotice, setStepNotice] = useState("");
  const [appliedFiles, setAppliedFiles] = useState([]); // which file(s) were applied/pushed
  const [sampleMode, setSampleMode] = useState(false); // true if using fallback
  const [allChangesApplied, setAllChangesApplied] = useState(false);

  // Start review: send POST to backend /review/start
  // PUBLIC_INTERFACE
  async function handleStartReview(input) {
    setError("");
    setReviewing(true);
    setReviewResult(null);
    setStepNotice("Cloning repository and starting analysis. This may take a few moments...");
    setRepoInput(input);
    setSampleMode(false);
    setAppliedFiles([]);
    setApplyResults({});
    setAllChangesApplied(false);

    try {
      const result = await postJson("/review/start", {
        owner: input.owner,
        repo: input.repo,
        branch: input.branch,
      });
      setReviewResult(result);
      setStep(2);
      setStepNotice(
        <MiniNotice type="success">
          Code review completed. See findings and edit reviewed code for each file.
        </MiniNotice>
      );
      setError("");
      setSampleMode(false);
    } catch (err) {
      setError(
        "Failed to review repo: " +
          (err.message || err.toString() || "unknown error")
      );
      setStepNotice(
        <MiniNotice type="warn">
          <span style={{ color: "#b77e24", fontWeight: 700, marginRight: 7 }}>Sample Data Mode:</span>
          Backend unavailable.<br />
          <span style={{ fontSize: 15 }}>The full interface below is populated with sample data for demo purposes.</span>
        </MiniNotice>
      );
      setReviewResult(MOCK_REVIEW_RESULT);
      setSampleMode(true);
      setStep(2);
    }
    setReviewing(false);
  }

  // Handler for reviewed code textarea change
  // PUBLIC_INTERFACE
  function handleEditReviewedCode(filename, code) {
    setEditedReviewed((prev) => ({ ...prev, [filename]: code }));
    // Also update reviewResult.files (so edit propagates to instance)
    if (!reviewResult) return;
    setReviewResult((prev) => ({
      ...prev,
      files: prev.files.map((f) =>
        f.filename === filename ? { ...f, reviewed_code: code } : f
      ),
    }));
  }

  // Handler for "Apply This Change" button (per file)
  // PUBLIC_INTERFACE
  async function handleApplyReviewedCode(filename) {
    setApplyingFile(filename);
    setApplyResults((prev) => ({ ...prev, [filename]: undefined }));
    try {
      const fileObj = reviewResult.files.find((f) => f.filename === filename);
      const reviewed_code =
        typeof editedReviewed[filename] === "string"
          ? editedReviewed[filename]
          : fileObj?.reviewed_code;
      // Try real API. If fails, fallback to mock:
      let resp;
      try {
        resp = await postJson("/apply-reviewed-code", {
          owner: repoInput?.owner || (reviewResult?.meta?.owner ?? "octocat"),
          repo: repoInput?.repo || (reviewResult?.meta?.repo ?? "hello-world"),
          branch: repoInput?.branch || (reviewResult?.meta?.branch ?? "main"),
          filename: filename,
          reviewed_code,
        });
        setSampleMode(false);
      } catch (_err) {
        // fallback to mock
        resp = mockApplyReviewedCode(filename, reviewed_code);
        setSampleMode(true);
        setStepNotice(
          <MiniNotice type="warn">
            <span style={{ color: "#b77e24", fontWeight: 700, marginRight: 7 }}>Sample Data Mode:</span>
            Backend unavailable.<br />
            <span style={{ fontSize: 15 }}>Actions below update the UI locally for demo.</span>
          </MiniNotice>
        )
      }
      setApplyResults((prev) => ({
        ...prev,
        [filename]: { ok: !!resp.ok, error: resp.error },
      }));
      setAppliedFiles((prev) => prev.includes(filename) ? prev : [...prev, filename]);
      // Update diff in reviewResult.files
      setReviewResult((prev) => ({
        ...prev,
        files: prev.files.map((f) =>
          f.filename === filename ? { ...f, diff: resp.diff } : f
        ),
      }));
      setStepNotice(
        <MiniNotice type="success">
          Reviewed code applied for <b>{filename}</b>. See Diff Preview tab for changes.
        </MiniNotice>
      );
    } catch (err) {
      setApplyResults((prev) => ({
        ...prev,
        [filename]: { ok: false, error: err?.message || "Unknown error" },
      }));
      setStepNotice(
        <MiniNotice type="error">
          Failed to apply reviewed code for <b>{filename}</b>:{" "}
          {err?.message || "Unknown error"}
        </MiniNotice>
      );
    }
    setApplyingFile("");
  }

  // Handler for "Apply All Changes" button (dashboard)
  async function handleApplyAllChanges() {
    if (!reviewResult || !Array.isArray(reviewResult.files)) return;
    setAllChangesApplied(false);
    // For each file, simulate API or set sample mode for button
    for (const f of reviewResult.files) {
      // Only apply files not already applied
      if (appliedFiles.includes(f.filename)) continue;
      await handleApplyReviewedCode(f.filename);
    }
    setAllChangesApplied(true);
    setTimeout(() => setStep(3), 550); // short visual delay for summary transition
  }

  function handleGoBackToDashboard() {
    setStep(2);
    setStepNotice("");
  }

  // Light/minimal layout theme
  useEffect(() => {
    document.body.style.background = "#f5f7fa";
    document.body.style.minHeight = "100vh";
  }, []);

  return (
    <>
      <TopNav />
      <main style={{ minHeight: "calc(100vh - 68px)" }}>
        {step === 1 && (
          <StepRepoInput onStartReview={handleStartReview} loading={reviewing} />
        )}
        {error && <MiniNotice type="error">{error}</MiniNotice>}
        {step === 2 && reviewResult && (
          <Dashboard
            reviewResult={reviewResult}
            reviewing={reviewing}
            onEditReviewedCode={handleEditReviewedCode}
            onApplyReviewedCode={handleApplyReviewedCode}
            applyingFile={applyingFile}
            applyResults={applyResults}
            stepNotice={stepNotice}
            appliedFiles={appliedFiles}
            sampleMode={sampleMode}
            onApplyAllChanges={handleApplyAllChanges}
            allChangesApplied={allChangesApplied}
          />
        )}
        {step === 3 && (
          <DiffSummaryPage
            appliedFiles={appliedFiles.length > 0 ? appliedFiles : (reviewResult ? reviewResult.files.map(f => f.filename) : [])}
            reviewResult={reviewResult}
            sampleMode={sampleMode}
            onBackToDashboard={handleGoBackToDashboard}
          />
        )}
      </main>
    </>
  );
}
