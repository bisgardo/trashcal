import {CalendarDay} from "./CalendarDay";

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

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


function* genWeekdayIdxs(init) {
    for (let res = init; true; res++) {
        yield res % 7;
    }
}

export function Calendar({ data, year, isLeapYear, firstWeekdayIndex }) {
    const { times, validFromTime } = data;
    const types = Array.from(times.keys());

    const weekdayIdxs = genWeekdayIdxs(firstWeekdayIndex);
    const months = MONTHS.map((name, monthIdx) => ({
        name,
        days: Array.from({ length: daysInMonth(monthIdx, isLeapYear) }, (_, dayIdx) => {
            const time = Date.UTC(year, monthIdx, dayIdx + 1);
            return {
                dayIdx,
                weekdayIdx: weekdayIdxs.next().value,
                matchedTypes: matchTypes(types, times, time),
                isValid: time >= validFromTime,
            };
        }),
    }));
    return (
        <>
            <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-green-600">Kalender</h1>
            <div className="grid grid-cols-12 gap-4">
                {months.map(({ name, days }, monthIdx) => (
                    <div key={monthIdx}>
                        <h3 className="font-bold">{name}</h3>
                        {days.map(({ weekdayIdx, matchedTypes, isValid }, dayIdx) => (
                            <CalendarDay
                                key={dayIdx}
                                dayNum={dayIdx + 1}
                                weekdayIdx={weekdayIdx}
                                matchedTypes={matchedTypes}
                                isValid={isValid}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}
