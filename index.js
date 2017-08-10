'use latest';
import { Vertex } from './src/vertex';

module.exports = function(cb) {
	let v = new Vertex([100, 50, 25], (point) => point.reduce( (sum, value) => sum + value, 0 ));
	cb(null, v.value);
};
