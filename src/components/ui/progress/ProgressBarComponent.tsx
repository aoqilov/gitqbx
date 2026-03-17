import { FC, useEffect, useRef, useState } from "react";
import { Progress, Text } from "@chakra-ui/react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import CountUp from "react-countup";

interface CustomProgressProps {
  value: number;
  height?: string;
  showValueText?: boolean;
}

const MotionDiv = motion.div;

const ProgressBarComponent: FC<CustomProgressProps> = ({
  value,
  height = "24px",
  showValueText = true,
}) => {
  const normalized = Math.min(Math.max(value, 0), 100);
  const [countStart, setCountStart] = useState(false);

  const motionValue = useMotionValue(0);
  const width = useTransform(motionValue, (v) => (v === 0 ? "40px" : `${v}%`));
  const isFirstRender = useRef(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCountStart(true);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }

    const timeout = setTimeout(() => {
      animate(motionValue, normalized, {
        duration: 1,
        ease: "easeOut",
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [normalized]);

  return (
    <Progress.Root value={100} max={100}>
      <Progress.Track
        h={height}
        borderRadius="full"
        border="1px solid"
        borderColor="brand.400"
        bg="var(--bg-main)"
        overflow="hidden"
      >
        <MotionDiv style={{ width }}>
          <Progress.Range
            bg="brand.500"
            h="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderEndRadius="full"
          >
            {showValueText && countStart && (
              <Text fontSize="sm" fontWeight="bold" color="white">
                <CountUp start={0} end={normalized} duration={1} suffix="%" />
              </Text>
            )}
          </Progress.Range>
        </MotionDiv>
      </Progress.Track>
    </Progress.Root>
  );
};

export default ProgressBarComponent;
