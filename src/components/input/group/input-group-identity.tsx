import { useForm } from "@/components/form";
import { useGroup } from "./input-group";
import { useEffect, useState } from "react";

export interface InputGroupIdentityProps {
  name: string;
  value?: string | number;
}

const InputGroupIdentity: React.FC<InputGroupIdentityProps> = ({
  name: inputName,
  value,
  ...props
}) => {
  const form = useForm();
  if (!form) {
    throw new Error("InputGroupDisplay must be used within a Form component");
  }
  const group = useGroup();
  if (!group) {
    throw new Error(
      "InputGroupDisplay must be used within a InputGroup component"
    );
  }
  const name = group.getFieldName(inputName);
  const [inputValue, setInputValue] = useState(
    value ?? form?.values[name]
  );

  useEffect(() => {
    group.declareField(inputName, {
      type: "hidden",
    });
  }, [inputName, group]);

  useEffect(() => {
    if (name && form && form.values[name]) {
      setInputValue(form.values[name]);
    }
  }, [name, form, inputValue]);

  return (
    <>
      {!name.includes(".edit.") && (
        <input
          name={name}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          value={inputValue}
          type="hidden"
          hidden
          aria-hidden="true"
          {...props}
        />
      )}
    </>
  );
};

export default InputGroupIdentity;
