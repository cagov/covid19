/* Substitute strings in text using either {{VAR}} or {var}, case-sensitive
*/

export default function applySubstitutions(textString, substitutions) {
    for (const key in substitutions) {
        const value = substitutions[key];
        textString = textString.replace('{{' + key + '}}', value);
        textString = textString.replace('{' + key + '}', value);
        textString = textString.replace('(' + key + ')', value);
    }
    return textString;
}
