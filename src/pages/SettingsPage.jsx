import { Button, Text, Box } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";

export const SettingsPage = () => {
  const showToast = useShowToast();
  const logout = useLogout();

  const freezeAccount = async () => {
    if (!window.confirm("Are you sure you want to freeze your account?"))
      return;

    try {
      const res = await fetch(import.meta.env.VITE_CONNECTO_API + "/api/users/freeze", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "warning", "top-accent");

      }
      if (data.success) {
        await logout();
        showToast("Frozen", "Your account has been frozen", "success", "top-accent");
      }
    } catch (error) {
      showToast("Error", error.message || "An error occurred", "error", "left-accent");

    }
  };

  return (
    <Box display="flex" justifyItems="center" alignItems="center" centerContent>
      <Box w={{ base: "full", md: "65%" }} margin="auto" mt={8}>
        <Text my={1} fontWeight={"bold"}>
          Freeze Your Account
        </Text>
        <Text my={1} mb={3}>
          You can unfreeze your account anytime by logging in.
        </Text>
        <Button size={"sm"} colorScheme="red" onClick={freezeAccount} pb={1}>
          Freeze
        </Button>
      </Box>
    </Box>
  );
};
