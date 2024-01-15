export function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function dayOfWeekOfJan1(year) {
    // Zeller's Congruence algorithm for finding the day of the week;
    // see 'https://en.wikipedia.org/wiki/Zeller%27s_congruence'.
    // Jan 1st is regarded as the first day of the 13th month of the previous year.
    const dayOfMonth = 1; // day of the month
    const month = 13; // month (January is treated as month 13 of the previous year)
    const previousYear = year - 1;
    const yearInCentury = previousYear % 100;
    const century = Math.floor(previousYear / 100);

    // Compute week day and shift to counting from Monday (as 0).
    const dayOfWeekFromSaturday =
        (dayOfMonth +
            Math.floor((13 * (month + 1)) / 5) +
            yearInCentury +
            Math.floor(yearInCentury / 4) +
            Math.floor(century / 4) +
            5 * century) %
        7;
    return (dayOfWeekFromSaturday + 5) % 7;
}
