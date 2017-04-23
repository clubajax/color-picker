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
		const left = dom('div', {class:'left-section',
			html:dom('div', {class:'sl-picker',
				html:[
					dom('div', {class: 'sl-hue'}),
					dom('div', {class: 'sl-bw'})
				]
			})
		}, this);
		this.slPicker = left.children[0];


		const center = dom('div', {class:'center-section',
			html:dom('div', {class: 'hue-picker'})
		}, this);
		this.huePicker = center.children[0];

		const fields = dom('div', {class:'right-section'}, this);
		this.swatch = dom('div', {class: 'picker-swatch'}, fields);

		dom('label', {html: [
			dom('span', {html: 'R'}),
			dom('input', {class: 'rgb r', attr:{value:'255'}})
		]}, fields);

		dom('label', {html: [
			dom('span', {html: 'G'}),
			dom('input', {class: 'rgb g', attr:{value:'255'}})
		]}, fields);

		dom('label', {html: [
			dom('span', {html: 'B'}),
			dom('input', {class: 'rgb b', attr:{value:'255'}})
		]}, fields);

		dom('label', {html: [
			dom('span', {html: '#'}),
			dom('input', {class: 'hex', attr:{value:'FFFFFF'}})
		]}, fields);
	}
}

// http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c

function hue2rgb(p, q, t){
	if(t < 0) { t += 1; }
	if(t > 1) { t -= 1; }
	if(t < 1/6) { return p + (q - p) * 6 * t; }
	if(t < 1/2) { return q; }
	if(t < 2/3) { return p + (q - p) * (2/3 - t) * 6; }
	return p;
}

function hslToRgb(h, s, l){
	let r, g, b;

	if(!s){
		r = g = b = l; // achromatic
	}else{

		let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		let p = 2 * l - q;
		r = hue2rgb(p, q, h + 1/3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1/3);
	}

	return {r: Math.round(r * 255), g:Math.round(g * 255), b:Math.round(b * 255)};
}

function rgbToHsl(r, g, b){
	r /= 255;
	g /= 255;
	b /= 255;

	let max = Math.max(r, g, b);
	let min = Math.min(r, g, b);
	let d, h, s, l = (max + min) / 2;

	if(max === min){
		h = s = 0; // achromatic
	}else{
		d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch(max){
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}

	return {
		h,
		s,
		l
	};
}

customElements.define('color-picker', ColorPicker);

module.exports = ColorPicker;