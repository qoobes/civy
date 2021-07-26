import { Box, ScaleFade } from "@chakra-ui/react";
import Navbar from "./Navbar";

export const DefaultLayout = ({ children }) => {
  return (
    <Box>
      <ScaleFade in={true}>
        <Navbar />
        <Box>{children}</Box>
      </ScaleFade>
    </Box>
  );
};
