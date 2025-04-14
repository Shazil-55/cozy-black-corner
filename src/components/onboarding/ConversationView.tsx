import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

type Message = {
	id: string;
	sender: "user" | "assistant";
	content: string;
};

interface ConversationViewProps {
	messages: Message[];
}

export const ConversationView: React.FC<ConversationViewProps> = ({
	messages,
}) => {
	const { user } = useAuth();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const userInitials = user?.name
		? user.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.substring(0, 2)
		: "U";

	// Auto-scroll to bottom when messages change with debounce
	useEffect(() => {
		// Clear any existing timeout to prevent multiple scrolls
		if (scrollTimeoutRef.current) {
			clearTimeout(scrollTimeoutRef.current);
		}

		// Set a small timeout to batch scroll operations
		scrollTimeoutRef.current = setTimeout(() => {
			if (messagesEndRef.current) {
				messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
			}
		}, 100);

		// Cleanup timeout on unmount
		return () => {
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}
		};
	}, [messages]);

	return (
		<div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4 md:p-6 overflow-hidden border border-blue-100 dark:border-gray-700 shadow-md relative">
			{/* Background decoration elements */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
				<div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800/20 rounded-full opacity-20 blur-xl"></div>
				<div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-200 dark:bg-indigo-800/20 rounded-full opacity-20 blur-xl"></div>
				<div className="absolute top-1/2 right-1/4 w-16 h-16 bg-purple-200 dark:bg-purple-800/20 rounded-full opacity-10 blur-lg"></div>
			</div>

			{/* Header with illustration */}
			<div className="relative z-10 mb-4 pb-3 border-b border-blue-100 dark:border-gray-700 flex items-center">
				<div className="flex-1">
					<h3 className="font-medium text-blue-700 dark:text-blue-300">
						Ilmee Assistant
					</h3>
					<p className="text-sm text-blue-500 dark:text-blue-400 opacity-70">
						Here to guide you through setup
					</p>
				</div>
				<div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center">
					<Bot className="h-5 w-5 text-blue-600 dark:text-blue-300" />
				</div>
			</div>

			{/* Conversation area - Add overflow-y-auto to the container instead of overflow-hidden */}
			<div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 pr-2  space-y-4 conversation-container">
				<AnimatePresence initial={false}>
					{messages.map((message, index) => (
						<motion.div
							key={message.id}
							initial={{ opacity: 0, y: 20, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							transition={{
								duration: 0.4,
								delay: Math.min(0.1 * index, 0.5),
								ease: "easeOut",
							}}
							className={cn(
								"flex",
								message.sender === "user" ? "justify-end" : "justify-start"
							)}
						>
							<div
								className={cn(
									"flex items-start gap-3 max-w-[90%] group",
									message.sender === "user" ? "flex-row-reverse" : "flex-row"
								)}
							>
								<motion.div
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{
										type: "spring",
										stiffness: 260,
										damping: 20,
										delay: Math.min(0.1 * index + 0.2, 0.7),
									}}
									className="relative"
								>
									<Avatar
										className={cn(
											"w-9 h-9 border-2 shadow-sm",
											message.sender === "user"
												? "border-blue-200 dark:border-blue-700"
												: "border-indigo-200 dark:border-indigo-700"
										)}
									>
										{message.sender === "user" ? (
											<>
												{user?.avatar ? (
													<AvatarImage src={user.avatar} alt={user.name} />
												) : (
													<AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs">
														{userInitials}
													</AvatarFallback>
												)}
											</>
										) : (
											<>
												<AvatarImage
													src="/lovable-uploads/f82deba0-84fd-43ca-a861-2e9e7abf8368.png"
													alt="Ilmee Assistant"
													className="p-1"
												/>
												<AvatarFallback className="bg-gradient-to-br from-[#1B68B3] to-blue-400 text-white text-xs p-1">
													<Bot className="h-5 w-5" />
												</AvatarFallback>
											</>
										)}
									</Avatar>

									{/* Subtle ping animation effect for the most recent message */}
									{index === messages.length - 1 && (
										<span className="absolute -top-1 -right-1 h-3 w-3">
											<span className="animate-ping absolute h-full w-full rounded-full bg-blue-400 opacity-75"></span>
											<span
												className={cn(
													"absolute h-3 w-3 rounded-full",
													message.sender === "user"
														? "bg-blue-500"
														: "bg-green-500"
												)}
											></span>
										</span>
									)}
								</motion.div>

								<motion.div
									initial={{
										opacity: 0,
										x: message.sender === "user" ? 20 : -20,
									}}
									animate={{ opacity: 1, x: 0 }}
									transition={{
										duration: 0.3,
										delay: Math.min(0.1 * index + 0.1, 0.6),
									}}
									className={cn(
										"rounded-2xl p-4 text-sm shadow-sm backdrop-blur-sm",
										message.sender === "user"
											? "bg-[#1B68B3] bg-gradient-to-br from-blue-600 to-blue-700 text-white"
											: "bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 text-gray-800 dark:text-gray-200 border border-blue-100 dark:border-gray-700"
									)}
								>
									{message.content}
								</motion.div>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
				<div ref={messagesEndRef} />

				{/* Typing indicator when no messages or as a placeholder */}
				{messages.length === 0 && (
					<div className="flex items-center gap-3 mt-4">
						<Avatar className="w-8 h-8 border-2 border-indigo-200 dark:border-indigo-700">
							<AvatarFallback className="bg-gradient-to-br from-[#1B68B3] to-blue-400 text-white text-xs">
								<Bot className="h-4 w-4" />
							</AvatarFallback>
						</Avatar>
						<div className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 rounded-xl p-3 px-4 text-sm border border-blue-100 dark:border-gray-700">
							<div className="flex items-center gap-1">
								<div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
								<div
									className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"
									style={{ animationDelay: "0.2s" }}
								></div>
								<div
									className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"
									style={{ animationDelay: "0.4s" }}
								></div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
