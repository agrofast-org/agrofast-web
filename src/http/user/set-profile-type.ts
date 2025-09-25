import { api } from "@/service/api";
import { ProfileType, User } from "@/types/user";

export type ProfileTypeResponse = {
  user: User;
};

export const setProfileType = (type: ProfileType) => {
  return api.put<ProfileTypeResponse>("/user/profile-type", {
    profile_type: type,
  });
};
