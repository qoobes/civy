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
import { useRef, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { DefaultLayout } from "../Components/DefaultLayout";
import firebase from "../firebase";

const checkEmail = email => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const Register = () => {
  const history = useHistory();
  const emailRef = useRef();
  const nameRef = useRef();
  const passwordRef = useRef();

  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const submit = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const name = nameRef.current.value;

    if (!checkEmail(email))
      return toast({
        position: "top",
        title: "Bad Email",
        description: "Your email is not valid",
        status: "error",
      });

    if (password.length < 5)
      return toast({
        position: "top",
        title: "Weak Password",
        description: "Please enter a stronger password",
        status: "error",
      });

    if (name.length < 2)
      return toast({
        position: "top",
        title: "Name too short",
        description: "Please enter a longer name",
        status: "error",
      });

    setLoading(true);

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebase
          .auth()
          .currentUser.updateProfile({ displayName: name })
          .then(() => {
            firebase
              .firestore()
              .doc(`users/${firebase.auth().currentUser.uid}`)
              .set({
                id: firebase.auth().currentUser.uid,
                displayName: name,
                photoUrl: "",
                companies: [],
              })
              .then(() => {
                toast({
                  position: "top",
                  title: "Account Created",
                  description: "Welcome to Civy",
                  status: "success",
                });
                setTimeout(() => history.push("/create"), 500);
              });
          });
      })
      .catch(error => {
        console.log(error);
        toast({
          position: "top",
          title: "Existing account",
          description: "An account with that email already exists",
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
          <Heading size="lg">Register</Heading>

          <Box w="25%">
            <FormLabel mt="1rem">Name</FormLabel>
            <Input
              bgColor="#ffffffcc"
              ref={nameRef}
              placeholder="Jimi Hendrix"
              focusBorderColor="#06919155"
            />
          </Box>

          <Box w="25%">
            <FormLabel mt="1rem">E-Mail</FormLabel>
            <Input
              bgColor="#ffffffcc"
              ref={emailRef}
              type="email"
              placeholder="jimi@hendrix.com"
              focusBorderColor="#06919155"
            />
          </Box>

          <Box w="25%">
            <FormLabel mt="1rem">Password</FormLabel>
            <Input
              bgColor="#ffffffcc"
              ref={passwordRef}
              type="password"
              placeholder="purplehaze123"
              focusBorderColor="#06919155"
            />
          </Box>

          <Text mt="0.5rem">
            Have an account?{" "}
            <Link
              color="#069191"
              as={RouterLink}
              to="/login"
              _focus={{ outline: "none" }}
            >
              Log in
            </Link>
          </Text>

          <Button
            mt={6}
            fontWeight="bolder"
            size="md"
            w="7rem"
            ml={2}
            variant="ghost"
            colorScheme="teal"
            bgColor="#00808011"
            onClick={submit}
          >
            Register
          </Button>
        </Box>
      </ScaleFade>
    </DefaultLayout>
  );
};

export default Register;
