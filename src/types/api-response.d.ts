import { AxiosError } from "axios";

export type Success<T = undefined> = T extends undefined
  ? {
      message: string;
      success: boolean;
    }
  : {
      message: string;
      data: T;
      success: boolean;
    };

export type Error<T = undefined> = (T extends undefined
  ? {
      message: string;
      success: boolean;
    }
  : {
      message: string;
      data: T;
      success: boolean;
    }) &
  AxiosError;
