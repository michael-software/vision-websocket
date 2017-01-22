class CommunicationHelper {
	constructor(socket, serverConfig) {
		this.serverConfig = serverConfig;
		this.socket = socket;
	}

	send(user, object) {
		let sockets = user.getSockets();

		for(let i = 0, z = sockets.length; i < z; i++) {
			this.socket.to(sockets[i]).emit(object);
		}
	}
}

module.exports = CommunicationHelper;