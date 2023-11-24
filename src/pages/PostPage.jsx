import {
  Avatar,
  Box,
  // Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const currentPost = posts[0];

  useEffect(() => {
    const getPost = async () => {
      setPosts([]);
      try {
        const jdata = JSON.parse(localStorage.getItem("user-threads"));
        const token = jdata.token;
        const res = await fetch(
          import.meta.env.VITE_CONNECTO_API + `/api/posts/${pid}`,
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
        setPosts([data]);
      } catch (error) {
        showToast(
          "Error",
          error.message || "An error occurred",
          "error",
          "left-accent"
        );
      }
    };
    getPost();
  }, [showToast, pid, setPosts]);

  const handleDeletePost = async () => {
    try {
      const jdata = JSON.parse(localStorage.getItem("user-threads"));
        const token = jdata.token;
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(
        import.meta.env.VITE_CONNECTO_API + `/api/posts/${currentPost._id}`,
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
      navigate(`/${user.username}`);
    } catch (error) {
      showToast(
        "Error",
        error.message || "An error occurred",
        "error",
        "left-accent"
      );
    }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost) return null;
  // console.log("currentPost", currentPost);

  return (
    <Flex  alignItems={"flex-start"} justifyContent={{base: "inherit", md:"space-around"}}>

      <Box w={{ base: "full", md: "600px" }}  mt={8} >
        <Box p={3.5}>
        <Flex>
          <Flex w={"full"} alignItems={"center"} gap={3}>
            <Avatar src={user.profilePic} size={"md"} />
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
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <Text
              fontSize={"xs"}
              width={36}
              textAlign={"right"}
              color={"gray.light"}
            >
              {formatDistanceToNow(new Date(currentPost.createdAt))} ago
            </Text>

            {currentUser?._id === user._id && (
              <DeleteIcon
                size={20}
                cursor={"pointer"}
                onClick={handleDeletePost}
              />
            )}
          </Flex>
        </Flex>

        <Text my={3} fontSize={"md"} p={0.5}>{currentPost.text}</Text>

        {currentPost.img && (
          <Box
            borderRadius={20}
            overflow={"hidden"}
            border={"1px solid"}
            borderColor={"gray.light"}
          >
            <Image src={currentPost.img} w={"full"} />
          </Box>
        )}

        <Flex gap={3} my={3}>
          <Actions post={currentPost} />
        </Flex>
</Box>
        <Divider my={4}  />
        
        {currentPost.replies.map((reply) => (
            
            // <Box key={reply._id} pl={3.5} pr={3.5}>

          <Comment
            key={reply._id}
            reply={reply}
            lastReply={
              reply._id ===
              currentPost.replies[currentPost.replies.length - 1]._id
            }
          />
          // </Box>
        ))}
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

export default PostPage;
