
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Volume2, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlideData, FAQ } from "@/services/courseService";
import ChatBot from "./ChatBot";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface PresentationViewProps {
	slides: SlideData[];
	title: string;
	faqs: FAQ[];
	onClose: () => void;
	classId: string;
}

const PresentationView: React.FC<PresentationViewProps> = ({
	slides,
	title,
	faqs,
	onClose,
	classId,
}) => {
	const [currentSlideIndex, setCurrentSlideIndex] = useState(-1); // Start at -1 for intro slide
	const [imageLoading, setImageLoading] = useState(false);
	const [transitionDirection, setTransitionDirection] = useState<"next" | "prev" | null>(null);
	const totalSlides = slides.length + 1; // +1 for the quiz slide at the end

	useEffect(() => {
		// Reset to the intro slide when the slides prop changes
		setCurrentSlideIndex(-1);
	}, [slides]);

	const goToPreviousSlide = () => {
		setTransitionDirection("prev");
		setTimeout(() => {
			setCurrentSlideIndex((prevIndex) => Math.max(prevIndex - 1, -1));
			setTransitionDirection(null);
		}, 300);
	};

	const goToNextSlide = () => {
		setTransitionDirection("next");
		setTimeout(() => {
			setCurrentSlideIndex((prevIndex) =>
				Math.min(prevIndex + 1, slides.length)
			);
			setTransitionDirection(null);
		}, 300);
	};

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight" || e.key === " ") {
				if (currentSlideIndex < slides.length) {
					goToNextSlide();
				}
			} else if (e.key === "ArrowLeft") {
				if (currentSlideIndex > -1) {
					goToPreviousSlide();
				}
			} else if (e.key === "Escape") {
				onClose();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [currentSlideIndex, slides.length, onClose]);

	// Get current slide or null for intro slide
	const currentSlide =
		currentSlideIndex >= 0 && currentSlideIndex < slides.length 
			? slides[currentSlideIndex] 
			: null;

	// Handle image loading
	const handleImageLoad = () => {
		setImageLoading(false);
	};

	const handleImageError = () => {
		setImageLoading(false);
		console.error("Failed to load image:", currentSlide?.imageUrl);
	};

	useEffect(() => {
		if (currentSlide?.imageUrl) {
			setImageLoading(true);
		}
	}, [currentSlideIndex, currentSlide]);

	// Show keyboard shortcuts toast on mount
	useEffect(() => {
		toast({
			title: "Keyboard shortcuts",
			description: "Use arrow keys or spacebar to navigate slides. Press Esc to exit.",
			duration: 3000,
		});
	}, []);

	// Render intro slide with a better background
	const renderIntroSlide = () => {
		return (
			<div className="slide-container w-full h-full flex items-center justify-center animate-fade-in">
				<div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-800 dark:to-slate-900">
					{/* Background pattern overlay */}
					<div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center"></div>
					
					{/* Content */}
					<div className="relative px-12 py-20 text-center z-10">
						<div className="inline-block px-6 py-2 mb-8 rounded-full bg-blue-500/10 backdrop-blur-sm">
							<span className="text-blue-700 dark:text-blue-300 font-medium">Presentation</span>
						</div>
						
						<h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-white leading-tight bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
							{title}
						</h1>
						
						<div className="w-24 h-1 mx-auto my-6 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
						
						<p className="text-xl text-slate-700 dark:text-slate-200 mb-10 max-w-2xl mx-auto">
							Click "Next" to start exploring the slides in this presentation
						</p>
						
						<Button 
							onClick={goToNextSlide}
							className="mt-4 px-8 py-6 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-lg font-medium rounded-xl animate-pulse transition-all hover:scale-105"
						>
							Start Presentation
							<ChevronRight className="w-5 h-5 ml-2" />
						</Button>
					</div>
				</div>
			</div>
		);
	};

	// Render quiz slide
	const renderQuizSlide = () => {
		return (
			<div className="slide-container w-full h-full flex items-center justify-center animate-fade-in">
				<div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-800 dark:to-slate-950 text-slate-800 dark:text-white rounded-2xl overflow-hidden shadow-2xl">
					{/* Background pattern overlay */}
					<div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1516146544193-b54a65682f16?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center"></div>
					
					{/* Slide header */}
					<div className="relative bg-black/10 dark:bg-black/30 p-6 border-b border-slate-300/20 dark:border-white/10 z-10">
						<h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400">Quiz Time!</h3>
					</div>

					{/* Quiz content */}
					<div className="relative p-10 flex flex-col items-center z-10">
						<div className="text-center mb-10">
							<p className="text-3xl mb-6 text-slate-700 dark:text-slate-200 font-bold">Ready to test your knowledge?</p>
							<p className="mb-8 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
								You've completed the lesson. Now it's time to test what you've learned.
							</p>
							<div className="bg-slate-100/70 dark:bg-slate-800/70 p-8 rounded-xl mb-10 text-left backdrop-blur-sm max-w-3xl mx-auto">
								<h4 className="font-semibold mb-4 text-slate-700 dark:text-slate-200 text-xl">Before you start:</h4>
								<ul className="space-y-4 text-slate-600 dark:text-slate-300">
									<li className="flex items-start">
										<span className="inline-block w-6 h-6 bg-blue-500/40 rounded-full mr-3 flex-shrink-0 mt-1"></span>
										<span>The quiz will test your understanding of key concepts from this lesson</span>
									</li>
									<li className="flex items-start">
										<span className="inline-block w-6 h-6 bg-blue-500/40 rounded-full mr-3 flex-shrink-0 mt-1"></span>
										<span>Read each question carefully before answering</span>
									</li>
									<li className="flex items-start">
										<span className="inline-block w-6 h-6 bg-blue-500/40 rounded-full mr-3 flex-shrink-0 mt-1"></span>
										<span>You can review your answers before final submission</span>
									</li>
									<li className="flex items-start">
										<span className="inline-block w-6 h-6 bg-blue-500/40 rounded-full mr-3 flex-shrink-0 mt-1"></span>
										<span>Take your time and do your best!</span>
									</li>
								</ul>
							</div>
						</div>
						<Link to={`/quiz/${classId}`} className="animate-bounce">
							<Button 
								className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium px-10 py-6 rounded-lg flex items-center gap-3 text-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 transform-gpu"
							>
								<FileQuestion className="w-6 h-6" />
								Start Quiz
							</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	};

	// Render content slide
	const renderContentSlide = () => {
		if (!currentSlide) return null;

		return (
			<div className="slide-container w-full h-full flex items-center justify-center animate-fade-in">
				<div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-800 dark:text-white rounded-2xl overflow-hidden shadow-2xl">
					{/* Background pattern overlay */}
					<div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center"></div>
					
					{/* Slide header */}
					<div className="relative mt-6 bg-black/5 dark:bg-black/30 p-6 border-b border-slate-300/20 dark:border-white/10 z-10">
						<div className="flex justify-between items-center">
							<h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400">
								{currentSlide.title}
							</h3>
							<div className="px-3 py-1 rounded-full bg-slate-200/50 dark:bg-slate-700/50 text-sm text-slate-700 dark:text-slate-300">
								Slide {currentSlideIndex + 1} of {slides.length}
							</div>
						</div>
					</div>

					{/* Slide content */}
					<div className="relative p-8 z-10">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Content section with scrollbar - Always first on small screens */}
							<ScrollArea className="h-[350px] rounded-md border  border-slate-400/50 dark:border-slate-700/40 px-4 backdrop-blur-sm">
								<div className="py-4">
									<div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
										<div className="text-xl leading-relaxed text-slate-700 dark:text-slate-200 mb-8">
											{currentSlide.content}
										</div>
										
										{currentSlide.example && (
											<div className="mt-6 p-6 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-300/20 dark:border-slate-700/40">
												<h4 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-3">Example:</h4>
												<p className="text-slate-600 dark:text-slate-300">{currentSlide.example}</p>
											</div>
										)}
									</div>
								</div>
							</ScrollArea>
							
							{/* Image section - shown if image exists */}
							{currentSlide.imageUrl ? (
								<div className="flex items-center justify-center bg-slate-200/30 dark:bg-slate-800/30 rounded-xl p-4 backdrop-blur-sm">
									{imageLoading && (
										<div className="w-full h-[280px] flex items-center justify-center bg-slate-200/50 dark:bg-slate-800/50 rounded-lg animate-pulse">
											<p className="text-slate-600 dark:text-slate-400">Loading image...</p>
										</div>
									)}
									
									<div className="w-full overflow-hidden rounded-lg">
										<img
											src={currentSlide.imageUrl}
											alt={currentSlide.title}
											className={`w-full h-full object-contain max-h-[280px] transition-opacity duration-300 ${
												imageLoading ? 'opacity-0' : 'opacity-100'
											}`}
											onLoad={handleImageLoad}
											onError={handleImageError}
										/>
									</div>
								</div>
							) : (
								// If no image, show a placeholder with the slide's visual prompt
								<div className="hidden lg:flex flex-col justify-center bg-slate-200/30 dark:bg-slate-800/30 rounded-xl p-8 backdrop-blur-sm border border-slate-400/50 dark:border-slate-700/40">
									<h4 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Visual Reference</h4>
									<p className="text-slate-600 dark:text-slate-400 italic">{currentSlide.visualPrompt}</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderCurrentSlide = () => {
		if (currentSlideIndex === -1) {
			return renderIntroSlide();
		} else if (currentSlideIndex === slides.length) {
			return renderQuizSlide();
		} else {
			return renderContentSlide();
		}
	};

	return (
		<div className="fixed inset-0 bg-slate-900/95 z-50 flex flex-col">
			{/* Header */}
			<div className="px-6 py-4 flex items-center justify-between text-white border-b border-slate-700/40 bg-slate-900/60 backdrop-blur-sm z-10">
				<h2 className="text-lg font-semibold bg-gradient-to-r from-slate-300 to-blue-300 bg-clip-text text-transparent">
					{title}
				</h2>
				<Button 
					variant="ghost" 
					size="icon" 
					onClick={onClose}
					className="hover:bg-white/10 rounded-full transition-colors"
				>
					<X className="h-5 w-5" />
				</Button>
			</div>

			{/* Slide Content */}
			<div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
				<div 
					className={`w-full h-full transition-all duration-500 transform
						${transitionDirection === "next" ? "translate-x-[-100%] opacity-0" : ""}
						${transitionDirection === "prev" ? "translate-x-[100%] opacity-0" : ""}
					`}
				>
					{renderCurrentSlide()}
				</div>
			</div>

			{/* Navigation Controls - Centered at the bottom */}
			<div className="px-6 py-6 flex items-center justify-center gap-8 backdrop-blur-sm bg-slate-900/60 border-t border-slate-700/40 z-10">
				<Button
					variant="outline"
					onClick={goToPreviousSlide}
					disabled={currentSlideIndex === -1}
					className="px-8 bg-white/5 border-white/20 hover:bg-white/10 transition-all hover:scale-105 disabled:opacity-50"
				>
					<ChevronLeft className="w-5 h-5 mr-2" />
					Previous
				</Button>
				<span className="text-white text-sm px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
					{currentSlideIndex === -1
						? "Intro"
						: currentSlideIndex === slides.length
						? "Quiz"
						: `Slide ${currentSlideIndex + 1} of ${slides.length}`}
				</span>
				<Button
					variant={currentSlideIndex === slides.length ? "outline" : "default"}
					onClick={goToNextSlide}
					disabled={currentSlideIndex === slides.length}
					className={`px-8 transition-all hover:scale-105 ${
						currentSlideIndex === slides.length 
							? "bg-white/5 border-white/20 hover:bg-white/10 disabled:opacity-50" 
							: "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
					}`}
				>
					Next
					<ChevronRight className="w-5 h-5 ml-2" />
				</Button>
			</div>

			{/* Add ChatBot component */}
			<ChatBot faqs={faqs} />
		</div>
	);
};

export default PresentationView;
