const Tools = require('../../jui/Tools');

class JuiViewBuilder {
	constructor(juiHelper, pluginHelper, userHelper, pluginId) {
		this.juiHelper = juiHelper;
		this.userHelper = userHelper;
		this.pluginHelper = pluginHelper;
		this.pluginId = pluginId;

		this.databaseHelpers = [];
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

	getDatabaseHelper() {
		let databaseHelper = this.pluginHelper.getDatabaseHelper();
		databaseHelper.setPlugin(this.pluginId);

		this.databaseHelpers.push(databaseHelper);

		return databaseHelper;
	}

	getNotificationHelper() {
		if(this.notificationHelper) return this.notificationHelper;

		this.notificationHelper = this.pluginHelper.socketHelper.getNotificationHelper();

		return this.notificationHelper;
	}



	setPluginId(pluginId) {
		this.pluginId = pluginId;
	}

	getPluginId() {
		return this.pluginId;
	}



	setParameters(params) {
		this.params = decodeURI(params).split('/');
	}

	getParameter(index) {
		if(this.params[index])
			return this.params[index];

		return null;
	}

	getParameters() {
		return this.params;
	}



	startRender() {
		if(this.formData && this.getFormData) {
			let render = this.getFormData(this.formData);

			if(render) return this._getRenderPromise(render);
		}

		return this._getRenderPromise( this.render() );
	}


	_getRenderPromise(data) {
		if (data instanceof Promise) return data;

		return Promise.resolve(data);
	}



	setFormData(data) {
		this.formData = data;
	}

	getFormData() {
		return this.formData;
	}

	hasFormData() {
		if(this.formData) return true;

		return false;
	}



	render() {
		return null;
	}
}

JuiViewBuilder.Tools = Tools;

module.exports = JuiViewBuilder;