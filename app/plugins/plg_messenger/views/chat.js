const JuiViewBuilder = require('../../../utils/jui/custom/JuiViewBuilder');
const NotificationHelper = require('../../../utils/helper/NotificationHelper/NotificationHelper');

const MESSAGE_CONTAINER_PADDING = 10;
const MESSAGE_CONTAINER_MARGIN = 10;
const MESSAGE_MARGIN = 10;

module.exports = class Builder extends JuiViewBuilder {
	getFormData(formData) {
		let user = this.getUser();

		if(user && formData && formData.message)
			return this.sendMessage(user, formData.message);
	}

	sendMessage(user, message) {

		let currentUser = this.getUserHelper().getCurrentUser();

		let query = `INSERT INTO ##pluginDB##_messages
						(message, sender, recipient)
						VALUES
						(?, ?, ?)`;

		return this.getDatabaseHelper().query({
			sql: query,
			values: [message, currentUser.getId(), user.getId()]
		}).then(() => {
			let notificationHelper = this.getNotificationHelper();

			let notification = new notificationHelper.Notification("Neue Nachricht", "Sie haben eine neue Nachricht");
			notification.setClick( this.getJuiHelper().Action.openPlugin(this, 'chat', currentUser.getId()) );
			notificationHelper.send(user.getId(), notification);


			return this.render();
		});
	}

	render() {
		let user = this.getUser();

		if(user)
			return this.renderUserView(user);

		return null;
	}

	getUser() {
		if(this.getParameter(0) && JuiViewBuilder.Tools.isNumeric( this.getParameter(0) )) {
			let userId = parseInt( this.getParameter(0) );

			if(userId <= 0) return null;


			let userHelper = this.getUserHelper();
			let user = userHelper.getUser(userId);

			if(!user) return null;

			return user;
		} else {
			return null;
		}
	}

	renderUserView(user) {
		let juiHelper = this.getJuiHelper();
		let currentUser = this.getUserHelper().getCurrentUser();

		let query = `SELECT * FROM ##pluginDB##_messages
						WHERE
							(sender = ? AND recipient = ?)
							OR
							(recipient = ? AND sender = ?)
						ORDER BY timestamp`;

		return this.getDatabaseHelper().query({
			sql: query,
			values: [currentUser.getId(), user.getId(), currentUser.getId(), user.getId()]
		}).then((data) => {

			let headline = new juiHelper.Headline(`Chat mit ${user.getDisplayName()}`);
			headline.setStyle({
				margin: {
					top: 0,
					bottom: 10
				}
			});
			juiHelper.add(headline);


			if(data.rows && data.rows.length > 0)
			for(let i = 0, z = data.rows.length; i < z; i++) {
				juiHelper.add( this.renderChatMessage(currentUser, user, data.rows[i]) );
			}


			let messageInput = new juiHelper.Input('message');
			messageInput.setPlaceholder('Nachricht schreiben');
			messageInput.setStyle({
				width: '100%'
			});

			let messageButton = new juiHelper.Button('Senden');
			messageButton.setClick( juiHelper.Action.submit() );
			messageButton.setStyle({
				width: '100%'
			});

			let messageTable = new juiHelper.Table();
			let messageRow = new juiHelper.Table.Row();
			messageRow.add(messageInput);
			messageRow.add(messageButton);
			messageTable.setStyle({
				width: '100%'
			});
			messageTable.add(messageRow);

			juiHelper.add(messageTable);

			return juiHelper.getArray();
		});
	}

	renderChatMessage(currentUser, user, data) {
		let juiHelper = this.getJuiHelper();


		let messageContainer = new juiHelper.Container();
		messageContainer.setStyle({
			background: '#88A8A8A8',
			margin: {
				top: MESSAGE_CONTAINER_MARGIN,
				bottom: MESSAGE_CONTAINER_MARGIN
			},
			padding: MESSAGE_CONTAINER_PADDING
		});

		let message = new juiHelper.Text(data.message);
		message.setStyle({
			margin: {
				bottom: MESSAGE_MARGIN
			}
		});

		let time = new juiHelper.Text( JuiViewBuilder.Tools.getDateString( 'j.m.Y - H:i', new Date(data.timestamp) ) );
		time.setStyle({
			color: '#666666'
		});
		time.setAlign('right');


		if(data.sender == user.getId()) {
			let username = new juiHelper.Text(user.getDisplayName());
			username.setStyle({
				color: '#FF0000'
			});
			username.setAlign('right');
			username.setAppearance(juiHelper.Text.APPEARANCE_BOLD);
			messageContainer.add(username);

			message.setAlign('right');
			message.setStyle({
				margin: {
					top: MESSAGE_MARGIN
				}
			});
		} else {
			time.setAlign('left');
		}


		messageContainer.add( message );
		messageContainer.add(time);


		return messageContainer;
	}
};