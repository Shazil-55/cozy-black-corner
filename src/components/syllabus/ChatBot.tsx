
import React, { useState } from 'react';
import { Bot, X, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FAQ } from '@/services/courseService';
import { cn } from '@/lib/utils';

interface ChatBotProps {
  faqs: FAQ[];
}

type Message = {
  id: string;
  type: 'bot' | 'user';
  content: string;
  isQuestion?: boolean;
};

const ChatBot: React.FC<ChatBotProps> = ({ faqs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! I can help you with frequently asked questions about this topic. What would you like to know?',
    },
  ]);

  const [showFaqs, setShowFaqs] = useState(true);
  const [userInput, setUserInput] = useState('');

  const addMessage = (content: string, type: 'bot' | 'user', isQuestion = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      isQuestion,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleFaqClick = (faq: FAQ) => {
    addMessage(faq.question, 'user', true);
    
    // Add small delay to simulate thinking
    setTimeout(() => {
      addMessage(faq.answer, 'bot');
      setShowFaqs(false);
    }, 500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    addMessage(userInput, 'user');
    setUserInput('');
    
    // Find most relevant FAQ based on user's question
    const relevantFaq = findRelevantFaq(userInput);
    
    // Simulate typing delay
    setTimeout(() => {
      if (relevantFaq) {
        addMessage(relevantFaq.answer, 'bot');
      } else {
        addMessage("I'm not sure about that. Would you like to see all available FAQs?", 'bot');
        setShowFaqs(true);
      }
    }, 1000);
  };

  const findRelevantFaq = (question: string): FAQ | null => {
    // Simple keyword matching - in a real app, you might use more sophisticated NLP
    const lowerQuestion = question.toLowerCase();
    return faqs.find(faq => 
      faq.question.toLowerCase().includes(lowerQuestion) || 
      lowerQuestion.includes(faq.question.toLowerCase().split(' ').slice(0, 3).join(' '))
    ) || null;
  };

  const resetChat = () => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: 'Hi! I can help you with frequently asked questions about this topic. What would you like to know?',
      },
    ]);
    setShowFaqs(true);
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
              <DialogTitle className="text-lg font-medium">Course Assistant</DialogTitle>
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
                    msg.type === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div 
                    className={cn(
                      "max-w-[85%] rounded-lg px-4 py-2",
                      msg.type === 'user' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white shadow-sm border rounded-tl-none'
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {showFaqs && faqs.length > 0 && (
              <div className="mt-6 space-y-2">
                <p className="text-xs text-gray-500 font-medium">FREQUENTLY ASKED QUESTIONS:</p>
                <div className="space-y-2">
                  {faqs.map((faq) => (
                    <button
                      key={faq.id}
                      className="w-full text-left p-3 bg-white rounded-lg shadow-sm border text-sm hover:bg-gray-50 transition-colors"
                      onClick={() => handleFaqClick(faq)}
                    >
                      {faq.question}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
              placeholder="Type a message..."
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
