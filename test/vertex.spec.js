'use strict';

import { expect } from 'chai';
import { Vertex } from '../src/vertex';

describe('Test the vetex class', () => {
	it('should create a vertex', () => {
		let v = new Vertex([100, 50, 25], (point) => point.reduce( (sum, value) => sum + value, 0 ));
		expect(v.value).to.be.equal(175);
	});
	it('should copy a vertex', () => {
		let v1 = new Vertex([100, 50, 25], (point) => point.reduce( (sum, value) => sum + value, 0 ));
		let v2 = new Vertex();
		v2.copy(v1);
		expect(v2.value).to.be.equal(175);
		// point array must be copied
		v2.point[0] = 200;
		expect(v2.value).to.be.equal(275);
		expect(v1.value).to.be.equal(175);
	});
	it('should reflect a vertex', () => {
		let v = new Vertex([100, 50, 25], (point) => point.reduce( (sum, value) => sum + value, 0 ));
		// reflect through the origin
		v.reflect([0, 0, 0]);
		expect(v.point).to.be.eql([-100, -50, -25]);
		// reflect through non-equal, non-origin point
		v.reflect([10, 20, 30]);
		expect(v.point).to.be.eql([120, 90, 85]);
		//reflect through itself
		v.reflect([120, 90, 85]);
		expect(v.point).to.be.eql([120, 90, 85]);
	});
	it('should expand a vertex', () => {
		let v = new Vertex([100, 50, 25], (point) => point.reduce( (sum, value) => sum + value, 0 ));
		// expand from the origin
		v.expand([0, 0, 0]);
		expect(v.point).to.be.eql([200, 100, 50]);
		// expand from non-equal, non-origin point
		v.expand([10, 20, 30]);
		expect(v.point).to.be.eql([390, 180, 70]);
		//expand from itself
		v.expand([390, 180, 70]);
		expect(v.point).to.be.eql([390, 180, 70]);
	});
	it('should contract a vertex', () => {
		let v = new Vertex([100, 50, 25], (point) => point.reduce( (sum, value) => sum + value, 0 ));
		// contract towards the origin
		v.contract([0, 0, 0]);
		expect(v.point).to.be.eql([60, 30, 15]);
		// contract towards non-equal, non-origin point
		v.contract([10, 20, 30]);
		expect(v.point).to.be.eql([40, 26, 21]);
		//contract towards itself
		v.contract([40, 26, 21]);
		expect(v.point).to.be.eql([40, 26, 21]);
	});
	it('should shrink a vertex', () => {
		let v = new Vertex([100, 50, 25], (point) => point.reduce( (sum, value) => sum + value, 0 ));
		// shrink towards the origin
		v.shrink([0, 0, 0]);
		expect(v.point).to.be.eql([70, 35, 17.5]);
		// shrink towards non-equal, non-origin point
		v.shrink([10, 20, 30]);
		expect(v.point).to.be.eql([52, 30.5, 21.25]);
		//shrink towards itself
		v.shrink([52, 30.5, 21.25]);
		expect(v.point).to.be.eql([52, 30.5, 21.25]);
	});
	it('should work with any dimension', () => {
		let p = [];
		let value = 0;
		for(let i = 1; i <= 10; i++) {
			p.push(i);
			value += i;
			let v = new Vertex(p, (point) => point.reduce( (sum, value) => sum + value, 0 ));
			expect(v.value).to.be.equal(value);
			v.reflect(p);
			expect(v.value).to.be.equal(value);
			v.expand(p);
			expect(v.value).to.be.equal(value);
			v.contract(p);
			expect(v.value).to.be.equal(value);
			v.shrink(p);
			expect(v.value).to.be.equal(value);
		}
	});
});
