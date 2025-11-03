import { create } from "zustand";
import type { ChatMessage } from "@/lib/openai";
import { nanoid } from "nanoid";

type ChatMode = "chat";
type ModelType = string;

type ChatStore = {
	messages: ChatMessage[];
	input: string;
	setInput: (input: string) => void;
	addMessage: (
		content: string,
		role: ChatMessage["role"],
		model: string,
	) => void;
	updateLastMessage: (content: string) => void;
	updateMessage: (id: string, content: string) => void;
	isStreaming: boolean;
	setIsStreaming: (streaming: boolean) => void;
	mode: ChatMode;
	setMode: (mode: ChatMode) => void;
	model: ModelType;
	setModel: (model: ModelType) => void;
	isReading: boolean;
	stopReading: () => void;
	voice: SpeechSynthesisVoice | null;
	setVoice: (voice: SpeechSynthesisVoice) => void;
	voiceRate: number;
	setVoiceRate: (rate: number) => void;
	voicePitch: number;
	setVoicePitch: (pitch: number) => void;
	retryMessage: (
		messageId: string,
		abortController: AbortController,
	) => Promise<void>;
};

export const useChatStore = create<ChatStore>((set) => ({
	messages: [],
	input: "",
	setInput: (input) => set({ input }),
	addMessage: (content, role, model) =>
		set((state) => ({
			messages: [
				...state.messages,
				{
					id: nanoid(),
					content,
					role,
					model,
				},
			],
		})),
	updateLastMessage: (content) =>
		set((state) => {
			const lastMessageIndex = state.messages.length - 1;
			if (lastMessageIndex < 0) return state; // No messages yet

			const updatedMessages = [...state.messages];
			updatedMessages[lastMessageIndex] = {
				...updatedMessages[lastMessageIndex],
				content: content,
			};

			return { ...state, messages: updatedMessages };
		}),
	updateMessage: (id, content) =>
		set((state) => {
			const updatedMessages = state.messages.map((message) =>
				message.id === id ? { ...message, content } : message,
			);
			return { ...state, messages: updatedMessages };
		}),
	retryMessage: async (messageId, abortController) => {
		// First, get the current state
		const state = useChatStore.getState();
		const messageIndex = state.messages.findIndex((m) => m.id === messageId);

		if (messageIndex === -1) return;

		const message = state.messages[messageIndex];
		const previousMessage = state.messages[messageIndex - 1];

		if (!previousMessage || previousMessage.role !== "user") return;

		// Get all messages up to and including the user message that preceded this assistant message
		const messagesUpToUser = state.messages.slice(0, messageIndex);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message: previousMessage.content,
					mode: state.mode,
					model: state.model,
					messages: messagesUpToUser,
				}),
				signal: abortController.signal,
			});

			if (!response.ok) {
				const errData = await response.json();
				throw new Error(errData?.error || `HTTP Error: ${response.status}`);
			}

			const reader = response.body?.getReader();
			const decoder = new TextDecoder();
			let accumulatedText = "";

			try {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					const chunk = decoder.decode(value, { stream: true });
					accumulatedText += chunk;
					useChatStore.getState().updateMessage(messageId, accumulatedText);
				}
			} catch (error) {
				console.error("Streaming error:", error);
			}
		} catch (error) {
			if (error instanceof Error && error.name === "AbortError") return;
			console.error("Retry Error:", error);
			useChatStore
				.getState()
				.updateMessage(
					messageId,
					`Sorry, something went wrong!\n\n\`\`\`bash\n${error}\n\`\`\`\n`,
				);
		}
	},
	isStreaming: false,
	setIsStreaming: (streaming) => set({ isStreaming: streaming }),
	mode: "chat", // Default mode is chat
	setMode: (mode) => set({ mode: mode }),
	model: "openai/gpt-oss-20b:free", // Default model
	setModel: (model) => set({ model: model }),
	isReading: false,
	stopReading: () => {
		window.speechSynthesis.cancel();
		set({ isReading: false });
	},
	voice: null,
	setVoice: (voice) => set({ voice }),
	voiceRate: 1,
	setVoiceRate: (rate) => set({ voiceRate: rate }),
	voicePitch: 1,
	setVoicePitch: (pitch) => set({ voicePitch: pitch }),
}));
