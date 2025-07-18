'use client';
import Canvas from "@/components/canvas";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [svg, setSvg] = useState("");
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/sync-user", {
        method: "POST",
      });
    } else {
      setLogin(false)
    }
  }, [isSignedIn]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      const cleaned = data.svg?.replace(/```xml|```/g, "").trim();

      setSvg(cleaned || "");
    } catch (error) {
      console.error("Error generating SVG:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="absolute inset-0 h-full w-full bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
    >

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 className="text-4xl text-white font-bold mb-6">Welcome to the <span className="text-green-500">SVG-fy</span></h1>

        <div className="w-[320px] relative flex-col gap-2">
          <Textarea placeholder="Enter your prompt here..."
            className="p-2 h-25" value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // prevents new line
                handleGenerate();
              }
            }} />
          <div className="flex justify-end">
            <Button
              disabled={loading}
              className="absolute cursor-pointer right-0 bottom-0 m-1 flex gap-2 items-center"
              onClick={handleGenerate}
            >
              {loading && <Loader2 className="animate-spin w-4 h-4" />}
              Generate ✨
            </Button>

          </div>
        </div>

        <div className="mt-6">
          <Canvas svg={svg} />
        </div>

        <div className="mt-6 w-full max-w-md p-4  rounded-lg shadow-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-50 text-center">
          <p>
            Not a Startup! SVG-fy is a simple SVG icon generator powered by AI.
            Explore more SVG icons at <Link className="text-green-500" href="/gallery">`SVG Gallery`</Link>
          </p>
          {/* <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </Accordion> */}
        </div>
      </div>

      <div className="absolute top-0 right-0 p-4 flex items-center gap-2">
        <SignedOut>
          <SignInButton />
          <SignUpButton>
            <Button>
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-gray-400 ">
        <p>SVG-fy</p>
        <p>Made with love ❤️</p>
      </div>
    </div>
  );
}
