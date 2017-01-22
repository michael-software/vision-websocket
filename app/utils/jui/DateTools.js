class DateTools extends Date {

	getRealMonth() {
		return this.getMonth()+1;
	}


	_addLeadingZero(number) {
		if(number < 10) return `0${number}`;

		return number;
	}


	getHoursWithLeadingZero() {
		let hours = this.getHours();

		return this._addLeadingZero(hours);
	}

	getMinutesWithLeadingZero() {
		let minutes = this.getMinutes();

		return this._addLeadingZero(minutes);
	}

	getSecondsWithLeadingZero() {
		let seconds = this.getSeconds();

		return this._addLeadingZero(seconds);
	}


	getDateWithLeadingZero() {
		let date = this.getDate();

		return this._addLeadingZero(date);
	}

	getMonthWithLeadingZero() {
		let month = this.getRealMonth();

		return this._addLeadingZero(month);
	}


	/**
	 * Formats a date to a string
	 * @param formatString {string} - The sting that should be used to format the date. String should be based on PHP-date (http://php.net/manual/de/function.date.php)
	 * @returns {string} - The formatted string
	 */
	format(formatString) {
		let dateString = this._replaceHours(formatString);
		dateString = this._replaceMinutes(dateString);
		dateString = this._replaceSeconds(dateString);

		dateString = this._replaceYears(dateString);
		dateString = this._replaceMonths(dateString);
		dateString = this._replaceDates(dateString);

		return dateString;
	}


	_replacePlaceholder( string, placeholder, callback ) {
		if(string.indexOf(placeholder) !== -1)
			string = string.replace(new RegExp(placeholder, 'g'), callback.bind(this)());

		return string;
	}


	_replaceHours( formatString ) {
		formatString = this._replacePlaceholder(formatString, 'H', this.getHoursWithLeadingZero);

		return this._replacePlaceholder(formatString, 'G', this.getHours);
	}

	_replaceMinutes( formatString ) {
		return this._replacePlaceholder(formatString, 'i', this.getMinutesWithLeadingZero);
	}

	_replaceSeconds( formatString ) {
		return this._replacePlaceholder(formatString, 's', this.getSecondsWithLeadingZero);
	}



	_replaceDates( formatString ) {
		formatString = this._replacePlaceholder(formatString, 'd', this.getDateWithLeadingZero);

		return this._replacePlaceholder(formatString, 'j', this.getDate);
	}

	_replaceMonths( formatString ) {
		formatString = this._replacePlaceholder(formatString, 'm', this.getMonthWithLeadingZero);

		return this._replacePlaceholder(formatString, 'n', this.getRealMonth);
	}

	_replaceYears( formatString ) {
		formatString = this._replacePlaceholder(formatString, 'Y', this.getFullYear);

		return this._replacePlaceholder(formatString, 'y', this.getYear);
	}
}

module.exports = DateTools;