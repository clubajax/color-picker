const BaseComponent = require('BaseComponent');
require ('BaseComponent/src/properties');
const dom = require('dom');
const on = require('on');

const attributes = [];

class ColorPicker extends BaseComponent {

	static get observedAttributes () {
		return attributes;
	}

	get props () {
		return attributes;
	}
}

module.exports = ColorPicker;