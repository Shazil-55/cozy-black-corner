
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
import { ApiUser, CreateParentPayload } from "@/services/userService";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronsUpDown, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AddParentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (parentData: CreateParentPayload) => Promise<void>;
  isLoading?: boolean;
  learners: ApiUser[];
  currentLearnerId?: string;
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
}) => {
  const [open, setOpen] = useState(false);
  const [selectedLearners, setSelectedLearners] = useState<string[]>(
    currentLearnerId ? [currentLearnerId] : []
  );

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
  
  // Set selected learners to form
  React.useEffect(() => {
    form.setValue("learnerIds", selectedLearners);
  }, [selectedLearners, form]);

  const toggleLearner = (learnerId: string) => {
    setSelectedLearners(current => {
      if (current.includes(learnerId)) {
        return current.filter(id => id !== learnerId);
      } else {
        return [...current, learnerId];
      }
    });
  };

  const removeLearner = (learnerId: string) => {
    setSelectedLearners(current => current.filter(id => id !== learnerId));
  };

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
              <Skeleton className="h-[100px] w-full rounded-md" />
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
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-2">
                        <FormLabel className="text-base">Assign Learners <span className="text-red-500">*</span></FormLabel>
                        <FormDescription>
                          Select the learners that this parent will have access to monitor
                        </FormDescription>
                      </div>
                      
                      {availableLearners.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                          No learners available to assign
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between"
                              >
                                {selectedLearners.length > 0 
                                  ? `${selectedLearners.length} learner${selectedLearners.length > 1 ? 's' : ''} selected`
                                  : "Select learners..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Search learners..." />
                                <CommandEmpty>No learners found.</CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-auto">
                                  {availableLearners.map((learner) => (
                                    <CommandItem
                                      key={learner.id}
                                      value={learner.id}
                                      onSelect={() => toggleLearner(learner.id)}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          selectedLearners.includes(learner.id) 
                                            ? "opacity-100" 
                                            : "opacity-0"
                                        )}
                                      />
                                      <div className="flex flex-col">
                                        <span>{learner.name}</span>
                                        <span className="text-xs text-muted-foreground">{learner.email}</span>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          {selectedLearners.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {selectedLearners.map(learnerId => {
                                const learner = availableLearners.find(l => l.id === learnerId);
                                return learner ? (
                                  <Badge key={learner.id} variant="secondary" className="py-1">
                                    {learner.name}
                                    <button 
                                      type="button"
                                      className="ml-1 rounded-full hover:bg-muted"
                                      onClick={() => removeLearner(learner.id)}
                                    >
                                      <X className="h-3 w-3" />
                                      <span className="sr-only">Remove</span>
                                    </button>
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          )}
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
