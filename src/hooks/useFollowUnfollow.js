import { useState } from "react";
import useShowToast from "./useShowToast";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";

const useFollowUnfollow = (user) => {
  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast("Error", "Please login to follow", "warning", "left-accent");
      return;
    }
    if (updating) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "warning", "top-accent");

        return;
      }

      if (following) {
        showToast("Unfollowed", `Unfollowed ${user.name}`, "info", "top-accent");
        user.followers.pop(); // simulate removing from followers
      } else {
        showToast("Followed", `Followed ${user.name}`, "info", "top-accent");
        user.followers.push(currentUser?._id); // simulate adding to followers
      }
      setFollowing(!following);

      console.log(data);
    } catch (error) {
      showToast("Error", error.message || "An error occurred", "error", "left-accent");

    } finally {
      setUpdating(false);
    }
  };

  return { handleFollowUnfollow, updating, following };
};

export default useFollowUnfollow;
