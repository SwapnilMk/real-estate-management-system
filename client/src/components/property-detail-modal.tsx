import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import PropertyDetailPage from "@/pages/client/property-detail";

interface PropertyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
}

export function PropertyDetailModal({
  isOpen,
  onClose,
  propertyId,
}: PropertyDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden flex flex-col">
        <div className="absolute right-4 top-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="bg-white/50 hover:bg-white/80 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="h-full">
            <PropertyDetailPage propertyId={propertyId} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
