import { dayOfWeekOfJan1 } from './time';

test('weekdays', () => {
    expect(dayOfWeekOfJan1(2020)).toBe(2); // Wednesday
    expect(dayOfWeekOfJan1(2021)).toBe(4); // Friday
    expect(dayOfWeekOfJan1(2022)).toBe(5); // Saturday
    expect(dayOfWeekOfJan1(2023)).toBe(6); // Sunday
    expect(dayOfWeekOfJan1(2024)).toBe(0); // Monday
    expect(dayOfWeekOfJan1(2025)).toBe(2); // Wednesday
    expect(dayOfWeekOfJan1(2026)).toBe(3); // Thursday
    expect(dayOfWeekOfJan1(2027)).toBe(4); // Friday
    expect(dayOfWeekOfJan1(2028)).toBe(5); // Saturday
    expect(dayOfWeekOfJan1(2029)).toBe(0); // Monday
    expect(dayOfWeekOfJan1(2030)).toBe(1); // Tuesday
});
