let JuiInputView = require('../abstract/JuiInputView');

/**
 * Input element that can have different PRESETS like PASSWORD or MULTILINE:
 * TEXTAREA - Multiline text
 * PASSWORD - Password input field
 * NUMBER - Allows simple numbers
 * COLOR - Lets you select a color
 * DATE - Lets you select a date
 */
class Input extends JuiInputView {
	/**
	 * Creates a new Input element
	 * @param name {String} - The name of the element that will be used when sending data to the server
	 */
	constructor( name ) {
		super(name);

		if(name) {
			this.setProperty(JuiInputView.TYPE, 'input');
			this.setProperty(JuiInputView.NAME, name);
		}
	}

	/**
	 * Sets the placeholder of the element
	 * @param string {String} - Value of the placeholder
	 */
	setPlaceholder(string) {
		this.setProperty(JuiInputView.PLACEHOLDER, String(string));
	}

	/**
	 * Define a preset that should be used by jui
	 * @param string - One of Input.<PRESET CONST>
	 */
	setPreset(string) {
		this.setProperty(JuiInputView.PRESET, String(string));
	}

}

Input.TEXTAREA 	= 'textarea';
Input.PASSWORD 	= 'password';
Input.NUMBER 	= 'number';
Input.COLOR 	= 'color';
Input.DATE 		= 'date';


module.exports = Input;