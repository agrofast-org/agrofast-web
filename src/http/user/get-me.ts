import api from "@/service/api";
import { Success } from "@/types/api-response";
import { User } from "@/types/user";

export type GetMeResponse = Success<{
  data: { user: User; authenticated: boolean };
}>;

export const getMe = () => {
  return api.get<GetMeResponse>("/user/info/me").then(({ data }) => data);
};
