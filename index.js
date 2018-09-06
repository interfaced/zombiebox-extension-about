const path = require('path');


/**
 * @implements {IZBAddon}
 */
class AboutExtension {
	/**
	 * @override
	 */
	getName() {
		return 'about';
	}

	/**
	 * @override
	 */
	getPublicDir() {
		return path.join(__dirname, 'lib');
	}

	/**
	 * @override
	 */
	getConfig() {
		return {};
	}
}


/**
 * @type {IZBAddon}
 */
module.exports = AboutExtension;
