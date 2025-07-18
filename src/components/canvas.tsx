"use client";

import { useState } from "react";
import Clipboard from "./clipboard";
import { Button } from "./ui/button";
import { toast } from "sonner"; // Optional: for user feedback

interface CanvasProps {
  svg: string;
}

export default function Canvas({ svg }: CanvasProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(svg);
      setCopied(true);
      toast.success("SVG copied to clipboard!"); // optional feedback
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Failed to copy SVG");
    }
  };

  return (
    <div className="min-h-64">
      <div className="bg-gray-600 p-4 w-64 h-64 rounded-lg shadow-lg flex items-center justify-center relative">
        <Button
          className="absolute top-1 right-1 rounded text-m cursor-pointer text-black"
          onClick={handleCopy}
        >
          <Clipboard />
        </Button>

        {svg ? (
          <div
            className="w-full h-full flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <p className="text-white text-sm text-center">SVG will appear here</p>
        )}
      </div>
    </div>
  );
}
