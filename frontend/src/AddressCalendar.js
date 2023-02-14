import { Calendar } from './Calendar';
import { useFetchCalendarData } from './useFetchCalendarData';

export function AddressCalendar({ addressId, year, isLeapYear, firstWeekdayIdx }) {
    const { data, fetchError } = useFetchCalendarData(addressId, year, isLeapYear, firstWeekdayIdx);
    return (
        <>
            {data && <Calendar data={data} />}
            {fetchError && <div>Fetch error: {fetchError}</div>}
        </>
    );
}
