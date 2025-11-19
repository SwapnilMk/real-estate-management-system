import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/app-routes";
import { Toaster } from "sonner";
import "./App.css";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
