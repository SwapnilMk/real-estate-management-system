import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageSquare, User } from "lucide-react";
import { ContactAgentDialog } from "./contact-agent-dialog";

interface Agent {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
}

interface AgentContactDialogProps {
  agent?: Agent;
  propertyAddress: string;
  propertyId: string;
  trigger?: React.ReactNode;
}

export function AgentContactDialog({
  agent,
  propertyAddress,
  propertyId,
  trigger,
}: AgentContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  if (!agent) {
    return null;
  }

  const handleCall = () => {
    if (agent.phoneNumber) {
      window.location.href = `tel:${agent.phoneNumber}`;
    }
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Inquiry about ${propertyAddress}`);
    const body = encodeURIComponent(
      `Hi ${agent.name},\n\nI am interested in the property at ${propertyAddress}. Please contact me with more details.\n\nThank you!`,
    );
    window.location.href = `mailto:${agent.email}?subject=${subject}&body=${body}`;
  };

  if (showInquiryForm) {
    return (
      <ContactAgentDialog
        propertyId={propertyId}
        propertyAddress={propertyAddress}
        agentName={agent.name}
        trigger={
          <Button
            variant="ghost"
            onClick={() => setShowInquiryForm(false)}
            className="hidden"
          />
        }
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full" size="lg">
            <Phone className="mr-2 h-4 w-4" />
            Contact Agent
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Agent</DialogTitle>
          <DialogDescription>
            Get in touch with {agent.name} about {propertyAddress}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Agent Info */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="h-16 w-16 rounded-full bg-muted overflow-hidden border-2 border-border flex items-center justify-center">
              {agent.avatar ? (
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg">{agent.name}</p>
              <p className="text-sm text-muted-foreground">{agent.email}</p>
              {agent.phoneNumber && (
                <p className="text-sm text-muted-foreground">
                  {agent.phoneNumber}
                </p>
              )}
            </div>
          </div>

          {/* Contact Actions */}
          <div className="space-y-3">
            {agent.phoneNumber && (
              <Button
                onClick={handleCall}
                className="w-full"
                size="lg"
                variant="default"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call {agent.phoneNumber}
              </Button>
            )}

            <Button
              onClick={handleEmail}
              className="w-full"
              size="lg"
              variant="secondary"
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>

            <ContactAgentDialog
              propertyId={propertyId}
              propertyAddress={propertyAddress}
              agentName={agent.name}
              trigger={
                <Button className="w-full" size="lg" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
