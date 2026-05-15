import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { pdfFile } = await req.json();

    if (!pdfFile) {
      return NextResponse.json(
        { error: "Missing pdfFile in request" },
        { status: 400 },
      );
    }

    const ocrApiKey = process.env.OCR_SPACE_KEY || process.env.OCR_API_KEY;

    if (!ocrApiKey) {
      return NextResponse.json({ error: "Missing OCR API key" }, { status: 500 });
    }

    // BASE64 → BLOB
    const base64Data = pdfFile.split(",")[1];
    const byteArray = Buffer.from(base64Data, "base64");

    const blob = new Blob([byteArray], {
      type: "application/pdf",
    });

    // OCR REQUEST
    const form = new FormData();

    form.append("apikey", ocrApiKey);
    form.append("file", blob, "resume.pdf");
    form.append("language", "eng");

    console.log("Sending PDF to OCR.space...");

    const ocrResponse = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: form,
    });

    if (!ocrResponse.ok) {
      const details = await ocrResponse.text();
      console.error("OCR request failed:", ocrResponse.status, details);
      return NextResponse.json(
        { error: "OCR service request failed", details },
        { status: 502 },
      );
    }

    const ocrResult = await ocrResponse.json();

    console.log("OCR RESULT:", JSON.stringify(ocrResult, null, 2));

    // MERGE ALL PDF PAGES
    let extractedText = "";

    if (ocrResult?.ParsedResults) {
      extractedText = ocrResult.ParsedResults.map((p) => p.ParsedText).join(
        " ",
      );
    }

    extractedText = extractedText
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .replace(/[^\x00-\x7F]/g, "")
      .trim();

    console.log("EXTRACTED TEXT:", extractedText);

    return NextResponse.json({
      success: true,
      extractedText,
    });
  } catch (err) {
    console.error("API ERROR:", err);

    return NextResponse.json(
      {
        error: "Resume processing failed",
        details: err.message,
      },
      { status: 500 },
    );
  }
}
