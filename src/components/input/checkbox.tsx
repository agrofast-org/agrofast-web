import React from "react";
import {
  CheckboxProps as HeroUICheckboxProps,
  Checkbox as HeroUICheckbox,
} from "@heroui/react";

export interface CheckboxProps extends HeroUICheckboxProps {
  children?: React.ReactNode;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ ...props }) => {
  return (
    <div className="relative flex flex-row justify-start items-center gap-2 px-1 py-2 w-full">
      <HeroUICheckbox size="sm" {...props} />
    </div>
  );
};
