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
  - Use ONLY information present in the Resume text above.
  - Do NOT hallucinate or invent skills.
  - If there is a skill or a specific skill visible anywhere in the resume, include it in the "skills" list. If the resume clearly shows a skill, do not leave it out.
  - Extract EVERY skill mentioned anywhere in the resume (job descriptions, projects, certifications, education, tools, and technologies). Do not omit any skills found in the text.
  - You may include skills that are directly and clearly implied by explicit resume wording (for example, "led a team" -> "Team Leadership"); only include inferred skills when unambiguously supported by the resume.
  - Normalize skill names (trim whitespace, de-duplicate, use Title Case) and sort them alphabetically.
  - For "gaps", list missing key skills or experience relative to the Target Role, using only resume content as evidence.
  - Output JSON only with no additional commentary or explanation.

  Answer now.
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
