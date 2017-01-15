const shorthands = require('../const/shorthands');
const Tools = require('../../Tools');

/**
 * View that needs to be extended by custom elements to use them with JUI
 */
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
	 * Removes a property from the elemnt
	 * @param key {String} - Key of the property (TYPE is not allowed)
	 */
	removeProperty(key) {
		key = JuiView.getPropertyKey(String(key).toLowerCase());

		if(key === JuiView.getPropertyKey(JuiView.TYPE)) return

		this._element[key] = undefined;
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

	/**
	 * Sets the style of an element
	 * @param style {{}} - Needs a style object to be appended
	 */
	setStyle(style) {
		const keys = shorthands.keys;
		const styleKey = keys.style;

		if(!style) {
			this._element[styleKey] = null;
			return;
		}

		this._element[styleKey] = this._element[styleKey] || {};

		if(Tools.isNumeric(style.width) || String(style.width).endsWith('%')) {
			this._element[styleKey][keys.width] = style.width;
		}

		if(Tools.isNumeric(style.height) || String(style.height).endsWith('%')) {
			this._element[styleKey][keys.height] = style.height;
		}

		if(style.padding) {
			this._setSpaces(keys.padding, 'padding', style);
		}

		if(style.margin) {
			this._setSpaces(keys.margin, 'margin', style);
		}

		if(style.visibility === JuiView.VISIBILITY_AWAY || style.visibility === JuiView.VISIBILITY_INVISIBLE) {
			this._element[styleKey][keys.visibility] = style.visibility;
		} else if(style.visibility === null) {
			this._element[styleKey][keys.visibility] = undefined;
		}

		if(style.color) {
			this._element[styleKey][keys.color] = style.color;
		}

		if(style.background) {
			this._element[styleKey][keys.background] = style.background;
		}

	}

	/**
	 * Method which sets padding and margin on the current JuiView
	 * @param key {String|int} - Key that should be set
	 * @param type {String} - Type of the Space (e.g. padding, margin)
	 * @param style {{}} - Style object of the element
	 * @private
	 */
	_setSpaces(key, type, style) {
		if(type !== 'padding' && type !== 'margin') return;

		const all 		= shorthands.keys.all;
		const left 		= shorthands.keys.left;
		const right 	= shorthands.keys.right;
		const top 		= shorthands.keys.top;
		const bottom 	= shorthands.keys.bottom;

		const styleKey = shorthands.keys.style;

		this._element[styleKey][key] = this._element[styleKey][key] || {};

		if(Tools.isNumeric(style[type])) {
			this._element[styleKey][key][all] = parseFloat(style[type]);
		} else if(style[type]) {
			if (Tools.isNumeric(style[type][top])) {
				this._element[styleKey][key][top] = parseFloat(style[type].top);
			}

			if (Tools.isNumeric(style[type][left])) {
				this._element[styleKey][key][left] = parseFloat(style[type].left);
			}

			if (Tools.isNumeric(style[type][right])) {
				this._element[styleKey][key][right] = parseFloat(style[type].right);
			}

			if (Tools.isNumeric(style[type][bottom])) {
				this._element[styleKey][key][bottom] = parseFloat(style[type].bottom);
			}
		} else if(style[type] === null) {
			this._element[styleKey][key] = null;
		}
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
JuiView.HTML = 'html';
JuiView.MIN = 'min';
JuiView.MAX = 'max';

JuiView.VISIBILITY_AWAY = 'away';
JuiView.VISIBILITY_INVISIBLE = 'invisible';

module.exports = JuiView;