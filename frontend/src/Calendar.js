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

function resolveTypes(types, data, date) {
    return types.filter((t) => {
        let datum = data.get(t);
        console.log(datum, date, datum.has(date));
        return datum.has(date);
    });
}

function dayStyle(data, types, year, month, day) {
    // 'new Date' doesn't work as it uses the local timezone while 'Date.parse' doesn't!!
    return resolveTypes(types, data, Date.parse(`${year}-${month}-${day}`))
        .map((t) => {
            console.log('matched type', t);
            switch (t) {
                case 'restaffald':
                    return 'bg-emerald-400';
                case 'genanvendeligt_affald':
                    return 'bg-slate-400';
                default:
                    return '';
            }
        })
        .join(' ');
}

export function Calendar({ data, year, isLeapYear, firstWeekdayIndex }) {
    const types = Array.from(data.keys());

    let weekdayIndex = firstWeekdayIndex;
    const nextWeekday = () => {
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
                            <div
                                className={`border mb-1 p-0.5 ${dayStyle(data, types, year, monthIdx + 1, dayIdx + 1)}`}
                            >
                                {WEEKDAYS[nextWeekday()]} {dayIdx + 1}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}
