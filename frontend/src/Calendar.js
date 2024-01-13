import './calendar.scss';
import { MONTH_NAMES } from './config';
import { WEEKDAY_NAMES } from './config';

const MAX_TYPES = 5;

const CSS_CLASS_CONTAINER = 'day';
const CSS_CLASS_TEXT = 'text';
const CSS_CLASS_TYPE_MANY = 'type-many';
const CSS_CLASS_INVALID = 'invalid';
const CSS_CLASS_TODAY = 'today';

export function CalendarDay({ dayNum, weekdayIdx, matchedTypes, typeNames, isValid, isToday }) {
    const names = matchedTypes.map((t) => typeNames.get(t)).filter(Boolean);

    const classNames = (() => {
        const res = matchedTypes.map((t) => typeNames.has(t) && `type-${t}`).filter(Boolean);
        if (!res.length) {
            return [null]; // render single <td> with no class name
        }
        if (res.length > MAX_TYPES) {
            return [CSS_CLASS_TYPE_MANY];
        }
        return res;
    })();

    const containerClasses = [CSS_CLASS_CONTAINER];
    if (!isValid) {
        containerClasses.push(CSS_CLASS_INVALID);
    }
    if (isToday) {
        containerClasses.push(CSS_CLASS_TODAY);
    }
    return (
        <div className={containerClasses.join('\n')} title={names.join('\n')}>
            <div className={CSS_CLASS_TEXT}>
                {WEEKDAY_NAMES[weekdayIdx]} {dayNum}
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

function CalendarMonth({ year, monthIdx, data, typeNames, today }) {
    // The index of today's day in month if today is in that month and 'false' otherwise.
    const todayDayIdx = today.year === year && today.monthIdx === monthIdx && today.dayIdx;
    return (
        <div>
            <h3 className="font-bold">{MONTH_NAMES[monthIdx]}</h3>
            {data.map(({ weekdayIdx, matchedTypes, isValid }, dayIdx) => (
                <CalendarDay
                    key={dayIdx}
                    dayNum={dayIdx + 1}
                    weekdayIdx={weekdayIdx}
                    matchedTypes={matchedTypes}
                    typeNames={typeNames}
                    isValid={isValid}
                    isToday={todayDayIdx === dayIdx}
                />
            ))}
        </div>
    );
}

export function Calendar({ year, months, typeNames, today }) {
    return (
        <div className="grid lg:grid-cols-12 md:grid-cols-6 sm:grid-cols-3 gap-4">
            {months.map((days, monthIdx) => (
                <CalendarMonth
                    key={monthIdx}
                    year={year}
                    monthIdx={monthIdx}
                    data={days}
                    typeNames={typeNames}
                    today={today}
                />
            ))}
        </div>
    );
}
