"use client";

import { ArrowUp } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!visible) return null;

    return (
        <Button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="group fixed bottom-6 right-6 z-50 flex h-9 w-9 items-center justify-center gap-0 overflow-hidden rounded-full ring-1 ring-primary/30 hover:w-auto hover:px-3 hover:gap-1.5 hover:shadow-primary/60 transition-all duration-300"
        aria-label="Back to top"
        >
        <ArrowUp className="h-4 w-4 shrink-0" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-medium group-hover:max-w-24 transition-all duration-300">
            Back to top
        </span>
        </Button>
    );
}
