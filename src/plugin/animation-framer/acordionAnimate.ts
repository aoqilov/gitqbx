export const acordionAnimate = {
  hidden: {
    height: 0,
    opacity: 0,
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut" as const,
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: "easeInOut" as const,
    },
  },
};
