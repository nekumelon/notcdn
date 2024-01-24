function getDate() {
	const date = new Date();

	return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function getTime() {
	const date = new Date();

	return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function createKey() {
	return `screenshots/${getDate()}/${getTime()}`;
}

function getKeyDetails(key) {
	const details = key.split('/');
	const date = details[1];

	const name = details[2].split('.');
	const time = name[0];
	const extension = 'png';

	return {
		date,
		time,
		extension,
	};
}

function getIdDetails(id) {
	const details = id.split('.');
	const name = details[0].split('_');
	const date = name[0];
	const time = name[1];
	const extension = details[1];

	return {
		date,
		time,
		extension,
	};
}

function createIdFromKey(key) {
	const details = getKeyDetails(key);

	return `${details.date}_${details.time}.${details.extension}`;
}

function createKeyFromId(id) {
	const details = getIdDetails(id);

	return `screenshots/${details.date}/${details.time}.${details.extension}`;
}

module.exports = {
	createKey,
	createKeyFromId,
	getDate,
	getTime,
	getKeyDetails,
	createIdFromKey,
	getIdDetails,
};
