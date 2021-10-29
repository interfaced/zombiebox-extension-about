/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2015-2021, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import InlineWidget from 'cutejs/widgets/inline-widget';
import InputKey from 'zb/device/input/key';


/**
 * @template DATA
 */
export default class Button extends InlineWidget {
	/**
	 * @param {HTMLElement} container
	 * @param {DATA=} data
	 */
	constructor(container, data) {
		container.classList.add('p-zb-about-w-button');
		super(container);

		/**
		 * Fired with: data {*}
		 * @type {string}
		 */
		this.EVENT_CLICK = 'click';

		/**
		 * @type {DATA}
		 * @protected
		 */
		this._data;

		this.setData(data);
	}

	/**
	 * @param {DATA} data
	 */
	setData(data) {
		this._data = data;
	}

	/**
	 * @return {DATA}
	 */
	getData() {
		return this._data;
	}

	/**
	 * @param {function(string, DATA)} callback
	 */
	onClick(callback) {
		this.on(this.EVENT_CLICK, callback);
	}

	/**
	 * @param {function(string, DATA)} callback
	 */
	offClick(callback) {
		this.off(this.EVENT_CLICK, callback);
	}

	/**
	 * Handles user-controlled key event
	 * @override
	 */
	_processKey(zbKey, event) {
		let isHandled = false;

		if (zbKey === InputKey.ENTER) {
			this._fireEvent(this.EVENT_CLICK, this._data);
			isHandled = true;
		}

		return isHandled;
	}
}
