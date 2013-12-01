var dataset = [
                  [ 5,     20 ],
                  [ 480,   90 ],
                  [ 250,   50 ],
                  [ 100,   33 ],
                  [ 330,   95 ],
                  [ 410,   12 ],
                  [ 475,   44 ],
                  [ 25,    67 ],
                  [ 85,    21 ],
                  [ 220,   88 ]
              ];

//define width and height
var w = 1000;
var h = 400;

//First, we need to create the SVG element in which to place all our shapes:
var svg = d3.select("body")
						.append("svg")
						.attr({
							"width": w,
							"height": h
						})


svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr({
			cx: function(d,i){ return d[0] },
			cy: function(d,i){ return d[1] },
			r: 5,
			stroke: "black",
			"stroke-width": 1
		})


svg.selectAll("text")
  	.data(dataset)
  	.enter()
  	.append("text")
  	.text(function(d,i){ return d })
  	.attr({
  		x: function(d,i){ return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2; }, 
  		y: function(d,i){ return (h-d) + 15 },
  		"font-family": "san serif",
  		"font-size": "11px",
  		"fill": "white",
  		"text-anchor": "middle"
  	})










