import { FC } from 'react'
import { Icon, IconButton as ChakraIconButton, IconButtonProps, defineRecipe } from '@chakra-ui/react'

interface IconButtonPropsI extends IconButtonProps {
    icon: React.ElementType
    iSize?: string,
    iColor?: string
}


export const buttonRecipe = defineRecipe({
    variants: {
        size: {
            "2xs": {
            }

        }
    }
})

const IconButton : FC<IconButtonPropsI> = ({ icon, iSize, iColor, ...props }) => {
    return(
            <ChakraIconButton
            {...props}
            rounded='full'
            >
                <Icon as={icon}
                color={ iColor ? iColor : '#fff' }
                fontSize={ iSize ? iSize : '0.85em'}
                 />
            </ChakraIconButton>
    )
}

export default IconButton