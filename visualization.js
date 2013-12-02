//http://api.nytimes.com/svc/search/v2/articlesearch.json?q=israel+iran&fq=source:("The New York Times")&api-key=f25c99da2f24daefca165f7a452d05ec:1:35029882

var keywordsArray = []
var templateVector = []

for (ii=0; ii<10; ii++) {
	$.ajax({
		url: "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=israel+iran&fq=source:(%22The%20New%20York%20Times%22)&page="+ii+"&api-key=f25c99da2f24daefca165f7a452d05ec:1:35029882"
	}).done(processDocs)
}



		

function vectorizeStory (doc) {

	var initialVector = []

	doc.keywords.forEach(function(keyword){
		
	})

	return vector;

}

function addToMasterKeywordsArray (doc) {
	doc.keywords.forEach(function(keyword){
		keywordsArray.push(keyword.value)
	})
}

function createTemplateVectorMap (keywordsArray) {

}

function processDocs (data) {

	//let's see what we get back...
	console.dir(data)

	//for each times story we get back... add each story's keywords to the master array
	data.response.docs.forEach(addToMasterKeywordsArray)

	//sort and unique, faster algo if sorted and we are sorting it, so pass true
	//produce template vector
	createTemplateVectorMap(_.uniq(keywordsArray.sort(), true))

	//turn keyword list into vector ['iran', 'israel'] => [0, 1] etc.
	data.response.docs.forEach(vectorizeStory)

	

}



//DONE sort keywords array
//DONE uniq sorted array
// de facto at which position each keyword belongs... index 50 is 'iran'... each time take in a story... 
// when want to make [1,0]... make an empty vector full of zeros... make a map out of it too... 
// make an object that would be a map... keywords[currentWord] = indexposition
// index of 1s and 0s... 
// when training... pass in... array of vectors that am creating... training case is the classifcation value
// when classifcation ... ... vector is the target vector... array of those 
// transform vectors into format that they want - just so happens that the input and output are the same 
// after i've trained it, go through them one at a time and check the hidden layer. 
// that's the x y position!!!!!





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
		.data([1,2,3,10,40])
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







