module.exports = class ListEntry {
	constructor( value ) {
		this.value = value;
	}

	setClick(click) {
		if(click) {
			this.click = click;
		}
	}

	setLongClick(longClick) {
		if(longClick) {
			this.longClick = longClick;
		}
	}
};