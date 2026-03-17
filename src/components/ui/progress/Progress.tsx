import { defineSlotRecipe, Progress as ChakraProgress } from '@chakra-ui/react'
import { progressAnatomy } from '@chakra-ui/react/anatomy';
import { FC } from 'react'

interface CustomProgressProps extends ChakraProgress.RootProps {
}

export const progressSlotRecipe = defineSlotRecipe({
    slots: progressAnatomy.keys(),
    variants: {
        size: {
            xxs: {
                track: {
                    "height": "2px"
                }
            }
        }
    }
});

const Progress : FC<CustomProgressProps> = ({...props}) => {
    return(
        <ChakraProgress.Root
        {...props}
        >
            <ChakraProgress.Track>
                <ChakraProgress.Range />
            </ChakraProgress.Track>
        </ChakraProgress.Root>
    )
}

export default Progress