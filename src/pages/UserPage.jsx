import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import { Box } from "@chakra-ui/layout";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetchingPosts(true);
      try {
        const res = await fetch(
          import.meta.env.VITE_CONNECTO_API + `/api/posts/user/${username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Add any other necessary headers
            },
          }
        );
        const data = await res.json();

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

        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getPosts();
  }, [username, showToast, setPosts, user]);

  if (!user && loading) {
    return (
      <Flex  pt={7} justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) return <h1 style={{padding: "10px"}}>User not found</h1>;

  return (
    <Flex  alignItems={"flex-start"} justifyContent={{base: "inherit", md:"space-around"}}>

      <Box w={{ base: "full", md: "600px" }}>
                <UserHeader user={user} />
        
        {!fetchingPosts && posts.length === 0 && <h1 style={{padding: "10px"}}>User has not posts.</h1>}
        {/* {fetchingPosts && (
          <Flex justifyContent={"center"} my={12}>
            <Spinner size={"xl"} />
          </Flex>
        )} */}
        {fetchingPosts &&
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
      display={{base: "none", md: "block"}}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default UserPage;
