import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleMapsProvider } from "./components/google-maps-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense>
          <GoogleMapsProvider>
            <App />
          </GoogleMapsProvider>
        </Suspense>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
