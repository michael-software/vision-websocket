const JuiViewBuilder = require('../../../app/utils/jui/custom/JuiViewBuilder');

module.exports = class Builder extends JuiViewBuilder {
	render() {
		let juiHelper = this.getJuiHelper();
		let userHelper = this.getUserHelper();
		let userList = userHelper.getUserList();

		let headline = new juiHelper.Headline(`Chats`);
		headline.setStyle({
			margin: {
				top: 0,
				bottom: 10
			}
		});


		let list = new juiHelper.List();
		for(let i = 0, z = userList.length; i < z; i++) {
			let user = userList[i];
			list.add(user.getUsername(), juiHelper.Action.openPlugin(this, 'chat', user.getId()));
		}

		juiHelper.add(headline);
		juiHelper.add(list);

		return juiHelper.getArray();
	}
};