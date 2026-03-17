import { Badge, HStack, Icon, BadgeProps } from "@chakra-ui/react";
import { ReactElement } from "react";
import { useMemo } from "react";

type BadgeVariant = "solid" | "subtle" | "outline";

interface BadgeComponentProps extends BadgeProps {
  text: string;
  color?: string; // hex yoki chakra color
  icon?: ReactElement;
  variant?: BadgeVariant;
}

export default function BadgeComponent({
  text,
  color = "#e2e8f0",
  icon,
  variant = "subtle",
  ...rest
}: BadgeComponentProps) {
  function useAutoContrastColor(bgColor: string) {
    return useMemo(() => {
      if (!bgColor) return "#000000";

      let hex = bgColor;
      if (bgColor.startsWith("#")) {
        hex = bgColor.slice(1);
      } else {
        return "#000000";
      }

      if (hex.length === 3) {
        hex = hex
          .split("")
          .map((c) => c + c)
          .join("");
      }

      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      // brightness formula (WCAG o'xshash)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;

      return brightness > 180 ? "#000000" : "#ffffff";
    }, [bgColor]);
  }
  const textColor = useAutoContrastColor(color);

  const styles = {
    solid: {
      bg: color,
      color: textColor,
      borderColor: color,
    },
    subtle: {
      bg: `${color}22`, //10% opacity
      color: "#666",
      borderColor: `${color}55`,
    },
    outline: {
      bg: "transparent",
      color: `#111`,
      borderColor: color,
    },
  };

  const current = styles[variant];

  return (
    <Badge
      borderRadius="10px"
      px="8px"
      py="3px"
      h="21px"
      display="inline-flex"
      alignItems="center"
      gap="8px"
      borderWidth="1px"
      {...current}
      {...rest}
    >
      <HStack gap="6px">
        {icon && <Icon as={() => icon} boxSize="12px" />}
        {text}
      </HStack>
    </Badge>
  );
}
