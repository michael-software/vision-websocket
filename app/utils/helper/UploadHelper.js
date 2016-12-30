const fs = require('fs');

class UploadHelper {
    constructor(socketHelper) {
        this.uploaded = {};
        this.uploadListeners = {};
        this.socketHelper = socketHelper;
    }

    setUploaded(id, path) {
        if(this.uploadListeners[id] && this.uploadListeners[id].success && this.uploadListeners[id].error) {
            this.uploadListeners[id].success({
                path: path,
                id: id
            });
        }

        this.uploaded[id] = {
            path: path,
            id: id
        };
    }

    getUploaded(id) {
        return new Promise((resolve, reject) => {
            if(this.uploaded[id]) {
                resolve(this.uploaded[id]);
            } else {
                this.listenUpload(id, resolve, reject);
            }
        });
    }

    listenUpload(id, success, error) {
        this.uploadListeners[id] = {
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