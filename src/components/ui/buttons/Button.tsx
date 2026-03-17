import { FC, PropsWithChildren } from 'react'
import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react'

interface ButtonPropsI extends ButtonProps {
    
}

const Button : FC<PropsWithChildren<ButtonPropsI>> = ({ children, ...props }) => {
    return(
        <ChakraButton
        { ...props }
        borderRadius="30px"
        w="full"
        >
            { children }
        </ChakraButton>
    )
}

export default Button