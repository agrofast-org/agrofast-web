import api from "@/service/api";
import { Success } from "@/types/api-response";
import { ProfileType, User } from "@/types/user";

export type ProfileTypeResponse = Success<{
  user: User;
}>;

export const profileType = (type: ProfileType) => {
  return api.put<ProfileTypeResponse>("/user/profile-type", { profile_type: type }).then(({ data }) => data);
};
