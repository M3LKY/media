import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import { SettingsPage } from "./pages/SettingsPage";
import PageLayout from "./PageLayout/PageLayout";

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();
  return (
    <PageLayout alignItems="center" justifyContent="center">
      <Box position={"relative"} w="full">
        <Container
          maxW={pathname === "/" ? { base: "full", md: "68%" } : "full"}
           minW={{base:"auto", md:"950px"}}
        >
          <Routes>
            <Route
              path="/"
              element={user ? <HomePage /> : <Navigate to="/auth" />}
            />
            <Route
              path="/auth"
              element={user == null ? <AuthPage /> : <Navigate to="/" />}
            />
            <Route
              path="/update"
              element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
            />
            <Route
              path="/:username"
              element={
                user ? (
                  <>
                    <UserPage />
                    <CreatePost />
                  </>
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route path="/:username/post/:pid" element={<PostPage />} />
            <Route
              path="/chat"
              element={user ? <ChatPage /> : <Navigate to={"/auth"} />}
            />
            <Route
              path="/settings"
              element={user ? <SettingsPage /> : <Navigate to={"/auth"} />}
            />
          </Routes>
        </Container>
      </Box>
    </PageLayout>
  );
}

export default App;
