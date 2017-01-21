module.exports = class JuiViewBuilder {
	constructor(juiHelper, pluginHelper, userHelper) {
		this.juiHelper = juiHelper;
		this.userHelper = userHelper;
		this.pluginHelper = pluginHelper;
	}

	getJuiHelper() {
		return this.juiHelper;
	}

	getUserHelper() {
		return this.userHelper;
	}

	getPluginHelper() {
		return this.pluginHelper;
	}

	render() {
		return null;
	}
};