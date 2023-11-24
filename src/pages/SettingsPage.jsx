import { Button, Text, Box, Flex } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";
import SuggestedUsers from "../components/SuggestedUsers";

export const SettingsPage = () => {
  const showToast = useShowToast();
  const logout = useLogout();

  const freezeAccount = async () => {
    if (!window.confirm("Are you sure you want to freeze your account?"))
      return;

    try {
      const jdata = JSON.parse(localStorage.getItem("user-threads"));
      const token = jdata.token;
      const res = await fetch(
        import.meta.env.VITE_CONNECTO_API + "/api/users/freeze",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            credentials: "include",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "warning", "top-accent");
      }
      if (data.success) {
        await logout();
        showToast(
          "Frozen",
          "Your account has been frozen",
          "success",
          "top-accent"
        );
      }
    } catch (error) {
      showToast(
        "Error",
        error.message || "An error occurred",
        "error",
        "left-accent"
      );
    }
  };

  return (
    <Flex  alignItems={"flex-start"} justifyContent={{base: "inherit", md:"space-around"}}>

      <Box w={{base:"full", md:"580px"}} pt={10} pl={6}>
        <Text my={1} fontWeight={"bold"}>
          Freeze Your Account
        </Text>
        <Text my={1} mb={3}>
          You can unfreeze your account anytime by logging in.
        </Text>
              
        <Button borderRadius={20} bg={"red.600"} pb={0.5} color={"white"} onClick={freezeAccount}>
          Freeze
        </Button>
      </Box>
      <Box
      height={"100vh"}
      borderLeft={"1px solid"}
      borderColor={"whiteAlpha.300"}
      py={8}
      position={"sticky"}
      top={0}
      left={0}
      m={0}
      px={{ base: 4, md: 4 }}
      flex={30}
      display={{base: "none", md: "block"}}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};
