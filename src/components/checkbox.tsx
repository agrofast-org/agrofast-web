import {
  CheckboxProps as HeroUICheckboxProps,
  Checkbox as HeroUICheckbox,
} from "@heroui/react";

export interface CheckboxProps extends HeroUICheckboxProps {
  children?: React.ReactNode;
}

const Checkbox: React.FC<CheckboxProps> = ({ children, ...props }) => {
  return (
    <div className="flex flex-row justify-start items-center gap-2 px-1 py-2 w-full">
      <HeroUICheckbox size="sm" {...props} />
      <p className="text-gray-700 dark:text-gray-200 text-small text-start">
        {children}
      </p>
    </div>
  );
};

export default Checkbox;
