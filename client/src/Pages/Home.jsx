import { Box, Button, Heading, Image, SlideFade, Text } from "@chakra-ui/react";
import { DefaultLayout } from "../Components/DefaultLayout";

const Home = () => {
  return (
    <DefaultLayout>
      <Box
        d="flex"
        w="100%"
        h="85vh"
        px="10rem"
        pt="12rem"
        backgroundImage="url('ThreeDotss.svg')"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        {/* text */}
        <Box w="50%">
          <SlideFade in={true} delay={0.5}>
            <Heading size="3xl" textShadow="1px 1px 5px gray">
              Welcome to <span style={{ color: "#069191" }}>Civy</span>
            </Heading>
          </SlideFade>
          <SlideFade in={true} delay={0.7}>
            <Text
              fontSize="2xl"
              mt={3}
              ml={2}
              mb={5}
              textShadow="1px 1px 3px gray"
            >
              A software suite designed to do it <strong>all</strong>.
              {/* <br /> Grow your non-profit faster than ever! */}
            </Text>
          </SlideFade>

          <SlideFade in={true} delay={0.9}>
            <Text fontSize="xl" ml={2}>
              Our one of a kind budgeting tools allow you to easily manage
              everything from payroll to tasks, with ease. Find out what it's
              like now!
            </Text>
            <Button
              mt={10}
              fontWeight="bolder"
              size="lg"
              ml={2}
              variant="ghost"
              colorScheme="teal"
              bgColor="#00808011"
            >
              Get Started
            </Button>
          </SlideFade>
        </Box>

        {/* image */}
        <Box>
          <SlideFade in={true} delay={1}>
            <Image w="600px" src="pana.svg" mt={-20} />
          </SlideFade>
        </Box>
      </Box>
    </DefaultLayout>
  );
};

export default Home;
