import * as d3 from 'd3';

interface LineChart {
	width?: Function;
	height?: Function;
	margins?: Function;
	addSeries?: Function;
	selection?: Function;
	title?: Function;
	xLabel?: Function;
	yLabel?: Function;
	render?: Function;
	update?: Function;
}

var selection = d3.select("body")

// Setting up data series
var data1 = [3,4,5.5,4,8,3,4.5,5,7,2].map(function (y, i) {
  return {x: i, y: y};
});

var data2 = [4,5,6.7,3,7,4,5.5,6,3,3].map(function (y, i) {
  return {x: i, y: y};
})

var data3 = [3,3,6.5,2,8,3,3.5,6,7,3].map(function (y, i) {
  return {x: i, y: y};
});

// How to use lineChart
var linechart = lineChart(selection)
  .addSeries(data1)
  .addSeries(data2)
  .xLabel('X-Axis', function (width, height, margins) {
    return {x:50, y:(height-20)}
  })
  .yLabel('Y-Axis')
  .title('Title')


linechart.render()


//- Implementation -------------------------------------------

function lineChart(selection) {
  // Private variables
  var selection = selection;
  var data = [];
  var all_data = [];
  var colours = d3.schemeCategory10;

  var svg, chart_area;
  var scaleX, scaleY, line;

  var margins = { top: 40, right: 30, bottom: 50, left: 50 };
  var width = 600;
  var height = 400;
  var chart_width, chart_height;

  var title = { text:"" };
  var x_label = { text:"" };
  var y_label = { text:"" };

  // Generates the titles xy position
  title.position = function (width, height, margins) {
    var x_pos = (width)/2;
    var y_pos = margins.top/1.4;
    return {x: x_pos, y: y_pos}
  }

  // Generates the x-axis label position
  x_label.position = function (width, height, margins) {
    var x_pos = (width)/2;
    var y_pos = height - (margins.bottom/5);
    return {x: x_pos, y: y_pos}
  }

  // Generates the y-axis label position
  y_label.position = function (width, height, margins) {
    var x_pos = (-height)/2;
    var y_pos = margins.left/3;
    return {x: x_pos, y: y_pos}
  }

  function scale() {
    all_data = []
    data.forEach(function (series) {
      all_data = all_data.concat(series);
    });

    scaleY = d3.scaleLinear()
      .range([height - margins.top - margins.bottom, 0])
      .domain(d3.extent(all_data, function (d) { return d.y }));

    scaleX = d3.scaleLinear()
      .range([0, width - margins.left - margins.right])
      .domain(d3.extent(all_data, function (d) { return d.x }));
  }

  function renderBody() {
    svg = selection.append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "chart-container")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("viewBox", "0 0 " + (width) + " " + (height))
      .style("background", "#eee")

    chart_area = svg.append("g")
      .attr("class", "chart")
      .attr("transform", "translate(" + margins.left  + "," + margins.top + ")")
  }

  function renderLines() {
    // Create line generator
    line = d3.line()
      .x(function (d) {
        return scaleX(d.x)
      })
      .y(function (d) {
        return scaleY(d.y)
      });

    // Add line for each data series
    chart_area.selectAll("path.line")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", function (d, i) {
        return colours[i];
      })
      .attr("stroke-width", "2");
  }

  function renderPoints() {
    // Render data points using flattened array
    chart_area.selectAll(".datum")
    .data(all_data)
    .enter()
      .append("circle")
        .attr("class", ".datum")
        .attr("cx", function (d, i) {
          return scaleX(d.x);
        })
        .attr("cy", function (d) {
          return scaleY(d.y);
        })
        .attr("r", 3)
        .attr("fill", "#000")
  }

  function renderAxes() {
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(" + margins.left + "," + (height - margins.bottom) + ")")
      .call(d3.axisBottom(scaleX))

    svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
      .call(d3.axisLeft(scaleY))
  }

  function renderLabels() {
    var position
    if (x_label.text) {
      position = x_label.position(width, height, margins);
      svg.append("text")
        .attr("class", "x-label")
        .text(x_label.text)
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + position.x + "," + position.y + ")")
    }

    if (y_label.text) {
      position = y_label.position(width, height, margins);
      svg.append("text")
        .attr("class", "y-label")
        .text(y_label.text)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90) translate(" + position.x + "," + position.y + ")")
    }

    if (title.text) {
      position = title.position(width, height, margins);
      svg.append("text")
        .attr("class", "title")
        .text(title.text)
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + position.x + "," + position.y + ")")
    }
  }

  // Returned object containing public API 
  var _lineChart: LineChart = {};

  // Getter/setter methods for configuring chart
  _lineChart.width = function (w): number | LineChart {
    if (!arguments.length) return width;
    width = w;
    return _lineChart;
  }

  _lineChart.height = function (h): number | LineChart {
    if (!arguments.length) return height;
    height = h;
    return _lineChart;
  }

  _lineChart.margins = function (m): {} | LineChart {
    if (!arguments.length) return margins;
    margins = m;
    return _lineChart;
  }

  _lineChart.addSeries = function (s): LineChart {
    data.push(s);
    return _lineChart;
  }

  _lineChart.selection = function (sel): Element | LineChart {
    if (!arguments.length) return selection;
    selection = sel;
    return _lineChart;
  }

  _lineChart.title = function (text, pos) {
    if (!arguments.length) return title;
    title.text = text;

    if(pos) {
      title.position = pos;
    }
    return _lineChart;
  }

  _lineChart.xLabel = function (text, pos) {
    if (!arguments.length) return x_label;
    x_label.text = text;

    if(pos) {
      x_label.position = pos;
    }
    return _lineChart;
  }

  _lineChart.yLabel = function (text, pos) {
    if (!arguments.length) return y_label;
    y_label.text = text;

    if(pos) {
      y_label.position = pos;
    }
    return _lineChart;
  }

  // Renders the chart to screen
  _lineChart.render = function () {
    if (data.length) {
      scale();
      renderBody();
      renderPoints();
      renderLines();
      renderAxes();
      renderLabels();
    }

  _lineChart.update = function () {
    if (data.length) {
      scale();
      renderPoints();
      renderLines();
      renderAxes();
    }
  }

  }

  return _lineChart;
}

