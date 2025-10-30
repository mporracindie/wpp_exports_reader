"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

interface ThemeSwitcherProps {
  variant?: "default" | "header";
  className?: string;
}

export function ThemeSwitcher({ variant = "default", className }: ThemeSwitcherProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant={variant === "header" ? "ghost" : "outline"}
        size="icon"
        className={cn(
          variant === "header" ? "text-white hover:bg-white/10" : "rounded-full",
          "opacity-0",
          className
        )}
        aria-label="Toggle theme"
        disabled
      >
        <div className="w-5 h-5" />
      </Button>
    );
  }

  if (variant === "header") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className={cn("text-white hover:bg-white/10", className)}
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={cn("rounded-full", className)}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </Button>
  );
}

