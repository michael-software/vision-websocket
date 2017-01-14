const JuiView = require('../../abstract/JuiView');

class TableRow {
	constructor() {
		this.columns = [];
	}

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

	_getValue(column) {
		if(column instanceof JuiView) {
			return column.getArray();
		} else {
			return String(column);
		}
	}
}


module.exports = TableRow;