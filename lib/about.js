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

		/**
		 * @type {zb.ext.about.popups.templates.AboutOut}
		 * @protected
		 */
		this._exported;

		/**
		 * @type {number} x2 relative to line-height
		 * @protected
		 */
		this._step = 0;

		/**
		 * @type {number}
		 * @protected
		 */
		this._containerSize = 0;

		/**
		 * @type {number}
		 * @protected
		 */
		this._sliderSize = 0;

		/**
		 * @type {number}
		 * @protected
		 */
		this._diff = 0;

		/**
		 * @type {number}
		 * @protected
		 */
		this._position = 0;

		this._exported.arrowUp.onClick(this._moveUp.bind(this));
		this._exported.arrowDown.onClick(this._moveDown.bind(this));
		this._exported.btnExit.onClick(() => this.close(undefined));
	}

	/**
	 * @override
	 */
	afterDOMShow() {
		super.afterDOMShow();

		this._updateView();
	}

	/**
	 * @override
	 */
	beforeDOMShow() {
		super.beforeDOMShow();

		const data = this._getData();
		for (const [key, value] of Object.entries(data)) {
			this._exported.content.appendChild(zb.html.node('div', 'p-zb-about__content-label', key + ': '));
			this._exported.content.appendChild(zb.html.node('div', 'p-zb-about__content-value', value));
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
	_processKey(zbKey, e) {
		const exp = this._exported;
		const keys = zb.device.input.Keys;

		if (zbKey === keys.ENTER) {
			switch (this._activeWidget) {
				case exp.arrowUp:
					return this._moveUp();

				case exp.arrowDown:
					return this._moveDown();

				case exp.btnExit:
					this.close(undefined);

					return true;
			}
		}

		if (zbKey === keys.BACK) {
			this.close(undefined);

			return true;
		}

		return super._processKey(zbKey, e);
	}

	/**
	 * @return {boolean}
	 * @protected
	 */
	_moveUp() {
		if (this._getPosition() === 0) {
			return false;
		}

		this._setPosition(this._position - this._step);
		this._toogleArrows();

		return true;
	}

	/**
	 * @return {boolean}
	 * @protected
	 */
	_moveDown() {
		if (this._getPosition() === 100) {
			return false;
		}

		this._setPosition(this._position + this._step);
		this._toogleArrows();

		return true;
	}

	/**
	 * @return {boolean}
	 * @protected
	 */
	_isScrollable() {
		return this._diff > this._step / zb.popups.About.MULTIPLICITY_STEP;
	}

	/**
	 * @return {number} in percents
	 * @protected
	 */
	_getPosition() {
		return this._diff ? this._position * 100 / this._diff : 0;
	}

	/**
	 * @protected
	 */
	_calculateSize() {
		const exp = this._exported;
		const lineHeight = window.getComputedStyle(exp.content)['line-height'];

		this._step = parseInt(lineHeight, 10) * zb.popups.About.MULTIPLICITY_STEP;
		this._containerSize = exp.popupContainer.offsetHeight;
		this._sliderSize = exp.slider.offsetHeight;
		this._diff = Math.max(this._sliderSize - this._containerSize, 0);
	}

	/**
	 * @protected
	 */
	_updateView() {
		this._calculateSize();

		this._toogleArrows();
		this._renderShadows();

		this._setPosition(this._position);
	}

	/**
	 * @param {number} position
	 * @protected
	 */
	_setPosition(position) {
		let normalizedPosition = position;

		normalizedPosition = Math.min(normalizedPosition, this._diff);
		normalizedPosition = Math.max(normalizedPosition, 0);

		this._exported.slider.style.top = `${-normalizedPosition}px`;
		this._position = normalizedPosition;
	}

	/**
	 * @protected
	 */
	_renderShadows() {
		zb.html.updateClassName(this._exported.popupContainer, '_no-scrolling', !this._isScrollable());
	}

	/**
	 * @protected
	 */
	_toogleArrows() {
		const exp = this._exported;

		if (this._getPosition() === 0) {
			exp.arrowUp.disable();
			exp.arrowDown.enable();
			this.activateWidget(exp.arrowDown);
		}

		if (this._getPosition() === 100) {
			exp.arrowUp.enable();
			exp.arrowDown.disable();
			this.activateWidget(exp.arrowUp);
		}

		if (this._getPosition() !== 0 && this._getPosition() !== 100) {
			exp.arrowUp.enable();
			exp.arrowDown.enable();
		}

		if (!this._isScrollable()) {
			exp.arrowUp.disable();
			exp.arrowDown.disable();
		}
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
		addInfo('ZombieBox version', zb.packageInfo['dependencies']['zombiebox']);

		addInfo('Device type', () => app.device.info.type());
		addInfo('Version', () => app.device.info.version());
		addInfo('Device model', () => app.device.info.model());
		addInfo('Software version', () => app.device.info.softwareVersion());
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
 * @const {number}
 */
zb.popups.About.MULTIPLICITY_STEP = 2;


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
