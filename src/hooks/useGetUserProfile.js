import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetUserProfile = () => {
  const [Puser, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_CONNECTO_API + `/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "warning", "top-accent");

          return;
        }
        if (data.isFrozen) {
          setUser(null);
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message || "An error occurred", "error", "left-accent");

      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [username, showToast]);

  return { loading, Puser };
};

export default useGetUserProfile;
