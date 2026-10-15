"use client";

import { useState } from "react";

interface Props {
    text: string;
    wordLimit?: number;
    className?: string;
}

export default function ExpandableText({ text, wordLimit = 60, className = "" }: Props) {
    const [expanded, setExpanded] = useState(false);

    const words = text.trim().split(/\s+/);
    const shouldTruncate = words.length > wordLimit;
    const displayText = shouldTruncate && !expanded
        ? words.slice(0, wordLimit).join(" ") + "…"
        : text;

    return (
        <div className={className}>
            <p className="text-gray-700 leading-relaxed">{displayText}</p>
            {shouldTruncate && (
                <button
                    onClick={() => setExpanded(v => !v)}
                    className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                    {expanded ? "Show Less ↑" : "Show More ↓"}
                </button>
            )}
        </div>
    );
}
