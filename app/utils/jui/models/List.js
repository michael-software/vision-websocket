let JuiView = require('../abstract/JuiView');
let ListEntry = require('./ListEntry');

class List extends JuiView {
	constructor() {
		super();

		this.setProperty(JuiView.TYPE, 'list');
	}

	add(value, click, longclick) {
		if(value instanceof ListEntry) {
			let entryValue = value.value;
			let entryClick = value.click;
			let entryLongClick = value.longClick;

			if(entryValue) value = entryValue;

			if(entryClick) click = entryClick;

			if(entryLongClick) longclick = entryLongClick;
		}


		if(value) {
			this.appendProperty(JuiView.VALUE, value);

			this.appendProperty(JuiView.CLICK, null || click);

			this.appendProperty(JuiView.LONG_CLICK, null || longclick)
		}
	}
}

List.Entry = ListEntry;

module.exports = List;