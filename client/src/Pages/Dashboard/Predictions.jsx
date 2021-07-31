import { Box, Heading, ScaleFade, SlideFade, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SimpleLoadingView } from "../../Components/Loading";
import { useCompany } from "../../Contexts/CompanyContext";

const Predictions = () => {
  const [company] = useCompany();
  const [predict, setPredict] = useState();

  const fetchMonth = async () =>
    await fetch("http://144.126.219.175/predict", {
      method: "POST",
      body: JSON.stringify({
        budgets: company.budgets,
        date: new Date()
          .toDateString()
          .substring(4, new Date().toDateString().length),
        category: company.category,
      }),
    });

  useEffect(() => {
    if (!company) return;

    fetchMonth()
      .then(res => res.json())
      .then(res => setPredict(res.budget));
  }, [company]);

  return !predict ? (
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
        alignItems="center"
      >
        <Heading size="xl" textShadow="1px 1px 3px gray">
          Ask the mighty AI to <span style={{ color: "#069191" }}>predict</span>
        </Heading>
        <Text fontSize="3xl" mt={5} mb={5} textShadow="1px 1px 2px gray">
          The wisdom of AI predicts your budget as such...!
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
            Your next budget: {predict}
          </SlideFade>
        </Box>
      </Box>
    </ScaleFade>
  );
};

export default Predictions;
