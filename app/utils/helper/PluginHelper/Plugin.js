module.exports = class Plugin {
	constructor(data) {
		this.id = data.id;
		this.name = data.name;
		this.icon = data.icon;
	}

	getId() {
		if(this.id)
			return this.id;

		return null;
	}

	getName() {
		if(this.name)
			return this.name;

		return null;
	}

	getIcon() {
		if(this.icon)
			return this.icon;

		return null;
	}
};