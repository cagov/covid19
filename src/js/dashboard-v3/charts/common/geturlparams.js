export default function getURLSearchParam(key, defaultValue='') {
    const queryString = window.location.search;
    const params  = new URLSearchParams(queryString);
    if (params.has(key)) {
        return params.get(key);
    } else {
        return defaultValue;
    }
}