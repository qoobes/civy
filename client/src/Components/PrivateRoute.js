import { useToast } from "@chakra-ui/toast";
import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();
  const toast = useToast();

  const mistakeToast = () =>
    toast({
      position: "top",
      title: "You're not logged in",
      description: "Please log in to proceed",
      status: "error",
      isClosable: false,
      duration: 1000,
    });

  return (
    <Route
      {...rest}
      render={props => {
        if (currentUser) return <Component {...props} />;
        mistakeToast();
        return <Redirect to="/login" />;
      }}
    />
  );
};
