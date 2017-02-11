module.exports = function promiseify(request, response, next) {
	response.promise = function(promise) {
		let responseText;

		promise.then(function(result) {
			response.setHeader('Content-Type', 'application/json');

			responseText = JSON.stringify(result);
			response.send(responseText);
		}).catch(function(error) {
			response.setHeader('Content-Type', 'application/json');

			error = error || {};

			responseText = JSON.stringify({
				error: error.message,
				stack: error.stack
			});
			response.send(responseText);
		});
	};

	next();
};