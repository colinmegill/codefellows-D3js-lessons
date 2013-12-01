var dataset = [];                         //Initialize empty array
for (var i = 0; i < 400; i++) {            //Loop 25 times
    var newNumber = Math.random() * 600;   //New random number (0-30)
    dataset.push(newNumber);              //Add new number to array
}

//define width and height
var w = 1000;
var h = 200;

var rScale = d3.scale.linear()
                     .domain([0, d3.max(dataset, function(d) { return d; })])
                     .range([0, h/8]);

var xScale = d3.scale.linear()
											.domain([0, d3.max(dataset, function(d){ return d; })])
											.range([0, w-40]);

var xAxis = d3.svg.axis()
									.scale(xScale)
									.orient("bottom")


//First, we need to create the SVG element in which to place all our shapes:
var svg = d3.select("body")
						.append("svg")
						.attr("width", w)
						.attr("height", h)
						.attr("border", "1px solid black")

svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("r", function(d, i){
			return rScale(d);
		})
		.attr("cy", function(d, i){
			return h/2;
		})
		.attr("cx", function(d, i){
			return xScale(d);
		})
		.attr("stroke", "blue")
		.attr("fill", "none")

//axis
svg.append("g")
		.attr("class", "axis")
		.call(xAxis)

		







