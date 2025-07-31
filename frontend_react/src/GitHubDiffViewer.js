import React from 'react';
import { parseDiff, Diff, Hunk } from 'react-diff-view';
import 'react-diff-view/style/index.css';

// GitHub-style colors and styling
const diffStyles = {
  container: {
    border: '1px solid #d0d7de',
    borderRadius: '6px',
    overflow: 'hidden',
    fontFamily: 'ui-monospace,SFMono-Regular,"SF Mono",Consolas,"Liberation Mono",Menlo,monospace',
    fontSize: '12px',
    backgroundColor: '#ffffff'
  },
  header: {
    backgroundColor: '#f6f8fa',
    padding: '8px 12px',
    borderBottom: '1px solid #d0d7de',
    fontWeight: '600',
    color: '#24292f'
  },
  diffWrapper: {
    '& .diff-gutter-normal': {
      backgroundColor: '#ffffff',
      color: '#656d76',
      width: '40px',
      textAlign: 'right',
      paddingRight: '8px',
      paddingLeft: '8px',
      userSelect: 'none',
      verticalAlign: 'top'
    },
    '& .diff-gutter-insert': {
      backgroundColor: '#ccfdf6',
      color: '#116329'
    },
    '& .diff-gutter-delete': {
      backgroundColor: '#ffd1d9',
      color: '#82071e'
    },
    '& .diff-code-normal': {
      backgroundColor: '#ffffff',
      paddingLeft: '8px',
      paddingRight: '8px'
    },
    '& .diff-code-insert': {
      backgroundColor: '#dafbe1',
      paddingLeft: '8px',
      paddingRight: '8px'
    },
    '& .diff-code-delete': {
      backgroundColor: '#ffebe9',
      paddingLeft: '8px',
      paddingRight: '8px'
    },
    '& .diff-line': {
      lineHeight: '20px'
    }
  }
};

// Helper function to parse unified diff format
function parseUnifiedDiff(diffText, filename) {
  // If no proper diff header, create one
  if (!diffText.includes('@@')) {
    return null;
  }
  
  // Ensure proper diff format
  let formattedDiff = diffText;
  if (!formattedDiff.startsWith('diff --git')) {
    formattedDiff = `diff --git a/${filename} b/${filename}\nindex 1234567..abcdefg 100644\n--- a/${filename}\n+++ b/${filename}\n${diffText}`;
  }
  
  try {
    const files = parseDiff(formattedDiff);
    return files[0] || null;
  } catch (error) {
    console.warn('Failed to parse diff:', error);
    return null;
  }
}

// Custom render functions for GitHub styling
const renderToken = (token, defaultRender, i) => {
  return defaultRender(token, i);
};

const renderGutter = ({ change, side, inHoverState, renderDefault, wrapInAnchor }) => {
  const lineNumber = change.lineNumber;
  
  return (
    <td 
      className={`diff-gutter-${change.type}`}
      style={{
        backgroundColor: change.type === 'insert' ? '#ccfdf6' : 
                        change.type === 'delete' ? '#ffd1d9' : '#ffffff',
        color: change.type === 'insert' ? '#116329' : 
               change.type === 'delete' ? '#82071e' : '#656d76',
        width: '40px',
        textAlign: 'right',
        paddingRight: '8px',
        paddingLeft: '8px',
        userSelect: 'none',
        verticalAlign: 'top',
        borderRight: '1px solid #d0d7de'
      }}
    >
      {lineNumber}
    </td>
  );
};

const renderCode = ({ change, ...props }) => {
  const prefix = change.type === 'insert' ? '+' : change.type === 'delete' ? '-' : ' ';
  
  return (
    <td
      className={`diff-code-${change.type}`}
      style={{
        backgroundColor: change.type === 'insert' ? '#dafbe1' : 
                        change.type === 'delete' ? '#ffebe9' : '#ffffff',
        paddingLeft: '8px',
        paddingRight: '8px',
        width: '100%'
      }}
    >
      <span style={{ color: change.type === 'insert' ? '#116329' : change.type === 'delete' ? '#82071e' : '#24292f' }}>
        <span style={{ marginRight: '4px', userSelect: 'none' }}>{prefix}</span>
        {change.content}
      </span>
    </td>
  );
};

// PUBLIC_INTERFACE
/**
 * GitHubDiffViewer component that renders diffs in GitHub's distinctive style
 * @param {string} filename - The name of the file being diffed
 * @param {string} diffText - The unified diff text
 * @param {string} viewType - Either 'unified' or 'split' (default: 'unified')
 */
export function GitHubDiffViewer({ filename, diffText, viewType = 'unified' }) {
  if (!diffText) {
    return (
      <div style={diffStyles.container}>
        <div style={diffStyles.header}>
          📄 {filename}
        </div>
        <div style={{ padding: '20px', textAlign: 'center', color: '#656d76' }}>
          No diff available
        </div>
      </div>
    );
  }

  const file = parseUnifiedDiff(diffText, filename);
  
  if (!file) {
    // Fallback to simple text display if parsing fails
    return (
      <div style={diffStyles.container}>
        <div style={diffStyles.header}>
          📄 {filename}
        </div>
        <pre style={{ 
          margin: 0, 
          padding: '12px', 
          backgroundColor: '#f6f8fa',
          fontSize: '12px',
          lineHeight: '20px',
          overflow: 'auto'
        }}>
          {diffText}
        </pre>
      </div>
    );
  }

  return (
    <div style={diffStyles.container}>
      <div style={diffStyles.header}>
        📄 {filename}
        <span style={{ 
          marginLeft: '8px', 
          fontSize: '11px', 
          color: '#656d76',
          backgroundColor: '#ffffff',
          padding: '2px 6px',
          borderRadius: '3px',
          border: '1px solid #d0d7de'
        }}>
          {file.hunks.reduce((total, hunk) => total + hunk.changes.length, 0)} changes
        </span>
      </div>
      <div style={diffStyles.diffWrapper}>
        <Diff 
          viewType={viewType}
          diffType={file.type}
          hunks={file.hunks}
          renderToken={renderToken}
          renderGutter={renderGutter}
          renderCode={renderCode}
        >
          {hunks => hunks.map(hunk => (
            <Hunk key={hunk.content} hunk={hunk} />
          ))}
        </Diff>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Side-by-side diff viewer component
 * @param {string} filename - The name of the file
 * @param {string} beforeCode - Original code
 * @param {string} afterCode - Modified code
 */
export function SideBySideDiffViewer({ filename, beforeCode, afterCode }) {
  return (
    <div style={diffStyles.container}>
      <div style={diffStyles.header}>
        📄 {filename}
      </div>
      <div style={{ display: 'flex', height: '400px' }}>
        <div style={{ 
          flex: 1, 
          borderRight: '1px solid #d0d7de',
          backgroundColor: '#ffebe9'
        }}>
          <div style={{
            backgroundColor: '#ffd1d9',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#82071e',
            borderBottom: '1px solid #d0d7de'
          }}>
            Original
          </div>
          <pre style={{
            margin: 0,
            padding: '12px',
            fontSize: '12px',
            lineHeight: '20px',
            height: 'calc(100% - 33px)',
            overflow: 'auto',
            backgroundColor: '#ffffff'
          }}>
            {beforeCode}
          </pre>
        </div>
        <div style={{ 
          flex: 1,
          backgroundColor: '#dafbe1'
        }}>
          <div style={{
            backgroundColor: '#ccfdf6',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#116329',
            borderBottom: '1px solid #d0d7de'
          }}>
            Modified
          </div>
          <pre style={{
            margin: 0,
            padding: '12px',
            fontSize: '12px',
            lineHeight: '20px',
            height: 'calc(100% - 33px)',
            overflow: 'auto',
            backgroundColor: '#ffffff'
          }}>
            {afterCode}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default GitHubDiffViewer;
