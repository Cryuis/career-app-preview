export async function getAIAnalysis(
  resumeText,
  jobTitle = "Software Engineer",
) {
  try {
    const text = resumeText.replace(/\s+/g, " ").slice(0, 3000);

    const prompt = `
  You are an ATS resume analyzer.

  Resume:
  ${text}

  Target Role:
  ${jobTitle}

  Return ONLY valid JSON:

  {
    "fitScore": number,
    "skills": string[],
    "gaps": string[],
    "summary": string,
    "questions": string[]
  }

  Rules:
  - Only use information from resume
  - Do not hallucinate skills
  - Output ONLY JSON
  `;

    // ✅ SAFE CHECK
    if (typeof window === "undefined") {
      throw new Error("AI can only run in browser (Puter dependency)");
    }

    // ✅ WAIT UNTIL PUTER EXISTS
    const waitForPuter = () =>
      new Promise((resolve, reject) => {
        const start = Date.now();

        const check = () => {
          if (window.puter?.ai?.chat) return resolve(window.puter);

          if (Date.now() - start > 5000) {
            return reject(new Error("Puter failed to load"));
          }

          setTimeout(check, 50);
        };

        check();
      });

    const puter = await waitForPuter();

    const response = await puter.ai.chat(prompt, {
      model: "gpt-4.1-mini",
    });

    const raw = response?.message?.content || "{}";

    try {
      // First try to parse the entire response as JSON
      return JSON.parse(raw);
    } catch {
      // If that fails, try to extract JSON from within the text
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch {
          // If JSON extraction fails, return fallback
        }
      }
      
      return {
        fitScore: 70,
        skills: [],
        gaps: [],
        summary: raw, // fallback shows raw AI output
        questions: [],
      };
    }
  } catch (error) {
    console.error("AI ANALYSIS ERROR:", error);

    return {
      fitScore: 70,
      skills: [],
      gaps: [],
      summary: "Analysis unavailable.",
      questions: [],
    };
  }
}
