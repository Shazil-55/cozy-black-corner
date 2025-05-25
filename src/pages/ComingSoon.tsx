
import React from "react";
import { Clock, ArrowLeft, Sparkles, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ComingSoonProps {
  featureName: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ featureName }) => {
  const navigate = useNavigate();

  const getFeatureIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'calendar':
        return Calendar;
      case 'conferences':
        return Users;
      default:
        return Clock;
    }
  };

  const FeatureIcon = getFeatureIcon(featureName);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="w-full max-w-2xl">
        {/* Floating decoration elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200/30 dark:bg-blue-800/20 rounded-full blur-3xl animate-pulse-soft"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-200/30 dark:bg-purple-800/20 rounded-full blur-3xl animate-pulse-soft animation-delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-indigo-200/30 dark:bg-indigo-800/20 rounded-full blur-2xl animate-bounce-subtle"></div>
        </div>

        <Card className="relative glass-effect border-0 shadow-2xl backdrop-blur-xl bg-white/70 dark:bg-gray-900/70">
          <CardHeader className="text-center pb-4">
            {/* Icon container with animated background */}
            <div className="mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse-soft"></div>
              <div className="relative p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
                <FeatureIcon className="h-12 w-12 text-white" />
              </div>
              {/* Floating sparkles */}
              <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-yellow-400 animate-bounce-subtle" />
              <Sparkles className="absolute -bottom-1 -left-2 h-4 w-4 text-blue-400 animate-bounce-subtle animation-delay-500" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Coming Soon
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 text-center px-8 pb-8">
            <div className="space-y-4">
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                The <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">{featureName}</span> feature is currently under development
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-blue-100 dark:border-gray-600">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We're crafting an amazing experience that will transform how you manage your {featureName.toLowerCase()}. 
                  Our team is working around the clock to bring you innovative features that will exceed your expectations.
                </p>
              </div>

              {/* Feature preview cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-blue-100 dark:border-gray-600">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-2 mx-auto">
                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Intuitive Design</h3>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-purple-100 dark:border-gray-600">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-2 mx-auto">
                    <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Real-time Sync</h3>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-indigo-100 dark:border-gray-600">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-2 mx-auto">
                    <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Collaboration</h3>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={() => navigate(-1)} 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComingSoon;
