import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import store from "./redux/store/store.js";
// import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      {/* <GoogleOAuthProvider clientId={import.meta.env.VITE_GG_CLIENT_ID}> */}
        <App />
      {/* </GoogleOAuthProvider> */}
    </BrowserRouter>
  </Provider>
);
