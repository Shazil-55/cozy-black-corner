import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { ConversationView } from "@/components/onboarding/ConversationView";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { IndustryPanel } from "@/components/onboarding/IndustryPanel";
import { OnboardingNavigation } from "@/components/onboarding/OnboardingNavigation";
import { industries } from "@/constants/industries";
import { userService } from "@/services/userService";
import { useOnboarding } from "@/context/OnboardingContext";
import { useAuth } from "@/context/AuthContext";

const Step3Industry: React.FC = () => {
	const navigate = useNavigate();
	const [industry, setIndustry] = useState<string>("");
	const [messages, setMessages] = useState<any[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { completeOnboarding } = useOnboarding();
	const { user } = useAuth();
	const messagesInitializedRef = useRef(false);

	useEffect(() => {
		// Only add initial messages once using a ref
		if (messagesInitializedRef.current) return;
		messagesInitializedRef.current = true;

		// Get user range from localStorage
		const userRange =
			localStorage.getItem("onboardingUserRange") || "your users";

		// Initial messages
		const initialMessages = [
			{
				id: "1",
				sender: "assistant",
				content: `Thanks for sharing your user scale! Having ${userRange} users will help us optimize your platform accordingly.`,
			},
			{
				id: "2",
				sender: "assistant",
				content: "One last question to complete your setup.",
			},
			{
				id: "3",
				sender: "assistant",
				content: "What industry does your organization operate in?",
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
					content: "Let me select our industry.",
				},
			]);
		}, delay);
	}, []);

	const handleSelectIndustry = (value: string) => {
		setIndustry(value);

		// Add message to conversation
		setMessages((prev) => [
			...prev,
			{
				id: Date.now().toString(),
				sender: "user",
				content: `Our organization operates in the ${value} industry.`,
			},
		]);

		// Assistant responds after a slight delay
		setTimeout(() => {
			setMessages((prev) => [
				...prev,
				{
					id: Date.now().toString() + "-assistant",
					sender: "assistant",
					content: `Excellent! The ${value} industry has unique learning needs that our platform is well-equipped to handle.`,
				},
			]);
		}, 500);
	};

	const handleFinish = async () => {
		if (!industry) {
			toast.error("Please select your industry to continue");
			return;
		}

		setIsSubmitting(true);

		// Save industry to localStorage
		localStorage.setItem("onboardingIndustry", industry);

		// Add final messages
		setMessages((prev) => [
			...prev,
			{
				id: Date.now().toString(),
				sender: "assistant",
				content: "Perfect! I have all the information I need now.",
			},
			{
				id: Date.now().toString() + "1",
				sender: "assistant",
				content:
					"Your Ilmee account is now fully set up and customized for your needs. Welcome aboard!",
			},
		]);

		try {
			// Get data from previous onboarding steps
			const savedGoals = localStorage.getItem("onboardingGoals");
			const portalUsers = localStorage.getItem("onboardingUserRange") || "";

			// Parse savedGoals as an array or use the first goal if only mainGoal is available
			const mainGoal = savedGoals
				? JSON.parse(savedGoals)
				: localStorage.getItem("onboardingMainGoal")
				? [localStorage.getItem("onboardingMainGoal")]
				: [];

			// Call the API to update user information
			await userService.updateUser({
				mainGoal,
				portalUsers,
				industry,
			});

			// Mark onboarding as complete
			completeOnboarding();

			// Navigate to dashboard page after a brief delay
			setTimeout(() => {
				setIsSubmitting(false);
				navigate("/");
				toast.success("Welcome to your dashboard!");
			}, 2000);
		} catch (error: any) {
			console.error("Failed to update user information:", error);
			setIsSubmitting(false);
			toast.error(
				error.response?.data?.message || "Failed to update user information"
			);
		}
	};

	const handleBack = () => {
		navigate("/onboarding/step2");
	};

	return (
		<OnboardingLayout currentStep={2} totalSteps={3}>
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

				{/* Right side - Industry selection */}
				<IndustryPanel
					industry={industry}
					onSelectIndustry={handleSelectIndustry}
					industries={industries}
				>
					<OnboardingNavigation
						onBack={handleBack}
						onNext={handleFinish}
						nextButtonText="Complete Setup"
						isSubmitting={isSubmitting}
						isNextDisabled={!industry}
					/>
				</IndustryPanel>
			</div>
		</OnboardingLayout>
	);
};

export default Step3Industry;
