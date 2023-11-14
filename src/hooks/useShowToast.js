import { useToast } from "@chakra-ui/toast";
import { useCallback } from "react";

const useShowToast = () => {
  const toast = useToast();

  const showToast = useCallback(
    (title, description, status, variant) => {
      toast({
        title,
        description,
        status,
        variant,
        duration: 5500,
        isClosable: true,
        position: "top-right",
      });
    },
    [toast]
  );

  return showToast;
};

export default useShowToast;
