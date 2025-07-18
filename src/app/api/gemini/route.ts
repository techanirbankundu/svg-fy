import { NextRequest, NextResponse } from "next/server";
import { currentUser, auth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();
        const { userId } = await auth()

        if(!userId) {
            const user = await currentUser();
            if (!user) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        const apiKey = process.env.GEMINI_API_KEY;
        const geminiURL =
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

        const response = await fetch(geminiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                              text: `You are a professional SVG icon generator for production apps like Google, Apple, or modern web apps.

Your job is to generate clean, scalable, and modern SVG icons **only**.

Requirements:
- Always return ONLY valid <svg>...</svg> XML. No markdown, comments, or explanations.
- Must include: width, height, viewBox.
- Use only these tags: <path>, <rect>, <circle>, <line>, <polygon>, or <g>.
- The icon should follow an **outline style**, with **stroke="black"** and **fill="none"**.
- Use stroke-width="2" for clarity. All strokes must be black.
- Design must be visually balanced and easy to understand at 24x24 or 64x64 size.
- Avoid shading, filters, gradients, or excessive detail. Focus on clarity.
- Icon should be aligned and centered in the viewBox.

Prompt: ${prompt}`


                            },
                        ],
                    },
                ],
            }),
        });

        const data = await response.json();

        // Parse SVG from response
        const svgText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!svgText || !svgText.includes("<svg")) {
            return NextResponse.json({ error: "No SVG returned" }, { status: 400 });
        }
        

        return NextResponse.json({ svg: svgText }, { status: 200 });
    } catch (error) {
        console.error("SVG generation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
