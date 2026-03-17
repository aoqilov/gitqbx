import { FC } from 'react'
import { CustomProvider, DateInputProps, DateInput as DateInputRSuite } from 'rsuite';
import '@/assets/css/rsuite-DateInput.css';
import { useColorMode } from '../provider/color-mode';
import IconButton from '../buttons/IconButton';
import { FaXmark } from 'react-icons/fa6';

interface DateInputPropsI extends DateInputProps{
    value: Date | null,
    onChange: (value: Date | null, event: any) => void,
    clearMethod?: () => void
}

const DateInput : FC<DateInputPropsI> = ({ value, onChange, clearMethod, ...props }) => {
    
    const theme = useColorMode()

    return(
        <div className='relative'>

            <CustomProvider theme={ theme.colorMode == 'dark' ? "dark" : "light"}>
                <DateInputRSuite
                { ...props }
                value={value}
                onChange={onChange}
                format="dd.MM.yyyy"
                borderRadius='30px'
                placeholder='дд.мм.гггг'
                />
            </CustomProvider>
            
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

export default DateInput