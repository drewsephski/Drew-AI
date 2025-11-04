"use client";

import { cn } from "@/lib/utils";
import type React from "react";
import { Button } from "./button";

type SuggestionsProps = {
	children: React.ReactNode;
	className?: string;
};

type SuggestionProps = {
	suggestion: string;
	onClick: (text: string) => void;
	className?: string;
};

export function Suggestions({ children, className }: SuggestionsProps) {
	return (
		<div
			className={cn(
				"flex flex-wrap gap-2 w-full justify-center px-4",
				className,
			)}
		>
			{children}
		</div>
	);
}

export function Suggestion({
	suggestion,
	onClick,
	className,
}: SuggestionProps) {
	return (
		<Button
			onClick={() => onClick(suggestion)}
			className={cn(
				// Base styling to match your chat interface
				"px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
				"bg-[#e5f0df] hover:bg-[#d5e8cf] active:bg-[#c5e0bf]",
				"dark:bg-emerald-900/50 dark:hover:bg-emerald-900/70 dark:active:bg-emerald-900/90",
				"border border-[#899c8d] dark:border-white/10",
				"text-[#435346] dark:text-white/85 hover:text-[#5e7e5f] dark:hover:text-white",
				"hover:shadow-sm active:shadow-none",
				"focus:outline-none focus:ring-2 focus:ring-[#899c8d] focus:ring-opacity-50",
				"dark:focus:ring-white/20",
				// Typography matching your existing design
				"bricolage-grotesque",
				className,
			)}
			type="button"
		>
			{suggestion}
		</Button>
	);
}
