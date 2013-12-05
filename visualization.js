//http://api.nytimes.com/svc/search/v2/articlesearch.json?q=israel+iran&fq=source:("The New York Times")&api-key=f25c99da2f24daefca165f7a452d05ec:1:35029882

var pagesOfStoriesToRequest = 9;
var requestsPromises = [];
var keywordsArray = [];
var uniqueKeywordsArray;
var templateVectorMap = {};
var featureVectorsRaw = [];
var coordinates = []; //array of arrays for d3 to scatterplot...

$(document).ready(function(){
	$('#timesApiSearch').submit(function(e){
		event.preventDefault();
					console.log('ready')

		var rawUserInput = $('#timesApiSearchInput').val()
		$('#timesApiSearchInput').val('')
		var whiteSpaceToPlus = rawUserInput.replace(/ /g, '+');
		makeAPIcall(whiteSpaceToPlus)
	})
})

function makeAPIcall(searchKeys){
	for (ii=0; ii < pagesOfStoriesToRequest; ii++) {
		requestsPromises.push(
			$.ajax({
				url: "http://api.nytimes.com/svc/search/v2/articlesearch.json?q="+searchKeys+"&fq=source:(%22The%20New%20York%20Times%22)&page="+ii+"&api-key=f25c99da2f24daefca165f7a452d05ec:1:35029882"
			})
		)
	}

	$.when.apply($, requestsPromises).then(function() { 

	var arrayOfResponseObjects = []

	_.each(arguments, function(arg){
		arrayOfResponseObjects.push(arg[0].response.docs)
	});

	var nyt = _.flatten(arrayOfResponseObjects)

	initializeNeuralNetwork(nyt)

	})


}



function addToMasterKeywordsArray (doc) {

	doc.keywords.forEach(function(keyword){
		keywordsArray.push(keyword.value)
	})

}

function createTemplateVectorMap () {

	_.each(uniqueKeywordsArray, function(keyword, indexposition){
		templateVectorMap[keyword] = indexposition;
	})

}

function vectorizeStory (doc) {

	var vector = [] //we push arrays onto the trainingData array

	_.each(templateVectorMap, function(){
		vector.push(0)
	}) //push a zero onto vector for each key


	_.each(doc.keywords, function(keywordObj){
		var indexPos = templateVectorMap[keywordObj.value]
		vector[indexPos] = 1;
	}) //get the position in templateVectorMap and set that position in the vector to 1 

	featureVectorsRaw.push(vector)

}

function processDocs (data) {

	//let's see what we get back...
	console.log('- - - - - - - - - - processing response data - - - - - - - - - - ')
	console.dir(data)
	window.allResponses = data;

	//for each times story we get back... add each story's keywords to the master array
	data.forEach(addToMasterKeywordsArray)
	console.log('the raw master keyword list now has ' + keywordsArray.length + ' elements in it.')

	//sort and unique, faster algo if sorted and we are sorting it, so pass true
	//produce template vector
	uniqueKeywordsArray = _.uniq(keywordsArray.sort(), true)
	console.log('the uniqd master keyword list now has ' + uniqueKeywordsArray.length + ' elements in it.')


	createTemplateVectorMap();
	console.log('- - - - - - - - - - index position of keywords map - - - - - - - - - - ')
	console.dir(templateVectorMap)

	//turn keyword list into vector ['iran', 'israel'] => [0, 1] etc.
	data.forEach(vectorizeStory)

	//transmute arrays into [{input: array, output: array}]
	var finalTrainingData = _.map(featureVectorsRaw, function(vector){
		return {input: vector, output: vector} // because it's an autoencoder, input and output are the same.
	})																			 // we are instead interested in the hidden layer

	return finalTrainingData;

}

function initializeNeuralNetwork (data) {

	var nytimes = processDocs(data)

	window.neuralNetwork = new brain.NeuralNetwork({
		hiddenLayers: [2]
	})

		document.write(allResponses)


	console.log('- - - - - - - - - - neural network  - - - - - - - - - -')
	console.dir(neuralNetwork)
	console.log('- - - - - - - - - - input === output autoencoder feature vectors - - - - - - - - - -')
	console.dir(nytimes)
	console.log('- - - - - - - - - - commencing training - - - - - - - -')
	neuralNetwork.train(nytimes, {
		errorThresh: 0.004,
		learningRate: 0.3,
		iterations: 4001,
		log: true,
		logPeriod: 1000
	});

	console.log('- - - - - - - - - - training complete, running real data - - - - - - - - - - -')

	var runDataSigmoid = []
	var runDataLinear = []

	_.each(featureVectorsRaw, function(storyAsVector, i){
			run = neuralNetwork.run(storyAsVector)
			runDataSigmoid.push(neuralNetwork.outputs[1].slice(0)) // this line... ask colin.
	})

	_.each(featureVectorsRaw, function(storyAsVector, i){
			runLinear = neuralNetwork.runLinear(storyAsVector)
			runDataLinear.push(neuralNetwork.outputs[1].slice(0)) // this line... ask colin.
	})

	console.log('The run was successful. Here are the values of the hidden layer for each run: ')
	console.dir(runDataSigmoid)
	console.dir(runDataLinear)

	console.log('- - - - - - - - - - visualizing... - - - - - - - - - - -')

	visualization(runDataLinear);

}





//DONE sort keywords array
//DONE uniq sorted array
//DONE de facto at which position each keyword belongs... index 50 is 'iran'... each time take in a story... 
//DONE when want to make [1,0]... make an empty vector full of zeros... make a map out of it too... 
//DONE make an object that would be a map... keywords[currentWord] = indexposition
//DONE index of 1s and 0s... 
//DONE when training... pass in... array of vectors that am creating... training case is the classifcation value
// when classifcation ... ... vector is the target vector... array of those 
// transform vectors into format that they want - just so happens that the input and output are the same 
// after i've trained it, go through them one at a time and check the two nodes of the hidden layer. 
// that's the x y position!



function visualization (dataset){

//define width and height
var w = 600;
var h = 600;

var xScale = d3.scale.linear()
											.domain([d3.min(dataset, function(d){ return d[0];}), d3.max(dataset, function(d){ return d[0]; })])
											.range([40, w-40]);

var yScale = d3.scale.linear()
											.domain([d3.min(dataset, function(d){ return d[1];}), d3.max(dataset, function(d){ return d[1];})])
											.range([40, h-40])

var tip = d3.tip()
  					.attr('class', 'd3-tip')
  					.html(function(d, i) { return allResponses[i].headline.main; })


//First, we need to create the SVG element in which to place all our shapes:
var svg = d3.select("body")
						.append("svg")
						.attr({
							"width": w,
							"height": h
						})
						.call(tip)


svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr({
			cx: function(d,i){ return xScale(d[0]) },
			cy: function(d,i){ return yScale(d[1]) },
			fill: "white",
			stroke: "#2980b9",
			// fill: function(d,i) { 
			// 	value = "rgb(" + (i*2) + ", 0 , " + (250-(i*2)) + ")";
			// 	return value;
			// },

/*
a few steps needed here. we can still use the index of d, i in the lambda. that is good.

1. sort the article indexes by date using their boolean
2. create a map of these new indexes, as in, var dateIndexForColors = { 37: 0, 42: 1, 14: 2 }
3. check 


function mergeSort(array) {
    // Recursion base case
    if(array.length < 2)
        return array;

    // Split array into two equal sized chunks
    var mid = Math.floor(array.length / 2),
        left = array.slice(0, mid),
        right = array.slice(mid);

    // Sort each chunk using merge sort
    var leftSorted = mergeSort(left),
        rightSorted = mergeSort(right);

    // Combine the chucks back into a single array and return it
    var sortedResult = [];
    while(leftSorted.length > 0 || rightSorted.length > 0) {
        if(leftSorted.length == 0) {
            Array.prototype.splice.apply(sortedResult, [sortedResult.length, 0].concat(rightSorted));
            break;
        } else if(rightSorted.length == 0) {
            console.log(sortedResult);
            Array.prototype.splice.apply(sortedResult, [sortedResult.length, 0].concat(leftSorted));
            break;
        } else {
            var elem = (leftSorted[0] < rightSorted[0]) ? leftSorted.shift() : rightSorted.shift();
            sortedResult.push(elem);
        }
    }
    
    return sortedResult;   
}

*/
			r: 4,
		})
		.on('mouseover', tip.show)
  	.on('mouseout', tip.hide)
  	.on('click', function(d,i){ window.open(allResponses[i].web_url) })











}
