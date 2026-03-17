import { chakra, SegmentGroup } from "@chakra-ui/react";
import type { SegmentGroupRootProps } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

type SegmentOption = {
  label: string;
  value: string;
};

interface Props extends Omit<
  SegmentGroupRootProps,
  "value" | "onChange" | "animation"
> {
  value: string;
  onChange: (value: string) => void;
  options: SegmentOption[];
  animation?: boolean;
}

const MotionDiv = chakra(motion.div);

const segmentVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
    scale: 0.995,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const, // Add 'as const' here
      stiffness: 150,
      damping: 20,
      mass: 1,
    },
  },
};

const SegmentComponent = ({
  value,
  onChange,
  options,
  animation = false,
}: Props) => {
  const Wrapper = animation ? MotionDiv : "div";

  const motionProps = animation
    ? {
        variants: segmentVariants,
        initial: "hidden",
        animate: "visible",
      }
    : {};

  return (
    <Wrapper {...motionProps}>
      <SegmentGroup.Root
        value={value}
        onValueChange={(e) => {
          if (e.value) onChange(e.value);
        }}
        width="full"
        height="30px"
        display="flex"
        bg="var(--bg-main)"
        border="1px solid"
        borderColor="brand.500"
        borderRadius="30px"
        overflow="hidden"
        position="relative"
      >
        <SegmentGroup.Indicator
          bg="#7016ea"
          borderRadius="full"
          height="100%"
        />

        {options.map((item) => (
          <SegmentGroup.Item
            key={item.value}
            value={item.value}
            flex="1"
            zIndex="1"
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            height="full"
          >
            <SegmentGroup.ItemText
              color={
                value === item.value ? "white" : "var(--text-lbrand-dwhite)"
              }
              fontSize="0.85em"
              fontWeight="500"
              transition="color 0.2s"
              lineHeight="100%"
            >
              {item.label}
            </SegmentGroup.ItemText>
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
        ))}
      </SegmentGroup.Root>
    </Wrapper>
  );
};

export default SegmentComponent;
