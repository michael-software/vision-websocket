const JuiViewBuilder = require('../../../app/utils/jui/custom/JuiViewBuilder');

module.exports = class Builder extends JuiViewBuilder {

	getFormData(formData) {
		if(!formData)
			return Promise.reject();

		if(formData.username && formData.password) {
			let userHelper = this.getUserHelper();

			return userHelper.createUser(formData.username, formData.password);
		} else if(formData['plugin'] && formData['plugin'][0]) {
			const uploadId = formData['plugin'][0];

			return this.getUploadHelper().getUploaded(uploadId).then((path) => {
				return this.pluginHelper.installFromFile(path.path);
			}).catch((error) => {
				console.log(error);
				return Promise.resolve();
			});
		}

		return Promise.reject();
	}

	render() {
		let juiHelper = this.getJuiHelper();

		let headline = new juiHelper.Headline(`Server`);
		headline.setStyle({
			margin: {
				top: 0,
				bottom: 10
			}
		});

		juiHelper.add(headline);


		let configContainer = new juiHelper.Container();
		configContainer.setStyle({
			padding: 5,
			background: '#66000000'
		});

			let shutdownButton = new juiHelper.Button('Server herunterfahren');
			configContainer.add(shutdownButton);

			let restartButton = new juiHelper.Button('Server neustarten');
			configContainer.add(restartButton);

			configContainer.nline();

			let abortShutdownButton = new juiHelper.Button('Herunterfahren abbrechen');
			configContainer.add(abortShutdownButton);

		juiHelper.add(configContainer);

		juiHelper.nline(2);

		this.renderExtensions();

		juiHelper.nline(2);

		this.renderUser();
	}


	renderExtensions() {
		let juiHelper = this.getJuiHelper();
		let pluginHelper = this.getPluginHelper();
		let plugins = pluginHelper.getPlugins();

		let pluginHeadline = new juiHelper.Headline(`Plugins`);
		pluginHeadline.setSize(juiHelper.Headline.SIZE_SMALL);
		juiHelper.add(pluginHeadline);



		let pluginListElement = new juiHelper.List();

		plugins.forEach((plugin) => {
			pluginListElement.add(plugin.getName() || plugin.getId(), juiHelper.Action.openPlugin(this, 'plugin', plugin.getId()));
		});

		juiHelper.add( pluginListElement );



		let createPluginContainer = new juiHelper.Container();
		juiHelper.add(createPluginContainer);

		let pluginUpload = new juiHelper.File('plugin');
		createPluginContainer.add(pluginUpload);


		let pluginSubmit = new juiHelper.Button('Plugin hochladen');
		pluginSubmit.setClick( juiHelper.Action.submit() );
		createPluginContainer.add( pluginSubmit );


	}


	renderUser() {
		let juiHelper = this.getJuiHelper();
		let userHelper = this.getUserHelper();
		let userList = userHelper.getUserList();



		let userHeadline = new juiHelper.Headline(`Benutzer`);
		userHeadline.setSize(juiHelper.Headline.SIZE_SMALL);
		juiHelper.add(userHeadline);

		let userListElement = new juiHelper.List();

		userList.forEach((user) => {
			userListElement.add(user.getUsername(), juiHelper.Action.openPlugin(this, 'user', user.getId()));
		});

		juiHelper.add(userListElement);

		if(userHelper.getCurrentUser().hasPermission(userHelper.MODIFY_USERS))
			juiHelper.add( this.renderUserCreation() );
	}

	renderUserCreation() {
		let juiHelper = this.getJuiHelper();

		let newUserContainer = new juiHelper.Container();
		newUserContainer.setStyle({
			padding: 10,
			background: '#55000000'
		});

		let newUsername = new juiHelper.Input('username');
		newUsername.setLabel('Benutzername: ');
		newUserContainer.add(newUsername);

		newUserContainer.nline();

		let newPassword = new juiHelper.Input('password');
		newPassword.setLabel('Kennwort: ');
		newPassword.setPreset( juiHelper.Input.PASSWORD );
		newUserContainer.add(newPassword);

		newUserContainer.nline();

		let submitButton = new juiHelper.Button('Benutzer erstellen');
		submitButton.setClick( juiHelper.Action.submit() );
		newUserContainer.add( submitButton );

		return newUserContainer;
	}
};