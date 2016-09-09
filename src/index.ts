import * as d3 from 'd3';

export interface Chart {
  ratio?: Function;
	width?: Function;
	height?: Function;
	margins?: Function;
	addSeries?: Function;
  data?: Function;
	selection?: Function;
	title?: Function;
	xLabel?: Function;
	yLabel?: Function;
	render?: Function;
	update?: Function;
  grid?: Function;
}

export interface Label {
  text?: string;
  position?: Function;
}

//- Implementation -------------------------------------------

function chart(selection, name = 'chart-container') {
  // Private variables
  var selection = selection;
  var data = [];
  var all_data = [];
  var colours = d3.schemeCategory10;
  var grid = false;

  var svg, chart_area, grid_svg;
  var scaleX, scaleY, line;

  var margins = { top: 50, right: 30, bottom: 50, left: 60 };
  var width = 800;
  var height = 600;
  var ratio = [4,3];
  var chart_width, chart_height;

  var title: Label = { text:"" };
  var x_label: Label = { text:"" };
  var y_label: Label = { text:"" };

  var parseTime = d3.timeParse("%d-%b-%y");

  // Generates the titles xy position
  title.position = function (width, height, margins) {
    var x_pos = (width)/2;
    var y_pos = margins.top/1.6;
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

  function renderContainer() {
    svg = selection.append("svg")
      // .attr("width", width)
      // .attr("height", height)
      .attr("class", name)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("viewBox", "0 0 " + (width) + " " + (height))
      .style("background", "#eee")
      .style("font-family", "sans-serif")
  }

  function renderChartArea() {
    chart_area = svg.append("g")
      .attr("class", "chart")
      .attr("transform", "translate(" + margins.left  + "," + margins.top + ")")
  }

  function renderGrid() {
    grid_svg = svg.append("g")
      .attr("class", "grid")
      
    var grid_h = grid_svg.selectAll("line.h-grid")
      .data(scaleY.ticks(10))
      
    grid_h.exit()
      .remove()

    grid_h.enter()
      .append("line")
        .attr("class", "h-grid")
        .attr("fill", "none")
        .attr("stroke", "rgb(200,200,200)")
        .attr("stroke-width", "1px")
      .merge(grid_h)
        .attr("x1", margins.left)
        .attr("x2", width - margins.right)
        .attr("y1", function (d) {
          return scaleY(d) + margins.top + 0.5;
        })
        .attr("y2", function (d) {
          return scaleY(d) + margins.top + 0.5;
        })
          
    var grid_v = grid_svg.selectAll("line.v-grid")
      .data(scaleX.ticks(10))

    grid_v.exit()
      .remove()

    grid_v.enter()
      .append("line")
        .attr("class", "v-grid")
        .attr("fill", "none")
        .attr("stroke", "rgb(200,200,200)")
        .attr("stroke-width", "1px")
      .merge(grid_v)
        .attr("y1", margins.top)
        .attr("y2", height - margins.bottom)
        .attr("x1", function (d) {
          return scaleX(d) + margins.left + 0.5;
        })
        .attr("x2", function (d) {
          return scaleX(d) + margins.left + 0.5;
        })
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
    var chart_lines = chart_area.selectAll("path.line")
      .data(data)

    // console.log(chart_lines)

    chart_lines.exit()
      .remove()

    chart_lines.enter()
      .append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke-width", "2")
      .merge(chart_lines)
        .attr("d", line)
        .attr("stroke", function (d, i) {
          return colours[i];
        })
  }

  function renderPoints() {
    // Render data points using flattened array
    // Update
    var chart_points = chart_area.selectAll("circle.datum")
      .data(all_data, function (d, i) {
        return i;
      })

    console.log(chart_points)
    console.log(all_data)

    // Remove
    chart_points.exit()
      .remove()

    // Enter + Update
    chart_points.enter()
      .append("circle")
        .attr("class", ".datum")
        .attr("r", 3)
        .attr("fill", "#000")
      .merge(chart_points)
        .attr("cx", function (d, i) {
          return scaleX(d.x);
        })
        .attr("cy", function (d) {
          return scaleY(d.y);
        })
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

  function updateAxes() {
    svg.select('g.x-axis')
      .call(d3.axisBottom(scaleX))

    svg.select('g.y-axis')
      .call(d3.axisLeft(scaleY))
  }

  function renderLabels() {
    var position
    if (x_label.text) {
      position = x_label.position(width, height, margins);
      svg.append("text")
        .attr("font-size", 15)
        .attr("class", "x-label")
        .text(x_label.text)
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + position.x + "," + position.y + ")")
    }

    if (y_label.text) {
      position = y_label.position(width, height, margins);
      svg.append("text")
        .attr("font-size", 15)
        .attr("class", "y-label")
        .text(y_label.text)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90) translate(" + position.x + "," + position.y + ")")
    }

    if (title.text) {
      position = title.position(width, height, margins);
      svg.append("text")
        .attr("font-size", 20)
        .attr("class", "title")
        .text(title.text)
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + position.x + "," + position.y + ")")
    }
  }

  // Returned object containing public API 
  var _chart: Chart = {};

  // Getter/setter methods for configuring chart
  _chart.width = function (w): number | Chart {
    if (!arguments.length) return width;
    width = w;
    return _chart;
  }

  _chart.height = function (h): number | Chart {
    if (!arguments.length) return height;
    height = h;
    return _chart;
  }

  _chart.ratio = function (w, h): number | Chart {
    if (arguments.length < 2) return ratio;
    height = (width * h)/w;
    ratio = [w,h];
    return _chart;
  }

  _chart.margins = function (m): {} | Chart {
    if (!arguments.length) return margins;
    for (var property in m) {
        if (m.hasOwnProperty(property)) {
            margins[property] = m[property]; 
        }
    }
    return _chart;
  }

  _chart.addSeries = function (s): Chart {
    data.push(s);
    return _chart;
  }

  _chart.data = function (_data): number[][] | Chart {
    if(!arguments.length) return data;
    data = _data;
    return _chart;
  }

  _chart.selection = function (sel): Element | Chart {
    if (!arguments.length) return selection;
    selection = sel;
    return _chart;
  }

  _chart.title = function (text, pos): string | Chart {
    if (!arguments.length) return title;
    title.text = text;

    if(pos) {
      title.position = pos;
    }
    return _chart;
  }

  _chart.xLabel = function (text, pos): string | Chart {
    if (!arguments.length) return x_label;
    x_label.text = text;

    if(pos) {
      x_label.position = pos;
    }
    return _chart;
  }

  _chart.yLabel = function (text, pos): string | Chart {
    if (!arguments.length) return y_label;
    y_label.text = text;

    if(pos) {
      y_label.position = pos;
    }
    return _chart;
  }

  _chart.grid = function (_grid): boolean | Chart {
    if (!arguments.length) return grid;
    grid = _grid;

    return _chart;
  }



  // Renders the chart to screen
  _chart.render = function (): Chart {
    if (data.length) {
      scale();
      renderContainer();
      if(grid) { renderGrid(); }
      renderChartArea();
      renderLines();
      renderPoints();
      renderAxes();
      renderLabels();
    }
    return _chart;
  }

  _chart.update = function (): Chart{
    if (data.length) {
      scale();
      // if(grid) { renderGrid(); }
      renderLines();
      renderPoints();
      updateAxes();
    }
    return _chart;
  }

  return _chart;
}

export { chart }

