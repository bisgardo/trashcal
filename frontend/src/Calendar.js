import './calendar.scss';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
const WEEKDAYS = ['M', 'T', 'O', 'T', 'F', 'L', 'S'];

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

const TYPE_NAMES = {
    d: 'Deponi',
    e: 'Elektronik',
    f: 'Fortroligt papir',
    G: 'Glas',
    gpm: 'Glast, plast, metal',
    h: 'Haveaffald',
    hh: 'Hårde Hvidevarer',
    jm: 'Jern, metal',
    m: 'Madaffald',
    p: 'Pap',
    pp: 'Pap, papir',
    s: 'Småt brændbart',
    S: 'Stort brændbart',
    g: 'Genanvendeligt affald',
    r: 'Restaffald',
};

const FALLBACK_TYPE_NAME = 'Ukendt';

const MAX_TYPES = 5;

const CSS_CLASS_CONTAINER = 'day';
const CSS_CLASS_TEXT = 'text';
const CSS_CLASS_TYPE_MANY = 'type-many';
const CSS_CLASS_TYPE_UNKNOWN = 'type-unknown';
const CSS_CLASS_INVALID = 'invalid';

function Day({ matchedTypes, dayNum, weekdayIdx, isValid }) {
    const names = matchedTypes.map((t) => TYPE_NAMES[t] || FALLBACK_TYPE_NAME);

    const classNames = (() => {
        if (!matchedTypes.length) {
            return [null]; // render single <td> with no class name
        }
        if (matchedTypes.length > MAX_TYPES) {
            return [CSS_CLASS_TYPE_MANY];
        }
        return matchedTypes.map((t) => (TYPE_NAMES[t] ? `type-${t}` : CSS_CLASS_TYPE_UNKNOWN));
    })();

    const containerClasses = [CSS_CLASS_CONTAINER];
    if (!isValid) {
        containerClasses.push(CSS_CLASS_INVALID);
    }
    return (
        <div className={containerClasses.join('\n')} title={names.join('\n')}>
            <div className={CSS_CLASS_TEXT}>
                {WEEKDAYS[weekdayIdx]} {dayNum}
            </div>
            <table>
                <tbody>
                    <tr>
                        {classNames.map((c, i) => (
                            <td key={i} className={c}>
                                {/* to set height */}
                                &nbsp;
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

function* weekdayIdxGen(firstWeekdayIndex) {
    let weekdayIndex = firstWeekdayIndex;
    while (true) {
        yield weekdayIndex % 7;
        weekdayIndex++;
    }
}

export function Calendar({ data, year, isLeapYear, firstWeekdayIndex }) {
    const { times, validFromTime } = data;
    const types = Array.from(times.keys());

    // TODO Extract to parent component.
    const nextWeekdayIdx = weekdayIdxGen(firstWeekdayIndex)
    const months = MONTHS.map((name, monthIdx) => ({
        name,
        days: Array.from({ length: daysInMonth(monthIdx, isLeapYear) }, (_, dayIdx) => {
            const time = Date.UTC(year, monthIdx, dayIdx + 1);
            return {
                dayIdx,
                weekdayIdx: nextWeekdayIdx.next().value,
                matchedTypes: matchTypes(types, times, time),
                isValid: time >= validFromTime,
            };
        }),
    }));
    return (
        <>
            <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-green-600">Kalender</h1>
            <div className="grid grid-cols-12 gap-4">
                {months.map(({ name, days }, monthIdx) =>
                    (
                        <div key={monthIdx}>
                            <h3 className="font-bold">{name}</h3>
                            {days.map(({weekdayIdx, matchedTypes, isValid}, dayIdx) => (
                                <Day
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
