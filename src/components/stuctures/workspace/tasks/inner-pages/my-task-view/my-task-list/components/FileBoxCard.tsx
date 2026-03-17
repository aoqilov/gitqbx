import Text from "@/components/ui/typography/Text";
import { Icon } from "@chakra-ui/react";
import { useState } from "react";
import { GoEye, GoFile } from "react-icons/go";
import { MdOutlineFileDownload } from "react-icons/md";
import mockImage from "@/assets/images/visaCard.png"; // ✅ default import
import { TaskFile } from "../MyTaskList";
import { FileViewModal } from "../../modals/FileViewModal";
import pdfData from "@/assets/pdf/CV.pdf";
// ⚠️ Hook — component tashqarisida bo'lishi shart
const useFileActions = () => {
  const handleDownload = async (file: TaskFile) => {
    try {
      const res = await fetch(file.url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file.name;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name;
      link.target = "_blank";
      link.click();
    }
  };
  return { handleDownload };
};

// ✅ Mock file — mockImage ishlatilmoqda
// mockFile ichida url ni o'zgartir
const mockFile: TaskFile = {
  id: "mock-1",
  name: "visaCard.png",
  size: 2621440,
  type: "image",
  url: "https://picsum.photos/800/1200",
  previewUrl: "https://picsum.photos/800/1200",
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
};

interface Props {
  file?: TaskFile; // prop orqali ham bersa bo'ladi, default mockFile
}

const FileBoxCard = ({ file = mockFile }: Props) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { handleDownload } = useFileActions();

  return (
    <>
      <div className="flex justify-between border! border-(--main-color)! px-2.5! py-1.5! rounded-[5px]! mt-3!">
        <div className="flex items-center gap-1.5">
          <Icon as={GoFile} color="brand.500" fontSize={16} />
          <div className="flex flex-col">
            <Text fontSize="0.72em">{file.name}</Text>
            <Text fontSize="0.8em" color="var(--subtext-color)">
              {formatFileSize(file.size)}
            </Text>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div
            className="p-1! flex items-center justify-center bg-(--main-color)! rounded-full! cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsPreviewOpen(true);
            }}
          >
            <Icon as={GoEye} color="white" fontSize={16} />
          </div>
          <div
            className="p-1! flex items-center justify-center border! border-(--main-color)! rounded-full! cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(file);
            }}
          >
            <Icon as={MdOutlineFileDownload} color="brand.500" fontSize={16} />
          </div>
        </div>
      </div>

      <FileViewModal
        file={file}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onDownload={(f) => {
          handleDownload(f);
          setIsPreviewOpen(false);
        }}
      />
    </>
  );
};

export default FileBoxCard;
