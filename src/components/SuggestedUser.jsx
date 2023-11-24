import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const SuggestedUser = ({ user, onClose }) => {
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

  const handleClose = () => {
    onClose();
  };
  return (
    <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
      {/* left side */}
      
    <Link to={`/${user.username}`}>
      <Flex gap={2} onClick={handleClose}>
        
        {!user.profilePic && (
        <Avatar src={"/person.jpg"} />
        )}
        {user.profilePic && (
        <Avatar src={user.profilePic} />
        )}
        <Box>
          <Text fontSize={"sm"} fontWeight={"bold"}>
            {user.username}
          </Text>
          <Text color={"gray.light"} fontSize={"sm"}>
            {user.name}
          </Text>
        </Box>
        
      </Flex>
      </Link>
      {/* right side */}
      <Button
        size={"sm"}
        color={following ? "white" : "black"}
        bg={following ? "black" : "white"}
        
        onClick={handleFollowUnfollow}
        isLoading={updating}
        borderRadius={20}
        _hover={{
          color: following ? "white" : "green.800",
          opacity: ".8",
        }}
      >
        {following ? "Unfollow" : "Follow"}
      </Button>
    </Flex>
  );
};

export default SuggestedUser;
