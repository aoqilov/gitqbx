import { FC, useState, useEffect } from "react";
import {
  Button,
  FileUpload,
  Field,
  Icon,
  Badge,
  Box,
  HStack,
  VStack,
  Text,
  Image,
  CloseButton,
} from "@chakra-ui/react";
import { HiUpload } from "react-icons/hi";
import { FaFileAlt, FaFilePdf, FaFileWord, FaFileExcel } from "react-icons/fa";
import { useColorMode } from "../provider/color-mode";
import InputRequiredIconTooltip from "../input/InputRequiredIconTooltip";
import { FiPaperclip } from "react-icons/fi";

type Mode = "single" | "multiple";

export interface FileUploadFormProps {
  label?: string;
  error?: string;
  isRequired?: boolean;
  accept?: string[];
  mode?: Mode;
  selectFile?: File[];
  onFilesChange?: (files: File | File[] | null) => void;
}

const getFileIcon = (file: File) => {
  const type = file.type;
  if (type.startsWith("image/")) return null; // rasm uchun preview ko'rsatiladi
  if (type === "application/pdf") return FaFilePdf;
  if (type.includes("word")) return FaFileWord;
  if (type.includes("excel") || type.includes("spreadsheet"))
    return FaFileExcel;

  return FaFileAlt;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileUploadForm: FC<FileUploadFormProps> = ({
  label,
  error,
  isRequired,
  accept = ["*/*"],
  mode = "single",
  selectFile = [],
  onFilesChange,
}) => {
  const theme = useColorMode();
  const isMultiple = mode === "multiple";
  const isDark = theme.colorMode === "dark";

  const [files, setFiles] = useState<File[]>(selectFile);
  const [previews, setPreviews] = useState<Record<string, string>>({});

  // selectFile tashqaridan o'zgarganda sync qilish
  useEffect(() => {
    setFiles(selectFile);
  }, [selectFile.length]);

  // Rasm preview URL larini yaratish
  useEffect(() => {
    const newPreviews: Record<string, string> = {};
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        newPreviews[file.name + file.size] = url;
      }
    });
    setPreviews((prev) => {
      // Eski URL larni tozalash
      Object.values(prev).forEach((url) => URL.revokeObjectURL(url));
      return newPreviews;
    });
    return () => {
      Object.values(newPreviews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleAdd = (newFiles: File[]) => {
    let updated: File[];
    if (isMultiple) {
      updated = [...files, ...newFiles];
    } else {
      updated = [newFiles[0]];
    }
    setFiles(updated);
    if (isMultiple) {
      onFilesChange?.(updated);
    } else {
      onFilesChange?.(updated[0] ?? null);
    }
  };

  const handleRemove = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    if (isMultiple) {
      onFilesChange?.(updated.length > 0 ? updated : null);
    } else {
      onFilesChange?.(updated[0] ?? null);
    }
  };

  return (
    <Field.Root invalid={!!error}>
      <div className="relative w-full">
        {label && (
          <Field.Label
            className="mb-2! flex items-center gap-1.5! ml-4!"
            fontSize="0.85em"
            color="var(--text-label)"
          >
            {label}
            {isRequired && <InputRequiredIconTooltip />}
          </Field.Label>
        )}

        <FileUpload.Root
          className="w-full "
          accept={accept}
          maxFiles={isMultiple ? 3 : 1}
          onFileAccept={(details) => {
            handleAdd(details.files);
          }}
        >
          <FileUpload.HiddenInput multiple={isMultiple} />

          <FileUpload.Trigger asChild className="w-full ">
            <Button
              variant="outline"
              size="sm"
              display={"flex"}
              justifyContent={"space-between"}
              borderRadius="30px"
              borderColor={
                files.length > 0 ? "var(--main-color)" : "var(--border-input)"
              }
              fontSize="0.9em"
              color={isDark ? "#fff" : "#000"}
              _hover={{ borderColor: "brand.500" }}
            >
              <Text>{isMultiple ? "Прикрепите файлы" : "Прикрепите файл"}</Text>

              <FiPaperclip color="var(--main-color)" />
            </Button>
          </FileUpload.Trigger>
        </FileUpload.Root>

        {/* Tanlangan fayllar ro'yxati */}
        {files.length > 0 && (
          <VStack mt={3} gap={2} align="stretch">
            {files.map((file, index) => {
              const fileKey = file.name + file.size;
              const isImage = file.type.startsWith("image/");
              const previewUrl = previews[fileKey];
              const IconComp = getFileIcon(file);

              return (
                <HStack
                  key={fileKey + index}
                  p={2}
                  px={3}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={isDark ? "whiteAlpha.200" : "gray.200"}
                  bg={isDark ? "whiteAlpha.50" : "gray.50"}
                  justify="space-between"
                  gap={3}
                >
                  {/* Thumbnail yoki Icon */}
                  <Box flexShrink={0}>
                    {isImage && previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt={file.name}
                        boxSize="40px"
                        objectFit="cover"
                        borderRadius="md"
                        border="1px solid"
                        borderColor={isDark ? "whiteAlpha.300" : "gray.300"}
                      />
                    ) : (
                      <Box
                        boxSize="40px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="md"
                        bg={isDark ? "whiteAlpha.100" : "gray.100"}
                      >
                        <Icon
                          as={IconComp ?? FaFileAlt}
                          boxSize={5}
                          color="brand.500"
                        />
                      </Box>
                    )}
                  </Box>

                  {/* Fayl ma'lumoti */}
                  <VStack align="start" gap={0} flex={1} overflow="hidden">
                    <Text
                      fontSize="0.8em"
                      fontWeight="500"
                      color={isDark ? "white" : "gray.800"}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      maxW="100%"
                    >
                      {file.name}
                    </Text>
                    <HStack gap={2}>
                      <Badge
                        size="sm"
                        colorPalette="purple"
                        borderRadius="full"
                        fontSize="0.7em"
                      >
                        {formatFileSize(file.size)}
                      </Badge>
                      <Text
                        fontSize="0.7em"
                        color={isDark ? "whiteAlpha.600" : "gray.400"}
                      >
                        {file.type || "unknown"}
                      </Text>
                    </HStack>
                  </VStack>

                  {/* O'chirish tugmasi */}
                  <CloseButton
                    size="sm"
                    borderRadius="full"
                    color={isDark ? "whiteAlpha.700" : "gray.500"}
                    _hover={{ bg: "red.500", color: "white" }}
                    onClick={() => handleRemove(index)}
                    aria-label="Faylni o'chirish"
                  />
                </HStack>
              );
            })}
          </VStack>
        )}
      </div>

      {error && (
        <Field.ErrorText fontSize="xs" color="error.500">
          {error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default FileUploadForm;
