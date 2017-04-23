const BaseComponent = require('BaseComponent/src/BaseComponent');
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

	constructor () {
		super();
		console.log('SUP');
	}

	domReady () {
		this.slPicker = dom('div', {class:'saturation-lightness-picker'}, this);
		this.huePicker = dom('div', {class:'hue-picker'}, this);
		const fields = dom('div', {class:'picker-fields'}, this);
		this.swatch = dom('div', {class: 'picker-swatch'}, fields);

		dom('label', {html: 'R'}, fields);
		this.colorField = dom('input', {}, fields);
		dom('label', {html: 'G'}, fields);
		this.colorField = dom('input', {}, fields);
		dom('label', {html: 'B'}, fields);
		this.colorField = dom('input', {}, fields);

		dom('label', {html: '#'}, fields);
		this.colorField = dom('input', {}, fields);
	}
}

customElements.define('color-picker', ColorPicker);

module.exports = ColorPicker;