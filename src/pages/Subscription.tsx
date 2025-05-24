
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, Info } from "lucide-react";

const subscriptionPlans = [
  {
    id: "core",
    name: "Core",
    description: "Begin your e-learning journey with foundational tools for success",
    userRange: "1-40 users",
    monthlyPrice: 109,
    yearlyPrice: 1308, // 109 * 12
    yearlyDiscount: 262, // ~20% discount
    features: [
      "Everything in Free",
      "1 branch",
      "TalentCraft AI (5,000 credits)",
      "Unlimited courses",
      "Custom homepage",
      "API",
      "Single sign-on support",
      "Custom domain + SSL",
      "Basic reports"
    ],
    ilmeeLibraryCost: 32
  },
  {
    id: "grow",
    name: "Grow",
    description: "Strategize your learning with intuitive insights",
    userRange: "1-70 users",
    monthlyPrice: 229,
    yearlyPrice: 2748, // 229 * 12
    yearlyDiscount: 550, // ~20% discount
    features: [
      "Everything in Core",
      "3 branches",
      "TalentCraft AI premium (120,000 credits)",
      "Custom reports",
      "Onboarding Starter",
      "LTI 1.3 support"
    ],
    ilmeeLibraryCost: 53,
    recommended: true
  },
  {
    id: "pro",
    name: "Pro",
    description: "Everything you need to support training at scale",
    userRange: "1-100 users",
    monthlyPrice: 399,
    yearlyPrice: 4788, // 399 * 12
    yearlyDiscount: 958, // ~20% discount
    features: [
      "Everything in Grow",
      "15 branches",
      "TalentCraft AI premium (180,000 credits)",
      "Remove Ilmee branding",
      "Automations",
      "Live chat support",
      "Priority email support",
      "Skills"
    ],
    ilmeeLibraryCost: 70,
    flexibility: {
      name: "Flexible user limit",
      cost: 140
    }
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Create a custom annual plan that fits your requirements",
    userRange: "Unlimited users",
    price: "Custom",
    features: [
      "Unlimited branches",
      "TalentCraft AI premium (1,000,000 credits)",
      "Phone support",
      "Account manager",
      "Onboarding Premium"
    ],
    ilmeeLibrary: true,
    enterprise: true
  }
];

const Subscription = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [includeIlmeeLibrary, setIncludeIlmeeLibrary] = useState(false);
  const [includeFlexibleUsers, setIncludeFlexibleUsers] = useState(false);
  
  const getPlanPrice = (plan) => {
    if (plan.enterprise) return "Custom";
    
    let price = billingCycle === "monthly" ? plan.monthlyPrice : (plan.yearlyPrice - plan.yearlyDiscount);
    
    // Add IlmeeLibrary cost if selected
    if (includeIlmeeLibrary && plan.ilmeeLibraryCost) {
      price += plan.ilmeeLibraryCost;
    }
    
    // Add flexible user limit cost if selected
    if (includeFlexibleUsers && plan.flexibility && plan.id === "pro") {
      price += plan.flexibility.cost;
    }
    
    return `$${price}`;
  };
  
  const getSavingsText = (plan) => {
    if (plan.enterprise || billingCycle !== "annually") return null;
    return `Save $${plan.yearlyDiscount}/year`;
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Subscription Plans</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your organization's learning needs
        </p>
      </div>
      
      {/* Usage summary */}
      <div className="mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="font-medium mb-2">My current plan: <span className="text-blue-600 dark:text-blue-400">Free</span> | 5 users</h2>
                <p className="text-sm text-muted-foreground">Usage summary: 4/5 users, 4/10 courses, 0 branches</p>
              </div>
              <div className="flex justify-end">
                <Button variant="outline">Subscription options</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Billing options */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-4 flex items-center gap-3">
          <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            You're about to reach the limit of your current plan. Upgrade now to unlock more features.
          </p>
        </div>
      
        <Tabs defaultValue="monthly" value={billingCycle} onValueChange={setBillingCycle} className="w-[240px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="annually">
              Annually <Badge className="ml-1 bg-green-500 text-[10px]">-20%</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Subscription cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {subscriptionPlans.map(plan => (
          <Card key={plan.id} className={`overflow-hidden ${plan.recommended ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}>
            {plan.recommended && (
              <div className="bg-blue-500 text-white text-center py-1 text-xs font-medium">
                RECOMMENDED
              </div>
            )}
            
            <CardHeader className={`${plan.enterprise ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="font-medium text-sm">{plan.userRange}</div>
                <Badge variant="outline">{billingCycle === "monthly" ? "Monthly" : "Annually"}</Badge>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">
                    {getPlanPrice(plan)}
                  </span>
                  {!plan.enterprise && (
                    <span className="text-muted-foreground ml-1">
                      {billingCycle === "monthly" ? "/month" : "/year"}
                    </span>
                  )}
                </div>
                {getSavingsText(plan) && (
                  <div className="text-green-600 dark:text-green-400 text-sm mt-1">
                    {getSavingsText(plan)}
                  </div>
                )}
              </div>
              
              <Button className="w-full mb-6" disabled={plan.enterprise}>
                {plan.enterprise ? 'Contact us' : 'Select plan'}
              </Button>
              
              {/* Add-ons */}
              {plan.ilmeeLibraryCost && (
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id={`ilmee-library-${plan.id}`} 
                      checked={includeIlmeeLibrary}
                      onChange={() => setIncludeIlmeeLibrary(!includeIlmeeLibrary)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={`ilmee-library-${plan.id}`} className="text-sm">IlmeeLibrary™</label>
                  </div>
                  <span className="text-sm">+${plan.ilmeeLibraryCost}/mo</span>
                </div>
              )}
              
              {plan.flexibility && (
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id={`flexible-users-${plan.id}`} 
                      checked={includeFlexibleUsers}
                      onChange={() => setIncludeFlexibleUsers(!includeFlexibleUsers)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={`flexible-users-${plan.id}`} className="text-sm">{plan.flexibility.name}</label>
                  </div>
                  <span className="text-sm">+${plan.flexibility.cost}/mo</span>
                </div>
              )}
              
              {/* Features */}
              <div className="space-y-3 mt-8">
                <h3 className="font-medium text-sm">FEATURES</h3>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* FAQ section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">What happens when I upgrade?</h3>
              <p className="text-sm text-muted-foreground">
                When you upgrade your plan, you'll immediately gain access to all the features included in your new subscription. Your billing will be prorated based on the time remaining in your current billing cycle.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Can I change plans later?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes will take effect at the end of your current billing cycle.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">What is IlmeeLibrary™?</h3>
              <p className="text-sm text-muted-foreground">
                IlmeeLibrary™ is our curated collection of professional courses created by expert instructional designers. Adding this option to your subscription gives all your users access to hundreds of ready-to-use courses.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">How does user licensing work?</h3>
              <p className="text-sm text-muted-foreground">
                Each plan comes with a specific user limit. A user license is consumed when you create an account for someone. The flexible user limit add-on allows you to exceed your plan's user limit for an additional fee.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Contact section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-3">Need help choosing?</h2>
        <p className="text-muted-foreground mb-6">
          Our team is ready to help you find the perfect plan for your organization
        </p>
        <Button size="lg" variant="outline">Contact sales</Button>
      </div>
    </div>
  );
};

export default Subscription;
