var fetch = require('node-fetch');
var FormData = require('form-data');


class LoginHelper {
    loginToken(server, authtoken) {
        return fetch(`${server}/api/login.php`, {
            headers: {
                Authorization: `bearer ${authtoken}`
            }
        }).then(function(data) {
            if(data.status == 401) {
                throw new Error('Bad message');
            } else {
                return data.json();
            }
        }).then((data) => {
            this.isLoggedIn = true;

            data.server = server;
            data.token = authtoken;


            this.parseLoginInfo(data);

            if(this.$login) {
                this.$login(data);
            }
        }).catch((error) => {

            if(this.$unauthorized) {
                this.$unauthorized(error);
            }

            console.warn(error);
        });
    }

    loginCredentials(server, username, password) {
        let formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        return fetch(`${server}/api/login.php?action=login`, {
            method: 'POST',
            body: formData
        }).then(function(data) {
            if(data.status == 401) {
                throw new Error('Bad message');
            } else {
                return data.json();
            }
        }).then((data) => {
            this.isLoggedIn = true;

            data.server = server;


            this.parseLoginInfo(data);

            if(this.$login) {
                this.$login(data);
            }
        }).catch((error) => {

            if(this.$unauthorized) {
                this.$unauthorized(error);
            }

            console.warn(error);
        });
    }

    on(type, callback) {
        switch (type) {
            case 'login':
                this.$login = callback;
                break;
            case 'unauthorized':
                this.$unauthorized = callback;
                break;
            default: break;
        }
    }

    parseLoginInfo(data) {
        console.log('parsedata');
        if(data.username && data.token && data.server) {
            this.username = data.username;
            this.token = data.token;
            this.server = data.server;
        }
    }

    getServer() {
        return this.server;
    }

    getUsername() {
        return this.username;
    }

    getToken() {
        return this.token;
    }
}

module.exports = LoginHelper;