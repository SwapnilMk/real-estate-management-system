import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useProperties } from "./properties-provider.tsx";
import {
  useDeletePropertyMutation,
  useBulkDeletePropertiesMutation,
} from "@/services/agentApi";
import { toast } from "sonner";

export function PropertiesDialogs() {
  const {
    deletingProperty,
    setDeletingProperty,
    bulkDeletingProperties,
    setBulkDeletingProperties,
  } = useProperties();

  const [deleteProperty, { isLoading: isDeleting }] =
    useDeletePropertyMutation();
  const [bulkDeleteProperties, { isLoading: isBulkDeleting }] =
    useBulkDeletePropertiesMutation();

  const handleDelete = async () => {
    if (!deletingProperty) return;

    try {
      await deleteProperty(deletingProperty._id).unwrap();
      toast.success("Property deleted successfully");
      setDeletingProperty(null);
    } catch (error) {
      toast.error("Failed to delete property");
    }
  };

  const handleBulkDelete = async () => {
    if (bulkDeletingProperties.length === 0) return;

    try {
      const ids = bulkDeletingProperties.map((p) => p._id);
      await bulkDeleteProperties(ids).unwrap();
      toast.success(`${ids.length} properties deleted successfully`);
      setBulkDeletingProperties([]);
    } catch (error) {
      toast.error("Failed to delete properties");
    }
  };

  return (
    <>
      {/* Delete Single Property Dialog */}
      <AlertDialog
        open={!!deletingProperty}
        onOpenChange={(open) => !open && setDeletingProperty(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the property at{" "}
              <span className="font-medium">
                {deletingProperty?.properties.street_address}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Dialog */}
      <AlertDialog
        open={bulkDeletingProperties.length > 0}
        onOpenChange={(open) => !open && setBulkDeletingProperties([])}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {bulkDeletingProperties.length} properties?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {bulkDeletingProperties.length}{" "}
              selected{" "}
              {bulkDeletingProperties.length === 1 ? "property" : "properties"}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isBulkDeleting ? "Deleting..." : "Delete All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
