import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import userAtom from "../atoms/userAtom"
import { useRecoilValue } from "recoil";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import { Box } from "@chakra-ui/layout";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
  const user = useRecoilValue(userAtom);
  const { Puser, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  const requestBody = JSON.stringify({
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
  });


  useEffect(() => {
    const getPosts = async () => {
      if (!Puser) return;
      setFetchingPosts(true);
      try {
        const res = await fetch(
          import.meta.env.VITE_CONNECTO_API + `/api/posts/user/${username}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // Add any other necessary headers
            },
            body: requestBody,
          }
        );
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "warning", "top-accent");
          console.log(data.error)
          return;
        }
        console.log(data);
        setPosts(data);
      } catch (error) {
        showToast(
          "Error",
          error.message || "An error occurred",
          "error",
          "left-accent"
        );
        console.log(error)
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getPosts();
  }, [username, showToast, setPosts, Puser]);

  if (!Puser && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!Puser && !loading) return <h1>User not found</h1>;

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Box w={{ base: "full", md: "53%" }} mr={{ base: 0, md: 12 }}>
        <UserHeader user={Puser} />

        {!fetchingPosts && posts.length === 0 && <h1>User has not posts.</h1>}
        {fetchingPosts && (
          <Flex justifyContent={"center"} my={12}>
            <Spinner size={"xl"} />
          </Flex>
        )}
        {Array.isArray(posts) &&
          posts.length > 0 &&
          posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))}
      </Box>
    </Box>
  );
};

export default UserPage;
