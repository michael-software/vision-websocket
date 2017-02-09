const JuiViewBuilder = require('../../../app/utils/jui/custom/JuiViewBuilder');

module.exports = class Builder extends JuiViewBuilder {
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
	}
};