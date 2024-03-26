/**
 * @typedef {Object} Rule
 * @property {undefined | 'email'} type
 * @property {boolean} required 是否為必填
 * @property {number} min 驗證 array, string 長度及數字大小(依照傳遞的 value 類型判斷)
 * @property {number} max 同 min
 * @property {undefined | string} message 驗證錯誤訊系
 * @property {undefined | function(*, Object<string, *>): boolean} validator
 */
