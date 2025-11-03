"use client";

import { useChatStore } from "@/store/chat";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportAsMarkdown, exportAsJSON, exportAsPDF } from "@/lib/export";
import { toast } from "sonner";

export default function ExportMenu() {
	const messages = useChatStore((state) => state.messages);

	if (messages.length === 0) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon">
					<Download className="h-5 w-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem
					onClick={() => {
						exportAsMarkdown(messages);
						toast.success("Export completed!", {
							description: "Your chat has been exported as Markdown.",
						});
					}}
				>
					Export as Markdown
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						exportAsJSON(messages);
						toast.success("Export completed!", {
							description: "Your chat has been exported as JSON.",
						});
					}}
				>
					Export as JSON
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						exportAsPDF(messages);
						toast.success("PDF export opened!", {
							description: "Your chat has been prepared for printing.",
						});
					}}
				>
					Export as PDF
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
