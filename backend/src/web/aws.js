const {
	PutObjectCommand,
	ListObjectsCommand,
	GetObjectCommand,
	S3Client,
	DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const fs = require('fs');
const { recognizeText } = require('../ocr/ocr');
const {
	getKeyDetails,
	createIdFromKey,
	getIdDetails,
	createKeyFromId,
} = require('../utils/date');
const client = new S3Client({});

const BUCKET_NAME = 'notcdn';

async function getObject(Bucket, Key) {
	return new Promise(async (resolve, reject) => {
		const getObjectCommand = new GetObjectCommand({ Bucket, Key });

		try {
			const response = await client.send(getObjectCommand);

			// Store all of data chunks returned from the response data stream
			// into an array then use Array#join() to use the returned contents as a String
			let responseDataChunks = [];

			// Handle an error while streaming the response body
			response.Body.once('error', (err) => reject(err));

			// Attach a 'data' listener to add the chunks of data to our array
			// Each chunk is a Buffer instance
			response.Body.on('data', (chunk) => responseDataChunks.push(chunk));

			// Once the stream has no more data, join the chunks into a string and return the string
			response.Body.once('end', () => {
				const data = Buffer.concat(responseDataChunks);

				resolve(data);
			});
		} catch (err) {
			// Handle the error or throw
			return reject(err);
		}
	});
}

function createImageFromRaw(data) {
	return 'data:image/png;base64,' + Buffer.from(data).toString('base64');
}

async function createImageTags(image) {
	const imageText = await recognizeText(image);
	const tags = imageText.replaceAll('\n', '').replaceAll('\t', '').split(' ');

	return tags;
}

async function uploadImageTagsFile(key, tags) {
	const tagsJson = JSON.stringify(tags);

	await uploadData(key, tagsJson);
}

async function getImageTagsFile(key) {
	const data = await getObject(BUCKET_NAME, key);

	return JSON.parse(data);
}

async function getImage(id) {
	const { date, time, extension } = getIdDetails(id);
	const key = createKeyFromId(id);

	const data = await getObject(BUCKET_NAME, key);

	const image = createImageFromRaw(data);
	const tags = await getImageTagsFile(`screenshots/${date}/${time}.txt`);

	return {
		date,
		time,
		extension,
		tags,
		id,
		data: image,
	};
}

async function getAllImages() {
	const data = await client.send(
		new ListObjectsCommand({
			Bucket: BUCKET_NAME,
		})
	);

	if (!data.Contents) return [];

	const items = data.Contents.map((item) => item.Key);

	const images = [];

	for (const item of items) {
		if (item.endsWith('.txt')) continue;

		const { date, time, extension } = getKeyDetails(item);
		const id = createIdFromKey(item);

		const tags = await getImageTagsFile(`screenshots/${date}/${time}.txt`);

		const image = createImageFromRaw(await getObject(BUCKET_NAME, item));
		images.push({
			date,
			time,
			extension,
			tags,
			id,
			data: image,
		});
	}

	return images;
}

async function uploadData(key, data) {
	await client.send(
		new PutObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key,
			Body: data,
		})
	);
}

async function uploadFile(key, filePath) {
	const fileData = await fs.promises.readFile(filePath);
	await uploadData(key, fileData);
}

async function deleteImage(id) {
	const { date, time, extension } = getIdDetails(id);
	const key = createKeyFromId(id);

	await client.send(
		new DeleteObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key,
		})
	);

	await client.send(
		new DeleteObjectCommand({
			Bucket: BUCKET_NAME,
			Key: `screenshots/${date}/${time}.txt`,
		})
	);
}

module.exports = {
	getAllImages,
	uploadImageTagsFile,
	getImageTagsFile,
	getImage,
	uploadFile,
	createImageTags,
	deleteImage,
	uploadData,
};
