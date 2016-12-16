var fetch = require('node-fetch');


class LoginHelper {
    login(server, authtoken) {
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

            if(this.$login) {
                this.$login(data);
            }

            this.parseLoginInfo(data);

            console.log('data', data);
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
        if(data.status == 'login') {
            this.username = data.username;
        }
    }
}

module.exports = LoginHelper;