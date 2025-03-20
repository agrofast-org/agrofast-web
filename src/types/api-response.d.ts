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
