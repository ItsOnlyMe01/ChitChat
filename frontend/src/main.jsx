import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./compo/context/chatProvider.jsx";
import SnackbarProvider from "./compo/context/SnackBar.jsx";

createRoot(document.getElementById("root")).render(
  <SnackbarProvider>
    <BrowserRouter>
      <ChatProvider>
        <App />
      </ChatProvider>
    </BrowserRouter>
  </SnackbarProvider>
);
