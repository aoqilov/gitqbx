import { Icon, Separator } from '@chakra-ui/react'
import { FC, ReactElement } from 'react'
import Heading from '../typography/Heading'

interface DialogHeaderProps {
    title: string
    headerIcon?: ReactElement
}

const DialogHeader : FC<DialogHeaderProps> = ({ title, headerIcon }) => {
    return(
        <div className='flex flex-col w-full gap-[10px]'>
            <div className='flex items-center gap-[5px]'>
                { headerIcon ? headerIcon : <></> }
                <Heading>{ title }</Heading>
            </div>

            <Separator w='full' />
        </div>
    )
}

export default DialogHeader