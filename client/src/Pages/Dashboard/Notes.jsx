import { CloseIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
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
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { IoOpenOutline } from "react-icons/io5";
import { v4 as uuid } from "uuid";
import { SimpleLoadingView } from "../../Components/Loading";
import { useCompany } from "../../Contexts/CompanyContext";
import firebase from "../../firebase";

const Notes = () => {
  const {
    isOpen: isAddOpen,
    onClose: onAddClose,
    onOpen: onAddOpen,
  } = useDisclosure();

  const {
    isOpen: isViewdOpen,
    onClose: onViewClose,
    onOpen: onViewOpen,
  } = useDisclosure();

  const toast = useToast();

  const addContentRef = useRef();
  const addTagRef = useRef();

  const [company] = useCompany();

  const [notes, setNotes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);

  const [currentNote, setCurrentNote] = useState();

  useEffect(() => {
    if (!company) return;
    firebase
      .firestore()
      .collection(`/companies/${company.id}/notes`)
      .onSnapshot(snap => {
        if (snap.empty) {
          setNotes([]);
          setLoaded(true);
          return;
        }

        let docs = snap.docs.map(doc => doc.data());
        setNotes(docs);

        setLoaded(true);
      });
  }, [company]);

  useEffect(() => {
    if (!query || query === "") {
      setFilteredNotes(notes);
      return;
    }

    const altNotes = notes.filter(
      e =>
        e.content.toLowerCase().includes(query.toLowerCase()) ||
        e.tags.join(" ").toLowerCase().includes(query.toLowerCase())
    );

    setFilteredNotes(altNotes);
  }, [query, notes]);

  const openNote = key => {
    setCurrentNote(notes[key]);
    setTimeout(() => onViewOpen(), 200);
  };

  const removeNote = id => {
    setButtonLoading(true);

    firebase
      .firestore()
      .collection(`/companies/${company.id}/notes`)
      .doc(id)
      .delete()
      .then(() => {
        toast({
          position: "top",
          title: "Note Deleted",
          status: "success",
          isClosable: false,
          duration: 2000,
        });
        onAddClose();
        onViewClose();
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
        onViewClose();
      });
    setButtonLoading(false);
  };

  const addNotes = () => {
    setButtonLoading(true);

    const id = uuid();

    const content = addContentRef.current.value;
    const tags = addTagRef.current.value;

    if (content.length < 3)
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
      .collection(`/companies/${company.id}/notes`)
      .doc(id)
      .set({ id, content, tags: tagsArray })
      .then(() => {
        toast({
          position: "top",
          title: "Note Added",
          status: "success",
          isClosable: false,
          duration: 2000,
        });
        onAddClose();
        setButtonLoading(false);
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
        setButtonLoading(false);
      });
  };

  return !loaded ? (
    <SimpleLoadingView />
  ) : (
    <ScaleFade in>
      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent bgColor="#FFFFFFEE">
          <ModalHeader>Add a Note</ModalHeader>
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel>Content</FormLabel>
              <Textarea
                ref={addContentRef}
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
                placeholder="payroll, new_notes"
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
              isLoading={buttonLoading}
              colorScheme="teal"
              bgColor="#00808011"
              onClick={addNotes}
            >
              Add Note
            </Button>
            <Button onClick={onAddClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isViewdOpen} onClose={onViewClose}>
        <ModalOverlay />
        <ModalContent bgColor="#FFFFFFEE">
          <ModalHeader>View Note</ModalHeader>
          <ModalBody pb={6}>
            {!currentNote ? (
              <SimpleLoadingView />
            ) : (
              <>
                <FormControl mt={4}>
                  <FormLabel>Content</FormLabel>
                  <Box
                    disabled
                    _placeholder={{ color: "black" }}
                    type="text"
                    bgColor="#ffffffAA"
                    p={2}
                    rounded="lg"
                    border="1px solid #06919155"
                  >
                    {currentNote.content}
                  </Box>
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Tags</FormLabel>
                  <Box
                    disabled
                    _placeholder={{ color: "black" }}
                    type="text"
                    rounded="lg"
                  >
                    {currentNote.tags &&
                      currentNote.tags.map((t, key) => (
                        <Tag
                          rounded="full"
                          bgColor="#06919155"
                          key={key}
                          mr={1}
                        >
                          {t}
                        </Tag>
                      ))}
                  </Box>
                </FormControl>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              fontWeight="bolder"
              size="md"
              mr={2}
              variant="ghost"
              colorScheme="red"
              color="#800000"
              bgColor="#80000011"
              isLoading={buttonLoading}
              onClick={() => removeNote(currentNote.id, true)}
            >
              Delete Note
            </Button>
            <Button
              fontWeight="bolder"
              size="md"
              variant="ghost"
              colorScheme="teal"
              bgColor="#00808011"
              onClick={onViewClose}
            >
              Close
            </Button>
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
          Take a look at your <span style={{ color: "#069191" }}>notes</span>
        </Heading>

        {notes.length === 0 ? (
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
                  You don't have any notes, add one!
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
            py={3}
            overflowY="scroll"
          >
            <Box w="40%">
              <InputGroup>
                <Input
                  value={query}
                  h="3rem"
                  onChange={e => setQuery(e.target.value)}
                  type="email"
                  bgColor="#ffffffcc"
                  placeholder="Search through your notes!"
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
            {filteredNotes.map((e, key) => (
              <Flex w="100%" alignItems="center">
                <Box
                  mt={4}
                  w="70%"
                  boxShadow="0px 0px 3px -1px gray"
                  h="4rem"
                  position="relative"
                  cursor="pointer"
                  onClick={() => openNote(key)}
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
                      <Heading
                        size="md"
                        mb={1}
                        mr={2}
                        isTruncated
                        maxW="70%"
                        fontWeight="normal"
                      >
                        {e.content}
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

                <Tooltip label="View Note" bg="gray.300" color="black">
                  <IconButton
                    ml={3}
                    icon={<Icon as={IoOpenOutline} fontWeight="bold" />}
                    mt={4}
                    w="4rem"
                    color="#069191"
                    h="4rem"
                    position="relative"
                    cursor="pointer"
                    onClick={() => openNote(key)}
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

                <Tooltip label="Remove Note" bg="gray.300" color="black">
                  <IconButton
                    ml={3}
                    icon={<MinusIcon fontWeight="bold" />}
                    mt={4}
                    w="4rem"
                    color="#800000"
                    h="4rem"
                    position="relative"
                    cursor="pointer"
                    onClick={() => removeNote(e.id)}
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
            Add New Note
          </Button>
        </Flex>
      </Box>
    </ScaleFade>
  );
};

export default Notes;
