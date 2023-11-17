import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
    
      try {
        const jdata = JSON.parse(localStorage.getItem('user-threads'));
const token = jdata.token;

        console.log(token)
        const res = await fetch(
          import.meta.env.VITE_CONNECTO_API + "/api/posts/feed",
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'credentials': 'include',
              'Authorization': `Bearer ${token}`, 
            },
          }
        );
    
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "warning", "top-accent");
          console.log(data.error);
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
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
     
    getFeedPosts();
  }, [showToast, setPosts]);

  return (
    <Flex gap="10" alignItems={"flex-start"}>
      <Box flex={70}>
        {!loading && posts.length === 0 && (
          <h1>Follow some users to see the feed</h1>
        )}
        {loading && (
          <Flex justify="center">
            <Spinner size="xl" />
          </Flex>
        )}

        {Array.isArray(posts) &&
          posts.length > 0 &&
          posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))}
      </Box>
      <Box
        flex={30}
        position={"sticky"}
        display={{
          base: "none",
          md: "block",
        }}
        style={{ top: 15, zIndex: 1 }}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomePage;
