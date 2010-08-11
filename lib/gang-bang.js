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
	var callGroupFunction = function(fxn) {
		var done = function(result) {
			results.push(result);
			items_left_to_execute--;
			if (!items_left_to_execute) 
				cb(results);
		};
		fxn(done);
	};

	for ( var i = 0; i < fxns.length; i++) {
		callGroupFunction(fxns[i]);
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
			if (result) 
				results.push(result);
				
            if (!(result instanceof Error) && fxns.length > pos) { 
                callNext();
			} else {
				callback(results);
			}
        };
        fxns[pos](done);
    };
    
    callNext();
}