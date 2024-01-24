const axios = require('axios');
const isDev = require('electron-is-dev');

const BASE_URL = isDev ? 'http://localhost:3000' : 'http://localhost:3000';

async function uploadImage(image) {
	try {
		const { data } = await axios({
			method: 'POST',
			url: `${BASE_URL}/uploadImage`,
			data: {
				image,
			},
		});

		return data;
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	uploadImage,
};
