import {
  Avatar as ChakraAvatar,
  defineStyle,
  AvatarRootProps,
  defineSlotRecipe,
} from "@chakra-ui/react";
import { avatarAnatomy } from "@chakra-ui/react/anatomy";
import { FC } from "react";

interface AvatarPropsI extends AvatarRootProps {
  fullName: string;
  avatar: string;
  ring?: "ringBrand" | "ringWhite" | "ringQRcode";
}

const ringBrand = defineStyle({
  outlineWidth: "2px",
  outlineColor: "colorPalette.500",
  outlineOffset: "4px",
  outlineStyle: "solid",
});

const ringWhite = defineStyle({
  outlineWidth: "1px",
  outlineColor: "var(--subtext-color)",
  outlineStyle: "solid",
  // outlineOffset: "5px",
  borderWidth: "5px",
  borderColor: "#fff",
});
const ringQRcode = defineStyle({
  outlineWidth: "6px",
  outlineColor: "brand",
  outlineStyle: "solid",
  // outlineOffset: "5px",
  borderWidth: "5px",
  borderColor: "white",
});

export const avatarSlotRecipe = defineSlotRecipe({
  slots: avatarAnatomy.keys(),
  variants: {
    size: {
      size100: {
        root: {
          "--avatar-font-size": "fontSizes.2xs",
          "--avatar-size": "100px",
        },
      },
    },
  },
});

const Avatar: FC<AvatarPropsI> = ({ fullName, avatar, ring, ...props }) => {
  return (
    <ChakraAvatar.Root
      css={
        ring === "ringBrand"
          ? ringBrand
          : ring === "ringWhite"
            ? ringWhite
            : ring === "ringQRcode"
              ? ringQRcode
              : {}
      }
      colorPalette="brand"
      {...props}
    >
      <ChakraAvatar.Fallback name={fullName} />
      <ChakraAvatar.Image src={avatar} />
    </ChakraAvatar.Root>
  );
};

export default Avatar;
