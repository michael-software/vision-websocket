module.exports = {
	keys: {
		type: 1,
		value: 2,
		click: 3,
		longclick: 4,
		size: 5,
		color: 6,
		name: 7,
		align: 8,
		appearance: 9,
		shadow: 10,
		placeholder: 11,
		preset: 12,
		label: 13,
		multiple: 14,
		style: 'style',
		html: 16
	},
	values: {
		type: {
			text: 1,
			headline: 2,
			nline: 3,
			hline: 4,
			input: 5,
			button: 6,
			checkbox: 7,
			file: 8,
			list: 9,
			image: 10,
			select: 11,
			table: 12,
			frame: 13,
			range: 14
		},
		size: {
			small: 's',
			normal: 'm',
			large: 'l'
		},
		color: {
			'#000000': 1,
			'#FFFFFF': 2,
			'#FF0000': 3,
			'#00FF00': 4,
			'#0000FF': 5,
			'#FFFF00': 6,
			'#00FFFF': 7,
			'#FF00FF': 8,
		},
		align: {
			left: 1,
			center: 2,
			right: 3
		},
		appearance: {
			bold: 1,
			italic: 2,
			bolditalic: 3
		},
		preset: {
			textarea: 1,
			password: 2,
			number: 3,
			color: 4,
			date: 5
		},
		click: {
			'submit()': 1
		},
		longclick: {
			'submit()': 1
		},
		value: {
			false: 1,
			true: 2
		}
	}
};