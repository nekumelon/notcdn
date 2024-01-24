import axios from 'axios';

const BASE_URL = window.location.origin.includes('localhost')
	? 'http://localhost:3000'
	: '';

async function getAllImages() {
	const { data } = await axios({
		method: 'GET',
		url: `${BASE_URL}/getAllImages`,
	});

	return data;
}

async function getImage(id) {
	const { data } = await axios({
		method: 'POST',
		url: `${BASE_URL}/getImage`,
		data: {
			id,
		},
	});

	return data;
}

async function deleteImage(id) {
	const { data } = await axios({
		method: 'POST',
		url: `${BASE_URL}/deleteImage`,
		data: {
			id,
		},
	});

	return data;
}

async function deleteImages(ids) {
	const { data } = await axios({
		method: 'POST',
		url: `${BASE_URL}/deleteImages`,
		data: {
			ids,
		},
	});

	return data;
}

export default {
	getImage,
	getAllImages,
	deleteImage,
	deleteImages,
};
