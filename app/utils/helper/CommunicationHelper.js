class CommunicationHelper {
	constructor(socket, serverConfig) {
		this.serverConfig = serverConfig;
		this.socket = socket;
	}

	send(user, type, object) {
		let sockets = user.getSockets();

		for(let i = 0, z = sockets.length; i < z; i++) {
			this.socket.to(sockets[i]).emit(type, object);
		}
	}
}

module.exports = CommunicationHelper;