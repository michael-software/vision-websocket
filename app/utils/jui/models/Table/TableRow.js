const JuiView = require('../../abstract/JuiView');

class TableRow {
	/**
	 * Creates a new TableRow
	 */
	constructor() {
		this.columns = [];
	}

	/**
	 * Adds the content of a column to the Row
	 * @param column {String || Array || JuiView} - Content of the column (String, JuiView, Array of JuiViews)
	 */
	add(column) {
		 if(Array.isArray(column)) {
		 	let array = [];

			column.map((element) => {
				array.push( this._getValue(element) );
			});

			this.columns.push(array);
		 } else if(column instanceof JuiView) {
			 this.columns.push([this._getValue(column)]);
		 } else {
			 this.columns.push(this._getValue(column));
		 }
	}

	/**
	 * Converts some data to String or Array
	 * @param column {*} - Data that should be converted
	 * @returns {*}
	 * @private
	 */
	_getValue(column) {
		if(column instanceof JuiView) {
			return column.getArray();
		} else {
			return String(column);
		}
	}
}


module.exports = TableRow;