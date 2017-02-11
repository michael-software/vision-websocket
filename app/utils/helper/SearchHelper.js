var fetch = require('node-fetch');

const CustomJuiHelper = require('../CustomJuiHelper');

class SearchHelper {
	constructor(socketHelper) {
		this.socketHelper = socketHelper;
	}

	getSearch(query) {
		//console.log('this', data);

		return new Promise((resolve, reject) => {
			let plugins = this.socketHelper.getPluginHelper().getPlugins().values();

			let results = [];

			for(let plugin of plugins) {
				if(this.searchInString(plugin.getName(), query)) {
					results.push(plugin);
				}
			}

            return resolve(results);
		});
	}

	getSearchView(query) {
		return this.getSearch(query).then((data) => {
			let juiHelper = new CustomJuiHelper();


			let list = new juiHelper.List();

			data.map((element) => {
				let entry = new juiHelper.List.Entry(element.name);
				entry.click = juiHelper.Action.openPlugin(element.id);

				list.add(entry);
			});

			juiHelper.add(list);

			return juiHelper;
		});
	}

	/**
	 * Searchs in a string
	 * @param string {string} - The string in which should be searched
	 * @param query {string} - The string that should be searched
	 * @returns {boolean} - Found or not found
	 */
	searchInString(string, query) {
		string = String(string);
		let lString = string.toLowerCase();

		query = String(query);
		let lQuery = query.toLowerCase();

		if(lString.search(lQuery) !== -1) {
			return true;
		}

		if(lQuery.search(lString) !== -1) {
			return true;
		}

		return false;
	}
}

module.exports = SearchHelper;