import {
  InputOtpProps as HeroUIInputOptProps,
  InputOtp as HeroUIInputOtp,
} from "@heroui/react";
import { useField } from "@/hooks/use-field";

export interface InputOtpProps extends HeroUIInputOptProps {
  length: number;
}

export const InputOtp: React.FC<InputOtpProps> = ({ ...props }) => {
  const field = useField<string>({
    id: props.id,
    name: props.name,
    value: props.value,
    onChange: (newValue) => {
      props.onValueChange?.(newValue);
    },
    ignoreForm: !props.name,
    error: props.errorMessage,
  });

  return (
    <HeroUIInputOtp
      classNames={{
        input: "w-12 h-12 text-center text-2xl",
        helperWrapper:
          "absolute min-w-max -bottom-[12px] -translate-x-1/2 left-1/2 flex justify-center text-danger text-tiny text-start truncate",
      }}
      {...props}
      id={field.id}
      name={field.name}
      value={field.value}
      onValueChange={field.onChange}
      onBlur={field.onBlur}
      errorMessage={field.error}
    />
  );
};
