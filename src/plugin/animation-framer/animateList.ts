// animations/listItem.ts
import { Variants } from "framer-motion";

// export const listItemVariants: Variants = {
//   hidden: {
//     opacity: 0,
//     x: -100,
//   },

//   visible: (index: number) => ({
//     opacity: 1,
//     x: 0,
//     transition: {
//       duration: 0.25,
//       ease: "easeOut",
//       delay: index * 0.05,
//     },
//   }),

//   exit: {
//     opacity: 0,
//     x: 100,
//     transition: {
//       duration: 0.25,
//       ease: "easeIn",
//     },
//   },
// };

export const listItemVariants = {
  hidden: {
    opacity: 0,
    x: -100,
  },

  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.25,
      delay: index * 0.1,
    },
  }),

  exit: {
    opacity: 0,
    x: 100,
    transition: {
      duration: 0.4,
    },
  },
};
