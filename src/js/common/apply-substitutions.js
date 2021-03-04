/* Substitute strings in text using either {{VAR}} or {var}, case-sensitive
*/

export default function applySubstitutions(textString, subdict) {
    for (const key in subdict) {
        const value = subdict[key];
        textString = textString.replace('{{' + key + '}}', value);
        textString = textString.replace('{' + key + '}', value);
    }
    return textString;
}
