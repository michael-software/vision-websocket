module.exports = (juiHelper) => {
	console.log('home');

console.log(juiHelper);
	let text = new juiHelper.Text('hi');
	text.setAlign('right');
	text.setShadow({
		color: '#FF0000'
	});
	text.setAppearance('bold');




	let headline = new juiHelper.Headline('hiho');
	headline.setAlign('center');
	headline.setShadow({
		color: '#0000FF'
	});
	headline.setSize('normal');


	let input1 = new juiHelper.Input('hiho');
	input1.setPlaceholder('Test');
	input1.setPreset(juiHelper.Input.TEXTAREA);
	input1.setValue('Hallo alle zusammen');




	let button = new juiHelper.Button('Senden');
	button.setClick( juiHelper.Action.submit() );



	let checkbox = new juiHelper.Checkbox('checkbox');
	checkbox.setValue(false);
	checkbox.setLabel('Teste mich!');


	juiHelper.add(headline);
	juiHelper.nline(2);
	juiHelper.add(text);
	juiHelper.hline();
	juiHelper.add(input1);
	juiHelper.add(button);
	juiHelper.add(checkbox);

	return juiHelper.getArray();
};