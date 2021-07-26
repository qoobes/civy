import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./Contexts/AuthContext";
import "./index.css";
import theme from "./theme";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <ChakraProvider theme={theme.chakra}>
        <App />
      </ChakraProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
