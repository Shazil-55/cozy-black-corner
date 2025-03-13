import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Award, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { courseService, QuizQuestionWithOptions } from "@/services/courseService";

const Quiz: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  
  // Fetch quiz questions from API
  const { data: questions, isLoading, error } = useQuery({
    queryKey: ['quizQuestions', classId],
    queryFn: () => courseService.getQuizQuestions(classId || ''),
    enabled: !!classId,
  });

  // Timer for the quiz
  React.useEffect(() => {
    if (!isSubmitted && questions && questions.length > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [questions, isSubmitted]);
  
  // Format time (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle option selection
  const handleSelectOption = (questionId: number, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Calculate score and submit quiz
  const handleSubmitQuiz = () => {
    if (!questions || questions.length === 0) return;

    const answeredQuestions = Object.keys(selectedAnswers).length;
    const totalQuestions = questions.length;
    
    if (answeredQuestions < totalQuestions * 0.5) {
      toast.warning("Please answer at least 50% of the questions before submitting.");
      return;
    }

    // In a real app, we would submit answers to an API endpoint here
    // For now, we'll just show completion message
    setIsSubmitted(true);
    toast.success("Quiz submitted successfully!");
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-talentlms-blue opacity-75 mb-4"></div>
              <div className="h-4 w-48 bg-talentlms-blue opacity-50 rounded mb-2.5"></div>
              <div className="h-3 w-32 bg-talentlms-blue opacity-30 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error || !questions) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            to={`/class/${classId}`}
            className="inline-flex items-center text-talentlms-blue mb-4 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Class
          </Link>

          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5 mr-2" />
                Error Loading Quiz
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                We couldn't load the quiz questions. Please try again later or contact support.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Quiz completed state
  if (isSubmitted && questions) {
    const answeredQuestions = Object.keys(selectedAnswers).length;
    const score = Math.round((answeredQuestions / questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            to={`/class/${classId}`}
            className="inline-flex items-center text-talentlms-blue mb-4 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Class
          </Link>

          <Card className="overflow-hidden border-2 border-green-200 shadow-md">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
              <div className="flex justify-center mb-4">
                <Award className="w-16 h-16" />
              </div>
              <h2 className="text-2xl font-bold text-center">Quiz Completed!</h2>
            </div>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold mb-2 text-talentlms-blue">{answeredQuestions}/{questions.length}</div>
                <p className="text-gray-600 dark:text-gray-400">Questions Answered</p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Completion:</span>
                    <span className="font-medium">{score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-talentlms-blue h-2.5 rounded-full" 
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center space-x-2 bg-gray-50 dark:bg-gray-800/50 py-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setSelectedAnswers({});
                  setIsSubmitted(false);
                  setTimeRemaining(600);
                }}
              >
                Retake Quiz
              </Button>
              <Button onClick={() => navigate(`/class/${classId}`)}>
                Return to Class
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Handle case when questions array is empty
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            to={`/class/${classId}`}
            className="inline-flex items-center text-talentlms-blue mb-4 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Class
          </Link>

          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-5 h-5 mr-2" />
                No Quiz Questions Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                There are no quiz questions available for this class yet. Please check back later.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate(`/class/${classId}`)}>
                Return to Class
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Make sure we have questions and a valid current question index
  if (currentQuestionIndex >= questions.length) {
    setCurrentQuestionIndex(0);
  }

  // Get current question
  const currentQuestion = questions[currentQuestionIndex];
  
  // Make sure we have a valid current question
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto text-amber-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Question Not Found</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                There was an issue loading this quiz question.
              </p>
              <Button onClick={() => navigate(`/class/${classId}`)}>
                Return to Class
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with navigation */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            to={`/class/${classId}`}
            className="inline-flex items-center text-talentlms-blue hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Exit Quiz
          </Link>
          
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 py-1 px-3 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className={`font-mono font-medium ${timeRemaining < 60 ? 'text-red-500 animate-pulse' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        {/* Quiz progress bar */}
        <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Object.keys(selectedAnswers).length} Answered
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-talentlms-blue h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question card */}
        <Card className="mb-6 shadow-md border-talentlms-lightBlue dark:border-blue-900">
          <CardHeader className="bg-talentlms-lightBlue dark:bg-blue-900/30">
            <CardTitle className="text-xl text-talentlms-darkBlue dark:text-white">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <RadioGroup 
              value={selectedAnswers[currentQuestion.id] || ""}
              onValueChange={(value) => handleSelectOption(currentQuestion.id, value)}
              className="space-y-3"
            >
              {/* Option 1 */}
              <label
                htmlFor={`option1-${currentQuestion.id}`}
                className={`flex items-start space-x-3 p-3 rounded-md border ${
                  selectedAnswers[currentQuestion.id] === "option1"
                    ? "bg-talentlms-lightBlue border-talentlms-blue dark:bg-blue-900/30 dark:border-blue-700"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                } transition-colors cursor-pointer`}
              >
                <RadioGroupItem 
                  value="option1" 
                  id={`option1-${currentQuestion.id}`} 
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-gray-700 dark:text-gray-200">
                    {currentQuestion.option1}
                  </p>
                </div>
              </label>

              {/* Option 2 */}
              <label
                htmlFor={`option2-${currentQuestion.id}`}
                className={`flex items-start space-x-3 p-3 rounded-md border ${
                  selectedAnswers[currentQuestion.id] === "option2"
                    ? "bg-talentlms-lightBlue border-talentlms-blue dark:bg-blue-900/30 dark:border-blue-700"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                } transition-colors cursor-pointer`}
              >
                <RadioGroupItem 
                  value="option2" 
                  id={`option2-${currentQuestion.id}`} 
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-gray-700 dark:text-gray-200">
                    {currentQuestion.option2}
                  </p>
                </div>
              </label>

              {/* Option 3 */}
              <label
                htmlFor={`option3-${currentQuestion.id}`}
                className={`flex items-start space-x-3 p-3 rounded-md border ${
                  selectedAnswers[currentQuestion.id] === "option3"
                    ? "bg-talentlms-lightBlue border-talentlms-blue dark:bg-blue-900/30 dark:border-blue-700"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                } transition-colors cursor-pointer`}
              >
                <RadioGroupItem 
                  value="option3" 
                  id={`option3-${currentQuestion.id}`} 
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-gray-700 dark:text-gray-200">
                    {currentQuestion.option3}
                  </p>
                </div>
              </label>

              {/* Option 4 */}
              <label
                htmlFor={`option4-${currentQuestion.id}`}
                className={`flex items-start space-x-3 p-3 rounded-md border ${
                  selectedAnswers[currentQuestion.id] === "option4"
                    ? "bg-talentlms-lightBlue border-talentlms-blue dark:bg-blue-900/30 dark:border-blue-700"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                } transition-colors cursor-pointer`}
              >
                <RadioGroupItem 
                  value="option4" 
                  id={`option4-${currentQuestion.id}`} 
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-gray-700 dark:text-gray-200">
                    {currentQuestion.option4}
                  </p>
                </div>
              </label>
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between py-4 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            {currentQuestionIndex === questions.length - 1 ? (
              <Button 
                onClick={handleSubmitQuiz}
                className="bg-green-600 hover:bg-green-700 flex items-center"
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Submit Quiz
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="flex items-center"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Question navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2 justify-center">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index === currentQuestionIndex
                    ? 'bg-talentlms-blue text-white'
                    : selectedAnswers[questions[index].id]
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-300 dark:border-green-800'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
