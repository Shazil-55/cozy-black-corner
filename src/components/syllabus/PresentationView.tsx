
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlideData, FAQ } from "@/services/courseService";
import ChatBot from "./ChatBot";

export interface PresentationViewProps {
	slides: SlideData[];
	title: string;
	faqs: FAQ[];
	onClose: () => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({
	slides,
	title,
	faqs,
	onClose,
}) => {
	const [currentSlideIndex, setCurrentSlideIndex] = useState(-1); // Start at -1 for intro slide
	const [imageLoading, setImageLoading] = useState(false);

	useEffect(() => {
		// Reset to the intro slide when the slides prop changes
		setCurrentSlideIndex(-1);
	}, [slides]);

	const goToPreviousSlide = () => {
		setCurrentSlideIndex((prevIndex) => Math.max(prevIndex - 1, -1));
	};

	const goToNextSlide = () => {
		setCurrentSlideIndex((prevIndex) =>
			Math.min(prevIndex + 1, slides.length - 1)
		);
	};

	// Get current slide or null for intro slide
	const currentSlide = currentSlideIndex >= 0 ? slides[currentSlideIndex] : null;

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

	// Render intro slide
	const renderIntroSlide = () => {
		return (
			<div className="flex items-center justify-center h-full">
				<div 
					className="w-full h-full bg-cover bg-center relative"
					style={{ backgroundImage: `url(/firstSlide.png)` }}
				>
					<div className="absolute inset-0 bg-[#01304b]/80 flex flex-col items-center justify-center text-white p-8">
						<h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">{title}</h1>
						<p className="text-xl md:text-2xl text-center">
							Click "Next" to begin the presentation
						</p>
					</div>
				</div>
			</div>
		);
	};

	// Render content slide
	const renderContentSlide = () => {
		if (!currentSlide) return null;
		
		return (
			<div className="bg-[#01304b] text-white rounded-lg overflow-hidden w-full max-w-6xl mx-auto">
				{/* Slide header */}
				<div className="bg-[#01304b]/80 p-4 border-b border-white/10">
					<h3 className="text-2xl font-bold">{currentSlide.title}</h3>
				</div>
				
				{/* Slide content */}
				<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Image section on right (or top on mobile) */}
					<div className={`flex flex-col ${currentSlide.imageUrl ? 'md:order-2' : 'md:col-span-2'}`}>
						{currentSlide.imageUrl && (
							<div className="h-64 md:h-full flex items-center justify-center p-2 bg-white/5 rounded-lg">
								{imageLoading && (
									<div className="w-full h-48 bg-gray-700 rounded-md animate-pulse flex items-center justify-center">
										<span className="text-gray-300">Loading image...</span>
									</div>
								)}
								<img
									src={currentSlide.imageUrl}
									alt={currentSlide.title}
									className={`max-w-full max-h-full rounded-md object-contain ${
										imageLoading ? "hidden" : "block"
									}`}
									onLoad={handleImageLoad}
									onError={handleImageError}
								/>
							</div>
						)}
					</div>
					
					{/* Content section */}
					<div className={`flex-1 ${currentSlide.imageUrl ? 'md:order-1' : 'md:col-span-2'}`}>
						<div className="text-lg leading-relaxed">
							{currentSlide.content}
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
			{/* Header */}
			<div className="px-6 py-4 flex items-center justify-between text-white">
				<h2 className="text-lg font-semibold">{title}</h2>
				<Button variant="ghost" size="icon" onClick={onClose}>
					<X className="h-5 w-5" />
				</Button>
			</div>

			{/* Slide Content */}
			<div className="flex-1 flex items-center justify-center p-4">
				{currentSlideIndex === -1 
					? renderIntroSlide() 
					: renderContentSlide()}
			</div>

			{/* Navigation Controls - Centered at the bottom */}
			<div className="px-6 py-8 flex items-center justify-center gap-8">
				<Button
					variant="secondary"
					onClick={goToPreviousSlide}
					disabled={currentSlideIndex === -1}
					className="px-8"
				>
					<ChevronLeft className="w-5 h-5 mr-2" />
					Previous
				</Button>
				<span className="text-white text-sm">
					{currentSlideIndex === -1 
						? "Intro" 
						: `Slide ${currentSlideIndex + 1} of ${slides.length}`}
				</span>
				<Button
					variant="secondary"
					onClick={goToNextSlide}
					disabled={currentSlideIndex === slides.length - 1}
					className="px-8"
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
