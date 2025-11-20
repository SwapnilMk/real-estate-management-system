import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useUsers } from "./users-provider";
import { userRoles } from "../data/data";

export function UserDetailDialog() {
  const { viewingUser, setViewingUser } = useUsers();

  if (!viewingUser) return null;

  const role = userRoles.find((r) => r.value === viewingUser.role);

  return (
    <Dialog
      open={!!viewingUser}
      onOpenChange={(open) => !open && setViewingUser(null)}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View detailed information about this user.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <p className="text-sm font-medium">{viewingUser.name}</p>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <p className="text-sm">{viewingUser.email}</p>
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Role
            </label>
            <div className="mt-1">
              <Badge
                variant="outline"
                className="flex w-fit items-center gap-1"
              >
                {role?.icon && <role.icon className="size-3" />}
                <span>{role?.label || viewingUser.role}</span>
              </Badge>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Phone Number
            </label>
            <p className="text-sm">
              {viewingUser.phoneNumber || "Not provided"}
            </p>
          </div>

          {/* Created At */}
          {viewingUser.createdAt && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Member Since
              </label>
              <p className="text-sm">
                {new Date(viewingUser.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
