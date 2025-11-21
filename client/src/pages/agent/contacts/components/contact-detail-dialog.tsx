import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ContactMessage } from "@/services/contactApi";
import { Mail, User, Calendar, MessageSquare } from "lucide-react";

interface ContactDetailDialogProps {
  contact: ContactMessage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactDetailDialog({
  contact,
  open,
  onOpenChange,
}: ContactDetailDialogProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "read":
        return <Badge variant="secondary">Read</Badge>;
      case "responded":
        return <Badge variant="default">Responded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Contact Message Details</DialogTitle>
          <DialogDescription>
            View the complete contact form submission
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            {getStatusBadge(contact.status)}
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contact Information</h3>

            <div className="flex items-start gap-3">
              <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-muted-foreground">{contact.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Email</p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-sm text-primary hover:underline"
                >
                  {contact.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Submitted</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(contact.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Message */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Message</h3>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Created: {formatDate(contact.createdAt)}</p>
            <p>Last Updated: {formatDate(contact.updatedAt)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
