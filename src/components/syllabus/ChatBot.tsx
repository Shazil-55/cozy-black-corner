
import React, { useState, useRef } from "react";
import { Bot, X, Send, MessageCircle, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { FAQ } from "@/services/courseService";
import { cn } from "@/lib/utils";

interface ChatBotProps {
	faqs: FAQ[];
}

type Message = {
	id: string;
	type: "bot" | "user";
	content: string;
	isQuestion?: boolean;
};

const ChatBot: React.FC<ChatBotProps> = ({ faqs }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			type: "bot",
			content:
				"Hi! I can help you with frequently asked questions about this topic. Below are the available questions:",
		},
	]);
	const [userInput, setUserInput] = useState("");
	const [activeSpeech, setActiveSpeech] = useState<SpeechSynthesisUtterance | null>(null);
	const speechSynthRef = useRef<SpeechSynthesis | null>(null);

	// Add numbers to FAQs
	const numberedFaqs = faqs.map((faq, index) => ({
		...faq,
		numberLabel: `${index + 1}. `,
	}));

	// Initialize with showing FAQs
	React.useEffect(() => {
		if (faqs.length > 0) {
			const faqListMessage = {
				id: Date.now().toString(),
				type: "bot" as const,
				content: numberedFaqs
					.map((faq) => `${faq.numberLabel}${faq.question}`)
					.join("\n\n"),
			};

			setMessages((prev) => [...prev, faqListMessage]);
		}
	}, [faqs]);

	// Initialize speech synthesis
	React.useEffect(() => {
		speechSynthRef.current = window.speechSynthesis;
		
		// Cleanup speech on unmount
		return () => {
			if (speechSynthRef.current) {
				speechSynthRef.current.cancel();
			}
		};
	}, []);

	const addMessage = (
		content: string,
		type: "bot" | "user",
		isQuestion = false
	) => {
		const newMessage: Message = {
			id: Date.now().toString(),
			type,
			content,
			isQuestion,
		};
		setMessages((prev) => [...prev, newMessage]);
	};

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!userInput.trim()) return;

		addMessage(userInput, "user");
		setUserInput("");

		// Check if user input is a number corresponding to a FAQ
		const numInput = parseInt(userInput.trim());

		if (!isNaN(numInput) && numInput > 0 && numInput <= numberedFaqs.length) {
			// User entered a number that matches a FAQ
			const selectedFaq = numberedFaqs[numInput - 1];

			// Simulate typing delay
			setTimeout(() => {
				addMessage(selectedFaq.answer, "bot");
			}, 500);
		} else {
			// Try to find a relevant FAQ by keyword matching
			const relevantFaq = findRelevantFaq(userInput);

			// Simulate typing delay
			setTimeout(() => {
				if (relevantFaq) {
					addMessage(relevantFaq.answer, "bot");
				} else {
					// Show numbered FAQ list again if no match
					addMessage(
						"I don't have specific information about that. Here are the questions I can answer:\n\n" +
							numberedFaqs
								.map((faq) => `${faq.numberLabel}${faq.question}`)
								.join("\n\n"),
						"bot"
					);
				}
			}, 500);
		}
	};

	const findRelevantFaq = (question: string): FAQ | null => {
		// Simple keyword matching - in a real app, you might use more sophisticated NLP
		const lowerQuestion = question.toLowerCase();
		return (
			numberedFaqs.find(
				(faq) =>
					faq.question.toLowerCase().includes(lowerQuestion) ||
					lowerQuestion.includes(
						faq.question.toLowerCase().split(" ").slice(0, 3).join(" ")
					)
			) || null
		);
	};

	const resetChat = () => {
		setMessages([
			{
				id: "1",
				type: "bot",
				content:
					"Hi! I can help you with frequently asked questions about this topic. Below are the available questions:",
			},
		]);

		// Add the FAQ list again after reset
		const faqListMessage = {
			id: Date.now().toString(),
			type: "bot" as const,
			content: numberedFaqs
				.map((faq) => `${faq.numberLabel}${faq.question}`)
				.join("\n\n"),
		};

		setMessages((prev) => [...prev, faqListMessage]);
	};

	const speakText = (text: string) => {
		// Cancel any active speech
		if (speechSynthRef.current) {
			speechSynthRef.current.cancel();
		}
		
		// If we already have an active speech and we're trying to speak the same text,
		// this means we want to stop the current speech
		if (activeSpeech?.text === text && speechSynthRef.current?.speaking) {
			setActiveSpeech(null);
			return;
		}

		// Create a new utterance
		const speech = new SpeechSynthesisUtterance(text);
		speech.lang = "en-US";
		speech.rate = 0.9; // slightly slower than default
		
		// Set up event handlers for the utterance
		speech.onend = () => {
			setActiveSpeech(null);
		};
		
		speech.onerror = () => {
			setActiveSpeech(null);
		};
		
		// Store the active speech and speak
		setActiveSpeech(speech);
		if (speechSynthRef.current) {
			speechSynthRef.current.speak(speech);
		}
	};

	return (
		<>
			{/* Bot Avatar Button */}
			<Button
				onClick={() => setIsOpen(true)}
				className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-primary shadow-lg hover:bg-primary/90 transition-transform hover:scale-105"
				size="icon"
			>
				<Bot className="h-7 w-7 text-white" />
			</Button>

			{/* Chat Dialog */}
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="sm:max-w-[425px] h-[600px] max-h-[80vh] p-0 overflow-hidden flex flex-col">
					<DialogHeader className="bg-primary text-white py-4 px-6 flex-shrink-0">
						<div className="flex items-center">
							<Bot className="h-6 w-6 mr-2" />
							<DialogTitle className="text-lg font-medium">
								Course Assistant
							</DialogTitle>
						</div>

						<Button
							variant="ghost"
							size="icon"
							className="absolute right-3 top-3 text-white hover:bg-primary/90 hover:text-white"
							onClick={() => setIsOpen(false)}
						>
							<X className="h-5 w-5" />
						</Button>
					</DialogHeader>

					<div className="flex-1 overflow-auto p-4 bg-gray-50">
						<div className="space-y-4">
							{messages.map((msg) => (
								<div
									key={msg.id}
									className={cn(
										"flex",
										msg.type === "user" ? "justify-end" : "justify-start"
									)}
								>
									<div
										className={cn(
											"max-w-[85%] rounded-lg px-4 py-2",
											msg.type === "user"
												? "bg-primary text-white rounded-tr-none"
												: "bg-white shadow-sm border rounded-tl-none"
										)}
									>
										{msg.type === "bot" && (
											<div className="whitespace-pre-wrap text-sm">
												{msg.content}
												{/* Add speaker icon for bot responses that aren't question lists */}
												{!msg.content.includes("Here are the questions") &&
													!msg.content.includes(
														"Below are the available questions"
													) &&
													!msg.content.startsWith("1.") && (
														<Button
															variant="ghost"
															size="icon"
															className={cn(
																"ml-1 h-6 w-6 p-1 inline-flex float-right",
																activeSpeech?.text === msg.content ? "text-accent" : ""
															)}
															onClick={() => speakText(msg.content)}
														>
															<Volume2 className="h-4 w-4" />
														</Button>
													)}
											</div>
										)}
										{msg.type === "user" && (
											<p className="text-sm">{msg.content}</p>
										)}
									</div>
								</div>
							))}
						</div>
					</div>

					<form
						onSubmit={handleSendMessage}
						className="p-4 border-t flex items-center gap-2 bg-white"
					>
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={resetChat}
							className="flex-shrink-0"
						>
							<MessageCircle className="h-5 w-5" />
						</Button>
						<input
							type="text"
							value={userInput}
							onChange={(e) => setUserInput(e.target.value)}
							placeholder="Type a message or FAQ number..."
							className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
						/>
						<Button type="submit" size="icon" disabled={!userInput.trim()}>
							<Send className="h-5 w-5" />
						</Button>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ChatBot;
