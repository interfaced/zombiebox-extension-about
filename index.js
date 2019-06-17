const path = require('path');
const {AbstractExtension} = require('zombiebox');


/**
 */
class AboutExtension extends AbstractExtension {
	/**
	 * @override
	 */
	getName() {
		return 'about';
	}

	/**
	 * @override
	 */
	getSourcesDir() {
		return path.join(__dirname, 'lib');
	}

	/**
	 * @override
	 */
	getConfig() {
		return {};
	}

	/**
	 * @override
	 */
	buildCLI(yargs, application) {
		return undefined;
	}

	/**
	 * @override
	 */
	generateCode(projectConfig) {
		return {};
	}
}


module.exports = AboutExtension;
