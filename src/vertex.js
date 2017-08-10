// Define a vertex and transformation operations
// this could be easily written to handle arbitrary number of variables,
// but it is more readable for this example using only 2.
export class Vertex {

	static get alpha(){
		return 1;
	}
	static get beta() {
		return 0.6;
	}
	static get gamma() {
		return 2;
	}
	static get delta() {
		return 0.7;
	}

	constructor(point, valueFunction) {
		this.point = point;
		this.valueFunction = valueFunction;
	}

	get value() {
		return this.valueFunction(this.point);
	}

	copy(v) {
		this.point = Array.from(v.point);
		this.valueFunction = v.valueFunction;
	}

	isEqual(v) {
		if(this.point.length !== v.point.length) {
			return false;
		}
		for(let idx in this.point) {
			if(this.point[idx] !== v.point[idx]) {
				return false;
			}
		}
		return this.value === v.value;
	}

	reflect(centroid) {
		this.point = this.point.map( (component, idx) => {
			return centroid[idx] + Vertex.alpha * (centroid[idx] - component);
		});
	}
	expand(centroid) {
		this.point = this.point.map( (component, idx) => {
			return centroid[idx] + Vertex.gamma * (component - centroid[idx]);
		});
	}
	contract(centroid) {
		this.point = this.point.map( (component, idx) => {
			return centroid[idx] + Vertex.beta * (component - centroid[idx]);
		});
	}
	shrink(bestPoint) {
		this.point = this.point.map( (component, idx) => {
			return bestPoint[idx] + Vertex.delta * (component - bestPoint[idx]);
		});
	}
}
