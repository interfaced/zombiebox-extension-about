goog.provide('zb.popups.About');
goog.require('zb.device.input.Keys');
goog.require('zb.ext.about.popups.templates.about');
goog.require('zb.layers.CutePopup');
goog.require('zb.packageInfo');



zb.popups.About = class extends zb.layers.CutePopup {
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
	 * @inheritDoc
	 */
	_renderTemplate() {
		return zb.ext.about.popups.templates.about(this._getTemplateData(), this._getTemplateOptions());
	}


	/**
	 * @inheritDoc
	 */
	_processKey() {
		if (this._keyProcessCounter > 0) {
			this.close(0);
		}
		this._keyProcessCounter++;

		return true;
	}

	/**
	 * @param {Array.<zb.device.input.Keys>} seq
	 */
	static setKeySequence(seq) {
		zb.popups.About._sequence = seq;
		zb.popups.About._currentPosition = 0;
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
zb.popups.About._currentPosition;


/**
 * Default value is '1235789' like Z
 * @type {Array.<zb.device.input.Keys>}
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
