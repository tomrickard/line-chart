module.exports = {
	entry: './lib/index.js',
	output: {
		path: './dist',
		filename: 'line-chart.js',
		libraryTarget: "var",
		library: "lineChart"
	},
    externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        "d3": "d3"
    }
};