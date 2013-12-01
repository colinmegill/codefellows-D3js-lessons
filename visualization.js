var dataset = [];                         //Initialize empty array
for (var i = 0; i < 25; i++) {            //Loop 25 times
    var newNumber = Math.floor(Math.random() * 20);   //New random number (0-30)
    dataset.push(newNumber);              //Add new number to array
}

//define width and height
var w = 1000;
var h = 200;

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
			return d;
		})
		.attr("cy", function(d, i){
			return h/2;
		})
		.attr("cx", function(d, i){
			return (i * 50) + 25;
		})
		.attr("fill", "yellow")
		.attr("stroke", "orange")
		.attr("stroke-width", function(d, i){
			return d/4;
		})







