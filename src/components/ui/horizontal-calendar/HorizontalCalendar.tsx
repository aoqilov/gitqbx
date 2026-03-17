import { Carousel, useCarousel } from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react'
import { useColorMode } from '../provider/color-mode'
import { getMinDate, stringToNormalizeDate } from '@/utils/date'
import Subtext from '../typography/SubText'
import Text from '../typography/Text'
import moment from 'moment'

interface HorizontalCalendarProps {
    selectedDay: Date,
    setSelectedDay: (v: Date) => void
    setModalIsOpen?: (v:boolean) => void
}

const HorizontalCalendar : FC<HorizontalCalendarProps> = ({ selectedDay, setSelectedDay, setModalIsOpen }) => {

    const theme = useColorMode()

    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())
    const [days, setDays] = useState<Array<string>>([])

    const [allowDateChoosing, setAllowDateChoosing] = useState<boolean>(false)
    const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0)
    const [carouselDateGap, setCarouselDateGap] = useState<number>(0)
    const [showCarousel, setShowCarousel] = useState<boolean>(false)

    const carousel = useCarousel({
        loop: true,
        slideCount: days.length,
        autoSize: true,
        allowMouseDrag: true,
        onPageChange: (details) => choiceSelectedDayIndex(details)
    });

    useEffect(() => {

        function handleResize() {
            const carouselElement = document.getElementsByClassName('carousel__root')
            if(carouselElement.length){
                const carouselWidth = carouselElement[0].offsetWidth
                const carouselElementsGap = ((carouselWidth-(7*40))/6).toFixed(1)
                setCarouselDateGap(+carouselElementsGap)
            }
        }

        window.addEventListener("resize", handleResize)
        handleResize()
        setShowCarousel(true)

        return () => window.removeEventListener("resize", handleResize)
        
    }, [])

    useEffect(() => {
        if(selectedDay){
            if(currentYear != selectedDay.getFullYear()) setCurrentYear(selectedDay.getFullYear())

            if(days.length){
                
                const dayTarget = days.find(d => d == getMinDate(selectedDay))
                
                if(dayTarget){
                    const dayIndex = days.indexOf(dayTarget)
                    carousel.scrollTo(dayIndex-3)
                }
            }
        }
    }, [selectedDay])

    useEffect(() => {
        if(currentYear){
            const daysList:Array<string> = generateYearDays(currentYear)

            const lastYearThreeDays = [`29.12.${currentYear-1}`, `30.12.${currentYear-1}`, `31.12.${currentYear-1}`]
            const newYearThreeDays = [`01.01.${currentYear+1}`, `02.01.${currentYear+1}`, `03.01.${currentYear+1}`]

            daysList.unshift(...lastYearThreeDays)
            daysList.push(...newYearThreeDays)
            setDays(daysList)

            setTimeout(() => {
                
                const dayTarget = daysList.find(d => d == getMinDate(selectedDay))
                
                if(dayTarget){
                    const dayIndex = daysList.indexOf(dayTarget)
                    carousel.scrollTo(dayIndex-3)
                    setAllowDateChoosing(true)
                }
            }, 300)
        }
    }, [currentYear])

    const choiceSelectedDayIndex = (details: { page: number, pageSnapPoint: number | undefined }) => {
        setSelectedDayIndex(details.page + 3)
        const target = days[details.page + 3]
        
        if(target && allowDateChoosing) setSelectedDay(stringToNormalizeDate(target))
    }

    const generateYearDays = (year: number) => {
        const days: Array<string> = [];
        let date = new Date(year, 0, 1);

        while (date.getFullYear() === year) {
            const formattedDate = getMinDate(date)
            days.push(formattedDate as string)
            
            date.setDate(date.getDate() + 1)
        }
        return days;
    }

    return(
        <Carousel.RootProvider
        value={carousel} 
        maxW="xl"
        >
            <Carousel.ItemGroup style={{ gap: `${carouselDateGap}px` }}>
                {
                    showCarousel && (
                        <>
                        {
                            days.map((day, index) => (
                                <Carousel.Item key={index} index={index} width="auto" onClick={() => setModalIsOpen && index == selectedDayIndex ? setModalIsOpen(true) : setSelectedDay(stringToNormalizeDate(day))} >                        
                                    <div id={`day-${index}`} className='w-[40px] h-[55px] flex flex-col gap-[4px] items-center justify-center'>
                                        <Subtext>{ moment(stringToNormalizeDate(day)).format('dd') }</Subtext>

                                        <div className={`flex w-[30px] h-[30px] items-center justify-center rounded-[10px] ${ index == selectedDayIndex && allowDateChoosing ? 'bg-[var(--main-color)]' : '' }`}>
                                            <Text color={ index == 0 || index == 1 || index == 2 || index == days.length-1 || index == days.length-2 || index == days.length-3 ? 'var(--subtext-color)' : index == selectedDayIndex && allowDateChoosing || theme.colorMode=='dark' ? '#fff' : '' }>{ moment(stringToNormalizeDate(day)).format('DD') }</Text>
                                        </div>
                                    </div>
                                </Carousel.Item>
                            ))
                        }
                        </>
                    )
                }
            </Carousel.ItemGroup>
        </Carousel.RootProvider>
    )
}

export default HorizontalCalendar