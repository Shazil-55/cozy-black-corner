import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ConversationView } from "@/components/onboarding/ConversationView";
import { OptionCard } from "@/components/onboarding/OptionCard";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight } from "lucide-react";

const goals = [
	"Train employees",
	"Train customers",
	"Train partners",
	"Provide training services",
	"Sell courses",
	"Teach students",
	"Other",
];

const Step1Goals: React.FC = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
	const [messages, setMessages] = useState<any[]>([]);
	const messagesInitializedRef = useRef(false);

	useEffect(() => {
		// Only add initial messages once using a ref
		if (messagesInitializedRef.current) return;
		messagesInitializedRef.current = true;

		// Initial messages with staggered appearance
		const initialMessages = [
			{
				id: "1",
				sender: "assistant",
				content: `Welcome aboard${
					user?.name ? `, ${user.name}` : ""
				}! I'm excited to help you get started with Ilmee.`,
			},
			{
				id: "2",
				sender: "assistant",
				content:
					"Let's customize your learning platform to perfectly match your needs.",
			},
			{
				id: "3",
				sender: "assistant",
				content:
					"What are your three main goals with Ilmee? Please select them in order of priority.",
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
					content: "Sure, I'll select my main goals now.",
				},
			]);
		}, delay);
	}, [user]);

	const handleSelectGoal = (goal: string) => {
		let newSelectedGoals = [...selectedGoals];

		// If already selected, remove it
		if (selectedGoals.includes(goal)) {
			newSelectedGoals = newSelectedGoals.filter((g) => g !== goal);
		}
		// If not selected and we have less than 3 goals, add it
		else if (selectedGoals.length < 3) {
			newSelectedGoals.push(goal);

			// Add user message
			if (newSelectedGoals.length === 1) {
				setMessages((prev) => [
					...prev,
					{
						id: Date.now().toString(),
						sender: "user",
						content: `I'll select ${goal} as my top priority.`,
					},
				]);

				// Assistant acknowledges the choice after a delay
				setTimeout(() => {
					setMessages((prev) => [
						...prev,
						{
							id: Date.now().toString() + "-assistant",
							sender: "assistant",
							content: `Great choice! ${goal} is an excellent primary focus. What's your second priority?`,
						},
					]);
				}, 500);
			} else if (newSelectedGoals.length === 2) {
				setMessages((prev) => [
					...prev,
					{
						id: Date.now().toString(),
						sender: "user",
						content: `My second priority is ${goal}.`,
					},
				]);

				// Assistant acknowledges the second choice after a delay
				setTimeout(() => {
					setMessages((prev) => [
						...prev,
						{
							id: Date.now().toString() + "-assistant",
							sender: "assistant",
							content: `${goal} is a solid choice! And finally, what's your third priority?`,
						},
					]);
				}, 500);
			} else if (newSelectedGoals.length === 3) {
				setMessages((prev) => [
					...prev,
					{
						id: Date.now().toString(),
						sender: "user",
						content: `My third priority is ${goal}.`,
					},
				]);

				// Assistant provides a summary after all three selections
				setTimeout(() => {
					setMessages((prev) => [
						...prev,
						{
							id: Date.now().toString() + "-assistant",
							sender: "assistant",
							content: `Perfect! Now I have a good understanding of your priorities: 1. ${newSelectedGoals[0]}, 2. ${newSelectedGoals[1]}, and 3. ${goal}. This will help us tailor your experience.`,
						},
					]);
				}, 500);
			}
		}
		// If trying to select more than 3, show toast
		else {
			toast.error("You can only select up to 3 goals");
			return;
		}

		setSelectedGoals(newSelectedGoals);
	};

	const handleNext = () => {
		if (selectedGoals.length === 0) {
			toast.error("Please select at least one goal to continue");
			return;
		}

		// Show a final message before navigating
		setMessages((prev) => [
			...prev,
			{
				id: Date.now().toString(),
				sender: "assistant",
				content:
					"Great! Let's move on to the next step to learn more about your needs.",
			},
		]);

		// Save goals to localStorage
		localStorage.setItem("onboardingGoals", JSON.stringify(selectedGoals));

		// Also save first goal as main goal
		if (selectedGoals.length > 0) {
			localStorage.setItem("onboardingMainGoal", selectedGoals[0]);
		}

		// Navigate to the next step with a slight delay for the message to be visible
		setTimeout(() => {
			navigate("/onboarding/step2");
		}, 1000);
	};

	const getGoalNumber = (goal: string) => {
		const index = selectedGoals.indexOf(goal);
		return index !== -1 ? index + 1 : undefined;
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
		<OnboardingLayout currentStep={0} totalSteps={3}>
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

				{/* Right side - Goal selection */}
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
							What are your three main goals with Ilmee?
						</motion.h2>
						<motion.p
							variants={itemVariants}
							className="text-gray-600 dark:text-gray-400 mb-6"
						>
							Select goals based on your priority, with the first choice being
							top priority.
						</motion.p>

						<motion.div
							variants={containerVariants}
							className="grid grid-cols-1 sm:grid-cols-2 gap-4"
						>
							{goals.map((goal) => (
								<motion.div key={goal} variants={itemVariants}>
									<OptionCard
										title={goal}
										isSelected={selectedGoals.includes(goal)}
										onClick={() => handleSelectGoal(goal)}
										number={getGoalNumber(goal)}
									/>
								</motion.div>
							))}
						</motion.div>

						<motion.div
							variants={itemVariants}
							className="mt-8 flex justify-end"
						>
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

export default Step1Goals;
