/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2015-2020, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import app from 'generated/app';
import {NPM_PACKAGE_NAME, NPM_PACKAGE_VERSION, ZOMBIEBOX_VERSION} from 'generated/define';
import {render, Out} from 'generated/cutejs/about/about.jst';
import AbstractCutePopup from 'cutejs/layers/abstract-popup';
import {node, updateClassName} from 'zb/html';
import {ResolutionInfo} from 'zb/device/resolutions';
import UnsupportedFeature from 'zb/device/errors/unsupported-feature';
import Key from 'zb/device/input/key';


/**
 */
export default class About extends AbstractCutePopup {
	/**
	 */
	constructor() {
		super();

		/**
		 * @type {Out}
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

		const nodeContent = this._exported.content;
		const data = this._getData();
		for (const [key, value] of Object.entries(data)) {
			nodeContent.appendChild(node('div', 'p-zb-about__content-label', key + ': '));
			nodeContent.appendChild(node('div', 'p-zb-about__content-value', value));
			nodeContent.appendChild(node('br'));
		}
	}

	/**
	 * @override
	 */
	_renderTemplate() {
		return render(this._getTemplateData(), this._getTemplateOptions());
	}

	/**
	 * @override
	 */
	_processKey(zbKey, e) {
		const exp = this._exported;

		if (zbKey === Key.ENTER) {
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

		if (zbKey === Key.BACK) {
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
		return this._diff > this._step / MULTIPLICITY_STEP;
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

		this._step = parseInt(lineHeight, 10) * MULTIPLICITY_STEP;
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
		updateClassName(this._exported.popupContainer, '_no-scrolling', !this._isScrollable());
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
				value = e instanceof UnsupportedFeature ? 'N/A' : 'ERR';
			}
			info[label] = value;
		};

		addInfo('Application name', NPM_PACKAGE_NAME);
		addInfo('Application version', NPM_PACKAGE_VERSION);
		addInfo('ZombieBox version', ZOMBIEBOX_VERSION);

		addInfo('Device type', () => app.device.info.type());
		addInfo('Version', () => app.device.info.version());
		addInfo('Device model', () => app.device.info.model());
		addInfo('Software version', () => app.device.info.softwareVersion());
		addInfo('Resolution', () => ResolutionInfo[app.device.info.osdResolutionType()].name);
		addInfo('Locale', () => '' + app.device.info.locale());

		if (_customDataProvider) {
			return _customDataProvider(info);
		}

		return info;
	}

	/**
	 * @param {Array<Key>} seq
	 */
	static setKeySequence(seq) {
		_sequence = seq;
		_currentPosition = 0;
	}

	/**
	 * @param {function(!Object<string, string>): !Object<string, string>} customProvider
	 */
	static setCustomDataProvider(customProvider) {
		_customDataProvider = customProvider;
	}

	/**
	 * @param {Key} zbKey
	 */
	static processKey(zbKey) {
		const seq = _sequence;
		_currentPosition = _currentPosition || 0;
		if (seq[_currentPosition] !== zbKey) {
			_currentPosition = 0;
		} else if (_currentPosition === seq.length - 1) {
			app.showChildLayer(About);
		} else {
			_currentPosition++;
		}
	}
}


/**
 * @type {number}
 * @private
 */
let _currentPosition;


/**
 * @type {?function(!Object<string, string>): !Object<string, string>}
 * @private
 */
let _customDataProvider;


/**
 * @const {number}
 */
const MULTIPLICITY_STEP = 2;


/**
 * Default value is '1235789' like Z
 * @type {Array<Key>}
 * @private
 */
let _sequence = [
	Key.DIGIT_1,
	Key.DIGIT_2,
	Key.DIGIT_3,
	Key.DIGIT_5,
	Key.DIGIT_7,
	Key.DIGIT_8,
	Key.DIGIT_9
];
