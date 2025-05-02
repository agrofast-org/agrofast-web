import { cn } from "@/lib/utils";
import { Upload } from "@solar-icons/react";
// import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "../form";
import { useGroup } from "./group/input-group";

export type FileAcceptedTypes =
  | "image/png"
  | "image/jpeg"
  | "image/webp"
  | "image/gif"
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/vnd.ms-excel"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export interface FileUploadProps {
  name: string;
  label?: string;
  type?: "append" | "replace";
  accept?: FileAcceptedTypes[];
  onUpload?: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  name: inputName,
  label,
  type = "replace",
  accept,
  onUpload,
}) => {
  // const t = useTranslations();
  const [files, setFiles] = useState<File[] | undefined>();

  const form = useForm();
  const group = useGroup();

  const name = inputName && group ? group.getFieldName(inputName) : inputName;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    let updatedFiles: File[] = [];

    if (type === "replace") {
      updatedFiles = selectedFiles;
    } else if (type === "append") {
      updatedFiles = [...(files ?? []), ...selectedFiles];
    }

    setFiles(updatedFiles);
    onUpload?.(updatedFiles);
  };

  useEffect(() => {
    if (form && form.getters[name]) return;
    if (name && form) {
      form.setGetter(name, () => files);
      form.setValue(name, files);
    }
  }, [form, name, files]);

  return (
    <div>
      <label
        htmlFor={name}
        className={cn(
          "inline-flex relative justify-center items-center gap-4 px-4 rounded-medium w-full min-w-20 h-10 text-sm duration-75 cursor-pointer",
          "select-none overflow-hidden tap-highlight-transparent active:scale-[0.97] outline-none focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 transition-transform-colors-opacity bg-default text-default-foreground hover:opacity-hover"
        )}
      >
        {label ?? "Input a file"}
        {/* {files
          ? t("UI.buttons.choose_another_photo")
          : t("UI.buttons.choose_a_photo")} */}
        <input
          id={name}
          name={name}
          type="file"
          accept={accept?.join(", ")}
          tabIndex={0}
          className="absolute inset-0 opacity-0 w-full h-full"
          onChange={handleUpload}
        />
        <Upload className="text-gray-700 dark:text-gray-200" />
      </label>
    </div>
  );
};

export default FileUpload;
