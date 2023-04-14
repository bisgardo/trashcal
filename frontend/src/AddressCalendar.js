import { Calendar } from './Calendar';
import { useFetchCalendarData } from './useFetchCalendarData';
import { useCallback, useMemo, useState } from 'react';

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

export function AddressCalendar({ addressId, year, isLeapYear, firstWeekdayIdx }) {
    // TODO Show spinner or loading message while loading.
    const [data, error] = useFetchCalendarData(addressId, year, isLeapYear, firstWeekdayIdx);
    const today = useMemo(() => {
        // Compute month/day of "today", as resolved in the local timezone.
        const now = new Date();
        if (year !== now.getFullYear()) {
            return undefined;
        }
        return { monthIdx: now.getMonth(), dayIdx: now.getDate() - 1 };
    }, [year]);
    return (
        <>
            <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-green-600">Kalender</h1>
            {error && <div>Fetch error: {error}</div>}
            {data && <CalendarWithLegend {...data} typeNames={TYPE_NAMES} today={today} />}
        </>
    );
}

function CalendarWithLegend({ months, types, typeNames, today }) {
    const [disabledTypes, setDisabledTypes] = useState(new Set());
    const selectedTypeNames = useMemo(() => {
        const res = new Map(Object.entries(typeNames));
        disabledTypes.forEach((t) => res.delete(t));
        return res;
    }, [typeNames, disabledTypes]);
    return (
        <>
            <CalendarLegend
                types={types}
                typeNames={typeNames}
                disabledTypes={disabledTypes}
                setDisabledTypes={setDisabledTypes}
            />
            <Calendar months={months} typeNames={selectedTypeNames} today={today} />
        </>
    );
}

function CalendarLegend({ types, typeNames, disabledTypes, setDisabledTypes }) {
    const toggleType = useCallback(
        (t) => {
            const newSelectedTypes = new Set(disabledTypes);
            if (disabledTypes.has(t)) {
                newSelectedTypes.delete(t);
            } else {
                newSelectedTypes.add(t);
            }
            setDisabledTypes(newSelectedTypes);
        },
        [disabledTypes, setDisabledTypes]
    );
    return (
        <dl className="mb-2">
            {types.map((t) => {
                let colorClass = `type-${t}`;
                if (disabledTypes.has(t)) {
                    colorClass += '-disabled';
                }
                return (
                    <>
                        <dt key={`color-${t}`} className={`w-4 h-4 inline-block align-middle mr-1 ${colorClass}`}></dt>
                        <dd
                            key={`name-${t}`}
                            className="inline-block align-middle mr-6 cursor-pointer"
                            onClick={() => toggleType(t)}
                        >
                            {typeNames[t]}
                        </dd>
                    </>
                );
            })}
        </dl>
    );
}
