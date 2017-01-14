let shorthands = require('../const/shorthands');

class JuiView {
	/**
	 * Constructs the new element
	 */
	constructor() {
		this._element = {};
	}


	/**
	 * Returns the short property
	 * @param {String} key - Specify the key that should be shortened
	 * @returns {*} - Returns the key or when available the shorthand
	 */
	static getPropertyKey(key) {
		if(shorthands.keys[key]) return shorthands.keys[key];

		return key;
	}


	/**
	 * Sets a property to the elemnt
	 * @param key {String} - Key of the property
	 * @param value {*} - Value of the property
	 */
	setProperty(key, value) {
		key = String(key).toLowerCase();
		if(shorthands.values[key] && shorthands.values[key][value]) value = shorthands.values[key][value];
		key = JuiView.getPropertyKey(key);

		this._element[key] = value;
	}

	/**
	 * Creates a new array when key is empty, Adds an entry when key is an array
	 * @param key {String} - Key of property
	 * @param value {*} - Value that should be added to key
	 * @returns {boolean} - Success or Failed
	 */
	appendProperty(key, value) {
		key = JuiView.getPropertyKey(key);
		let element = this._element[key];

		if(element === undefined || element === null) this._element[key] = [];
		else if(!Array.isArray(element)) return false;

		this._element[key].push(value);
	}

	/**
	 * Sets the value of the element (set property value)
	 * @param value {*} - Value of the element
	 */
	setValue(value) {
		if(value) {
			this.setProperty(JuiView.VALUE, value);
		}
	}

	/**
	 * Returns an element that represents the element in jui.
	 * Return null when element is not valid/does not exist
	 * @returns {{}|null}
	 */
	getArray() {
		if(this._element)
			return this._element;

		return null;
	}
}

JuiView.TYPE = 'type';
JuiView.VALUE = 'value';
JuiView.ALIGN = 'align';
JuiView.SIZE = 'size';
JuiView.SHADOW = 'shadow';
JuiView.APPEARANCE = 'appearance';
JuiView.NAME = 'name';
JuiView.PLACEHOLDER = 'placeholder';
JuiView.PRESET = 'preset';
JuiView.LABEL = 'label';
JuiView.CLICK = 'click';
JuiView.LONG_CLICK = 'longclick';
JuiView.MULTIPLE = 'multiple';

module.exports = JuiView;