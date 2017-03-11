const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const JuiHelper = require('../../CustomJuiHelper');
const Plugin = require('../PluginHelper/Plugin');
const PermissionHelper = require('../PermissionHelper/PermissionHelper');
const FileHelper = require('../FileHelper/FileHelper');
const JuiViewBuilder = require('../../jui/custom/JuiViewBuilder');
const AdmZip = require('adm-zip');

const Tools = require('../../jui/Tools');

const PLUGIN_DIR = path.join( FileHelper.getParent(__dirname, 4),  'plugins');


class PluginHelper {
	constructor(socketHelper, plugins) {
		this.socketHelper = socketHelper;
		this.uploadHelper = socketHelper.getUploadHelper();
		this.plugins = plugins;
	}

	setLoginHelper(loginHelper) {
	}

	getPluginList(data) {
		let pluginArray = [];
		for(let plugin of this.plugins.values()) {
			pluginArray.push(plugin);
		}

		return Promise.resolve(pluginArray);
	}

	getPlugin(name, view, params, formData) {
		//console.log('this', data);

		return new Promise((resolve, reject) => {

			if(this.isInstalled(name) && this.isPluginAllowed(name)) {

				try {
					let juiHelper = new JuiHelper();

					let imported = require(path.join(PLUGIN_DIR, name, 'views', (view || 'home')) + '.js');

					if(imported.prototype instanceof JuiViewBuilder) {
						let builder = new imported(this.socketHelper, juiHelper, this, this.socketHelper.getUserHelper());
						builder.setPluginId(name);
						builder.setParameters(params);
						builder.setFormData(formData);

						let render = builder.startRender();

						let plugin = this.plugins.get(name);

						render.then((data) => {
							resolve({
								data: data,
								head: {
									scripts: builder.getScripts(),
									title: plugin.getName()
								}
							});
						}).catch((error) => {
							resolve(error);
						});

					} else if(imported.call) {
						resolve({data: imported(juiHelper)});
					}
				} catch(error) {
					return reject(error);
				}

			} else {
				let juiHelper = new JuiHelper();

				if(!this.isInstalled(name)) {
					juiHelper.add(new JuiHelper.Headline("No plugin with this name found"));
				} else {
					juiHelper.add(new JuiHelper.Headline("No permission"));
				}

				return resolve({
					data: juiHelper.getArray()
				});
			}
		});
	}

	isPluginAllowed(pluginId) {

		if(pluginId === 'plg_home' || pluginId === 'plg_user' || pluginId === 'plg_license') {
			return true;
		}

		let userHelper = this.socketHelper.getUserHelper();
		let currentUser = userHelper.getCurrentUser();

		return currentUser.hasPermission(`use_${pluginId}`);
	}

	/**
	 * Return a Map of plugins
	 * @returns {Map}
	 */
	getPlugins() {
		return this.plugins;
	}

	getDatabaseHelper() {
		return this.socketHelper.getDatabaseHelper();
	}

	install(pluginId) {
		try {
			let imported = require( path.join(PLUGIN_DIR, pluginId, 'install.js') );

			if(imported.call) {
				let dbHelper = this.socketHelper.getDatabaseHelper();
				dbHelper.setPlugin(pluginId);

				imported(dbHelper);
			}
		} catch(error) {
			console.log(error);
		}
	}

	installFromFile(zipPath) {
		let zip = null;
		let manifestObject = null;

		return new Promise((resolve, reject) => {
			return resolve(new AdmZip(zipPath));
		}).then((admZip) => {
			zip = admZip;

			const entries = zip.getEntries();
			let manifest = null;

			entries.forEach(function(zipEntry) {
				if(manifest) return;

				if(zipEntry.entryName == "manifest.json") {
					manifest = zip.readAsText(zipEntry.entryName);
				}
			});

			if(!manifest) return Promise.reject(new Error('no manifest.json found'));
			return manifest;
		}).then((manifestData) => {
			return JSON.parse(manifestData);
		}).then((manifest) => {
			if(!manifest || !manifest.name || !manifest.id || !manifest.version) return Promise.reject(new Error('no valide manifest.json found'));

			manifestObject = manifest;

			const pluginDir = path.join(PLUGIN_DIR, manifest.id);

			try {
				fs.mkdirSync(pluginDir);

				return Promise.resolve(pluginDir);
			} catch(error) {
				return Promise.reject('Can\'t install plugin');
			}
		}).then((pluginDir) => {
			zip.extractAllTo(pluginDir, true);

			this.install(manifestObject.id);

			let plugin = new Plugin(manifestObject);
			this.plugins.set(plugin.getId(), plugin);
		});
	}

	isInstalled(name) {
		return this.plugins.has(name);
	}


	fetchPlugin(url, config, resolve, reject) {
        return fetch(url, config).then(function (response) {
            if (!response) {
                throw new Error('Bad response');
            }

            resolve(response.text());

            //resolve( data.json() );
        }).then((response) => {
            if (!response) {
                throw new Error('Bad response');
            }

            resolve(JSON.parse(response));
        }).catch(reject);
	}

	uninstall(pluginId) {
		return new Promise((resolve, reject) => {

			const userHelper = this.socketHelper.getUserHelper();
			if(userHelper && userHelper.getCurrentUser() &&
				userHelper.getCurrentUser().hasPermission( PermissionHelper.MANAGE_EXTENSIONS ))
			{
				if(this.plugins.has(pluginId)) {
					if(PluginHelper.isServerPlugin(pluginId)) return reject('Can\'t remove server plugin.');
					deleteFolderRecursive( path.join(PLUGIN_DIR, pluginId) );
					this.plugins.delete(pluginId);

					return resolve();
				}
			}

			return reject();

		});
	}

	static isServerPlugin(pluginId) {
		switch(pluginId) {
			case 'plg_home':
			case 'plg_server':
			case 'plg_license':
				return true;
			default:
				return false;
		}
	}
}


function deleteFolderRecursive(path) {
	if(!path.startsWith(PLUGIN_DIR)) return;

	if( fs.existsSync(path) ) {
		fs.readdirSync(path).forEach(function(file,index){
			let curPath = path + "/" + file;
			if(fs.lstatSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursive(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});

		try {
			fs.rmdirSync(path);
		} catch(e) {
			if(e.code == 'ENOTEMPTY') deleteFolderRecursive(path);
		}
	}
}

module.exports = PluginHelper;