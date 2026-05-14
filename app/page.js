'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (file) => {
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setOcrResult(null);
      setError(null);
    } else {
      alert('Please select a PDF file only');
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
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleProcessResume = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const reader = new FileReader();

      const pdfBase64 = await new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfFile: pdfBase64,
        }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (data.error) {
        setError(data.error);
      } else {
        setOcrResult(data);
      }
    } catch (err) {
      setError('Failed to process resume');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    console.log('AI Analysis:', ocrResult?.aiAnalysis);
  }, [ocrResult]);

  return (
    <div className="min-h-screen bg-black p-8">

      <div className="max-w-6xl mx-auto space-y-10">

        {/* ================= UPLOAD CARD ================= */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 p-8">

          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Upload Resume
          </h1>

          <p className="text-gray-400 text-center mb-8">
            Upload your PDF resume to get AI ATS analysis
          </p>

          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
              isDragging
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-gray-700'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
            />

            <label
              htmlFor="pdf-upload"
              className="cursor-pointer text-purple-400 font-medium"
            >
              Click to upload or drag and drop
            </label>

            <p className="text-gray-500 text-sm mt-2">
              Only PDF files allowed
            </p>

            {selectedFile && (
              <p className="text-green-400 mt-4">
                ✓ {selectedFile.name}
              </p>
            )}
          </div>

          {selectedFile && (
            <button
              onClick={handleProcessResume}
              disabled={isProcessing}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl"
            >
              {isProcessing ? 'Processing...' : 'Analyze Resume'}
            </button>
          )}

          {error && (
            <p className="text-red-400 mt-4">{error}</p>
          )}
        </div>

        {/* ================= RESULTS DASHBOARD ================= */}
        {ocrResult && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl p-8 space-y-8">

            <h2 className="text-2xl font-bold text-white">
              ATS Analysis Results
            </h2>

            {/* FIT SCORE */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl text-center">
              <p className="text-white text-lg">Fit Score</p>
              <p className="text-5xl font-bold text-white">
                {ocrResult.aiAnalysis?.fitScore || 0}%
              </p>
            </div>

            {/* SUMMARY */}
            <div>
              <h3 className="text-purple-400 font-semibold mb-2">
                Summary
              </h3>
              <p className="text-gray-300">
                {ocrResult.aiAnalysis?.summary}
              </p>
            </div>

            {/* SKILLS */}
            <div>
              <h3 className="text-purple-400 font-semibold mb-3">
                Skills
              </h3>

              <div className="flex flex-wrap gap-2">
                {ocrResult.aiAnalysis?.skills?.map((s, i) => (
                  <span
                    key={i}
                    className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* GAPS */}
            <div>
              <h3 className="text-red-400 font-semibold mb-3">
                Skill Gaps
              </h3>

              {ocrResult.aiAnalysis?.gaps?.map((g, i) => (
                <p key={i} className="text-red-300">
                  • {g}
                </p>
              ))}
            </div>

            {/* QUESTIONS */}
            <div>
              <h3 className="text-purple-400 font-semibold mb-3">
                Interview Questions
              </h3>

              {ocrResult.aiAnalysis?.questions?.map((q, i) => (
                <p key={i} className="text-gray-300">
                  {i + 1}. {q}
                </p>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}