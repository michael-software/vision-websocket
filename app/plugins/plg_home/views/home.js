module.exports = (juiHelper) => {
	console.log('home');

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

	let input2 = new juiHelper.File('test');
	input2.setLabel('Test');
	input2.setMultiple(true);

	let entry = new juiHelper.List.Entry('Yahoo');
	entry.setClick(juiHelper.Action.openUrl('https://www.yahoo.de'));

	let list1 = new juiHelper.List();
	list1.add(entry);
	list1.add('Google', juiHelper.Action.openUrl('https://www.google.de'), juiHelper.Action.openUrl('https://www.bing.de'));

	let image = new juiHelper.Image("http://placehold.it/350x150x");


	let select = new juiHelper.Select('hiho--select');
	select.add('Test');
	select.add('Hallo', 'Test');

	let table = new juiHelper.Table();
		let row = new juiHelper.Table.Row();
		row.add('Test');
		row.add('0,25');
	table.add(row);
		let row2 = new juiHelper.Table.Row();
		row2.add('Test');
		row2.add([headline, checkbox]);
	table.add(row2);
	table.setStyle({
		width: '100%',
		padding: 10,
		margin: {
			top: 30,
			right: 15,
			bottom: 8,
			left: 8
		},
		background: '#FF0000',
		visibility: juiHelper.Table.VISIBILITY_AWAY
	});
	table.setStyle({
		width: '50%',
		padding: {
			top: 20,
			right: 50,
			bottom: 0,
			left: 6
		},
		color: '#FFFFFF',
		visibility: null
	});



	let frame = new juiHelper.Frame("http://placehold.it/350x150x");
	frame.setHtml('<b>Test</b>');
	frame.setStyle({
		width: '100%'
	});


	let range = new juiHelper.Range('hiho--range');
	range.setValue(5);
	range.setMin(5);
	range.setMax(8);


	let container = new juiHelper.Container();
	container.add(range);
	container.add(input2);
	container.add(headline);


	juiHelper.add(headline);
	juiHelper.nline(2);
	juiHelper.add(text);
	juiHelper.hline();
	juiHelper.add(input1);
	juiHelper.add(button);
	juiHelper.add(checkbox);
	juiHelper.add(input2);
	juiHelper.add(list1);
	juiHelper.add(image);
	juiHelper.add(select);
	juiHelper.add(table);
	juiHelper.add(frame);
	juiHelper.add(range);
	juiHelper.add(container);

	return juiHelper.getArray();
};