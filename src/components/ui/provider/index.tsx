import { ChakraProvider } from "@chakra-ui/react"
import { system } from "./theme"
import { ColorModeProvider } from "./color-mode"

export function Provider(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>{props.children}</ColorModeProvider>
    </ChakraProvider>
  )
}