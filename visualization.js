//http://api.nytimes.com/svc/search/v2/articlesearch.json?q=israel+iran&fq=source:("The New York Times")&api-key=f25c99da2f24daefca165f7a452d05ec:1:35029882

var storiesToRequest = 10;

for (ii=0; ii < storiesToRequest; ii++) {
	$.ajax({
		url: "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=israel+iran&fq=source:(%22The%20New%20York%20Times%22)&page="+ii+"&api-key=f25c99da2f24daefca165f7a452d05ec:1:35029882"
	}).done(initializeNeuralNetwork)
}

function addToMasterKeywordsArray (doc) {

	console.log('adding keys to master list...')

	doc.keywords.forEach(function(keyword){
		keywordsArray.push(keyword.value)
	})

	console.log('the master list now has ' + keywordsArray.length + ' elements in it.')

}

function createTemplateVectorMap (keywordsArray) {
	
	console.log('creating templateVectorMap...')

	_.each(keywordsArray, function(keyword, indexposition){
		templateVectorMap[keyword] = indexposition;
	})

	console.dir('created templateVectorMap: ' + templateVectorMap)

}

function vectorizeStory (doc) {

	//we push arrays onto the trainingData array
	var vector = []

	doc.keywords.forEach(function(keyword){
	

		trainingData.push(vector)
	})


}




function processDocs (data) {

	var keywordsArray = [];
	var templateVectorMap = {};
	var trainingData = [];


	//let's see what we get back...
	console.dir(data)

	//for each times story we get back... add each story's keywords to the master array
	data.response.docs.forEach(addToMasterKeywordsArray)

	//sort and unique, faster algo if sorted and we are sorting it, so pass true
	//produce template vector
	createTemplateVectorMap(_.uniq(keywordsArray.sort(), true))

	//turn keyword list into vector ['iran', 'israel'] => [0, 1] etc.
	data.response.docs.forEach(vectorizeStory)

	return {
		templateVectorMap: templateVectorMap,
		trainingData: trainingData
	}

}


function initializeNeuralNetwork (data) {

	var nytimes = processDocs(data)
	var neuralNetwork = new brain.NeuralNetwork({
		hiddenLayers: [2]
	})

	neuralNetwork.train(nytimes.trainingData);

	var coordinates = [] //array of arrays for d3 to scatterplot...
	//must ask mike... believe neuralnetwork.js line 33

}



//DONE sort keywords array
//DONE uniq sorted array
// de facto at which position each keyword belongs... index 50 is 'iran'... each time take in a story... 
// when want to make [1,0]... make an empty vector full of zeros... make a map out of it too... 
//DONE make an object that would be a map... keywords[currentWord] = indexposition
//DONE index of 1s and 0s... 
// when training... pass in... array of vectors that am creating... training case is the classifcation value
// when classifcation ... ... vector is the target vector... array of those 
// transform vectors into format that they want - just so happens that the input and output are the same 
// after i've trained it, go through them one at a time and check the hidden layer. 
// that's the x y position!!!!!





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







