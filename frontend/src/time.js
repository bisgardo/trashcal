export function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getWeekdayOfJan1(year) {
    // Zeller's Congruence algorithm for finding the day of the week;
    // see 'https://en.wikipedia.org/wiki/Zeller%27s_congruence'.
    const q = 1; // day of the month
    const m = 13; // month (Jan is treated as month 13 of the previous year)
    const K = year % 100; // year of the century
    const J = Math.floor(year / 100); // zero-based year of the century

    // Day of the week (starting from Saturday).
    const h = (q + Math.floor((13 * (m + 1)) / 5) + K + Math.floor(K / 4) + Math.floor(J / 4) + 5 * J) % 7;

    // Shift result such that Monday is "0" and Sunday is "6".
    return (h + 5) % 7;
}
