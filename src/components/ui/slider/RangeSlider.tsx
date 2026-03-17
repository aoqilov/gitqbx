import { Flex, Slider } from "@chakra-ui/react";

interface RangeSliderProps {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number[];
  onChange?: (value: number[]) => void;
}

const RangeSlider = ({
  label = "Размер шрифта",
  min = 12,
  max = 18,
  step = 0.1,
  defaultValue = [12],
  onChange,
}: RangeSliderProps) => {
  return (
    <Slider.Root
      width="100%"
      min={min}
      max={max}
      step={step}
      defaultValue={defaultValue}
      colorPalette="purple"
      onValueChange={(e) => onChange?.(e.value)}
    >
      {label && (
        <Slider.Label
          className="mb-1.25!"
          fontSize={"0.85em"}
          lineHeight={"100%!"}
          color={"var(--text-label)"}
        >
          {label}
        </Slider.Label>
      )}

      {/* Sliderni "A" harflari bilan o'rash uchun Flex ishlatamiz */}
      <Flex align="center" gap="4">
        <span style={{ fontSize: "14px", color: "#805AD5" }}>A</span>

        <Slider.Control flex="1">
          <Slider.Track bg="gray.200" height="2px">
            <Slider.Range bg="purple.500" />
          </Slider.Track>

          <Slider.Thumb
            index={0}
            width="32px"
            height="32px"
            borderRadius="full"
            bg="purple.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
            outline="none"
          >
            {/* Thumb ichida qiymatni ko'rsatish */}
            <Slider.ValueText color="white" fontSize="xs" fontWeight="bold" />
          </Slider.Thumb>
        </Slider.Control>

        <span style={{ fontSize: "20px", color: "#805AD5" }}>A</span>
      </Flex>
    </Slider.Root>
  );
};

export default RangeSlider;
