const JuiViewBuilder = require('../../../app/utils/jui/custom/JuiViewBuilder');

module.exports = class Builder extends JuiViewBuilder {
	getFormData(data) {
		let userHelper = this.getUserHelper();
		let user = userHelper.getUser( this.getParameter(0) );

		let promiseArray = [];

		if(!user) return this.redirect(this);

		for(let key in data) {
			if(!data.hasOwnProperty(key)) continue;

			if(data[key]) {
				promiseArray.push( userHelper.changePermission(user, key, true) );
			} else {
				promiseArray.push( userHelper.changePermission(user, key, false) );
			}
		}

		return Promise.all(promiseArray).then(() => {
			return false;
		});
	}

	render() {
		let juiHelper = this.getJuiHelper();
		let userHelper = this.getUserHelper();
		this.user = userHelper.getUser( this.getParameter(0) );

		if(!this.user) return this.redirect(this);

		let headline = new juiHelper.Headline(this.user.getUsername());
		headline.setStyle({
			margin: {
				top: 0,
				bottom: 10
			}
		});

		juiHelper.add(headline);

		this.renderServerPermissions(userHelper);

		this.renderPluginPermissions();


		let submitButton = new juiHelper.Button('Speichern');
			submitButton.setClick( juiHelper.Action.submit() );
		juiHelper.add(submitButton);
	}

	renderCheckbox(root, permission, label) {
		let juiHelper = this.getJuiHelper();

		let checkbox = new juiHelper.Checkbox(permission);
		checkbox.setLabel(label);
		checkbox.setChecked( this.user.hasPermission(permission) );

		root.add(checkbox);
		root.nline();
	}

	renderPluginPermissions() {
		let juiHelper = this.getJuiHelper();
		let pluginHelper = this.getPluginHelper();
		let plugins = pluginHelper.getPlugins();


		let pluginContainer = new juiHelper.Container();
		pluginContainer.setStyle({
			padding: 10,
			margin: {
				top: 5,
				bottom: 5
			},
			background: '#AA999999'
		});

		let pluginHeadline = new juiHelper.Headline('Plugins');
		pluginHeadline.setSize(juiHelper.Headline.SIZE_SMALL);
		pluginHeadline.setStyle({
			margin: {
				bottom: 10
			}
		});
		pluginContainer.add(pluginHeadline);


		plugins.forEach((plugin) => {
			if(plugin.getId() === 'plg_home' || plugin.getId() === 'plg_user' || plugin.getId() === 'plg_license') return;

			this.renderCheckbox(pluginContainer, `use_${plugin.getId()}`, plugin.getName());
		});


		juiHelper.add(pluginContainer);
	}

	renderServerPermissions(userHelper) {

		let juiHelper = this.getJuiHelper();


		let permissionContainer = new juiHelper.Container();
		permissionContainer.setStyle({
			padding: 10,
			margin: {
				top: 5,
				bottom: 5
			},
			background: '#AA999999'
		});

		let permissionHeadline = new juiHelper.Headline('Server');
		permissionHeadline.setSize(juiHelper.Headline.SIZE_SMALL);
		permissionHeadline.setStyle({
			margin: {
				bottom: 10
			}
		});
		permissionContainer.add(permissionHeadline);

		this.renderCheckbox(permissionContainer, userHelper.START_SERVER, 'Server starten');
		this.renderCheckbox(permissionContainer, userHelper.STOP_SERVER, 'Server stoppen');
		this.renderCheckbox(permissionContainer, userHelper.MODIFY_USERS, 'Benutzer bearbeiten');
		this.renderCheckbox(permissionContainer, userHelper.LOG_ACCESS, 'Logs einsehen');
		this.renderCheckbox(permissionContainer, userHelper.SERVER_NOTIFICATIONS, 'Serverbenachrichtigungen erhalten');
		this.renderCheckbox(permissionContainer, userHelper.ACCESS_FILES, 'Private Dateien anlegen');

		juiHelper.add(permissionContainer);
	}
};