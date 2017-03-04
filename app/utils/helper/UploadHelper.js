const fs = require('fs');
const crypto = require("crypto");

let uploaded = {};
let uploadListeners = {};

class UploadHelper { // TODO: make UploadHelper scoped to user
    constructor(socketHelper) {
        this.socketHelper = socketHelper;
    }

	getUploadId() {
		return crypto.randomBytes(16).toString("hex");
	}

    setUploaded(id, path) {
        console.log('uploaded', path);

        if(uploadListeners[id] && uploadListeners[id].success && uploadListeners[id].error) {
            uploadListeners[id].success({
                path: path,
                id: id
            });
        }

        uploaded[id] = {
            path: path,
            id: id
        };
    }

    getUploaded(id) {
		console.log('getuploaded', id);
        return new Promise((resolve, reject) => {
            if(uploaded[id]) {
                resolve(uploaded[id]);
            } else {
                this.listenUpload(id, resolve, reject);
            }
        });
    }

    listenUpload(id, success, error) {
        uploadListeners[id] = {
            success: success,
            error: error
        };
    }

    remove(uploadId) {
        let id = this.socketHelper.getLoginHelper().getId();
    }

    removeAll() {
        let loginHelper = this.socketHelper.getLoginHelper();

        if(loginHelper && loginHelper.getId()) {
            UploadHelper.deleteFolderRecursive('temp/' + loginHelper.getId());
        }
    }

    static deleteFolderRecursive (path) {
        if(!path.startsWith('temp/')) return;

        if( fs.existsSync(path) ) {
            fs.readdirSync(path).forEach(function(file,index){
                var curPath = path + "/" + file;
                if(fs.lstatSync(curPath).isDirectory()) { // recurse
                    UploadHelper.deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });

            try {
                fs.rmdirSync(path);
            } catch(e) {
                if(e.code == 'ENOTEMPTY') UploadHelper.deleteFolderRecursive(path);
            }
        }
    };
}

module.exports = UploadHelper;