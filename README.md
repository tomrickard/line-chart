# Line-Chart

A small and simple line charting module. Uses D3 under the hood. Written in Typscript.

## Install

```
npm install @tomrickard/line-chart

// or just grab it directly
<script type="text/javascript" src="thomasrickard.uk/bundles/line-chart-v1.js"></script>
```

If using NPM:

### Vanilla JS

```
<script type="text/javascript" src="node_modules/line-chart/dist/line-chart.js"></script>
var lineChart = lineChart()
lineChart.chart(dom_selection)
...
```

### Node/CommonJS

```
var lineChart = require('line-chart')
lineChart.chart(dom_selection)
...
```

### Typescript

Type definitions are included and should be found automatically by the typescript compiler

```
import * as lineChart from 'line-chart' 
lineChart.chart(dom_selection)
...

// or
import { chart } from 'line-chart'
chart(dom_selection)
...
```

## Quick Example

## Usage

## Styling

The chart will automatically expand to fill the container it is placed in. The ratio setter/getter controls the aspect ratio of the chart. The default is 4:3. 

## NPM scripts

## Importing other NPM modules


## Modifying

```
git clone 
```


# License

MIT