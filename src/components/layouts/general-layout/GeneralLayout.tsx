import Header from '@/components/stuctures/header/Header';
import { FC, PropsWithChildren } from 'react'
import { useLocation } from 'react-router-dom';

const GeneralLayout : FC<PropsWithChildren<unknown>> = ({ children }) => {
    
    const location = useLocation()

    return (
        <div className={`w-full h-full ${location.pathname != '/' ? 'general' : '' }`}>
            
            {
                location.pathname != '/' && (
                    <Header />
                )
            }

            { children }

        </div>
    )
}

export default GeneralLayout