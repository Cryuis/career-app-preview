import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { resumeText, jobTitle } = await req.json();

    if (!resumeText) {
      return NextResponse.json({ error: "Missing resumeText" }, { status: 400 });
    }

    const text = resumeText.replace(/\s+/g, " ").slice(0, 3000);

    if (!text) {
      return NextResponse.json({ error: "Resume text is empty" }, { status: 400 });
    }

    const prompt = `
  You are an ATS resume analyzer.
  
  Return ONLY valid JSON:
  
  {
    "fitScore": number,
    "skills": string[],
    "gaps": string[],
    "summary": string,
    "questions": string[]
  }
  
  Rules:
  - Only use resume content
  - No hallucinations
  - No extra text
  
  Resume:
  ${text}
  
  Role:
  ${jobTitle}
  `;

    const res = await fetch("https://js.puter.com/v2/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        model: "gpt-4.1-mini",
      }),
    });

    if (!res.ok) {
      const details = await res.text();
      console.error("AI service request failed:", res.status, details);
      return NextResponse.json(
        {
          error: "AI service request failed",
          details,
        },
        { status: 502 },
      );
    }

    const data = await res.json();

    const raw = data?.message?.content?.trim() || "{}";

    let aiAnalysis;

    try {
      aiAnalysis = JSON.parse(raw);
    } catch (parseError) {
      console.error("AI parse error:", parseError, raw);
      return Response.json(
        {
          error: "AI analysis returned invalid JSON",
          details: raw,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      aiAnalysis,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "AI analysis failed",
        details: err.message,
      },
      { status: 500 },
    );
  }
}
