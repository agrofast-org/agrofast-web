import {
  CalendarDate,
  DatePicker as HeroUIDatePicker,
  DatePickerProps as HeroUIDatePickerPro,
} from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import { useGroup } from "@/components/input/group/input-group";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "../form";
import { useRouter } from "next/router";
import { parseQueryDate } from "@/lib/utils";

export type DatePickerValue = CalendarDate | null | undefined;

export interface DatePickerProps extends HeroUIDatePickerPro {
  label?: string;
  queryCollectable?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  name: inputName,
  queryCollectable,
  onChange,
  value,
  ...props
}) => {
  const router = useRouter();
  const form = useForm();
  const group = useGroup();

  const name = inputName && group ? group.getFieldName(inputName) : inputName;

  const [hasFirstRender, setHasFirstRender] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<DatePickerValue>();

  const changeValue = useCallback(
    (newValue?: DatePickerValue) => {
      if (newValue && newValue !== inputValue) {
        if (name && form) {
          form.setValue(name, newValue);
        }
        setInputValue(newValue);
      }
    },
    [name, form, inputValue]
  );

  useEffect(() => {
    setInputValue(value as unknown as DatePickerValue);
  }, [value]);

  useEffect(() => {
    if (queryCollectable && name && router.query[name] && !hasFirstRender) {
      const queryValue = router.query[name];
      if (queryValue) {
        try {
          const val = parseQueryDate(queryValue as string);
          changeValue(val as unknown as DatePickerValue);
          setHasFirstRender(true);
        } catch (e) {
          console.log("Invalid date format in query", e);
        }
      }
    }
  }, [queryCollectable, name, changeValue, router.query, hasFirstRender]);

  useEffect(() => {
    if (name && form && form.values[name]) {
      changeValue(form.values[name]);
    }
  }, [value, form, name, changeValue]);

  useEffect(() => {
    if (group && inputName) {
      group.declaredField(inputName, {
        type: "date",
        required: props.isRequired ?? false,
      });
    }
  }, [group, inputName, props.isRequired]);

  return (
    <I18nProvider>
      <HeroUIDatePicker
        name={name}
        value={inputValue}
        onChange={(val) => {
          onChange?.(val);
          changeValue(val);
        }}
        classNames={{
          base: "relative",
          label: "top-6",
          helperWrapper: "absolute -bottom-[20px] -left-0.5 min-w-max",
          input: "!transition-colors !duration-100 ",
          inputWrapper: "!transition-colors !duration-100",
          selectorButton: "rounded-lg left-0.5",
        }}
        labelPlacement="outside"
        variant="bordered"
        {...props}
      />
    </I18nProvider>
  );
};

export default DatePicker;
