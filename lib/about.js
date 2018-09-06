goog.provide('zb.popups.About');
goog.require('zb.device.ResolutionInfo');
goog.require('zb.device.errors.UnsupportedFeature');
goog.require('zb.device.input.Keys');
goog.require('zb.ext.about.popups.templates.AboutOut');
goog.require('zb.ext.about.popups.templates.about');
goog.require('zb.html');
goog.require('zb.layers.CutePopup');
goog.require('zb.packageInfo');


/**
 */
zb.popups.About = class extends zb.layers.CutePopup {
	/**
	 */
	constructor() {
		super();

		this._addContainerClass('p-zb-about');

		/**
		 * @type {zb.ext.about.popups.templates.AboutOut}
		 * @protected
		 */
		this._exported;

		/**
		 * @type {number}
		 * @private
		 */
		this._keyProcessCounter = 0;
	}

	/**
	 * @override
	 */
	beforeDOMShow() {
		super.beforeDOMShow();

		const data = this._getData();
		for (const [key, value] of Object.entries(data)) {
			this._exported.content.appendChild(zb.html.textNode(key + ': ' + value));
			this._exported.content.appendChild(zb.html.node('br'));
		}
	}

	/**
	 * @override
	 */
	_renderTemplate() {
		return zb.ext.about.popups.templates.about(this._getTemplateData(), this._getTemplateOptions());
	}

	/**
	 * @override
	 */
	_processKey() {
		if (this._keyProcessCounter > 0) {
			this.close(0);
		}
		this._keyProcessCounter++;

		return true;
	}

	/**
	 * @return {!Object<string, string>}
	 * @protected
	 */
	_getData() {
		const info = {};
		/**
		 * @param {string} label
		 * @param {string|function(): string} cb
		 */
		const addInfo = (label, cb) => {
			let value = '';
			try {
				value = cb instanceof Function ? cb() : cb;
			} catch (e) {
				value = e instanceof zb.device.errors.UnsupportedFeature ? 'N/A' : 'ERR';
			}
			info[label] = value;
		};

		addInfo('Application name', zb.packageInfo['name']);
		addInfo('Application version', zb.packageInfo['version']);
		addInfo('Zombiebox version', zb.packageInfo['dependencies']['zombiebox']);
		addInfo('Zombiebox in web', 'http://zombiebox.tv/');

		addInfo('Type', () => app.device.info.type());
		addInfo('Version', () => app.device.info.version());
		addInfo('Model', () => app.device.info.model());
		addInfo('SW', () => app.device.info.softwareVersion());
		addInfo('Resolution', () => zb.device.ResolutionInfo[app.device.info.osdResolutionType()].name);
		addInfo('Locale', () => '' + app.device.info.locale());

		if (zb.popups.About._customDataProvider) {
			return zb.popups.About._customDataProvider(info);
		}

		return info;
	}

	/**
	 * @param {Array<zb.device.input.Keys>} seq
	 */
	static setKeySequence(seq) {
		zb.popups.About._sequence = seq;
		zb.popups.About._currentPosition = 0;
	}

	/**
	 * @param {function(!Object<string, string>): !Object<string, string>} customProvider
	 */
	static setCustomDataProvider(customProvider) {
		zb.popups.About._customDataProvider = customProvider;
	}

	/**
	 * @param {zb.device.input.Keys} zbKey
	 */
	static processKey(zbKey) {
		const seq = zb.popups.About._sequence;
		zb.popups.About._currentPosition = zb.popups.About._currentPosition || 0;
		if (seq[zb.popups.About._currentPosition] !== zbKey) {
			zb.popups.About._currentPosition = 0;
		} else if (zb.popups.About._currentPosition === seq.length - 1) {
			app.showChildLayer(zb.popups.About);
		} else {
			zb.popups.About._currentPosition++;
		}
	}
};


/**
 * @type {number}
 * @private
 */
zb.popups.About._currentPosition; // eslint-disable-line interfaced/no-unused-expressions


/**
 * @type {?function(!Object<string, string>): !Object<string, string>}
 * @private
 */
zb.popups.About._customDataProvider; // eslint-disable-line interfaced/no-unused-expressions


/**
 * Default value is '1235789' like Z
 * @type {Array<zb.device.input.Keys>}
 * @private
 */
zb.popups.About._sequence = [
	zb.device.input.Keys.DIGIT_1,
	zb.device.input.Keys.DIGIT_2,
	zb.device.input.Keys.DIGIT_3,
	zb.device.input.Keys.DIGIT_5,
	zb.device.input.Keys.DIGIT_7,
	zb.device.input.Keys.DIGIT_8,
	zb.device.input.Keys.DIGIT_9
];
