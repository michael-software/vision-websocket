let shorthands = require('../const/shorthands');

class JuiView {

	constructor() {
		this._element = {};
	}


	static getPropertyKey(key) {
		if(shorthands.keys[key]) return shorthands.keys[key];

		return key;
	}


	setProperty(key, value) {
		key = String(key).toLowerCase();
		if(shorthands.values[key] && shorthands.values[key][value]) value = shorthands.values[key][value];
		key = JuiView.getPropertyKey(key);

		this._element[key] = value;
	}

	setValue(value) {
		if(value) {
			this.setProperty(JuiView.VALUE, value);
		}
	}

	getArray() {
		return this._element;
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