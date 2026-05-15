"use client";

import { useState } from "react";
import Script from "next/script";
import {
  Upload,
  FileText,
  Brain,
  BadgeCheck,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (file) => {
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setOcrResult(null);
      setError(null);
    } else {
      alert("Please select a PDF file only");
    }
  };

  const handleProcessResume = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Convert PDF → base64
      const reader = new FileReader();

      const pdfBase64 = await new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      // 2. OCR API call
      const response = await fetch("/api/ocr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfFile: pdfBase64,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      // 3. AI ANALYSIS via server route
      const analysisResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText: data.extractedText,
          jobTitle: "Software Engineer",
        }),
      });

      const analysisData = await analysisResponse.json();

      if (analysisData.error) {
        setError(analysisData.error);
        return;
      }

      setOcrResult({
        ...data,
        aiAnalysis: analysisData.aiAnalysis,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to process resume");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* LOAD PUTER */}
      <Script src="https://js.puter.com/v2/" strategy="afterInteractive" />

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.15),transparent_40%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-12 space-y-10">
        {/* HERO */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-full text-purple-300 text-sm">
            <Sparkles className="w-4 h-4" />
            AI Resume Analyzer
          </div>

          <h1 className="text-5xl font-bold">ATS Resume Scanner</h1>

          <p className="text-gray-400 max-w-2xl mx-auto">
            Upload your resume and get AI-powered ATS insights.
          </p>
        </div>

        {/* UPLOAD */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="hidden"
            id="pdf-upload"
          />

          <label
            htmlFor="pdf-upload"
            className="cursor-pointer inline-flex items-center gap-2 bg-purple-600 px-6 py-3 rounded-xl"
          >
            <FileText className="w-4 h-4" />
            Choose PDF
          </label>

          {selectedFile && (
            <p className="mt-4 text-green-400 flex items-center gap-2">
              <BadgeCheck className="w-4 h-4" />
              {selectedFile.name}
            </p>
          )}

          {selectedFile && (
            <button
              onClick={handleProcessResume}
              disabled={isProcessing}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-xl"
            >
              {isProcessing ? "Analyzing..." : "Analyze Resume"}
            </button>
          )}

          {error && (
            <div className="mt-4 text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* RESULTS */}
        {ocrResult?.aiAnalysis && (
          <div className="space-y-6">
            {/* SCORE */}
            <div className="bg-purple-600 p-10 rounded-3xl text-center">
              <p>ATS Fit Score</p>
              <h1 className="text-6xl font-bold">
                {ocrResult.aiAnalysis.fitScore}%
              </h1>
            </div>

            {/* SUMMARY */}
            <div className="bg-white/5 p-6 rounded-3xl">
              <h2 className="text-xl mb-2 flex items-center gap-2">
                <Brain className="text-purple-400" />
                AI Summary
              </h2>
              <p className="text-gray-300">{ocrResult.aiAnalysis.summary}</p>
            </div>

            {/* SKILLS */}
            <div className="bg-white/5 p-6 rounded-3xl">
              <h2 className="text-xl mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {ocrResult.aiAnalysis.skills?.map((s, i) => (
                  <span
                    key={i}
                    className="bg-purple-500/20 px-3 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* GAPS */}
            <div className="bg-white/5 p-6 rounded-3xl">
              <h2 className="text-xl mb-4 text-red-400">Gaps</h2>
              {ocrResult.aiAnalysis.gaps?.map((g, i) => (
                <p key={i} className="text-red-300">
                  • {g}
                </p>
              ))}
            </div>

            {/* QUESTIONS */}
            <div className="bg-white/5 p-6 rounded-3xl">
              <h2 className="text-xl mb-4">Interview Questions</h2>
              {ocrResult.aiAnalysis.questions?.map((q, i) => (
                <p key={i} className="text-gray-300 mb-2">
                  Q{i + 1}. {q}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
