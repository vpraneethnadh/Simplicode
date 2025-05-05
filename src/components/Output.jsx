import React, { useState, useRef, useEffect } from "react";
import { executeCode } from "../api";
import "./css/output.css";

const PLACEHOLDER = "Click on 'Run Code' to run";

const Output = ({ editorRef, language }) => {
  const [terminalLog, setTerminalLog] = useState(PLACEHOLDER);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [inputPrompts, setInputPrompts] = useState([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [collectedInputs, setCollectedInputs] = useState([]);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [terminalLog, currentInput]);

  const handleClear = () => {
    setTerminalLog(PLACEHOLDER);
    setCurrentInput("");
    setInputPrompts([]);
    setCurrentPromptIndex(0);
    setCollectedInputs([]);
    setIsError(false);
  };

  const runCode = () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    setTerminalLog("");
    setIsError(false);

    const prompts = [...sourceCode.matchAll(/input\(["'](.*?)["']\)/g)].map(
      (match) => match[1]
    );

    if (prompts.length > 0) {
      setInputPrompts(prompts);
      setCurrentPromptIndex(0);
      setCollectedInputs([]);
      setTerminalLog(`> ${prompts[0]} `);
    } else {
      submitInput([]);
    }
  };

  const handleNextInput = async () => {
    const input = currentInput.trim();
    if (!input) return;

    const newInputs = [...collectedInputs, input];
    setCollectedInputs(newInputs);
    setCurrentInput("");

    if (currentPromptIndex < inputPrompts.length - 1) {
      const nextIdx = currentPromptIndex + 1;
      setCurrentPromptIndex(nextIdx);
      setTerminalLog((prev) => `${prev}${input}\n> ${inputPrompts[nextIdx]} `);
    } else {
      submitInput(newInputs);
    }
  };

  const submitInput = async (inputs) => {
    try {
      setIsLoading(true);
      const result = await executeCode(
        language,
        editorRef.current.getValue(),
        inputs.join("\n")
      );

      let output = result.stdout || "";
      inputPrompts.forEach((prompt) => {
        output = output.replace(new RegExp(prompt, "g"), "");
      });
      output =
        output.trim() || result.stderr || result.compile_output || "";

      setTerminalLog((prev) => {
        const base = inputPrompts.length
          ? `${prev}${inputs[inputs.length - 1]}\n`
          : "";
        return `${base}${output}\n> `;
      });
      setIsError(!!result.stderr || !!result.compile_output);
    } catch (err) {
      setTerminalLog((prev) => `${prev}Error: ${err.message}\n> `);
      setIsError(true);
    } finally {
      setIsLoading(false);
      setInputPrompts([]);
      setCurrentPromptIndex(0);
      setCollectedInputs([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && inputPrompts.length > 0) {
      e.preventDefault();
      handleNextInput();
    }
  };

  const handleChange = (e) => {
    if (inputPrompts.length === 0) return;
    const newInput = e.target.value
      .replace(new RegExp(`^> ${inputPrompts[currentPromptIndex]} `), "")
      .replace(/\n/g, "");
    setCurrentInput(newInput);
  };

  const combinedText =
    inputPrompts.length > 0
      ? `> ${inputPrompts[currentPromptIndex]} ${currentInput}`
      : terminalLog;

      return (
        <div className="output-container">
          <div className="output-wrapper">
            <textarea
              ref={textareaRef}
              className={`output-box ${isError ? "error" : ""}`}
              value={combinedText}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
          </div>
      
          <div className="button-group">
            <button onClick={handleClear} className = "button-clear">
              <span>Clear</span>
            </button>
            <button onClick={runCode} disabled={isLoading} className = "button-run">
              <span>{isLoading ? "Running..." : "Run Code"}</span>
            </button>
          </div>
        </div>
      );
      
};

export default Output;