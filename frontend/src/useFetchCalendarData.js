import { useEffect, useState } from 'react';
import { BACKEND_URL_BASE, MONTH_NAMES } from './config';

function parsePatchedDate(year, monthDay) {
    // Parsing numbers instead of using `Date.parse(`${year}-${monthDay}`)` because the lack of leading zeros
    // on month and day causes Safari (on iOS at least) to parse such a date as NaN!
    // And Chrome to use the local time zone instead of UTC..!
    const idx = monthDay.indexOf('-');
    const month = Number.parseInt(monthDay.slice(0, idx), 10);
    const day = Number.parseInt(monthDay.slice(idx + 1), 10);
    return Date.UTC(year, month - 1, day);
}

function parseDates(dates, year) {
    if (dates === null) {
        return null;
    }
    return new Map(
        Object.entries(dates).map(([type, dates]) => [
            type,
            new Set(dates.map((monthDay) => parsePatchedDate(year, monthDay))),
        ])
    );
}

function parse(year, data) {
    const dates = data['dates'];
    const validFrom = data['valid_from_date'];
    try {
        return {
            times: parseDates(dates, year), // null if 'dates' is null
            validFromTime: parsePatchedDate(year, validFrom),
        };
    } catch {
        console.error('invalid data:', data);
        throw new Error('invalid data (logged to console)');
    }
}

function daysInMonth(monthIdx, isLeapYear) {
    switch (monthIdx) {
        case 0:
            return 31;
        case 1:
            return isLeapYear ? 29 : 28;
        case 2:
            return 31;
        case 3:
            return 30;
        case 4:
            return 31;
        case 5:
            return 30;
        case 6:
            return 31;
        case 7:
            return 31;
        case 8:
            return 30;
        case 9:
            return 31;
        case 10:
            return 30;
        case 11:
            return 31;
        default:
            throw new Error('invalid month index');
    }
}

function matchTypes(types, times, time) {
    // Note that printing 'times' here prunes the value to 32 bits in Firefox.
    // But not if you throw an exception right afterwards!
    // (Try to make minimal example of this.)
    return types.filter((t) => times.get(t).has(time));
}

function buildCalendarData(times, validFromTime, year, yearDetails) {
    if (times === null) {
        return null;
    }
    const { isLeapYear, firstWeekdayIdx } = yearDetails;
    const types = Array.from(times.keys());
    let nextWeekdayIdx = firstWeekdayIdx; // mutated inside "loop" below
    return {
        months: Array.from(MONTH_NAMES, (_, monthIdx) =>
            Array.from({ length: daysInMonth(monthIdx, isLeapYear) }, (_, dayIdx) => {
                const time = Date.UTC(year, monthIdx, dayIdx + 1);
                return {
                    dayIdx,
                    weekdayIdx: nextWeekdayIdx++ % 7,
                    matchedTypes: matchTypes(types, times, time),
                    isValid: time >= validFromTime,
                };
            })
        ),
        types,
    };
}

async function load(url, abortController, year, yearDetails) {
    try {
        const res = await fetch(url, abortController);
        if (res.status !== 200) {
            throw new Error(`calendar data lookup failed with HTTP status ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        let { times, validFromTime } = parse(year, json);
        return [{ calendar: buildCalendarData(times, validFromTime, year, yearDetails) }, ''];
    } catch (e) {
        return [null, e.message || e];
    }
}

export function useFetchCalendarData(addressId, yearWithDetails) {
    const [res, setRes] = useState([null, '']);
    useEffect(() => {
        const { year, details } = yearWithDetails;
        const url = new URL(`${BACKEND_URL_BASE}/trash_calendar/${addressId}`);
        url.searchParams.append('year', year);
        const abortController = new AbortController();
        setRes([null, '']);
        load(url, abortController, year, details).then(setRes);
        return () => abortController.abort();
    }, [addressId, yearWithDetails]);
    return res;
}
