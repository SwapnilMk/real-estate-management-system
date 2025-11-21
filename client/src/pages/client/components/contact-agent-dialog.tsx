import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateInterestMutation } from "@/services/interestApi";
import { toast } from "sonner";
import { Mail, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters"),
});

interface ContactAgentDialogProps {
  propertyId: string;
  propertyAddress: string;
  agentName?: string;
  trigger?: React.ReactNode;
}

export function ContactAgentDialog({
  propertyId,
  propertyAddress,
  agentName,
  trigger,
}: ContactAgentDialogProps) {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [createInterest, { isLoading }] = useCreateInterestMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message:
        "I am interested in this property. Please contact me with more details.",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("Please sign in to contact the agent");
      navigate("/sign-in");
      return;
    }

    try {
      await createInterest({
        propertyId,
        message: values.message,
      }).unwrap();
      toast.success("Inquiry sent successfully!");
      setOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to send inquiry");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !user) {
      toast.error("Please sign in to contact the agent");
      navigate("/sign-in");
      return;
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="secondary" className="w-full" size="lg">
            <Mail className="mr-2 h-4 w-4" />
            Email Agent
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Agent</DialogTitle>
          <DialogDescription>
            Send a message to {agentName || "the agent"} about {propertyAddress}
            .
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="I am interested in this property..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Inquiry
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
