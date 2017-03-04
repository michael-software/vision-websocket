const JuiViewBuilder = require('../../../app/utils/jui/custom/JuiViewBuilder');

module.exports = class Builder extends JuiViewBuilder {

    getFormData(formData) {
        return new Promise((resolve, reject) => {
            return resolve()
        });
    }

    render() {
        let juiHelper = this.getJuiHelper();
        let pluginHelper = this.getPluginHelper();
		let pluginList = pluginHelper.getPlugins();

        let pluginId = this.getParameter(0);
		if(!pluginList.has(pluginId)) return this.redirect(this.getPluginId());

		if(this.getParameter(1) === 'delete') {
			return pluginHelper.uninstall(pluginId).then(() => {
				return this.redirect(this);
			});
		}

		let pluginInfo = pluginList.get(pluginId);


		let headline = new juiHelper.Headline(pluginInfo.name || pluginInfo.id);
		juiHelper.add(headline);


		let deleteButton = new juiHelper.Button('Löschen');
		deleteButton.setStyle({
			color: '#FF0000'
		});
		deleteButton.setLongClick( juiHelper.Action.openPlugin(this, 'plugin', `${pluginInfo.id}/delete`) );
		juiHelper.add(deleteButton);


		let back = new juiHelper.Button('Zurück');
		back.setClick( juiHelper.Action.openPlugin(this) );
		juiHelper.add(back);

        console.log(pluginId);
    }
};