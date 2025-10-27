import { api } from "@/service/api";
import { FormValues } from "@/types/form";
import { User } from "@/types/user";

export const setPassword = (data: FormValues) => {
  return api.put<User>("/user/password", data);
};
