"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSubmit,
  isLoading = false,
  placeholder = "Digite sua mensagem...",
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "52px";
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.min(scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;

      if (buttonRef.current) {
        const height = textareaRef.current.offsetHeight;
        buttonRef.current.style.height = `${height}px`;
      }
    }
  }, [inputValue]);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim() || isLoading) {
      return;
    }

    onSubmit(inputValue.trim());
    setInputValue("");
  }, [inputValue, isLoading, onSubmit]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="max-w-3xl mx-auto px-6 py-[14px]">
        <div className="flex items-start gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              rows={1}
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 resize-none overflow-hidden"
              style={{
                minHeight: "52px",
                maxHeight: "200px",
              }}
            />
          </div>
          <button
            ref={buttonRef}
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isLoading}
            className="px-6 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shrink-0 cursor-pointer"
            style={{
              height: "52px",
            }}
          >
            {isLoading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
