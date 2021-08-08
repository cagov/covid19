export default function getURLSearchParam(key, defaultValue='') {
    const queryString = window.location.search;
    const params  = new URLSearchParams(queryString);
    if (params.has(key)) {
        console.log("Found param in",params);
        return params.get(key);
    } else {
        console.log("Did not find param in",params);
        return defaultValue;
    }
}