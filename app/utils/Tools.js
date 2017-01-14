class Tools {
	/**
     * checks whether the element is an float (parses to float)
	 * @param n {*} - Element that should be checked
	 * @returns {boolean} - Element is numeric or not
	 */
	static isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
}

module.exports = Tools;