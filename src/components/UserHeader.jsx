import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserHeader = ({ user }) => {
  const currentUser = useRecoilValue(userAtom); // logged in user
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
  return (
    <VStack gap={4} alignItems={"start"}>
      <Box w="full" display="flex" alignItems="center" justifyContent="center">
        <Box
          display="flex"
          flexDirection={{ base: "column", md: "column" }}
          alignItems="center"
        >
          <Box>
            {user.profilePic && (
              <Avatar
                name={user.name}
                src={user.profilePic}
                size={{ base: "xl", md: "2xl" }}
              />
            )}
            {!user.profilePic && (
              <Avatar
                name={user.name}
                src={"/person.jpg"}
                size={{ base: "xl", md: "2xl" }}
              />
            )}
          </Box>
          <Box mt={3}>
            <Text fontSize="2xl" fontWeight="bold">
              {user.name}
            </Text>
            <Flex gap={2} alignItems="center">
              <Text fontSize="sm">{user.username}</Text>
            </Flex>
          </Box>
        </Box>
      </Box>

      <Text>{user.bio}</Text>

      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          {/* <Box w='1' h='1' bg={"gray.light"} borderRadius={"full"}></Box> */}
          {/* <Li	nk color={"gray.light"}>instagram.com</Link> */}
        </Flex>
        <Flex>
          {currentUser?._id === user._id && (
            <Link as={RouterLink} to="/update">
              <Button size={"sm"}>Update Profile</Button>
            </Link>
          )}
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}> Threads</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
