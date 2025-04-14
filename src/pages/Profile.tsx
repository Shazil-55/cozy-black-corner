import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService, UpdateUserSchema } from "@/services/userService";
import { useRole } from "@/context/RoleContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { User, Mail, Key, UserRound, Building, Briefcase, Users, Target } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { industries } from "@/constants/industries";
import { useOnboarding } from "@/context/OnboardingContext";
import { Checkbox } from "@/components/ui/checkbox";

const userRangeOptions = [
  "1-10 users",
  "11-50 users",
  "51-200 users",
  "201-500 users",
  "501-1000 users",
  "1000+ users"
];

const goalOptions = [
  "Teach Students",
  "Create Learning Content",
  "Improve Teaching Skills",
  "Manage Educational Institution",
  "Research & Development",
  "Corporate Training",
  "Self-improvement",
  "Sell courses",
  "Other"
];

const Profile = () => {
  const { user, updateUserData, refreshUserData } = useAuth();
  const { role, roleDisplayName } = useRole();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  
  console.log("Current user data in Profile:", user);
  
  // Profile form setup with zod validation
  const profileForm = useForm({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
      industry: user?.industry || "",
      portalUsers: user?.portalUsers || "",
      mainGoal: user?.mainGoal || [],
      profileImage: user?.profileImage || user?.avatar || "",
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      console.log("Updating form with user data:", user);
      
      // Ensure mainGoal is always an array
      const mainGoalArray = Array.isArray(user.mainGoal) ? user.mainGoal : 
                          (user.mainGoal ? [user.mainGoal] : []);
      
      profileForm.reset({
        name: user.name || "",
        username: user.username || "",
        bio: user.bio || "",
        industry: user.industry || "",
        portalUsers: user.portalUsers || "",
        mainGoal: mainGoalArray,
        profileImage: user.profileImage || user.avatar || "",
      });
      
      setSelectedGoals(mainGoalArray);
      
      // Log the values for debugging
      console.log("Setting portalUsers to:", user.portalUsers);
      console.log("Setting mainGoal to:", mainGoalArray);
    }
  }, [user, profileForm]);

  // Load fresh user data on component mount
  useEffect(() => {
    console.log("Profile component mounted, refreshing user data");
    refreshUserData()
      .then(() => {
        console.log("User data refreshed on Profile page load");
      })
      .catch(error => {
        console.error("Failed to refresh user data on Profile load:", error);
      });
  }, []);
  
  // Password form state (separate from profile form)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (data: any) => {
    setIsSubmitting(true);
    
    // Ensure mainGoal is properly formatted as an array
    const formData = {
      ...data,
      mainGoal: selectedGoals,
    };
    
    console.log("Submitting profile update with data:", formData);
    
    try {
      const response = await userService.updateUser(formData);
      
      if (response.data) {
        await refreshUserData();
        toast.success("Profile updated successfully");
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await userService.updateUser({
        password: passwordForm.newPassword,
      });
      
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      toast.success("Password updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goal)) {
        return prev.filter(g => g !== goal);
      } else {
        return [...prev, goal];
      }
    });
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4 border-4 border-primary/10">
                <AvatarImage src={user?.avatar || user?.profileImage} alt={user?.name} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              
              <div className="mt-3 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {roleDisplayName[role]}
              </div>
              
              <div className="mt-6 w-full border-t pt-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserRound className="h-4 w-4" />
                  <span className="text-sm">Member since {new Date(user?.createdAt || Date.now()).getFullYear()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="flex items-center gap-2">
                              <User className="h-4 w-4" /> Full Name
                            </FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Your name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="flex items-center gap-2">
                              <User className="h-4 w-4" /> Username
                            </FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Your username" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" /> Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          value={user?.email || ""}
                          readOnly
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                          Email cannot be changed
                        </p>
                      </div>
                      
                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4" /> Bio
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Tell us about yourself" 
                                rows={4}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="mt-4"
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Update your organization and usage preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="flex items-center gap-2">
                              <Building className="h-4 w-4" /> Industry
                            </FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value || undefined}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {industries.map((industry) => (
                                  <SelectItem key={industry} value={industry}>
                                    {industry}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="portalUsers"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="flex items-center gap-2">
                              <Users className="h-4 w-4" /> Portal Users
                            </FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value || undefined}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select number of users" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {userRangeOptions.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <FormLabel className="flex items-center gap-2">
                          <Target className="h-4 w-4" /> Main Goals
                        </FormLabel>
                        <div className="bg-muted/40 p-4 rounded-md border border-border">
                          <div className="grid grid-cols-1 gap-3">
                            {goalOptions.map((goal) => (
                              <div key={goal} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`goal-${goal}`} 
                                  checked={selectedGoals.includes(goal)}
                                  onCheckedChange={() => handleGoalToggle(goal)}
                                />
                                <label
                                  htmlFor={`goal-${goal}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {goal}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save Preferences"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Update your password and security options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="flex items-center gap-2">
                      <Key className="h-4 w-4" /> Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Your current password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="flex items-center gap-2">
                      <Key className="h-4 w-4" /> New Password
                    </Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Your new password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                      <Key className="h-4 w-4" /> Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm your new password"
                    />
                  </div>
                  
                  <Button 
                    onClick={handlePasswordUpdate}
                    disabled={isSubmitting || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                    className="mt-4"
                  >
                    {isSubmitting ? "Updating..." : "Update Password"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
