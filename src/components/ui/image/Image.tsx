import { FC, useState } from 'react'
import { Image as ChakraImage, Skeleton, Icon, Text } from '@chakra-ui/react'
import { FaRegImage } from "react-icons/fa";

interface CustomImageProps {
    className: string,
    src: string,
    alt: string,
    filter?: string,
    animationClassName?: string,
    objectFit?: string
}

const Image : FC<CustomImageProps> = ({ className, src, alt, filter, animationClassName, objectFit }) => {
    
    const [previewIsLoad, setPreviewIsLoad] = useState<boolean>(false)

    return(
        <>
            {
                !previewIsLoad && (
                    <div className={`${className} w-full relative border-[3px] border-dashed border-[#7777773b]`}>
                        <Skeleton
                        variant="shine"
                        css={{
                            "--start-color": "#01366A90",
                            "--end-color": "#fff"
                        }}
                        className={className}
                        />
        
                        <div className={`top-0 absolute ${className} w-full flex justify-center items-center`}>
                            <div className='flex flex-col items-center gap-1 z-20'>
                                <Icon color="#7777773b" fontSize="2rem" as={FaRegImage} />
                                <Text color="#77777750" fontSize="0.9rem">Загрузка изображения..</Text>
                            </div>
                        </div>
                    </div>
                )
            }
        
            <ChakraImage
            hidden={!previewIsLoad}
            className={`${className} ${animationClassName}`}
            src={src}
            alt={alt}
            objectFit={ objectFit ? objectFit : "cover" }
            onLoad={() => setPreviewIsLoad(true)}
            filter={filter}
            />
        </>
    )
}

export default Image