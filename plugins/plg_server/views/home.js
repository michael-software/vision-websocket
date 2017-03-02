const JuiViewBuilder = require('../../../app/utils/jui/custom/JuiViewBuilder');

module.exports = class Builder extends JuiViewBuilder {

	getFormData(formData) {
		let userHelper = this.getUserHelper();

		if(!formData || !formData.username || !formData.password)
			return Promise.resolve();

		return userHelper.createUser(formData.username, formData.password);
	}

	render() {
		let juiHelper = this.getJuiHelper();
		let userHelper = this.getUserHelper();
		let userList = userHelper.getUserList();


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