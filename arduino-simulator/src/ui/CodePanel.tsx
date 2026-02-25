import React from 'react';
import Editor from '@monaco-editor/react';

interface CodePanelProps {
    code: string;
}

const CodePanel: React.FC<CodePanelProps> = ({ code }) => {
    return (
        <div className="code-panel">
            <div className="code-header">
                <h3>Generated Code</h3>
                <span className="auto-badge">Auto-Generated</span>
            </div>
            <div className="code-editor">
                <Editor
                    height="100%"
                    defaultLanguage="cpp"
                    value={code}
                    theme="vs-light" // White theme
                    options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
                />
            </div>
        </div>
    );
};

export default CodePanel;
