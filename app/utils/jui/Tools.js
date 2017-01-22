const DateTools = require('./DateTools.js');

class Tools {
	/**
     * checks wheather the element is an float (parses to float)
	 * @param n {*} - Element that should be checked
	 * @returns {boolean} - Element is numeric or not
	 */
	static isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

	/**
	 * checks wheather the element is a string
	 * @param s {*} - Element that should be checked
	 * @returns {boolean} - Element is a string or not
	 */
	static isString(s) {
		return typeof s === 'string' || s instanceof String;
	}

	/**
	 * Formats a string using php-date-syntax (http://php.net/manual/de/function.date.php)
	 * @param format {string} - The format string
	 * @param [date] - The date that should be formatted (optional)
	 * @returns {string||null} - Returns the string or null (when date-object is not valid or falsify)
	 */
	static getDateString( format, date ) {
		if(!date) date = new Date();

		if(date instanceof Date) {
			let dateTools = new DateTools(date);

			return dateTools.format(format);
		}

		return null;
	}
}

module.exports = Tools;