# Nelder Mead Optimization

## Synopsis

The Nelder Mead algorithm is an optimization algorithm that can be abstracted to any number of unknowns.  This implementation of the algorithm allows for the minimization of any function with any number of unknowns.  This has wide applicability for finding solutions to many problems.

## Demo
One of the more powerful applications of Nelder Mead is for curve fitting. Least squares fit is a minimization problem that can be applied to any function.  In this type of problem, you have a set of observed data points that you want to fit a target function to. As an example, let's say you have a set of data that is roughly quadratic- the target function is: a*x<sup>2</sup> + b*x + c.  In this case, there are 3 unknowns that need to be optimized: a, b, and c.  The demo below allows the input of a JavaScript function to define the target function, as well as an initial guess at the unknowns and input data points.

Click [here](https://wt-9bc133544eb89ca066585804e6ac28c2-0.run.webtask.io/multivariate_nelder_mead_optimization) for a demonstration of Nelder Mead curve fitting.

## Author

Keith Robertson