import { FC, PropsWithChildren } from 'react'

const LoaderLayout : FC<PropsWithChildren<unknown>> = ({ children }) => {
    return (
        <div className='flex justify-center items-center h-full w-full bg-[var(--loader-bg)]'>
            { children }
        </div>
    )
}

export default LoaderLayout