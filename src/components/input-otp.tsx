import {
  InputOtpProps as HeroUIInputOptProps,
  InputOtp as HeroUIInputOtp,
} from "@heroui/react";

export interface InputOtpProps extends HeroUIInputOptProps {
  length: number;
}

const InputOtp: React.FC<InputOtpProps> = ({ length, ...props }) => {
  return (
    <HeroUIInputOtp
      length={length}
      classNames={{
        input: "w-12 h-12 text-center text-2xl",
        helperWrapper:
          "absolute min-w-max -bottom-[12px] -translate-x-1/2 left-1/2 flex justify-center text-danger text-tiny text-start truncate",
      }}
      {...props}
    />
  );
};

export default InputOtp;
