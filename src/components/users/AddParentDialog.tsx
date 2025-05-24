
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ApiUser, CreateParentPayload } from "@/services/userService";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AddParentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (parentData: CreateParentPayload) => Promise<void>;
  isLoading?: boolean;
  learners: ApiUser[];
  currentLearnerId?: string;
  isLearnerDashboard?: boolean;
}

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  learnerIds: z.array(z.string()).min(1, "Select at least one learner"),
});

type FormValues = z.infer<typeof formSchema>;

export const AddParentDialog: React.FC<AddParentDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  learners,
  currentLearnerId,
  isLearnerDashboard = false,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      learnerIds: currentLearnerId ? [currentLearnerId] : [],
    },
  });

  const handleSubmit = async (values: FormValues) => {
    const parentData: CreateParentPayload = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      learnerIds: values.learnerIds,
    };
    
    await onSubmit(parentData);
  };

  // Filter learners to only include those with role "Learner"
  const availableLearners = learners.filter(user => user.role === "Learner");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add new parent</DialogTitle>
          <DialogDescription>
            Create a parent account and assign students. An email will be sent to the parent with login instructions.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-[200px] w-full rounded-md" />
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Parent Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter parent's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Parent Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="parent@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Learners Selection */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="learnerIds"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Assign Learners <span className="text-red-500">*</span></FormLabel>
                        <FormDescription>
                          {isLearnerDashboard 
                            ? "You will be assigned to this parent"
                            : "Select the learners that this parent will have access to monitor"}
                        </FormDescription>
                      </div>
                      
                      {availableLearners.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                          No learners available to assign
                        </div>
                      ) : (
                        <div className={cn(
                          "grid gap-2",
                          isLearnerDashboard ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
                        )}>
                          {availableLearners.map((learner) => (
                            <FormField
                              key={learner.id}
                              control={form.control}
                              name="learnerIds"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={learner.id}
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(learner.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, learner.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== learner.id
                                                )
                                              )
                                        }}
                                        disabled={isLearnerDashboard}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-sm font-medium">
                                        {learner.name}
                                      </FormLabel>
                                      <FormDescription className="text-xs">
                                        {learner.email}
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || availableLearners.length === 0}>Add Parent</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
