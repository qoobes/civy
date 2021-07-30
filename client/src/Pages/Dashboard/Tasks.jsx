import { CheckIcon, CloseIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Tag,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { SimpleLoadingView } from "../../Components/Loading";
import { useCompany } from "../../Contexts/CompanyContext";
import firebase from "../../firebase";

const Tasks = () => {
  const {
    isOpen: isAddOpen,
    onClose: onAddClose,
    onOpen: onAddOpen,
  } = useDisclosure();
  const toast = useToast();

  const addNameRef = useRef();
  const addTagRef = useRef();

  const [company] = useCompany();

  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState();

  useEffect(() => {
    if (!company) return;
    firebase
      .firestore()
      .collection(`/companies/${company.id}/tasks`)
      .onSnapshot(snap => {
        if (snap.empty) {
          setTasks([]);
          setLoaded(true);
          return;
        }

        let docs = snap.docs.map(doc => doc.data());
        setTasks(docs);

        setLoaded(true);
      });
  }, [company]);

  useEffect(() => {
    if (!query || query === "") {
      setFilteredTasks(tasks);
      return;
    }

    const altTasks = tasks.filter(
      e =>
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.tags.join(" ").toLowerCase().includes(query.toLowerCase())
    );

    setFilteredTasks(altTasks);
  }, [query, tasks]);

  const markComplete = id =>
    firebase
      .firestore()
      .collection(`/companies/${company.id}/tasks`)
      .doc(id)
      .update({ completed: true });
  const markIncomplete = id =>
    firebase
      .firestore()
      .collection(`/companies/${company.id}/tasks`)
      .doc(id)
      .update({ completed: false });

  const removeTask = id =>
    firebase
      .firestore()
      .collection(`/companies/${company.id}/tasks`)
      .doc(id)
      .delete()
      .then(() => {
        toast({
          position: "top",
          title: "Task Deleted",
          status: "success",
          isClosable: false,
          duration: 2000,
        });
        onAddClose();
      })
      .catch(() => {
        toast({
          position: "top",
          title: "Something went wrong",
          description: "Please contact us",
          status: "error",
          isClosable: false,
          duration: 2000,
        });
        onAddClose();
      });

  const addTasks = () => {
    const id = uuid();

    const name = addNameRef.current.value;
    const tags = addTagRef.current.value;

    if (name.length < 3)
      return toast({
        position: "top",
        title: "Missing info",
        description: "Please fill out all the fields",
        status: "error",
        isClosable: false,
        duration: 2000,
      });

    const tagsArray = tags
      .trim()
      .split(",")
      .map(t => t.trim());

    firebase
      .firestore()
      .collection(`/companies/${company.id}/tasks`)
      .doc(id)
      .set({ id, name, tags: tagsArray, completed: false })
      .then(() => {
        toast({
          position: "top",
          title: "Task Added",
          status: "success",
          isClosable: false,
          duration: 2000,
        });
        onAddClose();
      })
      .catch(() => {
        toast({
          position: "top",
          title: "Something went wrong",
          description: "Please contact us",
          status: "error",
          isClosable: false,
          duration: 2000,
        });
        onAddClose();
      });
  };

  return !loaded ? (
    <SimpleLoadingView />
  ) : (
    <ScaleFade in>
      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent bgColor="#FFFFFFEE">
          <ModalHeader>Add A Task</ModalHeader>
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel>Name</FormLabel>
              <Input
                ref={addNameRef}
                placeholder="Pay the piper"
                type="text"
                bgColor="#ffffffAA"
                focusBorderColor="#06919155"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Tags</FormLabel>
              <Input
                ref={addTagRef}
                placeholder="payroll, new_tasks"
                type="text"
                bgColor="#ffffffAA"
                focusBorderColor="#06919155"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              fontWeight="bolder"
              size="md"
              mr={2}
              variant="ghost"
              colorScheme="teal"
              bgColor="#00808011"
              onClick={addTasks}
            >
              Add Task
            </Button>
            <Button onClick={onAddClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* load the epxenses */}
      <Box
        d="flex"
        flexDir="column"
        w="100%"
        h="85vh"
        p="3rem"
        backgroundImage="url('ThreeDotss.svg')"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Heading size="xl" textShadow="1px 1px 3px gray" mb={5}>
          Take a look at your <span style={{ color: "#069191" }}>tasks</span>
        </Heading>

        {tasks.length === 0 ? (
          <Flex
            mt={8}
            w="30%"
            boxShadow="0px 0px 3px -1px gray"
            h="6"
            position="relative"
            cursor="pointer"
            rounded="lg"
            bgColor="#ffffffaa"
            p={6}
            transition="box-shadow 200ms, background-color 200ms"
            _hover={{
              boxShadow: "0px 2px 5px -1px gray",
              backgroundColor: "#ffffffdd",
            }}
            _active={{
              boxShadow: "none",
            }}
            _focus={{
              boxShadow: "none",
            }}
          >
            <Box
              h="100%"
              w="0.4rem"
              roundedLeft="lg"
              top={0}
              left={0}
              backgroundColor="#008080"
              zIndex="100"
              position="absolute"
            />
            <ScaleFade in delay={0.3}>
              <Flex justifyContent="flex-start" alignItems="center" h="100%">
                <Heading size="md" mr={2} fontWeight="normal">
                  You don't have any tasks, add one!
                </Heading>
              </Flex>
            </ScaleFade>
          </Flex>
        ) : (
          <Flex
            w="70%"
            flexDir="column"
            minH="20vh"
            maxH="60vh"
            overflowY="scroll"
            py={3}
          >
            <Box w="40%">
              <InputGroup>
                <Input
                  value={query}
                  h="3rem"
                  onChange={e => setQuery(e.target.value)}
                  type="email"
                  bgColor="#ffffffcc"
                  placeholder="Search through your tasks!"
                  border="2px solid transparent"
                  _focus={{
                    border: "2px solid #06919188 !important",
                  }}
                />
                <InputRightElement mt={1} mr={1} onClick={() => setQuery("")}>
                  <IconButton
                    icon={<CloseIcon fontSize="10" />}
                    size="sm"
                    rounded="full"
                  />
                </InputRightElement>
              </InputGroup>
            </Box>
            {filteredTasks.map((e, key) => (
              <Flex w="100%" alignItems="center">
                <Box
                  mt={4}
                  w="70%"
                  boxShadow="0px 0px 3px -1px gray"
                  h="4rem"
                  position="relative"
                  cursor="pointer"
                  key={key}
                  rounded="lg"
                  bgColor="#ffffffaa"
                  p={5}
                  pl={6}
                  transition="box-shadow 200ms, background-color 200ms"
                  _hover={{
                    boxShadow: "0px 2px 5px -1px gray",
                    backgroundColor: "#ffffffdd",
                  }}
                  _active={{
                    boxShadow: "none",
                  }}
                  _focus={{
                    boxShadow: "none",
                  }}
                >
                  <Box
                    h="100%"
                    w="0.4rem"
                    roundedLeft="lg"
                    top={0}
                    left={0}
                    backgroundColor="#008080"
                    zIndex="100"
                    position="absolute"
                  />
                  <ScaleFade in delay={0.3}>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Heading size="md" mb={1} mr={2}>
                        {e.completed ? <s>{e.name}</s> : e.name}
                      </Heading>
                      <Flex>
                        {e.tags &&
                          e.tags.map((t, key) => (
                            <Tag
                              rounded="full"
                              bgColor="#06919155"
                              key={key}
                              mx={1}
                            >
                              {t}
                            </Tag>
                          ))}
                      </Flex>
                    </Flex>
                  </ScaleFade>
                </Box>

                {!e.completed ? (
                  <Tooltip label="Mark Complete" bg="gray.300" color="black">
                    <IconButton
                      ml={3}
                      icon={<CheckIcon fontWeight="bold" />}
                      mt={4}
                      w="4rem"
                      color="#008080"
                      h="4rem"
                      position="relative"
                      cursor="pointer"
                      onClick={() => markComplete(e.id)}
                      rounded="full"
                      bgColor="#ffffffaa"
                      p={8}
                      transition="box-shadow 200ms, background-color 200ms"
                      _hover={{
                        boxShadow: "0px 2px 5px -1px gray",
                        backgroundColor: "#ffffffdd",
                      }}
                      _active={{
                        boxShadow: "none",
                      }}
                      _focus={{
                        boxShadow: "none",
                      }}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip label="Mark Incomplete" bg="gray.300" color="black">
                    <IconButton
                      ml={3}
                      rounded="full"
                      icon={<CloseIcon fontWeight="bold" fontSize="xs" />}
                      mt={4}
                      w="4rem"
                      color="#800000"
                      h="4rem"
                      position="relative"
                      cursor="pointer"
                      onClick={() => markIncomplete(e.id)}
                      bgColor="#ffffffaa"
                      p={8}
                      transition="box-shadow 200ms, background-color 200ms"
                      _hover={{
                        boxShadow: "0px 2px 5px -1px gray",
                        backgroundColor: "#ffffffdd",
                      }}
                      _active={{
                        boxShadow: "none",
                      }}
                      _focus={{
                        boxShadow: "none",
                      }}
                    />
                  </Tooltip>
                )}
                <Tooltip label="Remove Task" bg="gray.300" color="black">
                  <IconButton
                    ml={3}
                    icon={<MinusIcon fontWeight="bold" />}
                    mt={4}
                    w="4rem"
                    color="#800000"
                    h="4rem"
                    position="relative"
                    cursor="pointer"
                    onClick={() => removeTask(e.id)}
                    rounded="full"
                    bgColor="#ffffffaa"
                    p={8}
                    transition="box-shadow 200ms, background-color 200ms"
                    _hover={{
                      boxShadow: "0px 2px 5px -1px gray",
                      backgroundColor: "#ffffffdd",
                    }}
                    _active={{
                      boxShadow: "none",
                    }}
                    _focus={{
                      boxShadow: "none",
                    }}
                  />
                </Tooltip>
              </Flex>
            ))}
          </Flex>
        )}
        <Flex mt={5}>
          <Button
            fontWeight="bolder"
            textShadow="0px 1px 1px gray"
            size="lg"
            variant="ghost"
            colorScheme="teal"
            onClick={onAddOpen}
            bgColor="#00808011"
          >
            Add New Task
          </Button>
        </Flex>
      </Box>
    </ScaleFade>
  );
};

export default Tasks;
