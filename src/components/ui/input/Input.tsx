import { FC } from 'react'
import { Input as ChakraInput, defineRecipe, InputProps } from '@chakra-ui/react'
import { useColorMode } from '../provider/color-mode'
import IconButton from '../buttons/IconButton'
import { FaXmark } from "react-icons/fa6";

export interface InputPropsI extends InputProps {
  clearMethod?: () => void
}

export const inputRecipe = defineRecipe({
  className: "chakra-input",
  base: {
    //
  }
})

const Input : FC<InputPropsI> = ({ clearMethod, ...props }) => {
   
    const theme = useColorMode()
    const { value } = props

    return(
      <div className='relative'>
        <ChakraInput
        {...props}
        colorPalette='brand'
        borderRadius="30px"
        color={theme.colorMode == 'light' ? '#000' : '#fff'}
        fontSize="0.9em"
        />

        {
          clearMethod && (
            <div className="absolute top-[8px] right-[5px]">
              {
                value && (
                  <IconButton
                  icon={FaXmark}
                  onClick={() => clearMethod()}
                  size='2xs'
                  variant='solid'
                  colorPalette='brand'
                  color="#fff"
                  />
                )
              }
            </div>
          )
        }
      </div>
    )
}

export default Input