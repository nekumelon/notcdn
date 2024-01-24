const tesseract = require('node-tesseract-ocr');

const config = {
	lang: 'eng',
	oem: 1,
	psm: 3,
};

async function recognizeText(image) {
	return await tesseract.recognize(image, config);
}

module.exports = {
	recognizeText,
};
