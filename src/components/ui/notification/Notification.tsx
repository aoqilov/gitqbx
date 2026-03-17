import { FC, PropsWithChildren } from 'react'

interface NotificationProps {
    isNotify: boolean
}

const Notification : FC<PropsWithChildren<NotificationProps>> = ({ children, isNotify }) => {
    return(
        <div className='relative'>
            {children}

            {
                isNotify && (
                    <div className='absolute bottom-0 right-0 w-[10px] h-[10px] bg-[var(--notify-color)] rounded-full'></div>
                )
            }
        </div>
    )
}

export default Notification