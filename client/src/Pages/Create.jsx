import {
  Box,
  Button,
  FormLabel,
  Heading,
  Input,
  ScaleFade,
  Select,
  SlideFade,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { DefaultLayout } from "../Components/DefaultLayout";
import { useAuth } from "../Contexts/AuthContext";
import firebase from "../firebase";

const Create = () => {
  const history = useHistory();
  const nameRef = useRef();
  const descriptionRef = useRef();
  const [field, setField] = useState();
  const { currentUser } = useAuth();

  const toast = useToast();

  const submit = () => {
    const name = nameRef.current.value;
    const description = descriptionRef.current.value;

    if (name.length < 5)
      return toast({
        position: "top",
        title: "Error",
        description: "Please enter a longer name",
        status: "error",
      });

    if (!field)
      return toast({
        position: "top",
        title: "Error",
        description: "Please choose a field",
        status: "error",
      });

    const id = uuid();

    firebase
      .firestore()
      .collection("companies")
      .doc(id)
      .set({
        id,
        name,
        description,
        field,
        members: [currentUser.uid],
        budgets: [],
      })
      .then(() =>
        firebase
          .firestore()
          .doc(`/users/${currentUser.uid}`)
          .update({
            companies: firebase.firestore.FieldValue.arrayUnion({ id, name }),
          })
      )
      .then(() => {
        setTimeout(() => history.push("/dashboard/home"), 500);
      })
      .catch(error => {
        console.log(error);
        toast({
          position: "top",
          title: "Something went wrong",
          description: "Please contact us!",
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
          <SlideFade in delay={0.2}>
            <Heading size="lg">Create a Company</Heading>
          </SlideFade>

          <Box w="25%">
            <SlideFade in delay={0.32}>
              <FormLabel mt="1rem">Name</FormLabel>
              <Input
                type="email"
                ref={nameRef}
                bgColor="#ffffffcc"
                placeholder="WorldSave Ventures Inc."
                focusBorderColor="#06919155"
              />
            </SlideFade>
          </Box>
          <Box w="25%">
            <SlideFade in delay={0.36}>
              <FormLabel mt="1rem">Field</FormLabel>
              <Select
                type="password"
                bgColor="#ffffffcc"
                placeholder="Select a field"
                focusBorderColor="#d3ffff54"
                onChange={e => setField(e.target.value)}
              >
                <option value="education">Education</option>
                <option value="environment">Environment</option>
              </Select>
            </SlideFade>
          </Box>

          <Box w="25%">
            <SlideFade in delay={0.4}>
              <FormLabel mt="1rem">Description</FormLabel>
              <Textarea
                ref={descriptionRef}
                type="password"
                bgColor="#ffffffcc"
                placeholder="panama123"
                focusBorderColor="#06919155"
              />
            </SlideFade>
          </Box>

          <SlideFade in delay={0.42}>
            <Button
              mt={10}
              fontWeight="bolder"
              size="lg"
              ml={2}
              variant="ghost"
              colorScheme="teal"
              bgColor="#00808011"
              onClick={submit}
            >
              Create Non-Profit
            </Button>
          </SlideFade>
        </Box>
      </ScaleFade>
    </DefaultLayout>
  );
};

export default Create;
