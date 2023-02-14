import { CalendarDay } from './CalendarDay';
import { MONTH_NAMES } from './config';

export function Calendar({ data }) {
    return (
        <>
            <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-green-600">Kalender</h1>
            <div className="grid grid-cols-12 gap-4">
                {data.map((days, monthIdx) => (
                    <div key={monthIdx}>
                        <h3 className="font-bold">{MONTH_NAMES[monthIdx]}</h3>
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
