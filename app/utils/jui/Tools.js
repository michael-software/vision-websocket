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
}

module.exports = Tools;