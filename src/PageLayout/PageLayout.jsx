import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "../Sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const PageLayout = ({ children }) => {
  const { pathname } = useLocation();
  const user = useRecoilValue(userAtom);

  return (
    <Flex>
      {pathname !== "/auth" && user !== null ? (
        <Box w={{ base: "70px", md: "240px" }}>
          <Sidebar user={user} />
        </Box>
      ) : null}
      <Box flex={1} w={{ base: "calc(100% - 70px)", md: "calc(100% - 240px)" }} >
        {children}
      </Box>
    </Flex>
  );
};

export default PageLayout;
