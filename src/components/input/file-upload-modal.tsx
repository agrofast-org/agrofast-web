import {
  FileText,
  Gallery,
  MaximizeSquare2,
  Upload,
} from "@solar-icons/react";
import {
  Button,
  cn,
  Image,
  Link,
  ScrollShadow,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { useCallback, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ModalDialogue } from "../modal-dialogue";
import { Checkbox } from "./checkbox";
import { getRecentAttachments } from "@/http/uploads/recent-attachments";
import { uploadAttachment } from "@/http/uploads/upload-attachment";
import { Attachment } from "@/types/attachment";
import { useForm } from "../form/form";

export interface FileUploadModalProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  type?: "append" | "replace";
  accept?: string;
  multiple?: boolean;
  onUpload?: (files: Attachment[]) => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  name,
  label,
  placeholder,
  disabled = false,
  required = false,
  accept,
  multiple = false,
  onUpload,
}) => {
  const form = useForm();

  const disclosure = useDisclosure();
  const [selectedFiles, setSelectedFiles] = useState<Attachment["uuid"][]>([]);
  const [tempSelection, setTempSelection] = useState<Attachment["uuid"][]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    data: storedFiles = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["recent-attachments"],
    queryFn: async () => {
      const res = await getRecentAttachments();
      return res.data ?? [];
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;

    setIsUploading(true);
    const formData = new FormData();

    if (multiple) files.forEach((f) => formData.append("files[]", f));
    else formData.append("file", files[0]);

    try {
      const { data } = await uploadAttachment(formData);
      await refetch();
      data.forEach((attachment) => {
        setTempSelection((prev) =>
          prev.includes(attachment.uuid) ? prev : [...prev, attachment.uuid]
        );
      });
      if (onUpload) onUpload(storedFiles);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  useEffect(() => {
    if (disclosure.isOpen) {
      setTempSelection(selectedFiles);
    }
  }, [disclosure.isOpen, selectedFiles]);

  const toggleSelectTemp = useCallback((uuid: string) => {
    setTempSelection((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
    );
  }, []);

  const applySelection = () => {
    form?.setValue(name, tempSelection);
    setSelectedFiles(tempSelection);
    disclosure.onClose();
  };

  const discardChanges = () => {
    setTempSelection(selectedFiles);
    disclosure.onClose();
  };

  // useEffect(() => {
  //   if (form) {
  //     const formValue = form.values[name];
  //     console.log("Form value:", formValue);
  //     setSelectedFiles(formValue);
  //   }
  // }, [name, form]);

  return (
    <div className="relative flex flex-col pt-6">
      <span className="top-0 z-20 absolute flex justify-between w-full text-foreground text-small">
        <p>{label ?? placeholder ?? "Upload de arquivo"}</p>
      </span>

      <Button
        className="inline-flex justify-center items-center gap-2 bg-default-200 px-4 py-2 rounded-medium w-full text-default-600 cursor-pointer"
        isDisabled={disabled || isUploading}
        onPress={disclosure.onOpen}
      >
        {isUploading ? <Spinner size="sm" /> : <Upload weight="LineDuotone" />}
        {isUploading
          ? "Carregando..."
          : selectedFiles?.length > 0
          ? `${selectedFiles?.length ?? 0} selecionado${
              selectedFiles?.length === 1 ? "" : "s"
            }`
          : placeholder ?? label ?? "Selecionar arquivo"}
      </Button>

      <ModalDialogue
        title={`Selecionar arquivo${multiple ? "s" : ""}`}
        {...disclosure}
        action={applySelection}
        actionMessage="Selecionar"
        dismiss={discardChanges}
        dismissMessage="Cancelar"
      >
        <div className="flex flex-col gap-3">
          <p className="text-gray-600 dark:text-gray-300 text-small">
            Arquivos anexados anteriormente:
          </p>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : (
            <VerticalFileList
              files={storedFiles}
              selected={tempSelection}
              onToggle={toggleSelectTemp}
            />
          )}

          <Button
            as="label"
            htmlFor={`${name}-input`}
            className="inline-flex justify-center items-center gap-2 bg-default-200 px-4 py-2 rounded-medium w-full text-default-600 cursor-pointer"
            isDisabled={disabled || isUploading}
            isLoading={isUploading}
          >
            {isUploading ? (
              <Spinner size="sm" />
            ) : (
              <Upload weight="LineDuotone" />
            )}
            Enviar arquivo{multiple ? "s" : ""}
            <input
              id={`${name}-input`}
              type="file"
              accept={accept}
              multiple={multiple}
              disabled={disabled || isUploading}
              required={required}
              className="hidden"
              onChange={handleUpload}
            />
          </Button>
        </div>
      </ModalDialogue>
    </div>
  );
};

interface VerticalFileListProps {
  files: Attachment[];
  selected?: string[];
  onToggle?: (uuid: string) => void;
}

const VerticalFileList: React.FC<VerticalFileListProps> = ({
  files,
  selected = [],
  onToggle,
}) => {
  if (!files.length)
    return (
      <div className="flex justify-center my-2 w-full text-default-400 text-sm">
        Nenhum arquivo encontrado
      </div>
    );

  return (
    <div className="border border-default-300 rounded-medium overflow-hidden">
      <ScrollShadow className="gap-1 p-1 w-full max-h-72">
        {files.map((file) => (
          <FileItem
            key={file.uuid}
            file={file}
            isSelected={selected.includes(file.uuid)}
            onToggle={onToggle}
          />
        ))}
      </ScrollShadow>
    </div>
  );
};

interface FileItemProps {
  file: Attachment;
  isSelected?: boolean;
  onToggle?: (uuid: string) => void;
}

const FileItem: React.FC<FileItemProps> = ({ file, isSelected, onToggle }) => {
  const type = file.mime_type.split("/")[0];
  const handleClick = () => onToggle?.(file.uuid);

  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(true);

  return (
    <div
      className={cn(
        "flex items-center gap-2 hover:bg-default-100 p-1 rounded-small max-h-12 transition-colors cursor-pointer select-none"
      )}
      onClick={handleClick}
    >
      <Checkbox
        isSelected={isSelected}
        value={file.uuid}
        className="!w-5 pointer-events-none"
      />

      {type === "image" ? (
        <>
          {isImageLoaded ? (
            <Image
              className="rounded-small w-8 h-8 object-cover"
              src={`${file.path}/miniature`}
              alt={file.name}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setIsImageLoaded(false)}
            />
          ) : (
            <Gallery className="w-8 h-6 text-default-400" weight="LineDuotone" />
          )}
        </>
      ) : (
        <FileText className="w-8 h-6 text-default-400" weight="LineDuotone" />
      )}
      <span className="flex-1 text-small truncate">{file.name}</span>
      <Button as={Link} href={file.path} target="_blank" className="bg-default-200/45" size="sm" isIconOnly>
        <MaximizeSquare2 className="w-8 h-6 text-default-600" weight="LineDuotone"/>
      </Button>
    </div>
  );
};
