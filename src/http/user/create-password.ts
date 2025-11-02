import { api } from "@/service/api";
import { FormValues } from "@/types/form";
import { User } from "@/types/user";

export const createPassword = (data: FormValues) => {
  return api.post<User>("/user/password", data);
};
