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
        const res = await fetch(import.meta.env.VITE_CONNECTO_API + `/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "warning", "top-accent");

          return;
        }
        setPosts([data]);
      } catch (error) {
        showToast("Error", error.message || "An error occurred", "error", "left-accent");

      }
    };
    getPost();
  }, [showToast, pid, setPosts]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(import.meta.env.VITE_CONNECTO_API + `/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "warning", "top-accent");

        return;
      }
      showToast("Deleted", "Post deleted", "info");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message || "An error occurred", "error", "left-accent");

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
    <Box display="flex" justifyItems="center" alignItems="center" centercontent="true">
      <Box w={{ base: "full", md: "50%" }} margin="auto" mt={8}>
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

        <Text  my={3}>
          {currentPost.text}
        </Text>

        {currentPost.img && (
          <Box
            borderRadius={6}
            overflow={"hidden"}
            border={"1px solid"}
            borderColor={"gray.light"}
          >
            <Image src={currentPost.img} w={"full"} />
          </Box>
        )}

        <Flex  gap={3} my={3}>
          <Actions post={currentPost} />
        </Flex>

        <Divider my={4} />

        {/* <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex> */}

        <Divider my={4} />
        {currentPost.replies.map((reply) => (
          <Comment
            key={reply._id}
            reply={reply}
            lastReply={
              reply._id ===
              currentPost.replies[currentPost.replies.length - 1]._id
            }
          />
        ))}
      </Box>
    </Box>
  );
};

export default PostPage;
