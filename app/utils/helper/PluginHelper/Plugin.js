module.exports = class Plugin {
	constructor(data) {
		this._data = data;
	}

	getId() {
		if(this._data.id)
			return this._data.id;

		return null;
	}

	getName() {
		if(this._data.name)
			return this._data.name;

		return null;
	}

	getIcon() {
		if(this._data.icon)
			return this._data.icon;

		return null;
	}
};