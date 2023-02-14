import './calendar-day.scss';

const WEEKDAYS = ['M', 'T', 'O', 'T', 'F', 'L', 'S'];

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

const FALLBACK_TYPE_NAME = 'Ukendt';

const MAX_TYPES = 5;

const CSS_CLASS_CONTAINER = 'day';
const CSS_CLASS_TEXT = 'text';
const CSS_CLASS_TYPE_MANY = 'type-many';
const CSS_CLASS_TYPE_UNKNOWN = 'type-unknown';
const CSS_CLASS_INVALID = 'invalid';

export function CalendarDay({ matchedTypes, dayNum, weekdayIdx, isValid }) {
    const names = matchedTypes.map((t) => TYPE_NAMES[t] || FALLBACK_TYPE_NAME);

    const classNames = (() => {
        if (!matchedTypes.length) {
            return [null]; // render single <td> with no class name
        }
        if (matchedTypes.length > MAX_TYPES) {
            return [CSS_CLASS_TYPE_MANY];
        }
        return matchedTypes.map((t) => (TYPE_NAMES[t] ? `type-${t}` : CSS_CLASS_TYPE_UNKNOWN));
    })();

    const containerClasses = [CSS_CLASS_CONTAINER];
    if (!isValid) {
        containerClasses.push(CSS_CLASS_INVALID);
    }
    return (
        <div className={containerClasses.join('\n')} title={names.join('\n')}>
            <div className={CSS_CLASS_TEXT}>
                {WEEKDAYS[weekdayIdx]} {dayNum}
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

