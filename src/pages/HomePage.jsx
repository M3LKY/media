import { Box, Flex, Skeleton, SkeletonCircle } from "@chakra-ui/react";
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
        const jdata = JSON.parse(localStorage.getItem("user-threads"));
        const token = jdata.token;

        const res = await fetch(
          import.meta.env.VITE_CONNECTO_API + "/api/posts/feed",
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
          // console.log(data.error);
          return;
        }

        // console.log(data);
        setPosts(data);
      } catch (error) {
        showToast(
          "Error",
          error.message || "An error occurred",
          "error",
          "left-accent"
        );
        // console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getFeedPosts();
  }, [showToast, setPosts]);

  return (
    <Flex
      alignItems={"flex-start"}
      justifyContent={{ base: "inherit", md: "space-around" }}
    >
      <Box flex={70}>
        {!loading && posts.length === 0 && (
          <h1 style={{padding: 5}}>Follow some users to see the feed</h1>
        )}
        
        {loading &&
          Array.isArray(posts) &&
          [0, 1, 2, 3, 4].map((_, idx) => (
            <Box key={idx}>
              <Flex gap={2} alignItems={"center"} p={"4"} borderRadius={"md"}>
                {/* avatar skeleton */}
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                {/* username and fullname skeleton */}
                <Flex w={"full"} flexDirection={"column"} gap={2}>
                  <Skeleton h={"8px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90px"} />
                </Flex>

                {/* follow button skeleton */}
                <Flex>
                  <Skeleton h={"20px"} w={"60px"} borderRadius={20} />
                </Flex>
              </Flex>
              <Box
                display="flex"
                alignItems="right"
                justifyContent="right"
                p={5}
                pt={0}
              >
                <Skeleton h={"150px"} w={{base: "full", md:"540px"}} borderRadius={20} />
              </Box>
            </Box>
          ))}

        {Array.isArray(posts) &&
          posts.length > 0 &&
          posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
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
        display={{ base: "none", sm: "none", md: "block" }}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomePage;
