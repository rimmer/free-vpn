/**
 * Wrapper that holds pagination params like
 * page, per page count, etc.
 *
 * @typedef T
 * @typedef {object} Pagination<T>
 * @property {number} total - total number of items in collection
 * @property {number} pages - pages count
 * @property {string} next - url request to the next page
 * @property {string} prev - url request to the next page
 * @property {T[]} results - raw results data (limited to per_page)
 */
