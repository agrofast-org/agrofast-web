import { api } from "@/service/api";

export const updateUser = (data: FormData) => {
  return api.put("/user", data);
};
