import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const Post = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const jdata = JSON.parse(localStorage.getItem("user-threads"));
        const token = jdata.token;
        const res = await fetch(
          import.meta.env.VITE_CONNECTO_API + "/api/users/profile/" + postedBy,
          {
            method: "GET",
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

          return;
        }
        setUser(data);
      } catch (error) {
        showToast(
          "Error",
          error.message || "An error occurred",
          "error",
          "left-accent"
        );

        setUser(null);
      }
    };

    getUser();
  }, [postedBy, showToast]);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;
      const jdata = JSON.parse(localStorage.getItem("user-threads"));
      const token = jdata.token;
      const res = await fetch(
        import.meta.env.VITE_CONNECTO_API + `/api/posts/${post._id}`,
        {
          method: "DELETE",
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
        return;
      }
      showToast("Deleted", "Post deleted", "info");
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      showToast(
        "Error",
        error.message || "An error occurred",
        "error",
        "left-accent"
      );
    }
  };

  if (!user) return null;
  return (
    <Box w={{base:"full", md:"600px"}} borderBottom={"1px solid"}
    borderColor={"whiteAlpha.300"}  pl={3.5} pr={4}>
    <Link to={`/${user.username}/post/${post._id}`}>
      
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size="md"
            name={user.name}
            src={user?.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
            {post.replies[0] && (
              <Avatar
                size="xs"
                name={post.replies[0].username}
                src={post.replies[0].userProfilePic}
                position={"absolute"}
                top={"0px"}
                left="15px"
                padding={"2px"}
              />
            )}

            {post.replies[1] && (
              <Avatar
                size="xs"
                name={post.replies[1].username}
                src={post.replies[1].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                right="-5px"
                padding={"2px"}
              />
            )}

            {post.replies[2] && (
              <Avatar
                size="xs"
                name={post.replies[2].username}
                src={post.replies[2].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                left="4px"
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex mt={3.5} flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
                {user?.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text
                fontSize={"xs"}
                width={36}
                textAlign={"right"}
                color={"gray.light"}
              >
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>

              {currentUser?._id === user._id && (
                <DeleteIcon size={20} onClick={handleDeletePost} />
              )}
            </Flex>
          </Flex>

          <Text fontSize={"md"} p={0.5}>{post.text}</Text>
          {post.img && (
            <Box
              borderRadius={20}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={post.img} w={"full"} />
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
    </Box>
  );
};

export default Post;
