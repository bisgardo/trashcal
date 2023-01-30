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

function resolveTypes(types, times, time) {
    // Note that printing 'times' here prunes the value to 32 bits in Firefox.
    // But not if you throw an exception right afterwards!
    // (Try to make minimal example of this.)
    return types.filter((t) => times.get(t).has(time));
}

function matchClassNames(types, times, time, isValid) {
    // Note that Tailwind CSS classes must not be generated in template strings; see
    // 'https://tailwindcss.com/docs/content-configuration#class-detection-in-depth'.
    return resolveTypes(types, times, time).map((t) => {
        switch (t) {
            case 'd': // deponi
            case 'e': // elektronik
            case 'f': // fortroligt papir
            case 'G': // glas
            case 'gpm': // glas, plast og metal
            case 'h': // haveaffald
            case 'hh': // hårde hvidevarer
            case 'jm': // jern og metal
            case 'm': // madaffald
            case 'p': // pap
            case 'pp': // papir og pap
            case 's': // småt brændbart
            case 'S': // stort brændbart
                return isValid ? 'bg-rose-400' : 'bg-rose-200';
            case 'g': // genanvendeligt affald (glas, plast, metal, papir og pap)
                return isValid ? 'bg-slate-400' : 'bg-slate-200';
            case 'r': // restaffald
                return isValid ? 'bg-emerald-400' : 'bg-emerald-200';
            default:
                return '';
        }
    });
}

function Day({ times, validFromTime, types, time, day, weekdayIdx }) {
    // // TODO Remove this dummy data.
    // validFromTime = Date.UTC(2023, 5, 5);
    // times = new Map([
    //     ['r', new Set([Date.UTC(2023, 6, 7)])],
    //     ['g', new Set([Date.UTC(2023, 6, 7)])],
    //     ['p', new Set([Date.UTC(2023, 6, 7)])],
    // ]);
    // types = ['r', 'p', 'g']

    let isValid = time >= validFromTime;
    let classNames = matchClassNames(types, times, time, isValid);
    // if (time === validFromTime) console.log('before', {classNames});
    if (!classNames.length) {
        classNames = [undefined];
    } else if (classNames.length > 5) {
        classNames = ['bg-amber-900'];
    }
    // if (time === validFromTime) console.log('after', {classNames});

    function gridColsClass() {
        switch (classNames.length) {
            case 1:
                return 'grid-cols-1';
            case 2:
                return 'grid-cols-2';
            case 3:
                return 'grid-cols-3';
            case 4:
                return 'grid-cols-4';
            case 5:
                return 'grid-cols-5';
        }
    }

    const containerClassNames = ['grid', gridColsClass()];
    if (!isValid) {
        containerClassNames.push('text-gray-300');
    }
    return (
        <>
            <div className={containerClassNames.join(' ')}>
                <div className="px-1 absolute">
                    {WEEKDAYS[weekdayIdx]} {day}
                </div>
                {classNames.map((c, i) => (
                    <div key={i} className={c}>
                        &nbsp;
                    </div>
                ))}
            </div>
        </>
    );
}

export function Calendar({ data, year, isLeapYear, firstWeekdayIndex }) {
    const { times, validFromTime } = data;
    const types = Array.from(times.keys());

    let weekdayIndex = firstWeekdayIndex;
    const nextWeekdayIdx = () => {
        const tmp = weekdayIndex;
        weekdayIndex = (weekdayIndex + 1) % 7;
        return tmp;
    };
    return (
        <>
            <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-green-600">Kalender</h1>
            <div className="grid grid-cols-12 gap-4">
                {MONTHS.map((name, monthIdx) => (
                    <div key={monthIdx}>
                        <h3 className="font-bold">{name}</h3>
                        {Array.from(Array(daysInMonth(monthIdx, isLeapYear)).keys()).map((dayIdx) => (
                            <div key={dayIdx} className="border mb-1">
                                <Day
                                    times={times}
                                    validFromTime={validFromTime}
                                    types={types}
                                    time={Date.UTC(year, monthIdx, dayIdx)}
                                    day={dayIdx + 1}
                                    weekdayIdx={nextWeekdayIdx()}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}
