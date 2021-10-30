import path from 'path';
import {AbstractExtension} from 'zombiebox';


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
		return (new URL('lib', import.meta.url)).pathname;
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


export default AboutExtension;
