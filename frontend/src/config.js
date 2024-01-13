export const MITAFFALD_URL_VIEW_ADDRESS = 'https://mitaffald.affaldvarme.dk/Adresse/VisAdresseInfo';

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
export const WEEKDAY_NAMES = ['M', 'T', 'O', 'T', 'F', 'L', 'S'];
export const URL_PARAM_YEAR = 'year';

// Default config values.
const DAWA_URL_QUERY_ADDRESS_DATAFORSYNINGEN = 'https://api.dataforsyningen.dk/adresser';
const DAWA_KOMMUNEKODE_AARHUS = '0751';

export const BACKEND_URL_BASE = process.env.REACT_APP_BACKEND_URL_BASE || `${window.location.origin}/api`; // default to path '/api' relative to the current URL root
export const DAWA_URL_QUERY_ADDRESS =
    process.env.REACT_APP_DAWA_URL_QUERY_ADDRESS || DAWA_URL_QUERY_ADDRESS_DATAFORSYNINGEN;
export const DAWA_KOMMUNEKODE = process.env.REACT_APP_DAWA_URL_QUERY_ADDRESS || DAWA_KOMMUNEKODE_AARHUS;
