import { Icon } from "@chakra-ui/react";
import { RiFilter2Fill } from "react-icons/ri";
import InputForm from "@/components/ui/input/InputForm";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showFilter?: boolean;
  onFilterClick?: () => void;
}

const TemplateFilter = ({
  value,
  onChange,
  placeholder = "Search...",
  showFilter = false,
  onFilterClick,
}: SearchBoxProps) => {
  return (
    <div className="flex l gap-3.75 ">
      <InputForm
        showSearchIcon
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
      {showFilter && (
        <div
          className="w-11! h-10!   rounded-full flex items-center justify-center border! border-(--border-input)!"
          onClick={onFilterClick}
        >
          <Icon as={RiFilter2Fill} color="var(--border-input)" fontSize={20} />
        </div>
      )}
    </div>
  );
};

export default TemplateFilter;
