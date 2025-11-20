import { UsersProvider } from "./components/users-provider";
import { UsersTable } from "./components/users-table";
import { UserDetailDialog } from "./components/user-detail-dialog";
import { useGetUsersQuery } from "@/services/agentApi";

export default function UserList() {
  const { data: users = [], isLoading, error } = useGetUsersQuery();

  return (
    <UsersProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Users</h2>
            <p className="text-muted-foreground">
              View all registered users in the system
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : error ? (
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-destructive">
              Error loading users. Please try again.
            </p>
          </div>
        ) : (
          <UsersTable data={users} />
        )}
      </div>

      <UserDetailDialog />
    </UsersProvider>
  );
}
