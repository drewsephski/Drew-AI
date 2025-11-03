import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export const metadata: Metadata = {
	title: "Drew - your friendly AI.",
	description:
		"Drew is a friendly AI that can help you with your questions. It allows your to switch between different models and chat with them for free.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider attribute="class" defaultTheme="light">
					{children}
					<Toaster
						richColors
						position="top-center"
						theme="system"
						duration={3000}
					/>
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	);
}
