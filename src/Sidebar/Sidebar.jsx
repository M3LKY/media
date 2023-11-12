// import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState } from "recoil";
// import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";

const MAX_CHAR = 500;
import {
  Box,
  FormLabel,
  Tooltip,
} from "@chakra-ui/react";
import {
  Avatar,
  Link,
  useColorMode,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { FcFaq } from "react-icons/fc";
import { FcSettings } from "react-icons/fc";
import { FcNightLandscape } from "react-icons/fc";
import Connecto from "/connecto.png";
import Mobileonnecto from "/mobileconnecto.png";
import { FcSearch } from "react-icons/fc";
import { BsPlusSquareDotted } from "react-icons/bs";
import SuggestedUser from "../components/SuggestedUser";

import { FcHome } from "react-icons/fc";
import { BiLogOut } from "react-icons/bi";
// import CreatePost from "../components/CreatePost";

const Sidebar = ({ user }) => {
  const { toggleColorMode } = useColorMode();
  const logout = useLogout();

  const {
    isOpen: isSearchModalOpen,
    onOpen: onSearchModalOpen,
    onClose: onSearchModalClose,
  } = useDisclosure();

  const {
    isOpen: isCreatePostModalOpen,
    onOpen: onCreatePostModalOpen,
    onClose: onCreatePostModalClose,
  } = useDisclosure();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [Suser, setUser] = useState(null);
  const searchRef = useRef();

  const handleSearchUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/users/profile/${searchRef.current.value}`);
      const data = await res.json();
      setUser(data);
    } catch (error) {
      setError("An error occurred while searching for the user.");
    } finally {
      setLoading(false);
    }
  };

  // const handleCreatePost = () => {
  //   // Add logic for creating a post
  //   // ...

  //   // Close the create post modal
  //   onCreatePostModalClose();
  // };


  const [postText, setPostText] = useState("");
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  // const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();

  const handleTextChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          img: imgUrl,
        }),
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post created successfully", "success");
      if (username === user.username) {
        setPosts([data, ...posts]);
      }
      onCreatePostModalClose();
      setPostText("");
      setImgUrl("");
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
  };


  const sidebarItems = [
    {
      icon: <FcHome size={24} />,
      text: "Home",
      link: "/",
    },
    {
      icon: <FcSearch size={24} />,
      text: "Search",
      click: onSearchModalOpen,
    },
    {
      icon: <BsPlusSquareDotted size={24} />,
      text: "Create",
      click: onCreatePostModalOpen,
    },
    {
      icon: <FcFaq size={24} />,
      text: "Chat",
      link: "/chat",
    },

    {
      icon: <FcNightLandscape size={24} />,
      text: "Theme",
      click: toggleColorMode,
    },
    {
      icon: <FcSettings size={24} />,
      text: "Settings",
      link: "/settings",
    },
    {
      icon: <Avatar size={"sm"} name={user.name} src={user.profilePic} />,
      text: "Profile",
      link: `/${user.username}`,
    },
  ];

  return (
    <>
    <Box
      height={"100vh"}
      borderRight={"1px solid"}
      borderColor={"whiteAlpha.300"}
      py={8}
      position={"sticky"}
      top={0}
      left={0}
      px={{ base: 2, md: 4 }}
    >
      <Flex direction={"column"} gap={10} w="full" height={"full"}>
        <Link
          to={"/"}
          as={RouterLink}
          pl={2}
          display={{ base: "none", md: "block" }}
          cursor="pointer"
        >
          <Image src={Connecto} h={7} />
        </Link>
        <Link
          to={"/"}
          as={RouterLink}
          p={2}
          display={{ base: "block", md: "none" }}
          borderRadius={6}
          _hover={{
            bg: "whiteAlpha.200",
          }}
          cursor="pointer"
        >
          <Image src={Mobileonnecto} w={9} h={9} />
        </Link>
        <Flex direction={"column"} gap={5} cursor={"pointer"}>
          {sidebarItems.map((item, index) => (
            <Tooltip
              key={index}
              hasArrow
              label={item.text}
              placement="right"
              ml={1}
              openDelay={500}
              display={{ base: "block", md: "none" }}
            >
              {user && (
                <Link
                  display={"flex"}
                  to={item.link}
                  as={RouterLink}
                  onClick={item.click}
                  alignItems={"center"}
                  gap={4}
                  _hover={{ bg: "whiteAlpha.400" }}
                  borderRadius={6}
                  p={2}
                  w={{ base: 10, md: "full" }}
                  justifyContent={{ base: "center", md: "flex-start" }}
                >
                  {item.icon}
                  <Box display={{ base: "none", md: "block" }}>{item.text}</Box>
                </Link>
              )}
            </Tooltip>
          ))}
        </Flex>
        <Tooltip
          hasArrow
          label={"Logout"}
          placement="right"
          ml={1}
          openDelay={500}
          display={{ base: "block", md: "none" }}
        >
          <Link
            display={"flex"}
            as={RouterLink}
            onClick={logout}
            to={"/auth"}
            alignItems={"center"}
            gap={4}
            _hover={{ bg: "whiteAlpha.400" }}
            borderRadius={6}
            p={2}
            w={{ base: 10, md: "full" }}
            mt={"auto"}
            justifyContent={{ base: "center", md: "flex-start" }}
          >
            <BiLogOut size={25} />
            <Box display={{ base: "none", md: "block" }}>Logout</Box>
          </Link>
        </Tooltip>
      </Flex>
    </Box>

    {/*model search*/}

    <Modal isOpen={isSearchModalOpen} onClose={onSearchModalClose} motionPreset="slideInLeft">
        <ModalOverlay />
        <ModalContent bg={"black"} border={"1px solid gray"} maxW={"400px"}>
          <ModalHeader>Search user</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSearchUser}>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input
                  placeholder="asaprogrammer"
                  ref={searchRef}
                  isInvalid={error}
                />
              </FormControl>

              <Flex w="full" justifyContent="flex-end">
                <Button
                  type="submit"
                  ml="auto"
                  size="sm"
                  my={4}
                  isLoading={isLoading}
                >
                  Search
                </Button>
              </Flex>
            </form>
            {error && (
              <Box mt={2} color="red.500">
                {error}
              </Box>
            )}
            {Suser && <SuggestedUser user={Suser} onClose={onSearchModalClose} />}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/*model create*/}

      <Modal isOpen={isCreatePostModalOpen} onClose={onCreatePostModalClose}>        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Post content goes here.."
                onChange={handleTextChange}
                value={postText}
              />
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>

              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />

              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>

            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected img" />
                <CloseButton
                  onClick={() => {
                    setImgUrl("");
                  }}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={isLoading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Sidebar;
