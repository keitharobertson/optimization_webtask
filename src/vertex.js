// Define a vertex and transformation operations
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
	// copy from another vertex
	copy(v) {
		this.point = Array.from(v.point);
		this.valueFunction = v.valueFunction;
	}
	// reflect through the supplied centroid point
	reflect(centroid) {
		this.point = this.point.map( (component, idx) => {
			return centroid[idx] + Vertex.alpha * (centroid[idx] - component);
		});
	}
	// expand from the supplied centroid point
	expand(centroid) {
		this.point = this.point.map( (component, idx) => {
			return centroid[idx] + Vertex.gamma * (component - centroid[idx]);
		});
	}
	// contract towards teh supplied centroid point
	contract(centroid) {
		this.point = this.point.map( (component, idx) => {
			return centroid[idx] + Vertex.beta * (component - centroid[idx]);
		});
	}
	// shrink towards the supplied best point
	shrink(bestPoint) {
		this.point = this.point.map( (component, idx) => {
			return bestPoint[idx] + Vertex.delta * (component - bestPoint[idx]);
		});
	}
}
