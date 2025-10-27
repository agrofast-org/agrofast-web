export type Option = {
  image?: string;
  label: string;
  value: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: any;
};

export type Options = Option[];
