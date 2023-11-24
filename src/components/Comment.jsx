import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
const Comment = ({ reply, lastReply }) => {
  return (
    <>
      <Flex pl={3.5} pr={3.5} gap={4} py={2} my={2} w={"full"}>
        <Link to={`/${reply.username}`}>
          <Avatar src={reply.userProfilePic} size={"sm"} />
        </Link>
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Link to={`/${reply.username}`}>
              <Text fontSize="sm" fontWeight="bold">
                {reply.username}
              </Text>
            </Link>
          </Flex>
          <Text>{reply.text}</Text>
        </Flex>
      </Flex>
      {!lastReply ? <Divider /> : null}
    </>
  );
};

export default Comment;
