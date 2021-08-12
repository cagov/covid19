function hasURLSearchParam(key) {
    const queryString = window.location.search;
    const params  = new URLSearchParams(queryString);
    return params.has(key);
}

function getURLSearchParam(key, defaultValue='') {
    const queryString = window.location.search;
    const params  = new URLSearchParams(queryString);
    if (params.has(key)) {
        return params.get(key);
    } else {
        return defaultValue;
    }
}

export {hasURLSearchParam, getURLSearchParam};