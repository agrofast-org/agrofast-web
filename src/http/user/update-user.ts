import { api } from "@/service/api";
import { FormValues } from "@/types/form";

export const updateUser = (data: FormValues) => {
  return api.put("/user", data);
};
