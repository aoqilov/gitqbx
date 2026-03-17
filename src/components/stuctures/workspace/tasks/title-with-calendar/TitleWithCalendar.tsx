import PageTitle from '@/components/ui/typography/PageTitle'
import { FC, useState } from 'react'
import Subtext from '@/components/ui/typography/SubText'
import moment from 'moment'
import { capitalizeFirstWord } from '@/utils/string'
import { Icon, Separator } from '@chakra-ui/react'
import { FaRegCalendarAlt } from 'react-icons/fa'
import HorizontalCalendar from '@/components/ui/horizontal-calendar/HorizontalCalendar'
import Dialog from '@/components/ui/dialog/Dialog'
import Calendar from '@/components/ui/calendar/Calendar'
import Heading from '@/components/ui/typography/Heading'
import Button from '@/components/ui/buttons/Button'

interface TitleWithCalendarProps {
    title: string,
    selectedDay: Date,
    setSelectedDay: (v: Date) => void
}

const TitleWithCalendar : FC<TitleWithCalendarProps> = ({ title, selectedDay, setSelectedDay }) => {

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

    return(
        <div className='flex flex-col gap-[10px]'>
            <div className='flex justify-between items-center'>
                <PageTitle title={ title } />
                
                
                <Dialog
                size='xs'
                title="Перейти к дате"
                headerIcon={
                    <Icon fontSize='0.9em' as={FaRegCalendarAlt} color="var(--main-color)" />
                }
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
                openTrigger={
                    <div className='flex gap-1.5 items-center'>
                        <Icon fontSize='0.9em' as={FaRegCalendarAlt} color="var(--subtext-color)" />
                        <Subtext marginTop='4px' fontSize='0.9em'>{ capitalizeFirstWord(moment(selectedDay).format('MMMM')) } {moment(selectedDay).format('DD')}, {moment(selectedDay).format('YYYY')}</Subtext>
                    </div>
                }
                actionTrigger={
                    <Button
                    colorPalette='alphaWhite'
                    variant='outline'
                    size='sm'
                    borderColor="alphaWhite.500"
                    color="var(--grey-color)"
                    >Закрыть</Button>
                }
                >
                    <Calendar
                    selectDay={selectedDay}
                    selectDayMethod={setSelectedDay}
                    // yearsAllow={user.user.tasksYears}
                    // disabledDates={[stringToNormalizeDate('01.10.2026'), stringToNormalizeDate('01.12.2026'), stringToNormalizeDate('01.11.2026')]}
                    // haveTasksDates={[stringToNormalizeDate('01.12.2026'), stringToNormalizeDate('01.17.2026')]}
                    mode='single'
                    />
                </Dialog>
            </div>

            <div>
                <HorizontalCalendar
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                setModalIsOpen={setModalIsOpen}
                />
            </div>

        </div>
    )
}

export default TitleWithCalendar