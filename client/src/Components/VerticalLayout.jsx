import {
  Avatar,
  Box,
  CloseButton,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Select,
  Text,
  useBreakpointValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiBarChartAlt, BiLineChart, BiMoney, BiNotepad } from "react-icons/bi";
import {
  FiBell,
  FiHome,
  FiSettings,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useCompany } from "../Contexts/CompanyContext";
import firebase from "../firebase";

const LinkItems = [
  { name: "Home", icon: FiHome },
  { name: "Budget", icon: FiTrendingUp },
  { name: "Expenses", icon: BiMoney },
  { name: "Insights", icon: BiBarChartAlt },
  { name: "Predictions", icon: BiLineChart },
  { name: "Tasks", icon: FiStar },
  { name: "Notes", icon: BiNotepad },
  { name: "Settings", icon: FiSettings },
];

export default function VerticalLayout({ children }) {
  const [companies, setCompanies] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [_, setSelectedCompanyVal] = useCompany(null);

  const [user, setUser] = useState(null);
  const { currentUser } = useAuth();
  const toast = useToast();
  const history = useHistory();

  useEffect(() => {
    firebase
      .firestore()
      .doc(`/companies/${selectedCompany}`)
      .onSnapshot(snap => {
        let company = snap.data();
        console.log(company);
        setSelectedCompanyVal(company);
      });
  }, [selectedCompany]);

  // get the user
  useEffect(() => {
    firebase
      .firestore()
      .doc(`users/${currentUser.uid}`)
      .onSnapshot(snap => {
        if (!snap.exists) {
          toast({
            position: "top",
            status: "error",
            title: "Something went wrong",
            description: "Please contact us!",
            isClosable: false,
            duration: 3000,
          });
          history.push("/");
          return;
        }
        setUser(snap.data());
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      let localCompanies = user.companies;
      setCompanies(localCompanies);

      if (!localCompanies || localCompanies.length < 1) {
        toast({
          position: "top",
          status: "info",
          title: "Please create a company",
          description:
            "It appears you don't have any companies listed, so please create one!",
          isClosable: false,
          duration: 3000,
        });

        history.push("/create");
      }
      if (!selectedCompany)
        localCompanies &&
          localCompanies.length > 0 &&
          setSelectedCompany(localCompanies[0].id);
    }
  }, [user]);

  useEffect(() => {
    const ball1 = document.getElementsByClassName("ball1");
    for (let i = 0; i < ball1.length; i++) {
      const seed = () => Math.random() + 0.5;
      const current = ball1.item(i);

      current.animate(
        [
          { transform: "translateY(0px)" },
          {
            transform: `translateY(${300 * seed()}px) translateX(${
              200 * seed()
            }px)`,
          },
          {
            transform: `translateY(${500 * seed()}px) translateX(${
              300 * seed()
            }px)`,
          },
          {
            transform: `translateY(${400 * seed()}px) translateX(${
              600 * seed()
            }px)`,
          },
          {
            transform: `translateY(${450 * seed()}px) translateX(${
              800 * seed()
            }px)`,
          },
          {
            transform: `translateY(${500 * seed()}px) translateX(${
              1000 * seed()
            }px)`,
          },
          {
            transform: `translateY(${300 * seed()}px) translateX(${
              1300 * seed()
            }px)`,
          },
          {
            transform: `translateY(${100 * seed()}px) translateX(${
              900 * seed()
            }px)`,
          },
          {
            transform: `translateY(${200 * seed()}px) translateX(${
              700 * seed()
            }px)`,
          },
          {
            transform: `translateY(${300 * seed()}px) translateX(${
              500 * seed()
            }px)`,
          },
          {
            transform: `translateY(${200 * seed()}px) translateX(${
              300 * seed()
            }px)`,
          },
          { transform: "translateY(0px) translateX(0px)" },
        ],
        { duration: 1000 * 30, iterations: Infinity }
      );
    }

    const ball2 = document.getElementsByClassName("ball2");
    for (let i = 0; i < ball2.length; i++) {
      const seed = () => Math.random() + 0.5;
      const current = ball2.item(i);

      current.animate(
        [
          { transform: `translateY(${0 - seed()}px)` },
          {
            transform: `translateY(${300 * seed()}px) translateX(-${
              200 * seed()
            }px)`,
          },
          {
            transform: `translateY(${500 * seed()}px) translateX(-${
              300 * seed()
            }px)`,
          },
          {
            transform: `translateY(${400 * seed()}px) translateX(-${
              600 * seed()
            }px)`,
          },
          {
            transform: `translateY(${450 * seed()}px) translateX(-${
              800 * seed()
            }px)`,
          },
          {
            transform: `translateY(${500 * seed()}px) translateX(-${
              1000 * seed()
            }px)`,
          },
          {
            transform: `translateY(${300 * seed()}px) translateX(-${
              1300 * seed()
            }px)`,
          },
          {
            transform: `translateY(${100 * seed()}px) translateX(-${
              900 * seed()
            }px)`,
          },
          {
            transform: `translateY(${200 * seed()}px) translateX(-${
              700 * seed()
            }px)`,
          },
          {
            transform: `translateY(${300 * seed()}px) translateX(-${
              500 * seed()
            }px)`,
          },
          {
            transform: `translateY(${200 * seed()}px) translateX(-${
              300 * seed()
            }px)`,
          },
          { transform: "translateY(0px) translateX(0px)" },
        ],
        { duration: 1000 * 30, iterations: Infinity }
      );
    }
  }, []);

  return (
    <Box
      h="100vh"
      w="100vw"
      position="relative"
      maxH="100vh"
      maxW="100vw"
      overflowX="hidden"
      overflowY="hidden"
      bgImage={"url('/slickBackground.png')"}
    >
      <Image
        className="ball1 animate-hue"
        src="/RedDot.svg"
        position="absolute"
        w="100px"
        h="100px"
        zIndex="-1"
      />
      <Image
        className="ball1"
        left="200px"
        src="/RedDot.svg"
        w="150px"
        h="150px"
        position="absolute"
        zIndex="-1"
      />
      <Image
        className="ball1 animate-hue"
        w="100px"
        h="100px"
        src="/RedDot.svg"
        position="absolute"
        zIndex="-1"
      />
      <Image
        className="ball2 animate-hue"
        src="/BlueDot.svg"
        w="150px"
        h="150px"
        position="absolute"
        right="0"
        zIndex="-1"
      />
      <Image
        className="ball2 aniamte-hue"
        src="/BlueDot.svg"
        right="50px"
        top="100px"
        w="100px"
        h="100px"
        position="absolute"
        zIndex="-1"
      />

      <SidebarContent />

      {/* mobilenav */}
      <MobileNav
        companies={companies}
        setSelectedCompany={setSelectedCompany}
        selectedCompany={selectedCompany}
        onOpen={true}
      />

      <Box ml={{ base: 0, md: 60 }} p="4" zIndex="100">
        {children}
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      transition="3s ease"
      bg={"#ffffffaa"}
      zIndex="2"
      borderRight="1px"
      borderRightColor={"gray.200"}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="100vh"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Box fontFamily="monospace" fontWeight="bold">
          <Heading
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            fontWeight="black"
            letterSpacing="1px"
            as={RouterLink}
            to="/"
            cursor="pointer"
            color="#008080AA"
            transition="color 200ms"
            _hover={{
              color: "#008080",
            }}
            fontSize="2xl"
          >
            Civy
          </Heading>
        </Box>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map(link => (
        <NavItem key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }) => {
  const [loc, setLoc] = useState("");
  const history = useHistory();

  useEffect(() => {
    let location = window.location.pathname.split("/");
    location = location[location.length - 1].toLowerCase();

    setLoc(location);
  }, [history.location]);

  return (
    <Link
      as={RouterLink}
      to={`/dashboard/${children.toLowerCase()}`}
      style={{ textDecoration: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        rounded="2xl"
        role="group"
        transition="background-color 200ms"
        cursor="pointer"
        color={loc.includes(children.toLowerCase()) && "teal"}
        textShadow="1px 1px 3px gray"
        _hover={{
          bg: "teal.50",
        }}
        {...rest}
      >
        {icon && <Icon mr="4" fontSize="16" as={icon} />}
        {children}
      </Flex>
    </Link>
  );
};

const MobileNav = ({
  onOpen,
  companies,
  setSelectedCompany,
  selectedCompany,
  ...rest
}) => {
  const { currentUser } = useAuth();
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      zIndex="2"
      height="20"
      alignItems="center"
      bg={"#ffffffaa"}
      borderBottomWidth="1px"
      borderBottomColor={"gray.200"}
      justifyContent="space-between"
      {...rest}
    >
      <Select
        h="2.4rem"
        size="lg"
        bgColor="#00808001"
        focusBorderColor="#d3ffff54"
        w="16rem"
        defaultValue={selectedCompany}
        onChange={e => setSelectedCompany(e.target.value)}
      >
        {companies &&
          companies.map((company, key) => (
            <option value={company.id} key={key}>
              {company.name}
            </option>
          ))}
      </Select>

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={"center"} mr={5}>
          <Menu mr={5}>
            <MenuButton
              _hover={{ textDecoration: "underline", color: "teal" }}
              transition="text-decoration 200ms"
              mr={5}
              py={2}
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar size={"sm"} src={currentUser.photoUrl} />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text>{currentUser.displayName}</Text>
                </VStack>
              </HStack>
            </MenuButton>
            <MenuList bg={"white"} borderColor={"gray.200"}>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
