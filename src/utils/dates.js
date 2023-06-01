/**
 * A method that converts today's date to formatted string
 * @returns a string
 */
const getFormattedDay = (today) => {
    today = new Date(today);
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = dd + '-' + mm + '-' + yyyy;
    return formattedToday;
}

const getFormattedDayYYYYMMDD = (dateString) => {
    dateString = new Date(dateString);
    const yyyy = dateString.getFullYear();
    let mm = dateString.getMonth() + 1;
    let dd = dateString.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = yyyy + '-' + mm + '-' + dd;
    return formattedToday;
}


const getShiftProfit = (startTime, endTime, wage) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const totalStartMinutes = startHour * 60 + startMinute;
    const totalEndMinutes = endHour * 60 + endMinute;

    const minuteDifference = totalEndMinutes - totalStartMinutes;
    const decimalHours = minuteDifference / 60;

    return (decimalHours * Number(wage)).toFixed(2);
}

const isFromDate = (date1, date2) => {
    return (
        date1.getDate() >= date2.getDate() &&
        date1.getMonth() >= date2.getMonth() &&
        date1.getFullYear() >= date2.getFullYear()
    );
}

const isToDate = (date1, date2) => {
    return (
        date1.getDate() <= date2.getDate() &&
        date1.getMonth() <= date2.getMonth() &&
        date1.getFullYear() <= date2.getFullYear()
    );
}

/**
 * A method that calculates the age of the user
 * @returns the age as number
 */
const calculateAge = (birthDate) => {
    const currentDate = new Date();
    birthDate = new Date(birthDate);
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    let age = currentYear - birthYear;

    // Check if the current date is before the birth date in the current year
    if (
        currentMonth < birthMonth ||
        (currentMonth === birthMonth && currentDay < birthDay)
    ) {
        age--;
    }

    return age;
}

export { getFormattedDay, getShiftProfit, isFromDate, isToDate, calculateAge, getFormattedDayYYYYMMDD };