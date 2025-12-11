"use client";

import React, { useState } from "react";
import { processAIText } from "../utils/aiProcessor";

type AIModalProps = {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onApply: (suggestions: Record<string, { value: any; confidence: number }>) => void;
};

export default function AIModal({ isOpen, onClose, onApply }: AIModalProps) {
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleApply = async () => {
    if (!text.trim()) {
      onClose();
      return;
    }

    setIsProcessing(true);

    // Simulate 500ms delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const aiSuggestions = processAIText(text);
    // Convert array to record format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const suggestions: Record<string, { value: any; confidence: number }> = {};
    aiSuggestions.forEach(({ fieldId, value, confidence }) => {
      suggestions[fieldId] = { value, confidence };
    });
    
    onApply(suggestions);
    setIsProcessing(false);
    setText("");
    onClose();
  };

  const handleCancel = () => {
    setText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-xl font-bold mb-4">AI Assist</h2>
        <p className="text-sm text-gray-600 mb-4">
          Describe the incident and AI will suggest field values. You can review and edit before submitting.
        </p>
        
        <textarea
          className="w-full border rounded p-3 mb-4 min-h-[200px]"
          placeholder="Describe what happened..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isProcessing}
        />

        {isProcessing && (
          <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
            Processing...
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button
            onClick={handleCancel}
            disabled={isProcessing}
            className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={isProcessing || !text.trim()}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

