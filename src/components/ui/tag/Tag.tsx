import { FC } from 'react'
import { Tag as ChakraTag, defineSlotRecipe } from "@chakra-ui/react"
import { tagAnatomy } from '@chakra-ui/react/anatomy'

interface TagProps {
    
}

export const tagSlotRecipe = defineSlotRecipe({
  slots: tagAnatomy.keys(),
  base: {
    root: {
        borderRadius: "15px",
    }
  }
})

const Tag : FC<TagProps> = ({ children, ...props }) => {
    return(
        <ChakraTag.Root { ...props }>
            <ChakraTag.Label>{children}</ChakraTag.Label>
        </ChakraTag.Root>
    )
}

export default Tag