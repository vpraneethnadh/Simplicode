import React, { useState, useRef } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './css/CodeBot.css';

export default function CodeBot() {
  const [inputText, setInputText] = useState('');
  const [output, setOutput]     = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [copied, setCopied]     = useState(false);
  const outputRef = useRef(null);

  // Only copy from line 2 onward
  const copyableOutput = output
    .split('\n')
    .slice(1)
    .join('\n');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    setError('');
    setOutput('');
    setCopied(false);

    try {
      const res = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.statusText}`);
      const text = await res.text();
      setOutput(text);
      // scroll to output
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="codebot-wrapper">
      <form className="codebot-form" onSubmit={handleSubmit}>
        <label htmlFor="prompt" className="form-label">
          Enter your prompt
        </label>
        <textarea
          id="prompt"
          className="form-input"
          rows="6"
          placeholder="Describe what code you need..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
        />
        <button
          type="submit"
          className="form-submit"
          disabled={loading}
        >
          {loading ? '⏳ Generating...' : '🚀 Generate Code'}
        </button>
      </form>

      {error && <div className="form-error">Error: {error}</div>}

      {output && (
        <div className="output-container" ref={outputRef}>
          <div className="output-header">
            <h3>Generated Code</h3>
            <CopyToClipboard text={copyableOutput} onCopy={() => setCopied(true)}>
              <button className="copy-button">
                {copied ? '✅ Copied!' : '📋 Copy Code'}
              </button>
            </CopyToClipboard>
          </div>
          <pre className="output-code">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
