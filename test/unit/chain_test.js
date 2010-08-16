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

exports.testNullResultsAreNotDiscarded = function(assert) {
	assert.expect(1);
	
	// order the results by setting a timeout. this "proves" concurrency.
	var functions = [
		function(done) {  done('red'); },
		function(done) {  done(null); },
		function(done) {  done('blue'); }
	];
	
	gang.group(functions, function(colors) {
		assert.same(['red', null, 'blue'], colors);
		assert.done();
	});
};

exports.testUndefinedResultsNotDiscarded = function(assert) {
	assert.expect(1);
	
	// order the results by setting a timeout. this "proves" concurrency.
	var functions = [
		function(done) { done('red'); },
		function(done) { done(); },
		function(done) { done('blue'); },
	];
	
	gang.group(functions, function(colors) {
		assert.same(['red', undefined, 'blue'], colors);
		assert.done();
	});
};

exports.testStopsOnError = function(assert) {
	assert.expect(2);
	
	var functions = [
		function(done) { done('red'); },
		function(done) { done(new Error('green')); },
		function(done) { done('blue'); } 
	];
	
	gang.chain(functions, function(colors) {
		assert.ok(colors instanceof Error);
		assert.equals('green', colors.message);
		assert.done();
	});
};