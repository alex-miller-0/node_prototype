/*
	- is_percentage defined if the max and min prices are dollar amounts or percentages
	- valid_start and end are defined by the merchant (i.e. 10-20% off from 4-6 pm)
	- Valid_days are defined by the merchant (i.e. valid on Monday and Tuesday, or 1 and 2)
*/
CREATE TABLE if not exists deals
(
	id INT unsigned NOT NULL AUTO_INCREMENT,
	merchant_id INT unsigned,
	min_price INT unsigned,
	max_price INT unsigned,
	valid_start TIMESTAMP NOT NULL,
	valid_end TIMESTAMP NOT NULL,
	valid_days TIMESTAMP NOT NULL,
	description VARCHAR(256),
	is_percentage TINYINT(1),
	PRIMARY KEY (id)
);

/* 
	- Time start and end are defined by the price generation script.
*/
CREATE TABLE if not exists price_sets
(
	id INT unsigned NOT NULL AUTO_INCREMENT,
	price_set_id INT unsigned NOT NULL,
	price INT unsigned NOT NULL,
	merchant_id INT unsigned NOT NULL,
	time_start TIMESTAMP NOT NULL,
	time_end TIMESTAMP NOT NULL,
	description VARCHAR(256),
	void TINYINT(1) DEFAULT 0,
	PRIMARY KEY (id)
);