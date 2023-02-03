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

// Note that Tailwind CSS classes must not be generated in template strings; see
// 'https://tailwindcss.com/docs/content-configuration#class-detection-in-depth'.
const TYPES = {
    d: {
        name: 'Deponi',
        validClass: 'bg-rose-400',
        invalidClass: 'bg-rose-200',
    },
    e: {
        name: 'Elektronik',
        validClass: 'bg-rose-400',
        invalidClass: 'bg-rose-200',
    },
    f: {
        name: 'Fortroligt papir',
        validClass: 'bg-rose-400',
        invalidClass: 'bg-rose-200',
    },
    G: {
        name: 'Glas',
        validClass: 'bg-rose-400',
        invalidClass: 'bg-rose-200',
    },
    gpm: {
        name: 'Glast/plast/metal',
        validClass: 'bg-rose-400',
        invalidClass: 'bg-rose-200',
    },
    h: {
        name: 'Haveaffald',
        validClass: 'bg-rose-400',
        invalidClass: 'bg-rose-200',
    },
    hh: {
        name: 'Hårde Hvidevarer',
        validClass: 'bg-rose-400',
        invalidClass: 'bg-rose-200',
    },
    jm: {
        name: 'Jern/metal',
        validClass: 'bg-rose-400',
        invalidClass: 'bg-rose-200',
    },
    m: {
        name: 'Madaffald',
        validClass: 'bg-rose-400',
        invalidClass: 'bg-rose-200',
    },
    p: {
        name: 'Pap',
        validClass: 'bg-rose-400',
        invalidClass: 'bg-rose-200',
    },
    pp: {
        name: 'Pap/papir',
        validClass: 'bg-rose-400',
        invalidClass: 'bg-rose-200',
    },
    s: {
        name: 'Småt brændbart',
        validClass: 'bg-rose-400',
        invalidClass: 'bg-rose-200',
    },
    S: {
        name: 'Stort brændbart',
        validClass: 'bg-rose-400',
        invalidClass: 'bg-rose-200',
    },
    g: {
        name: 'Genanvendeligt affald',
        validClass: 'bg-slate-400',
        invalidClass: 'bg-slate-200',
    },
    r: {
        name: 'Restaffald',
        validClass: 'bg-emerald-400',
        invalidClass: 'bg-emerald-200',
    },
};

const FALLBACK_TYPE = {
    name: 'Ukendt',
    validClass: 'bg-gray-400',
    invalidClass: 'bg-gray-200',
};

function Day({ times, validFromTime, types, time, day, weekdayIdx }) {
    // // TODO Remove this dummy data.
    // validFromTime = Date.UTC(2023, 5, 5);
    // times = new Map([
    //     ['r', new Set([Date.UTC(2023, 6, 7)])],
    //     ['g', new Set([Date.UTC(2023, 6, 7)])],
    //     ['p', new Set([Date.UTC(2023, 6, 7)])],
    // ]);
    // types = ['r', 'p', 'g']

    const isValid = time >= validFromTime;
    const typeDatas = resolveTypes(types, times, time).map((t) => TYPES[t] || FALLBACK_TYPE);
    const names = typeDatas.map((t) => t.name);
    let classNames = typeDatas.map((t) => {
        return isValid ? t.validClass : t.invalidClass;
    });
    if (!classNames.length) {
        classNames = [null];
    } else if (classNames.length > 5) {
        classNames = ['bg-amber-900'];
    }

    let textClassNames = '';
    if (!isValid) {
        textClassNames = 'text-gray-300';
    }
    return (
        <div className="mb-1" title={names.join('\n')}>
            <div className="px-1 absolute">
                <span className={textClassNames}>
                    {WEEKDAYS[weekdayIdx]} {day}
                </span>
            </div>
            <table className="border w-full">
                <tbody>
                    <tr>
                        {classNames.map((c, i) => (
                            <td key={i} className={`${c} p-0`}>
                                &nbsp;
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
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
                            <Day
                                key={dayIdx}
                                times={times}
                                validFromTime={validFromTime}
                                types={types}
                                time={Date.UTC(year, monthIdx, dayIdx + 1)}
                                day={dayIdx + 1}
                                weekdayIdx={nextWeekdayIdx()}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}
