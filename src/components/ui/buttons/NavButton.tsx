import { FC, useState } from "react";
import {
  Button as ChakraNavButton,
  ButtonProps,
  defineRecipe,
} from "@chakra-ui/react";

interface NavButtonProps extends ButtonProps {
  hasNotification?: boolean;
  isActive?: boolean;
}

export const buttonRecipe = defineRecipe({
  base: {
    position: "relative",
    transition: "all 0.2s ease",
  },
  variants: {
    variant: {
      nav: {
        justifyContent: "flex-start",
        textAlign: "left",
        w: "full",
        borderRadius: "8px",
        bg: "transparent",
        fontWeight: 400,
        color: "var(--text-heading)",

        "& svg": {
          color: "var(--navButton-icon)",
          transition: "color 0.2s ease",
        },

        "&.active": {
          backgroundColor: "var(--main-color)",
          color: "white",

          "& svg": {
            color: "white", // active icon rangi
          },
        },
      },

      footerNav: {
        justifyContent: "flex-start",
        textAlign: "left",
        w: "full",
        borderRadius: "8px",
        color: "var(--text-heading)",
        fontWeight: 400,
        "& svg": {
          color: "var(--navButton-icon-footer)",
          transition: "color 0.2s ease",
        },

        "&.active": {
          backgroundColor: "var(--main-color)",
          color: "white",

          "& svg": {
            color: "white", // active icon rangi
          },
        },
      },
    },
  },
});

interface NavButtonProps extends ButtonProps {
  hasNotification?: boolean;
  isActive?: boolean; // Yangi props
}

const NavButton: FC<NavButtonProps> = ({
  children,
  hasNotification,
  isActive, // qabul qilamiz
  className,
  ...props
}) => {
  const [showNotification] = useState<boolean>(hasNotification ?? false);

  return (
    <ChakraNavButton
      {...props}
      // Agar isActive true bo'lsa, recipe'dagi "&.active" ishlashi uchun klass qo'shamiz
      className={`${className} ${isActive ? "active" : ""}`}
    >
      {children}
      {showNotification && (
        <span
          style={{
            position: "absolute",
            right: "50px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "#EF9F66",
          }}
        />
      )}
    </ChakraNavButton>
  );
};
export default NavButton;
