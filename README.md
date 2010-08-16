# Gang Bang

A flow control library for node.js for executing multiple functions as a group or in a chain, calling back when all functions have finished.

## Installation

    npm install gang-bang

## Usage

	var gang = require('gang-bang'),
	    puts = require('sys').puts;
	
	// the array of functions to execute. each calls the done function
	// upon completion, passing back relevant information.
	var functions = [
		function(done) { done('red'); },
		function(done) { done('green'); },
		function(done) { done('blue'); } 
	];
	
	// execute functions concurrently, and callback when all functions have been called
	gang.group(functions, function(colors) {
		puts("All colors were collected: " + colors);
	});
	
	// execute each one after the other, and callback when all functions have been called
	gang.chain(functions, function(colors) {
		puts("All colors were collected: " + colors);
	});

## Function results

You must invoke the `done` function in each of your functions. This notifies the `group` or
`chain` process that the function is done executing and provides an opportunity to return
results. 

Once all the `done` functions have been invoked, the callback is invoked with a parameter
that contains an array of the function results. Note that the results are in the same order
that the functions are declared, even for the `group` function. So if you're looking for the
"return value" of the second function you can examine the results at the 1st array index.
	
## Handling null and undefined results

If the `done` method is called with a `null` parameter or no parameter, then `null` or
`undefined` will be returned with other function values to the callback.
	
## Error handling

If an error occurs in a function, pass the error to the `done` method.  When an error occurs 
execution stops and the error is returned to the callback. Other result values are discarded

It's up to you to check for errors in the values passed to the callback function and behave accordingly.

	var gang = require('gang-bang'),
	    puts = require('sys').puts;

	// the array of functions to execute. each calls the done function
	// upon completion, passing back relevant information.
	var functions = [
		function(done) { done('red'); },
		function(done) { done(new Error('something went wrong')); },
		function(done) { done('blue'); } 
	];

	// execute functions concurrently, and callback when all functions have been called
	gang.group(functions, function(colors) {
		puts("Colors is an error: " + colors);
	});

	// execute each one after the other, and callback when the error occurs
	// non-error results are discarded.
	gang.chain(functions, function(colors) {
		puts("Colors is an error: " + colors);
	});