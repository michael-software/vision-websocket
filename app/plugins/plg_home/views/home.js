const JuiViewBuilder = require('../../../utils/jui/custom/JuiViewBuilder');

module.exports = class Builder extends JuiViewBuilder {
	render() {
		let juiHelper = this.getJuiHelper();
		let userHelper = this.getUserHelper();
		let currentUser = userHelper.getCurrentUser();

		let pluginHelper = this.getPluginHelper();
		console.log('home');

		let headline = new juiHelper.Headline(`Hallo ${currentUser.getUsername()}`);
		headline.setStyle({
			margin: {
				top: 0,
				bottom: 10
			}
		});


		let container = new juiHelper.Container();
		container.setStyle({
			padding: 15,
			margin: 5,
			background: '#AA999999'
		});
		container.add(headline);
		container.add(`Sie sind verbunden mit: ${currentUser.getServer()}`);


		let buttonList = new juiHelper.ButtonList();
		let plugins = pluginHelper.getPlugins().values();
		for(let plugin of plugins){
			buttonList.add(plugin.getName(), plugin.getIcon(), juiHelper.Action.openPlugin(plugin.getId()));
		}


		juiHelper.add(container);
		juiHelper.add(buttonList);

		return juiHelper.getArray();
	}
};