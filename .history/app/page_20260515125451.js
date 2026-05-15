"use client";

import { useState, useRef } from "react";
import Script from "next/script";
import {
  Upload,
  FileText,
  Brain,
  BadgeCheck,
  AlertTriangle,
  Sparkles,
  Target,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getAIAnalysis } from "@/lib/ai";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setOcrResult(null);
      setError(null);
    } else {
      setError("Please select a PDF file only");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
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

      if (!data.extractedText) {
        setError("No text was extracted from the PDF");
        return;
      }

      const aiAnalysis = await getAIAnalysis(
        data.extractedText,
        "Software Engineer",
      );

      setOcrResult({
        ...data,
        aiAnalysis,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to process resume");
    } finally {
      setIsProcessing(false);
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

      if (!data.extractedText) {
        setError("No text was extracted from the PDF");
        return;
      }

      const aiAnalysis = await getAIAnalysis(
        data.extractedText,
        "Software Engineer",
      );

      setOcrResult({
        ...data,
        aiAnalysis,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to process resume");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* LOAD PUTER */}
      <Script src="https://js.puter.com/v2/" strategy="afterInteractive" />

      {/* BACKGROUND PATTERNS */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

      <div className="relative min-h-screen">
        {/* HEADER */}
        <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-white">ResumeAI</span>
              </div>
              <div className="text-sm text-gray-400">ATS Resume Analyzer</div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* HERO SECTION */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-full text-purple-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Powered by AI
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              ATS Resume
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Scanner</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Upload your resume and get comprehensive AI-powered insights to optimize your chances of passing Applicant Tracking Systems.
            </p>
          </div>

          {/* UPLOAD SECTION */}
          <div className="max-w-2xl mx-auto mb-16">
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                isDragging
                  ? "border-purple-400 bg-purple-500/10 scale-105"
                  : "border-gray-600 hover:border-purple-400 hover:bg-white/5"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="hidden"
                id="pdf-upload"
              />

              <div className="space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-white" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Upload Your Resume
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Drag and drop your PDF resume here, or click to browse
                  </p>
                </div>

                <label
                  htmlFor="pdf-upload"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-xl font-medium text-white cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <FileText className="w-5 h-5" />
                  Choose PDF File
                </label>

                <p className="text-sm text-gray-500">Supports PDF files up to 10MB</p>
              </div>
            </div>

            {selectedFile && (
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">{selectedFile.name}</span>
                  <span className="text-gray-400 text-sm ml-auto">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
            )}

            {selectedFile && (
              <button
                onClick={handleProcessResume}
                disabled={isProcessing}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold text-white text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing Resume...
                  </div>
                ) : (
                  "Analyze Resume"
                )}
              </button>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400">{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* RESULTS SECTION */}
          {ocrResult?.aiAnalysis && (
            <div className="space-y-8">
              {/* SCORE CARD */}
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 text-center">
                <div className="inline-flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full text-purple-300 text-sm font-medium mb-4">
                  <TrendingUp className="w-4 h-4" />
                  ATS Compatibility Score
                </div>
                <div className="text-7xl font-bold text-white mb-2">
                  {ocrResult.aiAnalysis.fitScore}%
                </div>
                <p className="text-gray-300">
                  {ocrResult.aiAnalysis.fitScore >= 80 ? "Excellent fit!" :
                   ocrResult.aiAnalysis.fitScore >= 60 ? "Good potential" :
                   "Needs improvement"}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* SUMMARY */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">AI Summary</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{ocrResult.aiAnalysis.summary}</p>
                </div>

                {/* SKILLS */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Identified Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ocrResult.aiAnalysis.skills?.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* GAPS */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Areas for Improvement</h3>
                  </div>
                  <div className="space-y-3">
                    {ocrResult.aiAnalysis.gaps?.map((gap, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-gray-300 text-sm leading-relaxed">{gap}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QUESTIONS */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Interview Questions</h3>
                  </div>
                  <div className="space-y-4">
                    {ocrResult.aiAnalysis.questions?.map((question, i) => (
                      <div key={i} className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <span className="bg-purple-500/20 text-purple-300 text-sm font-medium px-2 py-1 rounded">
                            Q{i + 1}
                          </span>
                          <p className="text-gray-300 text-sm leading-relaxed">{question}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
