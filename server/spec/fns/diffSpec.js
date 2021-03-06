describe('diff', function() {

	var diff = require('../../fns/diff');


	it('should diff a shallow object', function() {
		var result = diff(
			{
				'one': 1,
				'two': 2
			},
			{
				'one': 54,
				'two': 2
			}
		);

		expect(result).toEqual({one: 54});
	});


	it('should diff an array of strings', function() {
		var result = diff(
			[1,2,3],
			[1,5,3]
		);

		expect(result).toEqual([undefined, 5]);
	});


	it('should diff an object of arrays', function() {
		var result = diff(
			{socks: ['red', 'yellow', 'salty'], pants: ['blue', 'red']},
			{socks: ['blue', 'yellow', 'salty', 'peach'], pants: null}
		);

		expect(result).toEqual({socks: ['blue', undefined, undefined, 'peach'], pants: null});
	});


	it('should return an empty object if data is identical', function() {
		var result = diff(
			{targets: {zazz: 1, suuz:{arr:[1,2,3]}, lala:null}},
			{targets: {zazz: 1, suuz:{arr:[1,2,3]}, lala:null}}
		);

		expect(result).toEqual({});
	});


	it('should diff deeply embedded values', function() {
		var result = diff(
			{targets: {suuz: {arr: [1,2,3]}}},
			{targets: {suuz: {arr: [1,2,5]}}}
		);

		expect(result).toEqual({targets: {suuz: {arr: [undefined, undefined, 5]}}});
	});


	it('should diff new arrays of data', function() {
		var result = diff(
			{},
			{pandas: [{'name': 'sally'}, {'name': 'bobo'}]}
		);

		expect(result).toEqual({pandas: [{'name': 'sally'}, {'name': 'bobo'}]});
	});


	it('should set data as null if it is no longer existent', function() {
		var result = diff(
			{hats: 'yes'},
			{}
		);

		expect(result).toEqual({hats: null});
	});

});