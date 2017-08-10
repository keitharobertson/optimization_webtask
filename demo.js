'use strict';

// templated html page to serve
export default function(error, fit, optimizedParams, rSquared, targetFunctionString, initialGuess, observedData, editManually) {
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
	<body style="font-family: Arial, Helvetica, sans-serif">
		<div id="chartContainer" style="height: 300px; width: 100%;"></div>
		<h3>Optimized parameters: ${optimizedParams.join(', ')}</h3>
		<h5>R<sup>2</sup>: ${rSquared}</h5>
		<div style='color:red'>${error}</div><br />
		<form method='POST'>
			<b>Target Function:</b><br />
			Input the target function in the format<br />
			function(x, param_to_be_optimized_1, param_to_be_optimized_2, ...){ ... }<br />
			<textarea rows="4" cols="60" name='targetFunction'>${targetFunctionString}</textarea><br />
			<b>initial Guess:</b><br />
			Input comma separated initial guesses for each of the optimization parameters<br/>
			for the function above in the same order as they appear in the argument list<br/>
			There must be the same number of initial guesses in this box as there are optmization<br/>
			parameters in the target function.<br/>
			<textarea rows="2" cols="60" name='initialGuess'>${initialGuess.join(', ')}</textarea><br />
			<b>Data to Fit</b> (<input type="checkbox" onClick="toggleObservedDataEdit()" name="editManually" id="editManually" ${editManually ? 'checked' : ''}/>Edit Manually):<br />
			Leave the "Edit Manually" checkbox unchecked to have sample data automatically generated.<br/>
			If you wish to edit the input data manually, check the box.<br/>
			<textarea rows="8" cols="60" name='observedData' id='observedData'>${observedData.map( (point) => point.join(', ')).join('\n')}</textarea><br />
			<input type='submit' />
		</form>
	</body>
</html>`;
}
