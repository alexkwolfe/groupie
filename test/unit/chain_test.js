var gang = require('../../lib/gang-bang');

exports.testAllFunctionsCalled = function(assert) {
	assert.expect(1);
	
	var calls = 0;
	var functions = [
		function(done) { calls++; done(); },
		function(done) { calls++; done(); },
		function(done) { calls++; done(); } 
	];
	
	gang.chain(functions, function(colors) {
		assert.equals(3, calls);
		assert.done();
	});
}

exports.testResults = function(assert) {
	assert.expect(1);
	
	var functions = [
		function(done) { done('red'); },
		function(done) { done('green'); },
		function(done) { done('blue'); } 
	];
	
	gang.chain(functions, function(colors) {
		assert.same(['red', 'green', 'blue'], colors);
		assert.done();
	});
};

exports.testStopsOnError = function(assert) {
	assert.expect(4);
	
	var functions = [
		function(done) { done('red'); },
		function(done) { done(new Error('green')); },
		function(done) { done('blue'); } 
	];
	
	gang.chain(functions, function(colors) {
		assert.equals(2, colors.length);
		assert.equals('red', colors[0]);
		assert.ok(colors[1] instanceof Error);
		assert.equals('green', colors[1].message);
		assert.done();
	});
};