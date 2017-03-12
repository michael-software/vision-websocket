const Tools = require('../../jui/Tools');

class JuiViewBuilder {
	constructor(connectionHelper, juiHelper, pluginHelper, userHelper, pluginId) {
		this.connectionHelper = connectionHelper;
		this.juiHelper = juiHelper;
		this.userHelper = userHelper;
		this.pluginHelper = pluginHelper;
		this.pluginId = pluginId;

		this.databaseHelpers = [];

		this.scripts = [];
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

	getFileHelper() {
		return this.connectionHelper.getFileHelper();
	}

	getUploadHelper() {
		return this.connectionHelper.getUploadHelper();
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
		if(params) {
			this.params = decodeURI(params).split('/');
		} else {
			this.params = [];
		}
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



			if(render instanceof Promise) {
				return render.then((render) => {

					let renderElements = !!render ? render : this.render();

					return this._getRenderPromise(renderElements).then((data) => {
						return data;
					}).catch((error) => {
						return error;
					});
				}).catch((error) => {
					console.log('render', error);
				});
			}

			if(render) return this._getRenderPromise(render);
		}

		return this._getRenderPromise( this.render() );
	}


	_getRenderPromise(data) {
		if (data instanceof Promise) return data;

		if (Array.isArray( data )) return Promise.resolve( data );

		return Promise.resolve(this.getJuiHelper().getArray());
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

	redirect(name, view, params) {
		this.scripts.push( this.getJuiHelper().Action.openPlugin(name, view, params) );
	}

	getScripts() {
		return this.scripts;
	}



	render() {
		return null;
	}
}

JuiViewBuilder.Tools = Tools;

module.exports = JuiViewBuilder;