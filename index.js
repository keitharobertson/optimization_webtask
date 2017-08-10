'use latest';
import querystring from 'querystring';
import { NelderMead } from './src/nelder_mead';
import template from './demo';

// get the post data and parse the form
function getBody(req) {
	return new Promise( (resolve) => {
		let body = '';
		req.on('data', (chunk) => {
			body += chunk;
		});
		req.on('end', () => {
			body = querystring.parse(body);
			if(body.observedData) {
				body.observedData = body.observedData.split('\n').map( (stringPoint) =>
					stringPoint.split(',').map( (v) => Number(v) )
				);
			}
			if(body.initialGuess) {
				body.initialGuess = body.initialGuess.split(',').map( (v) => Number(v) );
			}
			resolve(body);
		});
	});
}

// if no target function was passed in, this defines the default
function defaultTargetFunction() {
	return `function (x, a, b, c) {
    return a * Math.pow(x, 2) + b * x + c;
}`;
}

// if no initial guess was passed in, this defines the default
function defaultInitialGuess() {
	return [2, 3, 4];
}

//if no observed data was passed in, generate some default data
function defaultObservedData(y, initialGuess) {
	return [...Array(50).keys()].map( (x) => {
		x = x - 25;
		let trueVal = y(x, ...initialGuess);
		let noise = (Math.random() - 0.5);
		return [x, trueVal + trueVal * noise];
	});
}

// run the nelder mead optimization to fit the curve
function runOptimization(y, observedData, initialGuess) {
	let minimization = (params) => {
		return observedData.reduce( (errorSum, point) => {
			// least squares fit (sum the squared residuals)
			return errorSum + Math.pow(y(point[0], ...params) - point[1], 2);
		}, 0);
	};

	let nm = new NelderMead(initialGuess, minimization);
	nm.iterateNTimes(1000);
	return nm.getNthPoint(0);
}


module.exports = function(context, req, res) {
	getBody(req).then( (body) => {
		let targetFunctionString = body.targetFunction || defaultTargetFunction();
		let initialGuess = body.initialGuess || defaultInitialGuess();
		let y = eval('(' + targetFunctionString + ')');


		let fit = [];
		let error = '';
		let optimizedParams = [];
		let observedData = [];
		if(y.length !== initialGuess.length + 1) {
			res.writeHead(400);
			error = 'There must be as many initial guess parameters as there are unknowns';
		} else {
			observedData = (body.editManually && body.observedData) ? body.observedData : defaultObservedData(y, initialGuess);
			optimizedParams = runOptimization(y, observedData, initialGuess);
			fit = observedData.map( (point) => [point[0], y(point[0], ...optimizedParams)]);
			res.writeHead(200, { 'Content-Type': 'text/html '});
		}

		res.end(template(error, fit, optimizedParams, targetFunctionString, initialGuess, observedData, body.editManually));
	});
};
