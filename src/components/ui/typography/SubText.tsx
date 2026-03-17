import { FC, PropsWithChildren } from 'react'
import { Text, TextProps } from '@chakra-ui/react'

interface CustomSubtextProps extends TextProps{
}

const Subtext : FC<PropsWithChildren<CustomSubtextProps>> = ({ children, ...props }) => {

    const { fontSize } = props

    return(
        <Text {...props} color='var(--subtext-color)' fontSize={ fontSize ? fontSize : '0.85em' }>{ children }</Text>
    )
}

export default Subtext