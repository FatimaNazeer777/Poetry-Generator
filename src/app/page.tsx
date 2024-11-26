"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  BookOpen,
  HeartHandshake,
  Moon,
  Sparkles,
  Stars,
  Feather,
  Music,
  ScrollText,
  Heart,
  PartyPopper,
  Palette,
  RefreshCcw,
  ArrowRight,
} from "lucide-react";

// Floating Elements Component
const FloatingElements: React.FC = () => {
  const [elements, setElements] = useState<
    { id: number; style: React.ReactNode }[]
  >([]);

  useEffect(() => {
    const newElements = [...Array(15)].map((_, i) => ({
      id: i,
      style:
        i % 3 === 0 ? (
          <Feather className="w-6 h-6 text-purple-300/40" />
        ) : i % 3 === 1 ? (
          <Stars className="w-4 h-4 text-yellow-300/40" />
        ) : (
          <Music className="w-5 h-5 text-pink-300/40" />
        ),
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {elements.map(({ id, style }) => (
        <div
          key={id}
          className="absolute animate-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          {style}
        </div>
      ))}
    </div>
  );
};

// Magic Circle Animation
const MagicCircle: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="relative w-64 h-64">
      <div className="absolute inset-0 border-2 border-purple-500/20 rounded-full animate-spin-slow" />
      <div className="absolute inset-0 border-2 border-pink-500/20 rounded-full animate-spin-reverse" />
      <div className="absolute inset-0 border-2 border-yellow-500/20 rounded-full animate-pulse" />
    </div>
  </div>
);

// Typewriter effect component
interface TypeWriterProps {
  text: string;
  speed?: number;
}

const TypeWriter: React.FC<TypeWriterProps> = ({ text, speed = 50 }) => {
  const [displayText, setDisplayText] = useState<string>("");

  useEffect(() => {
    let currentIndex = 0;
    setDisplayText("");

    const intervalId = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return (
    <span>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Theme options
type ThemeKey = "mystical" | "sunset" | "moonlight";

const themes: Record<
  ThemeKey,
  { background: string; primary: string; accent: string }
> = {
  mystical: {
    background: "from-purple-800 via-pink-800 to-yellow-800",
    primary:
      "bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 hover:bg-gradient-to-l",
    accent: "text-purple-100",
  },
  sunset: {
    background: "from-orange-800 via-red-800 to-pink-800",
    primary:
      "bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:bg-gradient-to-l",
    accent: "text-orange-100",
  },
  moonlight: {
    background: "from-blue-800 via-indigo-800 to-purple-800 ",
    primary:
      "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple -600 hover:bg-gradient-to-l",
    accent: "text-blue-100",
  },
};

// Poetry styles
type PoetryStyleKey =
  | "classical"
  | "modern"
  | "romantic"
  | "spiritual"
  | "celebrate";

const poetryStyles: Record<
  PoetryStyleKey,
  { icon: JSX.Element; name: string }
> = {
  classical: { icon: <ScrollText />, name: "Classical" },
  modern: { icon: <Palette />, name: "Modern" },
  romantic: { icon: <Heart />, name: "Romantic" },
  spiritual: { icon: <Moon />, name: "Spiritual" },
  celebrate: { icon: <PartyPopper />, name: "Celebrate" },
};

const MagicalPoetryExperience: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>("portal");
  const [theme, setTheme] = useState<ThemeKey>("mystical");
  const [mood, setMood] = useState<string>("");
  const [style, setStyle] = useState<PoetryStyleKey | "">("");
  const [poem, setPoem] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handlePageTransition = (newPage: string) => {
    setCurrentPage(newPage);
  };

  const generatePoetry = async () => {
    if (!mood) {
      setError("Please describe your mood first");
      return;
    }
    if (!style) {
      setError("Please select a poetry style");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/poetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, style }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setPoem(data.poem);
      handlePageTransition("enchantment");
    } catch (error: unknown) {
      console.error("API Error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred while generating poetry.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (poem) {
      navigator.clipboard
        .writeText(poem)
        .then(() => {
          alert("Poetry copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  // Portal Page
  const renderPortalPage = () => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-violet-900 via-indigo-900 to-blue-900">
      <Card className="w-full max-w-lg bg-black/90 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <CardTitle className={`text-4xl font-bold ${themes[theme].accent}`}>
            <TypeWriter text="✨ Urdu Poetry Portal ✨" />
          </CardTitle>
          <p className="text-gray-400">Step into a world of magical verses</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(themes).map(([key]) => (
              <Button
                key={key}
                variant={theme === key ? "default" : "outline"}
                className={theme === key ? themes[key].primary : ""}
                onClick={() => setTheme(key as ThemeKey)}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Button>
            ))}
          </div>
          <div className="flex justify-center">
            <Sparkles
              className={`w-16 h-16 ${themes[theme].accent} animate-float`}
            />
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button
            className={`w-full ${themes[theme].primary}`}
            onClick={() => handlePageTransition("journey")}
          >
            Begin Magical Journey
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  // Journey Page
  const renderJourneyPage = () => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
      <Card className="w-full max-w-2xl bg-gradient-to-r from-violet-900 via-indigo-900 to-blue-900 backdrop-blur-none shadow-none">
        <CardHeader>
          <CardTitle
            className={`flex items-center gap-2 text-3xl ${themes[theme].accent}`}
          >
            <HeartHandshake className="w-8 h-8" />
            <TypeWriter text="Choose Your Path" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <p className="text-gray-400">Express your current state of mind</p>
            <Input
              placeholder="Describe your mood..."
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="text-center"
            />
          </div>
          <div className="space-y-4">
            <p className="text-gray-400">Select your desired poetry style</p>
            <div className="grid grid-cols-2 sm:md:grid-cols-3 gap-4">
              {Object.entries(poetryStyles).map(([key, { icon, name }]) => (
                <Button
                  key={key}
                  variant={style === key ? "default" : "outline"}
                  className={`${
                    style === key ? "bg-purple-600" : ""
                  } px-16 sm:px-0 md:px-0`}
                  onClick={() => setStyle(key as PoetryStyleKey)}
                >
                  <span className="mr-2">{icon}</span>
                  {name}
                </Button>
              ))}
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => handlePageTransition("portal")}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={generatePoetry}
            disabled={isLoading}
            className={`flex-1 ${themes[theme].primary}`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <BookOpen className="w-4 h-4 mr-2" />
            )}
            Create Magic
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  // Enchantment Page
  const renderEnchantmentPage = () => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-teal-800 via-purple-400 to-blue-800">
      <Card className="w-full max-w-3xl bg-black/90 backdrop-blur-sm shadow-2xl">
        <CardHeader>
          <CardTitle
            className={`flex items-center gap-2 ${themes[theme].accent}`}
          >
            <Sparkles className="w-6 h-6" />
            <TypeWriter text="Your Enchanted Verses" speed={100} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative p-8 rounded-lg bg-gradient-to-r from-purple-800 to-pink-400">
            {!poem && <MagicCircle />}
            <div className="relative z-10">
              <pre className="font-poetry text-xl text-gray-200 whitespace-pre-wrap leading-relaxed rtl">
                <TypeWriter text={poem || ""} speed={70} />
              </pre>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button
            variant="outline"
            onClick={copyToClipboard}
            className="flex-1"
          >
            Copy Poetry
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageTransition("journey")}
            className="flex-1"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Create Another
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <>
      {currentPage === "portal" && renderPortalPage()}
      {currentPage === "journey" && renderJourneyPage()}
      {currentPage === "enchantment" && renderEnchantmentPage()}
      <FloatingElements />
    </>
  );
};

export default MagicalPoetryExperience;
