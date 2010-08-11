var gang = require('../../lib/gang-bang');

exports.testAllFunctionsCalled = function(assert) {
	assert.expect(1);
	
	var calls = 0;
	var functions = [
		function(done) { calls++; done(); },
		function(done) { calls++; done(); },
		function(done) { calls++; done(); } 
	];
	
	gang.group(functions, function(colors) {
		assert.equals(3, calls);
		assert.done();
	});
}

exports.testResults = function(assert) {
	assert.expect(1);
	
	// order the results by setting a timeout. this "proves" concurrency.
	var functions = [
		function(done) {  setTimeout(function() { done('red'); }, 300); },
		function(done) {  setTimeout(function() { done('green'); }, 100); },
		function(done) {  setTimeout(function() { done('blue'); }, 200); },
	];
	
	gang.group(functions, function(colors) {
		assert.same(['green', 'blue', 'red'], colors);
		assert.done();
	});
};

exports.testDoesNotStopOnError = function(assert) {
	assert.expect(5);
	
	var functions = [
		function(done) {  setTimeout(function() { done('red'); }, 100); },
		function(done) {  setTimeout(function() { done(new Error('green')); }, 200); },
		function(done) {  setTimeout(function() { done('blue'); }, 300); },
	];
	
	gang.group(functions, function(colors) {
		assert.equals(3, colors.length);
		assert.equals('red', colors[0]);
		assert.ok(colors[1] instanceof Error);
		assert.equals('green', colors[1].message);
		assert.equals('blue', colors[2]);
		assert.done();
	});
};