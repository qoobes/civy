import { Box, ScaleFade } from "@chakra-ui/react";
import Navbar from "./Navbar";

export const DefaultLayout = ({ children, disableBg }) => {
  return (
    <Box h="100vh">
      <Box
        position="absolute"
        height="100vh"
        zIndex="-1"
        backgroundImage={!disableBg && "url('ThreeDotssFlip.svg')"}
        backgroundRepeat={!disableBg && "no-repeat"}
        backgroundPosition={!disableBg && "center"}
        width="100vw"
      />
      <ScaleFade in={true}>
        <Navbar />
        <Box>{children}</Box>
      </ScaleFade>
    </Box>
  );
};
