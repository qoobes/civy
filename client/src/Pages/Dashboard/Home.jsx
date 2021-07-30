import { Box, Flex, Grid, Heading, ScaleFade, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { SimpleLoadingView } from "../../Components/Loading";
import { useCompany } from "../../Contexts/CompanyContext";

const DashHome = () => {
  const [company] = useCompany();

  const content1 = [
    {
      title: "Budget",
      description: "Try setting a budget",
      color: "#008080",
      href: "/dashboard/budget",
    },
    {
      title: "Insights (AI)",
      description: "Take a look at our AI-powered insights!",
      color: "#008080",
      href: "/dashboard/insights",
    },
  ];

  const content2 = [
    {
      title: "Tasks",
      description: "You can add tasks too",
      color: "#ca5858",
      href: "/dashboard/tasks",
    },
    {
      title: "Notes",
      description: "Add notes to keep track",
      color: "#caac58",
      href: "/dashboard/notes",
    },
  ];

  const settings = [
    {
      title: "Settings",
      description: "Try changing your settings",
      color: "#65ca58",
      href: "/dashboard/settings",
    },
  ];
  return !company ? (
    <SimpleLoadingView />
  ) : (
    <ScaleFade in={true}>
      <Flex
        w={{ base: "100%", xl: "80%" }}
        flexDir="column"
        justifyContent="center"
        p={12}
      >
        <ScaleFade in delay={0.1}>
          <Heading textShadow="1px 1px 3px gray">
            Welcome to <span style={{ color: "#069191" }}>Civy</span>
          </Heading>
          <Text fontSize="xl" mt={3} mb={5} textShadow="1px 1px 1px gray">
            Here are some things to get you started with{" "}
            <strong>{company.name}</strong>!
          </Text>

          <Text fontSize="3xl" mt={5} mb={5} textShadow="1px 1px 2px gray">
            Wanna look into your budget or see some{" "}
            <span style={{ color: "#069191" }}>data</span>?
          </Text>

          <Grid gridTemplateColumns="1fr 1fr" gap="10px">
            {content1.map((item, key) => (
              <Box
                w="100%"
                boxShadow="0px 0px 3px -1px gray"
                h="8rem"
                position="relative"
                cursor="pointer"
                rounded="lg"
                as={RouterLink}
                to={item.href}
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
                  backgroundColor={item.color}
                  zIndex="100"
                  position="absolute"
                />
                <ScaleFade in delay={key * 0.2 + 0.2}>
                  <Heading size="md" mb={1}>
                    {item.title}
                  </Heading>
                  <Text>{item.description}</Text>
                </ScaleFade>
              </Box>
            ))}
          </Grid>

          <Text fontSize="3xl" mt={5} mb={5} textShadow="1px 1px 2px gray">
            Wanna take a look at what you're{" "}
            <span style={{ color: "#069191" }}>doing</span>?
          </Text>

          <Grid gridTemplateColumns="1fr 1fr" gap="10px">
            {content2.map((item, key) => (
              <Box
                w="100%"
                boxShadow="0px 0px 3px -1px gray"
                h="8rem"
                position="relative"
                cursor="pointer"
                rounded="lg"
                as={RouterLink}
                to={item.href}
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
                  backgroundColor={item.color}
                  zIndex="100"
                  position="absolute"
                />
                <ScaleFade in delay={key * 0.2 + 0.2}>
                  <Heading size="md" mb={1}>
                    {item.title}
                  </Heading>
                  <Text>{item.description}</Text>
                </ScaleFade>
              </Box>
            ))}
          </Grid>
          <Text fontSize="3xl" mt={5} mb={5} textShadow="1px 1px 2px gray">
            Finally, you can tweak your{" "}
            <span style={{ color: "#069191" }}>settings</span>!
          </Text>
          <Grid gridTemplateColumns="1fr 1fr" gap="10px">
            {settings.map((item, key) => (
              <Box
                w="100%"
                boxShadow="0px 0px 3px -1px gray"
                h="8rem"
                position="relative"
                cursor="pointer"
                rounded="lg"
                as={RouterLink}
                to={item.href}
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
                  backgroundColor={item.color}
                  zIndex="100"
                  position="absolute"
                />
                <ScaleFade in delay={key * 0.2 + 0.2}>
                  <Heading size="md" mb={1}>
                    {item.title}
                  </Heading>
                  <Text>{item.description}</Text>
                </ScaleFade>
              </Box>
            ))}
          </Grid>
        </ScaleFade>
      </Flex>
    </ScaleFade>
  );
};
export default DashHome;
