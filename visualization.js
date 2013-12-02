
//http://api.nytimes.com/svc/search/v2/articlesearch.json?q=israel+iran&fq=source:("The New York Times")&api-key=f25c99da2f24daefca165f7a452d05ec:1:35029882


var keywordsArray = []

for (ii=0; ii<10; ii++) {

	$.ajax({
		url: "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=israel+iran&fq=source:(%22The%20New%20York%20Times%22)&page="+ii+"&api-key=f25c99da2f24daefca165f7a452d05ec:1:35029882"
	}).done(function(data){ 
		data.response.docs.forEach(function(doc){
			doc.keywords.forEach(function(keyword){
				keywordsArray.push(keyword.value)
			})
		})
		console.dir(data)
	})

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







