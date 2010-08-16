/**
 * Creates a group of passed functions, and executes callback when all have completed 
 * when an error has been detected.
 */
var sys = require('sys');

exports.group = function (fxns, cb) {
	if (fxns.length === 0) {
		cb();
		return;
	} 

	var items_left_to_execute = fxns.length;
	var results = [];
	var callGroupFunction = function(i, fxn) {
		var done = function(result) {
			if (result instanceof Error)
				return cb(result);

			results[i] = result;

			items_left_to_execute--;
			if (!items_left_to_execute) 
				cb(results);
		};
		fxn(done);
	};

	for ( var i = 0; i < fxns.length; i++) {
		callGroupFunction(i, fxns[i]);
	}
}
/**
 * Executes all functions in order, and a callback when all have completed
 * or when an error has been detected
 */
exports.chain = function (fxns, callback) {
    if (fxns.length === 0)
        return;
    
    var pos = 0;
	var results = [];
    var callNext = function() {
		var done = function(result) {
            pos++;
			if (result instanceof Error)
				return callback(result);
				
			results.push(result);
				
            if (fxns.length > pos) { 
                callNext();
			} else {
				callback(results);
			}
        };
        fxns[pos](done);
    };
    
    callNext();
}