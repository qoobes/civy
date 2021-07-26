import {
  Box,
  Button,
  FormLabel,
  Heading,
  Input,
  Link,
  ScaleFade,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRef } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { DefaultLayout } from "../Components/DefaultLayout";
import firebase from "../firebase";

const Login = () => {
  const history = useHistory();
  const emailRef = useRef();
  const passwordRef = useRef();

  const toast = useToast();

  const submit = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (password.length < 5)
      return toast({
        title: "Error",
        description: "Please check your credentials",
        status: "error",
      });

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(yes => {
        toast({
          title: "Signed in",
          description: "Welcome to Civy",
          status: "success",
        });
        setTimeout(() => history.push("/dashboard/home"), 500);
      })
      .catch(error => {
        console.log(error);
        toast({
          title: "Error",
          description: "Please check your credentials",
          status: "error",
        });
      });
  };

  return (
    <DefaultLayout>
      <ScaleFade in={true}>
        <Box
          onKeyPress={e => e.key === "Enter" && submit()}
          width="100%"
          mt="10rem"
          d="flex"
          justifyContent="center"
          alignItems="center"
          flexDir="column"
        >
          <Heading size="lg">Login</Heading>

          <Box w="25%">
            <FormLabel mt="1rem">E-Mail</FormLabel>
            <Input
              type="email"
              ref={emailRef}
              placeholder="eddie@van.halen"
              focusBorderColor="#06919155"
            />
          </Box>

          <Box w="25%">
            <FormLabel mt="1rem">Password</FormLabel>
            <Input
              type="password"
              ref={passwordRef}
              placeholder="panama123"
              focusBorderColor="#06919155"
            />
          </Box>

          <Text mt="0.5rem">
            Don't have an account?{" "}
            <Link
              color="teal"
              as={RouterLink}
              to="/register"
              _focus={{ outline: "none" }}
            >
              Register
            </Link>
          </Text>

          <Button mt="1.5rem" w="6rem" colorScheme="teal" onClick={submit}>
            Login
          </Button>
        </Box>
      </ScaleFade>
    </DefaultLayout>
  );
};

export default Login;
