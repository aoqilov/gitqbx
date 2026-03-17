export const getMinDate = (date: Date | string) : string | unknown => {
    try {
        const dateData = new Date(date)

        if(Number.isNaN(dateData.getDate())) return undefined
        
        const day = dateData.getDate() < 10 ? `0${dateData.getDate()}` : dateData.getDate()
        const month = dateData.getMonth()+1 < 10 ? `0${dateData.getMonth()+1}` : dateData.getMonth()+1
        const year = dateData.getFullYear()

        return `${day}.${month}.${year}`
    } catch (error) {
        return error
    }
}

export const stringToNormalizeDate = (date: string) => {
    const dateAsArray = date.split('.')
    if(dateAsArray.length == 3){
        if(typeof +dateAsArray[0] == 'number' &&typeof +dateAsArray[1] == 'number' &&typeof +dateAsArray[2] == 'number'){
            return new Date(`${dateAsArray[1]}.${dateAsArray[0]}.${dateAsArray[2]}`)
        } else throw new Error('Incorrect date value. The date must contain 3 numbers')
    } else throw new Error('Incorrect date value. Date numbers must be of type digits (int/number)')

}