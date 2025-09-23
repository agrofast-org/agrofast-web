import api from "@/service/api";
import { User } from "@/types/user";

export type GetMeResponse = {
  user: User;
  authenticated: boolean;
};

export const getMe = () => {
  return api.get<GetMeResponse>("/user/info/me").then(({ data }) => data);
};
