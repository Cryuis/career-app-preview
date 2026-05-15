# Career Agent Preview

Career Agent Preview is an AI-powered resume analysis web application built with Next.js.

This project was independently developed as one of my projects during my internship experience. The application analyzes resumes using AI to provide ATS-style insights such as resume scoring, skill detection, skill gap analysis, and interview question generation.

While the project was inspired by my experience working on career-related systems during my internship, this version was fully rebuilt using a different implementation approach, code structure, AI integration, APIs, UI/UX design, and application architecture. The only shared technology stack is the use of Next.js as the frontend framework.

---

## Features

* PDF Resume Upload
* OCR-Based Resume Text Extraction
* AI Resume Analysis
* ATS Compatibility Score
* Technical Skill Detection
* Skill Gap Recommendations
* AI-Generated Interview Questions
* Responsive Modern UI
* Drag & Drop File Upload

---

## Tech Stack

* Next.js
* React
* Tailwind CSS
* Lucide React Icons
* OCR API Integration
* Puter.js AI Integration

---

## Getting Started

First, install dependencies:

```bash id="n7p7a7"
npm install
```

Run the development server:

```bash id="89i2vx"
npm run dev
```

Open:

```bash id="gkt6lz"
http://localhost:3000
```

with your browser to see the result.

You can start editing the application by modifying:

```bash id="0e7ywr"
app/page.js
```

The page auto-updates as you edit the file.

---

## Project Structure

```bash id="u3kwb9"
app/
 ├── api/
 │    ├── ai/
 │    │    └── route.js
 │    │
 │    └── ocr/
 │         └── route.js
 │
 ├── page.js
 ├── layout.js

lib/
 └── ai.js

public/
```

---

## API Routes

### `/api/ocr`

Handles:

* PDF processing
* OCR extraction
* resume text conversion

### `/api/ai`

Handles:

* AI-powered ATS analysis
* skill detection
* gap analysis
* interview question generation

---

## How It Works

1. User uploads a PDF resume
2. Resume file is converted into Base64 format
3. OCR extracts readable text from the resume
4. AI analyzes the extracted resume content
5. ATS insights and recommendations are displayed in the dashboard

---

## AI Analysis Includes

* ATS Resume Match Score
* Technical Skills Detection
* Missing Skill Identification
* Resume Summary
* AI Interview Questions

---

## Example AI Response

```json id="10dr0u"
{
  "fitScore": 85,
  "skills": [
    "React",
    "Next.js",
    "JavaScript",
    "Node.js"
  ],
  "gaps": [
    "Docker",
    "AWS"
  ],
  "summary": "Candidate demonstrates strong frontend development experience with modern JavaScript frameworks.",
  "questions": [
    "How did you optimize React performance in your projects?",
    "Explain your API integration workflow.",
    "Describe a challenging project you developed."
  ]
}
```

---

## Notes

This repository is an independently developed educational and portfolio project.

No proprietary source code, confidential assets, internal systems, or private implementations from my internship were used in this project. The application was rebuilt using different APIs, architecture, UI design, and implementation methods.

---

## Future Improvements

* Resume vs Job Description Matching
* Authentication System
* Resume History
* Exportable ATS Reports
* AI Career Recommendations
* Multi-Role Resume Analysis
* Resume Improvement Suggestions

---

## Learn More

To learn more about the technologies used in this project:

* Next.js Documentation
* React Documentation
* Tailwind CSS Documentation

---

## Deploy on Vercel

The easiest way to deploy this Next.js application is through Vercel.

---

## License

MIT License
