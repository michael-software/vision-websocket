let JuiInputView = require('../abstract/JuiInputView');

/**
 * Input-Element that let the user select a file
 */
class File extends JuiInputView {
	/**
	 * Creates a new File element
	 * @param name {String} - The name of the element that will be used when sending data to the server
	 */
	constructor( name ) {
		super(name);

		if(name) {
			this.setProperty(JuiInputView.TYPE, 'file');
			this.setProperty(JuiInputView.NAME, name);
		}
	}

	/**
	 * Set whether it is allowed to select multiple files
	 * @param boolean {boolean||null} - Value to be set (false: only one file, anything else: multiple files)
	 */
	setMultiple(boolean) {
		if(boolean === false)
			this.setProperty(JuiInputView.MULTIPLE, false);
		else
			this.setProperty(JuiInputView.MULTIPLE, true);
	}
}


module.exports = File;