module.exports = function promiseify(request, response, next) {
	response.promise = function(promise) {
		let responseText;

		response.setHeader('Content-Type', 'application/json');

		promise.then(function(result) {
			responseText = JSON.stringify(result);
			response.send(responseText);
		}).catch(function(error) {
			responseText = JSON.stringify({
				error: error
			});
			response.send(responseText);
		});
	};

	next();
};