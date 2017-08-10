'use strict';

import { expect } from 'chai';
import { NelderMead } from '../src/nelder_mead';

describe('Test the NelderMead class', () => {
	it('should fail to create a NelderMead', () => {
		expect(() => new NelderMead()).to.throw();
		expect(() => new NelderMead(12)).to.throw();
	});
	it('should create a NelderMead', () => {
		let initialGuess = [100, 50, 25];
		let nm = new NelderMead(initialGuess, (point) => point.reduce( (sum, value) => sum + value, 0 ));
		expect(nm.vertices.length).to.be.equal(initialGuess.length + 1);
		initialGuess.map( (v, idx) => {
			expect(nm.getNthPointValue(idx)).to.be.at.most(nm.getNthPointValue(idx + 1));
		});
	});
	it('should get the best centroid', () => {
		let initialGuess = [0, 1, 2];
		let nm = new NelderMead(initialGuess, (point) => point.reduce( (sum, value) => sum + value, 0 ));
		expect(nm.getBestCentroid()).to.be.eql([0.5, 1, 2]);
	});
	it('should transform', () => {
		let nm = new NelderMead([0, 0], (point) => point.reduce( (sum, value, idx) => sum + (idx + 1) * Math.abs(value), 0 ));
		// reflecting the worst point makes it better than the second worst, but is still worse than the best
		nm.vertices = [
			[0, 0],
			[10, 4],
			[5, 7]
		];
		expect(nm.transform(nm.getBestCentroid())).to.be.eql(['reflect']);
		// reflecting the worst point made it better than the best point- expand
		nm.vertices = [
			[1, 10],
			[4, 10],
			[3, 15]
		];
		expect(nm.transform(nm.getBestCentroid())).to.be.eql(['reflect', 'expand']);
		// reflection makes it worse
		nm.vertices = [
			[0, 0],
			[0, 6],
			[12, 1]
		];
		expect(nm.transform(nm.getBestCentroid())).to.be.eql(['contract']);
	});
	it('should optimize abs minimum to origin in all dimensions', () => {
		let p = [3];
		for(let i = 1; i < 5; i++) {
			p.push(3);
			let nm = new NelderMead(p, (point) => point.reduce( (sum, value) => sum + Math.abs(value), 0 ));
			nm.iterateNTimes(1000);
			expect(nm.getNthPointValue(0)).to.be.at.most(1);
		}
	});
	it('should optimize rosenbrock banana function minimum to aprox (1, 1)', () => {
		let nm = new NelderMead([2, 2], (point) => Math.pow(1 - point[0], 2) + 100 * Math.pow(point[1] - Math.pow(point[0], 2), 2));
		nm.iterateNTimes(1000);
		expect(nm.getNthPointValue(0)).to.be.at.most(0.1);
	});
	it('should fit the linear regression (y = mx + b) to y = x', () => {
		let y = (x, m, b) => m * x + b;
		let randomData = [...Array(50).keys()].map( (x) => {
			let trueVal = y(x, 1, 0);
			let noise = (Math.random() - 0.5) * 0.1;
			return [x, trueVal + trueVal * noise];
		});

		let minimization = (params) => {
			return randomData.reduce( (errorSum, point) => {
				return errorSum + Math.pow(y(point[0], params[0], params[1]) - point[1], 2);
			}, 0);
		};

		let nm = new NelderMead([2, 2], minimization);
		nm.iterateNTimes(1000);
		expect(nm.getNthPointValue(0)).to.be.at.most(50);
	});
	it('should fit the quadratic regression (y = ax^2 + bx + c) to y = 3x^2 + 6x + 7', () => {
		let y = (x, a, b, c) => a * Math.pow(x, 2) + b * x + c;
		let randomData = [...Array(50).keys()].map( (x) => {
			let trueVal = y(x, 3, 6, 7);
			let noise = (Math.random() - 0.5) * 0.1;
			return [x, trueVal + trueVal * noise];
		});

		let minimization = (params) => {
			return randomData.reduce( (errorSum, point) => {
				return errorSum + Math.pow(y(point[0], ...params) - point[1], 2);
			}, 0);
		};

		let nm = new NelderMead([2, 2, 2], minimization);
		nm.iterateNTimes(5000);
		expect(nm.getNthPointValue(0)).to.be.at.most(800000);
	});
});
