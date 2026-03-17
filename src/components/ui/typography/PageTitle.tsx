import { FC } from 'react'
import Heading from './Heading'

interface PageTitleProps {
    title: string
}

const PageTitle : FC<PageTitleProps> = ({ title }) => {
    return(
        <Heading fontSize='lg'>{ title }</Heading>
    )
}

export default PageTitle