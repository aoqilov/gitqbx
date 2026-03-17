import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
  defineSlotRecipe,
} from "@chakra-ui/react";
import { progressSlotRecipe } from "@/components/ui/progress/Progress";
import { toasterSlotRecipe } from "../toaster/Toaster";
import { drawerSlotRecipe } from "@/components/stuctures/menu/Menu";
import { inputRecipe } from "../input/Input";
import { tagSlotRecipe } from "../tag/Tag";
import { avatarSlotRecipe } from "../avatar/Avatar";
import { buttonRecipe } from "../buttons/NavButton";

const customConfig = defineConfig({
  globalCss: {
    "*": {
      margin: "10px",
    },
  },

  theme: {
    recipes: {
      input: inputRecipe,
      button: buttonRecipe
    },
    slotRecipes: {
      progress: progressSlotRecipe,
      toast: toasterSlotRecipe,
      drawer: drawerSlotRecipe,
      tag: tagSlotRecipe,
      avatar: avatarSlotRecipe,
    },
    tokens: {
      colors: {
        brand: {
          50: { value: "#f0e8fdf" },
          100: { value: "#dcc2fa" },
          200: { value: "#c69cf7" },
          300: { value: "#ae76f3" },
          400: { value: "#924eee" },
          500: { value: "#711ce9" },
          600: { value: "#5c1cba" },
          700: { value: "#471a8d" },
          800: { value: "#331662" },
          900: { value: "#20103a" },
          950: { value: "#0b0217" },
        },

        error: {
          50: { value: "#fdf0e7" },
          100: { value: "#ffd7bf" },
          200: { value: "#ffbd97" },
          300: { value: "#fba471" },
          400: { value: "#f58b4a" },
          500: { value: "#ec711f" },
          600: { value: "#bc5b1c" },
          700: { value: "#8f4719" },
          800: { value: "#643315" },
          900: { value: "#3c200f" },
          950: { value: "#180b02" },
        },
      },
    },

    semanticTokens: {
      colors: {
        brand: {
          solid: { value: "{colors.brand.500}" },
          contrast: { value: "{colors.brand.100}" },
          fg: { value: "{colors.brand.700}" },
          muted: { value: "{colors.brand.100}" },
          subtle: { value: "{colors.brand.200}" },
          emphasized: { value: "{colors.brand.300}" },
          focusRing: { value: "{colors.brand.500}" },
        },
        error: {
          solid: { value: "{colors.error.500}" },
          contrast: { value: "{colors.error.100}" },
          fg: { value: "{colors.error.700}" },
          muted: { value: "{colors.error.100}" },
          subtle: { value: "{colors.error.200}" },
          emphasized: { value: "{colors.error.300}" },
          focusRing: { value: "{colors.error.500}" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
