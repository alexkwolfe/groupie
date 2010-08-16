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

To retrieve "return values" from each of your functions, pass the return value the `done` callback. 
You must invoke `done` even if you don't want to return a value &mdash; it provides the execution flow
control.

The return values are passed in an array to the callback in the same order that the functions 
are declared. 
	
## Handling null and undefined results

If the `done` method is called with a `null` parameter or no parameter, then `null` or
`undefined` will be returned with other function values to the callback.
	
## Error handling

If an error occurs in a function, pass the error to the `done` method.  When an error occurs 
execution stops and the error is returned to the callback. Other result values collected up to that
point are available in the second callback parameter. 

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

	// execute functions concurrently.
	// stop execution and callback when an error occurs.
	gang.group(functions, function(err, colors) {
		if (err instanceof Error) {
			puts("An error occurred: " + err);
			puts("Here are the colors collected before the error: " + colors);
		} else {
			puts("No error occurred. Here are the colors: " + err);
		}
	});

	// execute each one after the other, and callback when the error occurs
	// non-error results are provided in the second parameter.
	gang.chain(functions, function(err, colors) {
		if (err instanceof Error) {
			puts("An error occurred: " + err);
			puts("Here are the colors collected before the error: " + colors);
		} else {
			puts("No error occurred. Here are the colors: " + err);
		}
	});