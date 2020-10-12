google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawHistogram);

// function to draw all charts together
function drawCharts()
{
	try
	{
		drawHistogram();
	}
	catch (error)
	{
		console.log(error);
	}
}

function drawHistogram()
{
      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'Degree Count');
	  
	  var values = fg.degree_histogram();
      data.addRows(values);

      var options = {
		pointSize: 6,
		pointShape: 'circle',
		colors: ['#757575'],
        hAxis: {
          title: 'Degree'
        },
        vAxis: {
          title: 'Count'
        }
      };

      var chart = new google.visualization.ColumnChart(document.getElementById('histogramGraph'));

      chart.draw(data, options);
}
