const JuiView = require('../../abstract/JuiView');
const TableRow = require('./TableRow.js');

class Table extends JuiView {
	/**
	 * Creates a new Table-element
	 */
	constructor() {
		super();

		this.setProperty(JuiView.TYPE, 'table');
	}

	add(row) {
		if(row instanceof TableRow) {
			this.appendProperty(JuiView.VALUE, row.columns);
		}
	}
}

Table.Row = TableRow;

module.exports = Table;