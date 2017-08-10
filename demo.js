'use strict';

// templated html page to serve
export default function(error, fit, optimizedParams, targetFunctionString, initialGuess, observedData, editManually) {
return `
<!DOCTYPE HTML>
<html>
	<head>
		<script type="text/javascript">
			function toggleObservedDataEdit() {
				console.log('toggle observed called');
				document.getElementById('observedData').disabled = !document.getElementById('editManually').checked;
			}
			window.onload = function () {
				toggleObservedDataEdit();
				var chart = new CanvasJS.Chart('chartContainer', 
					{
						title: {
							text: 'Multivariate Least Squares Fit Using Nelder Mead'
						},
						data: [
							{
								type: "line",
								markerType: "none",
								dataPoints: ${ JSON.stringify(fit.map( ( point ) => ({x: point[0], y: point[1]}))) }
							}, {
								type: "scatter",
								dataPoints: ${ JSON.stringify(observedData.map( ( point ) => ({x: point[0], y: point[1]}))) }
							}
						]
					}
				);
				chart.render();
			}
		</script>
		<script type="text/javascript" src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
	</head>
	<body>
		<div id="chartContainer" style="height: 300px; width: 100%;"></div><br />
		<b>Optimized parameters: ${optimizedParams.join(', ')}</b><br />
		<div style='color:red'>${error}</div><br />
		<form action='/node_dev' method='POST'>
			Target Function:<br />
			<textarea rows="5" cols="60" name='targetFunction'>${targetFunctionString}</textarea><br />
			initial Guess:<br />
			<textarea rows="4" cols="60" name='initialGuess'>${initialGuess.join(', ')}</textarea><br />
			Data to Fit (<input type="checkbox" onClick="toggleObservedDataEdit()" name="editManually" id="editManually" ${editManually ? 'checked' : ''}/>Edit Manually):<br />
			<textarea rows="15" cols="60" name='observedData' id='observedData'>${observedData.map( (point) => point.join(', ')).join('\n')}</textarea><br />
			<input type='submit' />
		</form>
	</body>
</html>`;
}
