import { AddIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
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
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { IoOpenOutline } from "react-icons/io5";
import { useHistory } from "react-router-dom";
import { SimpleLoadingView } from "../../Components/Loading";
import { getMonthString } from "../../config";
import { useCompany } from "../../Contexts/CompanyContext";
import firebase from "../../firebase";

const Budget = () => {
  const history = useHistory();

  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isAddOpen,
    onClose: onAddClose,
    onOpen: onAddOpen,
  } = useDisclosure();

  const {
    isOpen: isViewOpen,
    onClose: onViewClose,
    onOpen: onViewOpen,
  } = useDisclosure();

  const [company] = useCompany();

  const [expenses, setExpenses] = useState([]);

  const toast = useToast();

  const [currentBudget, setCurrentBudget] = useState([0]);
  const newInputRef = useRef();
  const addInputRef = useRef();

  useEffect(() => {
    console.log(company);
    if (!company || !company.budgets || company.budgets.length < 1) {
      setCurrentBudget("Not Defined");
    } else setCurrentBudget(company.budgets[company.budgets.length - 1]);
  }, [company]);

  // get expenses
  useEffect(() => {
    if (!company) return;
    firebase
      .firestore()
      .collection(`/companies/${company.id}/expenses`)
      .onSnapshot(snap => {
        if (snap.empty) {
          setExpenses([]);
          return;
        }

        let docs = snap.docs.map(doc => doc.data());
        setExpenses(docs);
      });
  }, [company]);

  const changeCurrentBudget = newBudget => {
    setCurrentBudget(newBudget);

    let budgets = company.budgets;
    budgets[budgets.length - 1] = Number(newBudget);

    firebase
      .firestore()
      .doc(`/companies/${company.id}`)
      .update({ budgets })
      .then(() => {
        onClose();
      })
      .catch(() => {
        onClose();
        toast({
          position: "top",
          status: "error",
          title: "Something went wrong",
          description: "Please contact us and report the error",
          duration: 3000,
          isClosable: false,
        });
      });
  };

  const addNewBudget = newBudget => {
    setCurrentBudget(newBudget);

    let budgets = company.budgets;
    budgets[budgets.length] = Number(newBudget);

    firebase
      .firestore()
      .doc(`/companies/${company.id}`)
      .update({ budgets })
      .then(() => {
        onAddClose();
      })
      .catch(() => {
        onAddClose();
        toast({
          position: "top",
          status: "error",
          title: "Something went wrong",
          description: "Please contact us and report the error",
          duration: 3000,
          isClosable: false,
        });
      });
  };

  return !company ? (
    <SimpleLoadingView />
  ) : (
    <ScaleFade in={true}>
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
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bgColor="#FFFFFFEE">
            <ModalHeader>Edit Your Budget</ModalHeader>
            <ModalBody pb={6}>
              <FormControl mt={4}>
                <FormLabel>New Budget</FormLabel>
                <Input
                  ref={newInputRef}
                  placeholder="$2100"
                  type="number"
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
                onClick={() => changeCurrentBudget(newInputRef.current.value)}
              >
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isAddOpen} onClose={onAddClose}>
          <ModalOverlay />
          <ModalContent bgColor="#FFFFFFEE">
            <ModalHeader>Add another month</ModalHeader>
            <ModalBody pb={6}>
              <FormControl mt={4}>
                <FormLabel>Add Budget</FormLabel>
                <Input
                  ref={addInputRef}
                  placeholder="$2100"
                  type="number"
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
                onClick={() => addNewBudget(addInputRef.current.value)}
              >
                Save
              </Button>
              <Button onClick={onAddClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isViewOpen} onClose={onViewClose}>
          <ModalOverlay />
          <ModalContent bgColor="#FFFFFFEE">
            <ModalHeader>Look at your history</ModalHeader>
            <ModalBody pb={6}>
              {company &&
                company.budgets &&
                company.budgets
                  .slice(0)
                  .reverse()
                  .map((b, key) => (
                    <Flex
                      key={key}
                      w="100%"
                      h="2.5rem"
                      bgColor="#00808001"
                      boxShadow="0px 2px 4px -1px lightgray"
                      cursor="pointer"
                      _hover={{
                        boxShadow: "0px 2px 5px 0px lightgray",
                      }}
                      transition="all 200ms"
                      alignItems="center"
                      px={3}
                      justifyContent="space-between"
                      rounded="lg"
                      mb={2}
                    >
                      <Text color="#008080">${b}</Text>
                      <Text>
                        {getMonthString(
                          new Date(
                            new Date().setMonth(
                              new Date().getUTCMonth() + 1 - key
                            )
                          ).getMonth()
                        ) +
                          " " +
                          new Date().getFullYear()}
                      </Text>
                    </Flex>
                  ))}
            </ModalBody>

            <ModalFooter>
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

        <Heading size="xl" textShadow="1px 1px 3px gray">
          Take a look at your budget
        </Heading>
        <Flex w="100%" alignItems="center">
          <Box
            mt={8}
            w="30%"
            boxShadow="0px 0px 3px -1px gray"
            h="8rem"
            position="relative"
            cursor="pointer"
            onClick={onOpen}
            rounded="lg"
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
              <Flex justifyContent="flex-start" alignItems="center">
                <Heading size="md" mb={1} mr={2}>
                  This month's budget{" "}
                </Heading>
                <Tooltip
                  label="Click anywhere to change your budget!"
                  bg="gray.300"
                  color="black"
                >
                  <EditIcon fontSize="xl" />
                </Tooltip>
              </Flex>
              <Heading size="md" mb={1} fontWeight="normal" color="#008080">
                $ {currentBudget}
              </Heading>
            </ScaleFade>
          </Box>

          <Tooltip label="Add another month" bg="gray.300" color="black">
            <IconButton
              ml={3}
              icon={<AddIcon fontWeight="bold" />}
              mt={8}
              w="4rem"
              color="#008080"
              h="4rem"
              position="relative"
              cursor="pointer"
              onClick={onAddOpen}
              rounded="lg"
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

          <Tooltip label="View your budget history" bg="gray.300" color="black">
            <IconButton
              ml={3}
              icon={<ViewIcon fontWeight="bold" />}
              mt={8}
              w="4rem"
              color="#008080"
              h="4rem"
              position="relative"
              cursor="pointer"
              onClick={onViewOpen}
              rounded="lg"
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

        {/* adding expenses */}
        <Text fontSize="3xl" textShadow="1px 1px 1px gray" mt={5}>
          Manage your <span style={{ color: "#069191" }}>expenses</span>
        </Text>
        <Box
          mt={8}
          w="30%"
          boxShadow="0px 0px 3px -1px gray"
          h="8rem"
          position="relative"
          cursor="pointer"
          onClick={() => history.push("/dashboard/expenses")}
          rounded="lg"
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
            <Flex justifyContent="flex-start" alignItems="center">
              <Heading size="md" mb={1} mr={2}>
                Leftover budget
              </Heading>

              <Icon as={IoOpenOutline} fontSize="xl" mb={1} fontWeight="bold" />
            </Flex>

            <Heading
              size="md"
              mb={1}
              fontWeight="normal"
              color={
                (expenses.length > 0 ? expenses.reduce((a, c) => a + c) : 0) ===
                0
                  ? "#008055"
                  : "#800000"
              }
            >
              ${" "}
              {Number(currentBudget) -
                (expenses.length > 0
                  ? expenses.map(a => Number(a.amount)).reduce((a, c) => a + c)
                  : 0)}
            </Heading>
          </ScaleFade>
        </Box>
      </Box>
    </ScaleFade>
  );
};

export default Budget;
