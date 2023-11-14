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
  Box,
  Tooltip,
  Avatar,
  Link,
  useColorMode,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill, BsPlusSquareDotted } from "react-icons/bs";
import { useRecoilState } from "recoil";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { Link as RouterLink, useParams } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import Connecto from "/connecto.png";
import Mobileonnecto from "/mobileconnecto.png";
import SuggestedUser from "../components/SuggestedUser";
import {
  FcHome,
  FcSearch,
  FcFaq,
  FcSettings,
  FcNightLandscape,
} from "react-icons/fc";
import { BiLogOut } from "react-icons/bi";
import { Search2Icon } from "@chakra-ui/icons";

const MAX_CHAR = 500;

const Sidebar = ({ user }) => {
  const { toggleColorMode } = useColorMode();
  const logout = useLogout();
  const [postText, setPostText] = useState("");
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [Suser, setUser] = useState(null);
  const searchRef = useRef();

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

  const handleSearchUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setError(null);
      const res = await fetch(`/api/users/profile/${searchRef.current.value}`);
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "warning", "top-accent");

        return;
      }
      setUser(data);
    } catch (error) {
      setError("An error occurred while searching for the user.");
    } finally {
      setLoading(false);
    }
  };

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
      if(postText === ""){
        showToast("Error", "Is Empty", "warning", "top-accent");
        return;
      }
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
        showToast("Error", data.error, "warning", "top-accent");

        return;
      }
      showToast("Posted", "Post created successfully", "success", "left-accent");
      if (username === user.username) {
        setPosts([data, ...posts]);
      }
      onCreatePostModalClose();
      setPostText("");
      setImgUrl("");
    } catch (error) {
      showToast("Error", error.message || "An error occurred", "error", "left-accent");

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
        px={{ base: 4, md: 4 }}
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
            display={{ base: "block", md: "none" }}
            _hover={{
              bg: "whiteAlpha.200",
            }}
            cursor="pointer"
          >
            <Image src={Mobileonnecto} ml={1} w={9} h={9} />
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
                    <Box display={{ base: "none", md: "block" }}>
                      {item.text}
                    </Box>
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

      <Modal
        isOpen={isSearchModalOpen}
        onClose={onSearchModalClose}
        motionPreset="slideInLeft"
      >
        <ModalOverlay />
        <ModalContent bg={"black"} color={"white"}>
          <ModalHeader>Search</ModalHeader>
          <ModalCloseButton color={"red"} />
          <ModalBody pb={6}>
            <form onSubmit={handleSearchUser}>
              <Flex
                w={{ base: "full", md: "415px" }}
                alignItems={"center"}
                gap={2}
                mb={5}
              >
                <Input
                  placeholder="e.g. John"
                  ref={searchRef}
                  isInvalid={error}
                  borderColor={"orange"}
                />

                <Button
                  colorScheme=""
                  color={"white"}
                  type="submit"
                  size="sm"
                  isLoading={isLoading}
                >
                  <Search2Icon fontSize={18} color={"orange"} />
                </Button>
              </Flex>
            </form>
            {error && (
              <Box mt={2} color="red.500">
                {error}
              </Box>
            )}
            {Suser && (
              <SuggestedUser user={Suser} onClose={onSearchModalClose} />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/*model create*/}

      <Modal isOpen={isCreatePostModalOpen} onClose={onCreatePostModalClose}>
        {" "}
        <ModalOverlay />
        <ModalContent bg={"black"} color={"white"}>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton color={"red"} />
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
                color={"gray.500"}
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
                  bg={"red.300"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="teal"
              onClick={handleCreatePost}
              isLoading={isLoading}
              pb={0.5}
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
