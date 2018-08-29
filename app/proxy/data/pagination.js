/**
 * Wrapper that holds pagination params like
 * page, per page count, etc.
 * @template T
 * @typedef {Object} Pagination<T>
 * @property {integer} total - total number of items in collection
 * @property {integer} pages - pages count
 * @property {string} next - url request to the next page
 * @property {string} prev - url request to the next page
 * @property {T[]} results - raw results data (limited to per_page)
 */
