/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  return [...arr].sort((a, b) => {
    if (param === 'desc') {
      [a, b] = [b, a];
    }

    return a.localeCompare(b, ['ru', 'en'], {sensitivity: 'case', caseFirst: 'upper'});
  });
}
