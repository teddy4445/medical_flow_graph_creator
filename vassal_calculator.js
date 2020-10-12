var model_standard_size = Math.pow(10, -12);

class VassalCalculator
{
	constructor()
	{
		
	}
	
	/*
	diameter (mm)
	distensibility (mm)
	*/
	static tranform(diameter, distensibility)
	{
		var a = -0.31736084;
		var b = 0.26632368;
		var c = -0.70771979;
		var d = -0.24984539;
		var x = diameter;
		var y  = distensibility;
		var answer = a * x + b * x * x + c + y + d * y * y;
		if (answer < 0)
		{
			answer = 0.01;
		}
		return answer;
	}
	
	/*
	Code python to calculate this function:
	
	def func(X, a, b, c, d):
		x, y = X
		return a * x + b * x * x + c + y + d * y * y

	if __name__ == '__main__':
		data = [[1.41, 2.95, 0.15], [0.51, 2.45, 0.15], [0.51, 1.40, 0.11], [0.47, 1.33, 0.09]]
		x = [item[0] for item in data]
		y = [item[1] for item in data]
		z = [item[2] for item in data]
		popt, pcov = curve_fit(func, (x, y), z)
		z = [item[2] for item in data]

		fit_values = [func((x[i], y[i]), popt[0], popt[1], popt[2], popt[3]) for i in range(len(x))]
		[print("func = {}, z = {}".format(fit_values[i], z[i])) for i in range(len(z))]
		r2 = r2_score(numpy.asarray(fit_values), numpy.asarray(z))
		fit_str = "popt = {} | R^2 = {:.3f}".format(popt, r2)
		print(fit_str)
	*/
	
	/*
	length (m)
	diameter (m)
	velocety (m/s)
	*/
	static calc_vassal_count(length, diameter, velocety)
	{
		return velocety * diameter * diameter * length / model_standard_size;
	}
	
	/*
	length (mm)
	diameter (mm)
	distensibility (mm)
	*/
	static calc_vassal_from_table(length, diameter, distensibility)
	{
		return VassalCalculator.calc_vassal_count(length / 1000, diameter / 1000, VassalCalculator.tranform(diameter, distensibility)) + 1;
	}
}