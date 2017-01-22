const CommunicationHelper = require('../CommunicationHelper');
const Notification = require('./Notfication');

class NotificationHelper extends CommunicationHelper {
	constructor(socket, serverConfig, userHelper) {
		super(socket, serverConfig);

		this.serverConfig = serverConfig;
		this.userHelper = userHelper;
		this.Notification = Notification;
	}

	send(userId, notification) {
		let user = this.userHelper.getUser(userId);

		if(user && notification instanceof Notification) {
			super.send(user, 'notification', notification)
		}
	}
}

NotificationHelper.Notification = Notification;

module.exports = NotificationHelper;