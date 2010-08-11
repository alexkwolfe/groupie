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
	
## Error handling

If an error occurs in a function, pass the error to the `done` method. The error will be included
among the values passed to the callback function.

When an error occurs during chained execution, the chain stops and the values collected (including
the error) are returned to the callback function.

Check for errors in the values passed to the callback function and behave accordingly.

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
		puts("Two colors and one error were collected: " + colors);
	});

	// execute each one after the other, and callback when the error occurrs
	gang.chain(functions, function(colors) {
		puts("One color and one error were collected: " + colors);
	});