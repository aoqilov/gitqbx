import { FC, PropsWithChildren, ReactElement, useEffect, useState } from 'react'
import { Dialog as ChakraDialog, CloseButton, Portal, DialogRootProps } from '@chakra-ui/react'
import DialogHeader from './DialogHeader'

interface DialogPropsI extends DialogRootProps {
    openTrigger: ReactElement,
    footer?: ReactElement,
    actionTrigger?: ReactElement,

    modalIsOpen?: boolean,
    setModalIsOpen?: (v:boolean) => void
    title: string
    headerIcon?: ReactElement
}

const Dialog : FC<PropsWithChildren<DialogPropsI>> = ({ openTrigger, footer, actionTrigger, modalIsOpen=false, setModalIsOpen, title, headerIcon, children, ...props }) => {
    
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if(modalIsOpen && setModalIsOpen){
            setOpen(true)
            setModalIsOpen(false)
        }
    }, [modalIsOpen])

    return(
        <ChakraDialog.Root { ...props } open={open} onOpenChange={(e) => setOpen(e.open)}>
        <ChakraDialog.Trigger asChild>
            { openTrigger }
        </ChakraDialog.Trigger>
        <Portal>
            <ChakraDialog.Backdrop />
            <ChakraDialog.Positioner>
            <ChakraDialog.Content>

                <ChakraDialog.Header>
                    <DialogHeader
                    title={title}
                    headerIcon={headerIcon}
                    />
                </ChakraDialog.Header>

                <ChakraDialog.Body>
                    { children }
                </ChakraDialog.Body>

                {
                    footer || actionTrigger && (
                        
                        <ChakraDialog.Footer className='flex flex-col w-full items-center'>
                            { footer ? footer : <></> }

                            {
                                actionTrigger && (
                                    <ChakraDialog.ActionTrigger asChild>
                                        {actionTrigger}
                                    </ChakraDialog.ActionTrigger>
                                )
                            }
                        </ChakraDialog.Footer>
                    )
                }

                <ChakraDialog.CloseTrigger asChild>
                    <CloseButton size="sm" mt="7px" />
                </ChakraDialog.CloseTrigger>

            </ChakraDialog.Content>
            </ChakraDialog.Positioner>
        </Portal>
        </ChakraDialog.Root>
    )
}

export default Dialog