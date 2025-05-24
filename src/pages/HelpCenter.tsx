
import React, { useState, useEffect } from "react";
import { 
  Search,
  BookOpen, 
  MessageCircle, 
  FileText, 
  HelpCircle,
  Info,
  ArrowRight,
  Mail
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const HelpCenter = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("guides");

  const faqItems = [
    {
      question: "How do I create a new course?",
      answer: "Navigate to the Courses section, click on 'Create Course' button, fill in the course details such as title, description, and categories, then add modules and lessons as needed."
    },
    {
      question: "How do I invite users to my domain?",
      answer: "Go to the Users page, click 'Add User', enter their email address and select their role. They will receive an invitation email to join your domain."
    },
    {
      question: "How can I customize my learning portal?",
      answer: "From the settings page, you can update your domain appearance, logo, colors, and other branding elements to match your organization's identity."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for annual subscriptions. Contact our sales team for enterprise billing options."
    },
    {
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login screen, enter your email address, and follow the instructions sent to your email to create a new password."
    },
  ];

  const helpCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics of using Ilmee",
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
      gradient: "from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      title: "Course Creation",
      description: "Build engaging learning experiences",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-purple-50 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300",
      gradient: "from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30",
      borderColor: "border-purple-200 dark:border-purple-800"
    },
    {
      title: "User Management",
      description: "Add and manage your users",
      icon: <MessageCircle className="h-6 w-6" />,
      color: "bg-green-50 text-green-600 dark:bg-green-900/40 dark:text-green-300",
      gradient: "from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      title: "Billing & Subscription",
      description: "Manage your subscription and payments",
      icon: <Info className="h-6 w-6" />,
      color: "bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300",
      gradient: "from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30",
      borderColor: "border-amber-200 dark:border-amber-800"
    }
  ];

  const guides = [
    {
      title: "Complete Guide to Course Creation",
      description: "Learn how to create engaging courses that keep your learners motivated",
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400",
      minRead: "8"
    },
    {
      title: "Effective User Management",
      description: "Best practices for organizing and managing your users and groups",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400",
      minRead: "6"
    },
    {
      title: "Advanced Quiz Creation",
      description: "Create challenging assessments to test your learner's knowledge",
      imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400",
      minRead: "5"
    }
  ];

  const filterResults = (items) => {
    if (!searchQuery) return items;
    return items.filter(item => 
      item.question?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  useEffect(() => {
    // Scroll to top when tab changes
    window.scrollTo(0, 0);
  }, [activeTab]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section with enhanced design */}
        <div className="rounded-3xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 p-10 mb-12 relative overflow-hidden shadow-xl">
          <div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop')] 
                      opacity-[0.03] mix-blend-overlay bg-cover bg-center"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/5 to-blue-500/5 dark:from-purple-400/10 dark:to-blue-400/10" />
          <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-blue-200 dark:bg-blue-700/30 rounded-full blur-3xl opacity-30" />
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-200 dark:bg-purple-700/30 rounded-full blur-3xl opacity-30" />
          
          <div className="relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
            >
              Help Center
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto text-lg"
            >
              Find answers to common questions or contact our support team for assistance
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative max-w-xl mx-auto"
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                className="pl-12 py-7 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg rounded-xl text-lg border-0 focus-visible:ring-2 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
          </div>
        </div>

        {/* Enhanced Tabs with animation */}
        <Tabs 
          defaultValue="guides" 
          className="mb-12"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <div className="flex justify-center mb-6">
            <TabsList className="grid grid-cols-3 w-full max-w-2xl p-1 rounded-xl bg-gray-100 dark:bg-gray-800/80">
              <TabsTrigger 
                value="guides"
                className="rounded-lg py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all duration-300"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Guides
              </TabsTrigger>
              <TabsTrigger 
                value="faq"
                className="rounded-lg py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all duration-300"
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                FAQ
              </TabsTrigger>
              <TabsTrigger 
                value="contact"
                className="rounded-lg py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all duration-300"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="guides">
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-10"
            >
              {/* Enhanced category cards with hover effects */}
              <motion.div variants={item}>
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <BookOpen className="mr-3 h-6 w-6 text-purple-500" />
                  Help Categories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {helpCategories.map((category, index) => (
                    <motion.div 
                      key={index} 
                      variants={item}
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      className="h-full"
                    >
                      <Card className={cn(
                        "overflow-hidden hover:shadow-lg transition-all duration-300 h-full border",
                        category.borderColor
                      )}>
                        <CardHeader className={cn(
                          `bg-gradient-to-br p-5 flex flex-row items-center gap-4`,
                          category.gradient
                        )}>
                          <div className={cn(
                            "bg-white/90 dark:bg-gray-800/90 p-3 rounded-xl shadow-md",
                            category.color
                          )}>
                            {category.icon}
                          </div>
                          <div>
                            <CardTitle className="text-xl">{category.title}</CardTitle>
                            <CardDescription className="text-gray-700 dark:text-gray-300 text-base mt-1">
                              {category.description}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardFooter className="pt-4 pb-5 px-5">
                          <Button variant="ghost" className="group w-full justify-between">
                            <span>Explore topics</span>
                            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Popular guides with enhanced card design */}
              <motion.div variants={item}>
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <FileText className="mr-3 h-6 w-6 text-purple-500" />
                  Popular Guides
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {guides.map((guide, index) => (
                    <motion.div 
                      key={index} 
                      variants={item}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                          <img 
                            src={guide.imageUrl} 
                            alt={guide.title} 
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          />
                          <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent w-full h-1/2" />
                          <div className="absolute bottom-3 left-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs backdrop-blur-md">
                            {guide.minRead} min read
                          </div>
                        </div>
                        <CardContent className="p-5 flex-grow">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{guide.title}</h3>
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                            {guide.description}
                          </p>
                        </CardContent>
                        <CardFooter className="pt-0 pb-5 px-5">
                          <Button variant="default" className="w-full">
                            Read Guide
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="faq">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <HelpCircle className="mr-3 h-6 w-6 text-purple-500" />
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {filterResults(faqItems).map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <AccordionItem value={`item-${index}`} className="border-b border-gray-200 dark:border-gray-700">
                        <AccordionTrigger className="text-left py-5 hover:no-underline hover:text-purple-600 dark:hover:text-purple-400 text-lg">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl mb-2 text-gray-700 dark:text-gray-300">
                            {item.answer}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
                
                {filterResults(faqItems).length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-16 border border-dashed rounded-xl"
                  >
                    <HelpCircle className="mx-auto h-14 w-14 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No results found</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      We couldn't find any questions matching your search.
                      <br />Try using different keywords or contact support.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-6"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveTab('contact');
                      }}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact Support
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="contact">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Contact options with enhanced design */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800/50 overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/50 dark:bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl">
                        <Mail className="mr-3 h-6 w-6 text-blue-500" />
                        Email Support
                      </CardTitle>
                      <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                        Reach out to our support team via email
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-6 text-gray-700 dark:text-gray-300">Our support team typically responds within 24 hours during business days.</p>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="outline" className="w-full group border-blue-200 dark:border-blue-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                            <Mail className="mr-2 h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
                            <span className="text-gray-800 dark:text-gray-200">support@ilmee.ai</span>
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-800 shadow-lg">
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">Contact email copied!</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Click to copy our support email address to your clipboard.
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-100 dark:border-purple-800/50 overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/50 dark:bg-purple-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl">
                        <MessageCircle className="mr-3 h-6 w-6 text-purple-500" />
                        Live Chat
                      </CardTitle>
                      <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                        Chat with our support representatives
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-6 text-gray-700 dark:text-gray-300">Available Monday to Friday, 9 AM to 5 PM EST.</p>
                      <Button className="w-full">
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Start Live Chat
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
              
              {/* Contact form with enhanced design */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 opacity-50"></div>
                  <CardHeader className="relative z-10 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
                    <CardTitle className="flex items-center text-2xl">
                      <FileText className="mr-3 h-6 w-6 text-purple-500" />
                      Submit a Request
                    </CardTitle>
                    <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                      Send us a detailed message about your issue
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10 pt-6">
                    <form className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                          <Input 
                            id="name" 
                            placeholder="Your name" 
                            defaultValue={user?.name || ""}
                            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="your.email@example.com" 
                            defaultValue={user?.email || ""}
                            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                        <Input 
                          id="subject" 
                          placeholder="Brief description of your issue" 
                          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                        <textarea 
                          id="message" 
                          rows={6} 
                          className="w-full min-h-[180px] rounded-md border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-4 py-3 text-sm ring-offset-background placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Please describe your issue in detail..."
                        />
                      </div>
                      <div className="pt-2">
                        <Button type="submit" className="px-8 py-6 text-base font-medium">
                          Submit Request
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HelpCenter;
