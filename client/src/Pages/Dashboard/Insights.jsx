import { Box, Heading, ScaleFade, SlideFade, Text } from "@chakra-ui/react";
import { CanvasJSChart } from "canvasjs-react-charts";
import { createBudgetsChart } from "../../config";

const Insights = () => {
  return (
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
        alignItems="center"
      >
        <Heading size="xl" textShadow="1px 1px 3px gray">
          Take a look at your budget
        </Heading>
        <Text fontSize="3xl" mt={5} mb={5} textShadow="1px 1px 2px gray">
          Long-term stats
        </Text>
        <Box
          w="40%"
          bgColor="#ffffffaa"
          rounded="lg"
          p={3}
          boxShadow="0px 2px 5px -1px lightgray"
          transition="all 200ms"
          _hover={{
            boxShadow: "0px 2px 5px 1px lightgray",
            backgroundColor: "#ffffffcc",
          }}
        >
          <SlideFade in delay={0.5}>
            <CanvasJSChart options={createBudgetsChart("yes")} />
          </SlideFade>
        </Box>
      </Box>
    </ScaleFade>
  );
};

export default Insights;
