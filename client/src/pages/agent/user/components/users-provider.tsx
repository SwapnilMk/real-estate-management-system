import { createContext, useContext, useState, type ReactNode } from "react";
import { type User } from "../data/schema";

interface UsersContextType {
  viewingUser: User | null;
  setViewingUser: (user: User | null) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: ReactNode }) {
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  return (
    <UsersContext.Provider
      value={{
        viewingUser,
        setViewingUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within UsersProvider");
  }
  return context;
}
