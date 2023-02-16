import { Calendar } from './Calendar';
import { useFetchCalendarData } from './useFetchCalendarData';
import {useCallback, useMemo, useState} from "react";

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
    const [data, error] = useFetchCalendarData(addressId, year, isLeapYear, firstWeekdayIdx);
    return (
        <>
            <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-green-600">Kalender</h1>
            {error && <div>Fetch error: {error}</div>}
            {data && <CalendarWithLegend {...data} typeNames={TYPE_NAMES} />}
        </>
    );
}

function CalendarWithLegend({months, types, typeNames}) {
    const [unselectedTypes, setUnselectedTypes] = useState(new Set());
    const selectedTypeNames = useMemo(() => {
        const res = new Map(Object.entries(typeNames));
        unselectedTypes.forEach((t) => res.delete(t))
        return res;
    }, [typeNames, unselectedTypes])
    return (
        <>
            <CalendarLegend types={types} typeNames={typeNames} unselectedTypes={unselectedTypes} setUnselectedTypes={setUnselectedTypes} />
            <Calendar months={months} typeNames={selectedTypeNames} />
        </>
    );
}

function CalendarLegend({types, typeNames, unselectedTypes, setUnselectedTypes}) {
    const toggleType = useCallback((t) => {
        const newSelectedTypes = new Set(unselectedTypes);
        if (unselectedTypes.has(t)) {
            newSelectedTypes.delete(t);
        } else {
            newSelectedTypes.add(t);
        }
        setUnselectedTypes(newSelectedTypes);
    }, [unselectedTypes, setUnselectedTypes])
    return (
        <dl className="mb-2">
            {types.map((t) => {
                let colorClass = `type-${t}`;
                if (unselectedTypes.has(t)) {
                    colorClass += '-disabled'
                }
                return (
                    <>
                        <dt key={`color-${t}`} className={`w-4 h-4 inline-block align-middle mr-1 ${colorClass}`}></dt>
                        <dd key={`name-${t}`} className="inline-block align-middle mr-6 cursor-pointer" onClick={() => toggleType(t)}>{typeNames[t]}</dd>
                    </>
                );
            })}
        </dl>
    );
}
