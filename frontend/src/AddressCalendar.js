import { Calendar } from './Calendar';
import { useFetchCalendarData } from './useFetchCalendarData';

export function AddressCalendar({ addressId, year, isLeapYear, firstWeekdayIdx }) {
    const [data, error] = useFetchCalendarData(addressId, year, isLeapYear, firstWeekdayIdx);
    return (
        <>
            {data && <Calendar data={data} />}
            {error && <div>Fetch error: {error}</div>}
        </>
    );
}
