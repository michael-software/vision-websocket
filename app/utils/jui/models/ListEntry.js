module.exports = class ListEntry {
	/**
	 * Creates a new List.Entry
	 * @param value {String} - Sets the value of the entry
	 */
	constructor( value ) {
		this.value = value;
	}

	/**
	 * Sets an click-action to the element
	 * @param click {String} - A string created by JuiHelper.Action or a custom-action
	 */
	setClick(click) {
		if(click) {
			this.click = click;
		}
	}

	/**
	 * Sets an longclick-action to the element
	 * @param longClick {String} - A string created by JuiHelper.Action or a custom-action
	 */
	setLongClick(longClick) {
		if(longClick) {
			this.longClick = longClick;
		}
	}
};