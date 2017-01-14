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

	/**
	 * Adds a new row to the table
	 * @param row {Table.Row} - Row that should be added
	 */
	add(row) {
		if(row instanceof TableRow) {
			this.appendProperty(JuiView.VALUE, row.columns);
		}
	}
}

Table.Row = TableRow;

module.exports = Table;