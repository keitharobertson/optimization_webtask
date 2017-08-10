'use strict';
import { Vertex } from './vertex';

// define the nelder mead process
// this could be abstracted to handling arbitrary functions with arbitrary number
// of variables, but it is more readable for this example if explicitly using 2
export class NelderMead {
	constructor(initialGuess, valueFunction) {
		if( !Array.isArray(initialGuess) || initialGuess.length < 1) {
			throw new Error('First argument to NelderMead must be an array of the initial guess');
		}
		this.valueFunction = valueFunction;

		this.vertices = [].concat(
			[initialGuess],
			initialGuess.map( (component, idx) => {
				let guessVertex = Array.from(initialGuess);
				guessVertex[idx] = (component * 2) + 1;
				return guessVertex;
			})
		);
		this.worstVertex = new Vertex();
	}
	set vertices(verts) {
		this._vertices = verts.map( (v) => new Vertex(v, this.valueFunction));
		this.order();
	}
	get vertices() {
		return this._vertices;
	}
	getNthPoint(n) {
		return this.vertices[n].point;
	}
	getNthPointValue(n) {
		return this.vertices[n].value;
	}
	// order the vertices by value
	order() {
		this.vertices.sort( (a, b) => a.value > b.value );
	}
	// get the centroid between the best two points
	getBestCentroid() {
		return this.vertices[0].point.map( (component, idx) => {
			return (component + this.vertices[1].point[idx]) / 2;
		});
	}
	// following the Nelder Mead algorithm logic laid out here:
	// http://www.scholarpedia.org/article/Nelder-Mead_algorithm#Simplex_transformation_algorithm
	transform(centroid) {
		let best = this.vertices[0];
		let worst = this.vertices[this.vertices.length - 1];
		let secondWorst = this.vertices[this.vertices.length - 2];
		// save away the worst vertex before transforming
		this.worstVertex.copy(worst);
		//a) reflect the worst vertex over the centroid
		var completed_operations = ['reflect'];
		worst.reflect(centroid);
		if(best.value <= worst.value && worst.value < secondWorst.value){
			// reflected point is better than second worst but not better than the best vertex.
			// this iteration is done.
			return completed_operations;
		} else if(worst.value < best.value) {
			// b) expand if value_reflected < value_best
			// the reflected point is better than the previously best point. Need to expand.
			completed_operations.push('expand');
			worst.expand(centroid);
		} else if(worst.value > secondWorst.value) {
			// c) contract if z_reflected > z_second_worst
			// the reflected point is worse than the second worse still. Need to contract.
			completed_operations.push('contract');
			if(worst.value >= this.worstVertex.value) {
				// undo the reflection
				worst.copy(this.worstVertex);
				if(completed_operations.indexOf('reflect') > -1) {
					completed_operations.splice(completed_operations.indexOf('reflect'), 1);
				}
			}
			var value_before_contract = worst.value;
			worst.contract(centroid);
			if(worst.value >= value_before_contract) {
				//d) shrink
				// undo the reflect
				if(completed_operations.indexOf('reflect') > -1) {
					completed_operations.splice(completed_operations.indexOf('reflect'), 1);
				}
				completed_operations.push('shrink');
				worst.copy(this.worstVertex);
				secondWorst.shrink(best.point);
				worst.shrink(best.point);
			}
		}
		return completed_operations;
	}
	iterate() {
		// 2. centroid
		let c = this.getBestCentroid();
		// 3. transform
		this.transform(c);
		// 1. order (initially ordered by constructor)
		// moved to last so printing out will always print the best vertex
		this.order();
	}
	iterateNTimes(n) {
		for(let i = 0; i < n; i++) {
			this.iterate();
		}
	}
}
