import { Axios, AxiosError } from "axios";

export type Success<T = undefined> = Axios<T extends undefined ? unknown : T>;

export type Error<T = undefined> = AxiosError<
  T extends undefined ? ValidationError : T
>;
