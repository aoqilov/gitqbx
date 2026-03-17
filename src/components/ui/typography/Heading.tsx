import { FC, PropsWithChildren } from 'react'
import { Heading as ChakraHeading, HeadingProps } from '@chakra-ui/react'

interface CustomHeadingProps extends HeadingProps{
}

const Heading : FC<PropsWithChildren<CustomHeadingProps>> = ({ children, ...props  }) => {
    return(
        <ChakraHeading 
        // _light={{ color: '#000' }} 
        color={"var(--text-heading)"} {...props} fontWeight='semibold' lineHeight='1.3em'>{ children }</ChakraHeading>
    )
}

export default Heading