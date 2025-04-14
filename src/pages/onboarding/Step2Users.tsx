import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ConversationView } from "@/components/onboarding/ConversationView";
import { OptionCard } from "@/components/onboarding/OptionCard";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft } from "lucide-react";

const userRanges = [
	"1-10",
	"11-50",
	"51-200",
	"201-500",
	"501-1000",
	"1001-5000",
	"10001+",
];

const Step2Users: React.FC = () => {
	const navigate = useNavigate();
	const [selectedUserRange, setSelectedUserRange] = useState<string | null>(
		null
	);
	const [messages, setMessages] = useState<any[]>([]);
	const messagesInitializedRef = useRef(false);

	useEffect(() => {
		// Only add initial messages once using a ref
		if (messagesInitializedRef.current) return;
		messagesInitializedRef.current = true;

		// Get goals from localStorage
		const goals = JSON.parse(localStorage.getItem("onboardingGoals") || "[]");
		const primaryGoal = goals.length > 0 ? goals[0] : "your goals";

		// Initial messages
		const initialMessages = [
			{
				id: "1",
				sender: "assistant",
				content: `Thanks for sharing your goals! Understanding that ${primaryGoal} is your top priority helps us customize your experience.`,
			},
			{
				id: "2",
				sender: "assistant",
				content: "Now, I'd like to know about the scale of your operations.",
			},
			{
				id: "3",
				sender: "assistant",
				content: "How many users will be using your learning portal?",
			},
		];

		// Add messages with delay
		let delay = 0;
		initialMessages.forEach((message) => {
			setTimeout(() => {
				setMessages((prev) => [...prev, message]);
			}, delay);
			delay += 600;
		});

		// After all assistant messages appear, add the user response
		setTimeout(() => {
			setMessages((prev) => [
				...prev,
				{
					id: "4",
					sender: "user",
					content:
						"Let me share the expected number of users for our platform.",
				},
			]);
		}, delay);
	}, []);

	const handleSelectUserRange = (range: string) => {
		setSelectedUserRange(range);

		// Add message to conversation
		setMessages((prev) => [
			...prev,
			{
				id: Date.now().toString(),
				sender: "user",
				content: `We'll have about ${range} users on our portal.`,
			},
		]);

		// Assistant responds after a slight delay
		setTimeout(() => {
			setMessages((prev) => [
				...prev,
				{
					id: Date.now().toString() + "-assistant",
					sender: "assistant",
					content: `Great! That helps me understand the scale of your operation. ${getScaleMessage(
						range
					)}`,
				},
			]);
		}, 500);
	};

	// Helper function to provide context-aware responses
	const getScaleMessage = (range: string) => {
		const numRange = range.split("-").map((n) => parseInt(n, 10));
		const lowerBound = numRange[0];

		if (range === "10001+" || lowerBound > 1000) {
			return "You're looking at an enterprise-scale deployment. We'll ensure the system is optimized for high performance.";
		} else if (lowerBound >= 201) {
			return "That's a substantial user base. Our platform scales well for organizations of your size.";
		} else if (lowerBound >= 51) {
			return "A mid-sized implementation. This is a sweet spot for our platform's collaboration features.";
		} else {
			return "A focused team size. Our platform works great for smaller groups with tight collaboration needs.";
		}
	};

	const handleNext = () => {
		if (!selectedUserRange) {
			toast.error("Please select a user range to continue");
			return;
		}

		// Show a final message before navigating
		setMessages((prev) => [
			...prev,
			{
				id: Date.now().toString(),
				sender: "assistant",
				content: "Perfect! Just one more step to complete your profile.",
			},
		]);

		// Save user range to localStorage
		localStorage.setItem("onboardingUserRange", selectedUserRange);

		// Navigate to the next step with a slight delay for the message to be visible
		setTimeout(() => {
			navigate("/onboarding/step3");
		}, 1000);
	};

	const handleBack = () => {
		navigate("/onboarding/step1");
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				delayChildren: 0.3,
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: { y: 0, opacity: 1 },
	};

	return (
		<OnboardingLayout currentStep={1} totalSteps={3}>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Left side - Conversation */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className="h-[600px]"
				>
					<ConversationView messages={messages} />
				</motion.div>

				{/* Right side - User range selection */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
				>
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
					>
						<motion.h2
							variants={itemVariants}
							className="text-2xl font-semibold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
						>
							How many users will use your portal?
						</motion.h2>
						<motion.p
							variants={itemVariants}
							className="text-gray-600 dark:text-gray-400 mb-6"
						>
							Select the range that best represents your expected number of
							users.
						</motion.p>

						<motion.div
							variants={containerVariants}
							className="grid grid-cols-2 md:grid-cols-4 gap-4"
						>
							{userRanges.map((range) => (
								<motion.div key={range} variants={itemVariants}>
									<OptionCard
										key={range}
										title={range}
										isSelected={selectedUserRange === range}
										onClick={() => handleSelectUserRange(range)}
									/>
								</motion.div>
							))}
						</motion.div>

						<motion.div
							variants={itemVariants}
							className="mt-8 flex justify-between"
						>
							<Button
								variant="outline"
								onClick={handleBack}
								className="px-6 gap-2 border-gray-300 dark:border-gray-600"
							>
								<ArrowLeft className="h-4 w-4" />
								Back
							</Button>

							<Button
								onClick={handleNext}
								className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 gap-2 text-white"
							>
								Next
								<ArrowRight className="h-4 w-4" />
							</Button>
						</motion.div>
					</motion.div>
				</motion.div>
			</div>
		</OnboardingLayout>
	);
};

export default Step2Users;
