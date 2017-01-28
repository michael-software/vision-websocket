module.exports = function(databaseHelper) {
	databaseHelper.query(`CREATE TABLE IF NOT EXISTS ##pluginDB##_messages (
		id INT NOT NULL AUTO_INCREMENT,
		message TEXT,
		sender INT,
		recipient INT,
		type INT DEFAULT 0,
		timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY (ID)
	)`)
};