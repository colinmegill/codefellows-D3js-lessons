var dataset = [];                         //Initialize empty array
for (var i = 0; i < 50; i++) {            //Loop 25 times
    var newNumber = Math.floor(Math.random() * 50);   //New random number (0-30)
    dataset.push(newNumber);              //Add new number to array
}

//define width and height
var w = 1000;
var h = 300;
var barPadding = 1;

//First, we need to create the SVG element in which to place all our shapes:
var svg = d3.select("body")
						.append("svg")
						.attr("width", w)
						.attr("height", h)
						.attr("border", "1px solid black")

svg.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
		.attr({
			x: function(d,i){ return i * (w / dataset.length) },
			y: function(d,i){ return h - d },
			width: function(d,i){ return w / dataset.length - barPadding },
			height: function(d,i){ return d },
			fill: function(d,i){return "rgb(0,0,"+ (d*10) +")"},
			stroke: "white",
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





