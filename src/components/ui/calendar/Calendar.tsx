import { FC, useEffect, useState } from 'react'
import { DayButton, DayButtonProps, DayPicker, DropdownOption, getDefaultClassNames, Matcher, Mode, type DropdownProps  } from "react-day-picker";
import { ru } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { useColorMode } from '../provider/color-mode';
import Select from '../select/Select';
import { getMinDate, stringToNormalizeDate } from '@/utils/date';
import DateInput from '../date-input/DateInput';
import TimePicker from '../time-picker/TimePicker';
import Notification from '@/components/ui/notification/Notification'
import Input from '../input/Input';

export type DayPickerValue = Date | undefined | Array<Date> | { from: Date, to: Date }

interface DayPickerProps<T extends DayPickerValue> {
    selectDay: T
    selectDayMethod: (v: T) => void,
    mode: Mode
    yearsAllow?: AccessTasksYears<number>
    disabledDates?: Matcher | Matcher[] | undefined,
    haveTasksDates?: Array<Date>,
    enableDateInput?:boolean,

    enableTimeInput?: boolean
    selectTime?: string | undefined
    selectTimeMethod?: (v: string | undefined) => void
}


const currentYear = new Date(Date.now()).getFullYear()
const accessYears = {
    first: stringToNormalizeDate(`01.01.${currentYear-1}`),
    last: stringToNormalizeDate(`31.12.${currentYear+10}`)
}


const Calendar : FC<DayPickerProps> = ({ selectDay, selectDayMethod, mode="single", disabledDates=[], yearsAllow, haveTasksDates=[], enableDateInput=true, enableTimeInput=false, selectTimeMethod }) => {

    const defaultClassNames = getDefaultClassNames();
    const theme = useColorMode()

    const [ accessDate, setAccessDate ] = useState<AccessTasksYears<Date>>(accessYears)
    const [ inputDate, setInputDate ] = useState<Date | null>(null)
    const [ month, setMonth ] = useState<Date>(new Date())
    const [ rangeInput, setRangeInput ] = useState<string>()

    const [ selectedInSelectDates, setSelectedInSelectDates ] = useState<Array<{ value: string, label: string }>>([])

    useEffect(() => {
        if(yearsAllow){
            if(yearsAllow.first && typeof yearsAllow.first == 'number'){
                if(yearsAllow.first < accessYears.first.getFullYear()) accessYears.first = new Date(`01.01.${yearsAllow.first}`)
            }
            if(yearsAllow.last && typeof yearsAllow.last == 'number'){
                if(yearsAllow.last > accessYears.last.getFullYear()) accessYears.last = new Date(`01.01.${yearsAllow.last}`)
            }
        } 
        
        setAccessDate(accessYears)

        if(selectDay){
            setInputDate(selectDay)
            selectDayMethod(selectDay)
            setMonth(selectDay)
        }
    }, [])

    function isActualDate(value) {
        return value instanceof Date && !isNaN(value);
    }

    const selectedDayMethodPrehand = (v: DayPickerValue) => {
        
        selectDayMethod(v)        

        if(Array.isArray(v)) setSelectedInSelectDates(v.map(d => { return { value: getMinDate(d), label: getMinDate(d) } }))
        if(isActualDate(v)) setInputDate(v as Date)
        if(typeof v == 'object'){
            if(v.from || v.to) {
                const fromDate = v.from ? getMinDate(v.from) : ''
                const toDate = v.to ? getMinDate(v.to) : ''

                setRangeInput(`${fromDate}-${toDate}`)
            }
        }
    }

    const clearRangeMethod = () => {
        setRangeInput('')
        selectDayMethod(undefined)
    }

    const inputDateClearMethod = () => {
        
        setInputDate(null)
        selectDayMethod(undefined)
    }

    const deleteFromSelect = (mode: 'single' | 'all', value?: string) => {
        if(mode == 'single'){
            if(Array.isArray(selectDay)){
                const filteredSelectedDateFromSelect = [...selectedInSelectDates].filter(date => date.value != value)
                setSelectedInSelectDates(filteredSelectedDateFromSelect)

                const filteredSelectedDateFromCalendar = [...selectDay].filter(date => getMinDate(date) != value)
                selectDayMethod(filteredSelectedDateFromCalendar)
            }
        } else {            
            selectDayMethod(undefined)
            setSelectedInSelectDates([])
        }
    }

    const setInputDateMethod = (value:Date | null, event: any) => {


        if(mode == 'single'){
            if(!value) return setInputDate(value)                

            try {
                const checkedMinDate = getMinDate(value)
                const maxAccessDateYear = accessDate.last.getFullYear()
                let validDate: Date | undefined = undefined                

                if(checkedMinDate && typeof checkedMinDate == 'string'){
                    
                    const dateAsArray = checkedMinDate.split('.')  
                                    
                    if(+dateAsArray[2] > maxAccessDateYear){
                        dateAsArray[2] = ''+maxAccessDateYear
                        const preparedValidDate = dateAsArray.join('.')

                        validDate = stringToNormalizeDate(preparedValidDate)
                        
                    }else if(value < accessDate.first && dateAsArray[2].length == 4){
                        validDate = accessDate.first
                    } else{
                        validDate = value
                    }

                    if(disabledDates && Array.isArray(disabledDates)){
                        disabledDates.forEach(date => {
                            if(validDate && !Array.isArray(validDate)){
                                const dateTarget = getMinDate(date as Date)
                                const checkedTarget = getMinDate(validDate)
                                
                                let validDateMilliseconds = validDate.getTime()
                                if(dateTarget == checkedTarget){
                                    let freeDateIsFind = false

                                    while(!freeDateIsFind){
                                        validDateMilliseconds += 1*24*60*60*1000

                                        const checkDate = new Date(validDateMilliseconds)
                                            if(!disabledDates.find((disDate) => getMinDate(disDate as Date) == getMinDate(checkDate))){
                                                freeDateIsFind = true
                                                validDate = checkDate
                                            } else continue
                                    }
                                }
                            }
                        })
                    }
                    
                    if(validDate){
                        setInputDate(validDate)
                        selectDayMethod(validDate)
                        setMonth(validDate)
                    }

                }

            } catch (error) {            
                setInputDate(value)
            }
        }
    
    }

    // TODO:
    // - sync datapick with datainput
    // - time picker

    return(
        <div className='flex flex-col gap-[5px] items-center '>

            <div className={ enableTimeInput ? 'grid grid-cols-[170px_auto] gap-[15px]' : 'w-[294px]' }>

                {
                    enableDateInput && (
                        <>
                            {
                                mode == 'single' ? (
                                    <DateInput
                                    value={inputDate}
                                    onChange={setInputDateMethod}
                                    size="md"
                                    clearMethod={inputDateClearMethod}
                                    />
                                ) : mode == 'multiple' ? (
                                    <Select
                                    placeholder="Выберите дату"
                                    size='md'
                                    options={Array.isArray(selectDay) ? selectDay.map(v => { return { value: getMinDate(v), label: getMinDate(v) } }) : []}
                                    isMulti
                                    value={selectedInSelectDates}
                                    isClearable={false}
                                    showSelected={true}
                                    hideList={true}
                                    deleteItemsMethod={deleteFromSelect}
                                    />
                                ) : (
                                    <Input
                                    placeholder='Выберите даты'
                                    disabled={true}
                                    value={rangeInput}
                                    clearMethod={clearRangeMethod}
                                    />
                                )
                            }
                        </>
                    )
                }

                {
                    enableTimeInput && selectTimeMethod && (
                        <TimePicker
                        selectTimeMethod={selectTimeMethod}
                        clearMethod={() => {}}
                        />
                    )
                }
            </div>

            <DayPicker
            animate
            mode={mode}
            classNames={{
                weekday: `text-[var(--subtext-color)]`,
                day: `w-[10px] h-[10px]`,
                today: `${defaultClassNames.today} rounded-[15px] border-[1px]`,
                selected: `${defaultClassNames.selected} font-normal bg-[var(--main-color)] text-[#fff] rounded-[15px]`,
                root: `${defaultClassNames.root} flex justify-center ${ theme.colorMode == 'light' ? 'text-[#000]' : 'text-[#fff]'  }`,
                range_start: `bg-[var(--main-color)] text-[#fff] rounded-[15px]`,
                range_middle: `${defaultClassNames.range_middle} bg-[#C69CF7]`,
                range_end: `bg-[var(--main-color)] text-[#fff] rounded-[15px]`,
                chevron: `${defaultClassNames.chevron} w-[18px]`
            }}
            selected={selectDay}
            onSelect={selectedDayMethodPrehand}
            month={month}
            onMonthChange={setMonth}
            locale={ru}
            captionLayout="dropdown"
            disabled={ disabledDates ? disabledDates : undefined }
            required
            startMonth={accessDate.first}
            endMonth={accessDate.last}
            components={{ 
                YearsDropdown: CustomSelectDropdown,
                MonthsDropdown: CustomSelectDropdown,
                DayButton: ({...props}) => (
                    <CustomDayButton {...props} haveTasksDates={haveTasksDates} />
                )
            }}
            />
            
        </div>
    )
}

export const CustomSelectDropdown = (props: DropdownProps) => {
  const { options, value, onChange, "aria-label": ariaLabel } = props;

  const handleValueChange = (newValue) => {
    
    if (onChange) {
      const syntheticEvent = {
        target: {
          value: newValue.value,
        },
      } as React.ChangeEvent<HTMLSelectElement>;

      onChange(syntheticEvent);
    }
  };

  const preparedOptions = (options as Array<DropdownOption>).map(option => { return { value: option.value.toString(), label: option.label } })

  return (
    <div className='w-fit'>
        <Select
        value={preparedOptions.find(option => option.value == value)}
        onChange={handleValueChange}
        options={preparedOptions}
        size='sm'
        variant='ghost'
        />
    </div>
  );
}


export const CustomDayButton = (props: DayButtonProps & { haveTasksDates: Array<Date> }) => {
  const { day, modifiers, haveTasksDates, ...buttonProps } = props;   

  return (
    <Notification isNotify={!!haveTasksDates.find(d => getMinDate(d) == getMinDate(day.date))}>
        
        <DayButton
        {...buttonProps}
        day={day}
        modifiers={modifiers}        
        />
    </Notification>
  )
}

export default Calendar