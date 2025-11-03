"use client";

import { ChatInput } from "@/components/widgets/chat-input";
import { Chat } from "@/components/chat";
import Link from "next/link";
import ThemeSwitcher from "@/components/theme-switchr";
import ExportMenu from "@/components/export-menu";

export default function Home() {
	const handleSuggestionClick = (text: string) => {
		// This will be handled by ChatInput component via prop
		// We need to pass this down through state management or props
		window.dispatchEvent(new CustomEvent("suggestion-click", { detail: text }));
	};

	return (
		<div className="h-screen w-[97%] md:w-[60%] relative mx-auto items-center !pb-4 flex flex-col">
			<h1 className="italic text-3xl fraunces w-full flex justify-between pt-4 sm:fixed left-6 items-center select-none sm:px-0 px-4 pb-3">
				<span className="!text-[#5e7e5f] dark:!text-white/85">Drew</span>

				<div className="sm:fixed right-6 flex gap-3">
					<ExportMenu />
					<ThemeSwitcher />
				</div>
			</h1>
			<Chat onSuggestionClick={handleSuggestionClick} />
			<ChatInput />
		</div>
	);
}
