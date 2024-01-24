const express = require('express');
const {
	getAllImages,
	uploadImageTagsFile,
	uploadData,
	createImageTags,
	getImage,
	deleteImage,
} = require('./web/aws');
const cors = require('cors');
const functions = require('firebase-functions');
const { createKey, createIdFromKey } = require('./utils/date');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

// Create temp folder
if (fs.existsSync('./temp')) {
	fs.rm('./temp', { recursive: true }, () => {
		fs.mkdirSync('./temp');
	});
} else {
	fs.mkdirSync('./temp');
}

app.use(bodyParser.json({ limit: '50mb' }));
app.use(
	bodyParser.urlencoded({
		limit: '50mb',
		extended: true,
		parameterLimit: 50000,
	})
);

app.use(cors({ origin: true, credentials: true }));

app.get('/', (req, res) => {
	res.send('notcdn');
});

app.get('/getAllImages', async (req, res) => {
	const images = await getAllImages();
	res.json(images);
});

app.post('/getImage', async (req, res) => {
	const { id } = req.body;

	const image = await getImage(id);
	res.json(image);
});

app.post('/uploadImage', async (req, res) => {
	try {
		let { image } = req.body;
		image = Buffer.from(image.data);

		const key = createKey();
		const id = createIdFromKey(key);
		// Write the image to a temp file
		const imagePath = `./temp/${id}`;
		await fs.promises.writeFile(imagePath, image);

		// Generate OCR tags from the image and upload them
		const tags = await createImageTags(imagePath);
		await uploadImageTagsFile(`${key}.txt`, tags);

		// Upload the image
		await uploadData(`${key}.png`, image);

		res.json({ success: true });
	} catch (error) {
		console.error(error);

		res.status(500).json({ success: false });
	}
});

app.post('/deleteImage', async (req, res) => {
	try {
		const { id } = req.body;

		await deleteImage(id);

		res.json({ success: true });
	} catch (error) {
		console.error(error);

		res.status(500).json({ success: false });
	}
});

app.post('/deleteImages', async (req, res) => {
	try {
		const { ids } = req.body;

		await Promise.all(ids.map((id) => deleteImage(id)));

		res.json({ success: true });
	} catch (error) {
		console.error(error);

		res.status(500).json({ success: false });
	}
});

// Remove temp folder
process.on('exit', () => {
	fs.rmdirSync('./temp', { recursive: true });
});

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
// 	console.log(`Server listening on port ${PORT}`);
// });

exports.app = functions.https.onRequest(app);
