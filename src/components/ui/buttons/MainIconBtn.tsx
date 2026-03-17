import { Icon, IconButton, IconButtonProps } from '@chakra-ui/react'
import { FC } from 'react'
import { IconType } from 'react-icons'

interface MainIconBtnI extends IconButtonProps {
    icon: IconType,
    iSize?: string,
    iColor?: string
}

const MainIconBtn : FC<MainIconBtnI> = ({ icon, iSize, iColor, ...props }) => {
    return(
        <IconButton
        {...props}
        colorPalette='brand'
        rounded='full'
        >
            <Icon as={icon} color={ iColor ? iColor : "#fff" } fontSize={iSize} />
        </IconButton>
    )
}

export default MainIconBtn