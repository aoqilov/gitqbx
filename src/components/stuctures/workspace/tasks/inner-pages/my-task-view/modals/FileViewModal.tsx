// components/FilePreviewModal.tsx
import { Dialog, IconButton } from "@chakra-ui/react";
import { IoCloseOutline } from "react-icons/io5";
import Text from "@/components/ui/typography/Text";
import Button from "@/components/ui/buttons/Button";
import { TaskFile } from "../my-task-list/MyTaskList";

interface Props {
  file: TaskFile | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (file: TaskFile) => void;
}

export const FileViewModal = ({ file, isOpen, onClose, onDownload }: Props) => {
  if (!file) return null;

  return (
    <Dialog.Root
      placement={"center"}
      open={isOpen}
      onOpenChange={({ open }) => !open && onClose()}
      size="xl"
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content className="bg-[var(--bg-main)]! p-4! mx-5!">
          <Dialog.Header>
            <Dialog.Title>{file.name}</Dialog.Title>
            <Dialog.CloseTrigger asChild></Dialog.CloseTrigger>
          </Dialog.Header>

          <Dialog.Body p={0}>
            {" "}
            {/* ✅ p={4} olib tashlandi — padding yo'q */}
            {file.type === "image" ? (
              <img
                src={file.previewUrl ?? file.url}
                alt={file.name}
                style={{
                  width: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            ) : file.type === "pdf" ? (
              <iframe
                src={`${file.url}#toolbar=0`}
                title={file.name}
                width="100%"
                height="500px"
                style={{ border: "none", display: "block" }}
              />
            ) : (
              <Text p={4}>Preview mavjud emas. Faylni yuklab oling.</Text>
            )}
          </Dialog.Body>

          <Dialog.Footer className="mt-3!">
            <Button onClick={() => onDownload(file)}>Yuklab olish</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
