var height = document.getElementById('main-wrapper').offsetHeight;
var width = document.getElementById('main-wrapper').offsetWidth;
var cloudArray = [];
var cloudCount = 5;
var gameVelocity = 150;
var movementCriteria = 50;
var distanceCriteria = 50;
var score = 0;
var flag = 0;
var warningCounter = 5;
var typedWord = "";


window.onload = function() {	
	window.addEventListener('keydown', getKeys);
	window.addEventListener('keypressed', getKeys);
}

function wordCloud() {
	this.x = 0;
	this.y = 0;
	this.pixelMovement = 10;
	this.text;
	this.element;

	this.init = function() {
		this.element = document.createElement('div');
		this.element.setAttribute('class', 'cloud');
		this.element.style.top = this.y + 'px';
		this.element.style.left = this.x + 'px';
		this.element.innerHTML = randomWords();
		this.text = this.element.innerHTML;
		document.getElementById('main-wrapper').appendChild(this.element);
	}

	this.redraw = function() {
		this.element.style.top = this.y + 'px';
		this.element.style.left = this.x + 'px';
	}
}

function createCloud() {
	var cloud = new wordCloud();
	cloud.x = getRandom(0, width - 70);
	cloud.y = 0;
	cloud.crossedFlag = 0;
	cloud.pixelMovement = getRandom(5,10);
	cloud.init();
	return cloud;
}

function gameStart() {
	cloudArray = [];
	for(var i=0; i < cloudCount; i++){
		var newCloud = createCloud();
		cloudArray.push(newCloud);
	}

	animationStart = setInterval(dropClouds, gameVelocity);
}

function clearDivs(){
	//Clearing the divs
	while ( document.getElementById('main-wrapper').firstChild ) {
		document.getElementById('main-wrapper').removeChild(document.getElementById('main-wrapper').firstChild );
	}
}

function checkOverlap(){
	for(var i = 0; i < cloudArray.length; i++){
		for(j = i+1; j<cloudArray.length; j++){
			if(cloudArray[i].y== 0 && cloudArray[j].y == 0){
				cloudDistance = getCloudDistance(cloudArray[i], cloudArray[j]);
				if(cloudDistance <= distanceCriteria){
					console.log("overlapped");
					clearInterval(animationStart);//Clear the interval first
					clearDivs();
					gameStart();//Restart the process
				}
			}
		}
	}

}

function dropClouds() {
	checkOverlap();

	if(score == 20) {
		gameVelocity = 100;
	}

	// console.log("After hitting ", cloudArray.length);
	for(var i = 0; i < cloudArray.length; i++) {
		cloudArray[i].y += cloudArray[i].pixelMovement;

		if(cloudArray[i].y > height){//checking if the obstacle has crossed the container or not
			cloudArray[i].x = getRandom(0, width);
			cloudArray[i].y = 0;
			cloudArray[i].pixelMovement = getRandom(5,10);
			cloudArray[i].init();
			warningCounter--;
			document.getElementById('warning').innerHTML = warningCounter;
			
		}

		if(warningCounter == 0 ){
			console.log("Game over");
			document.getElementById('over').innerHTML = "GAME OVER!!";
			clearInterval(animationStart);
		}

		cloudArray[i].redraw();
	}
}

gameStart();


function restart() {
	typedWord = "";
	document.getElementById('type').innerHTML = "";
	gameVelocity = 150;
	warningCounter = 5;
	document.getElementById('warning').innerHTML = warningCounter;
	score = 0;
	document.getElementById('over').innerHTML = "";
	clearDivs();
	clearInterval(animationStart);
	gameStart();
}

//Key events
function getKeys(e) {
	e.preventDefault();
	if(e.keyCode == 13){
		for(var i = 0; i < cloudArray.length; i++) {
			console.log(cloudArray);		
			if( typedWord == cloudArray[i].text) {
				console.log("Reached here", cloudArray[i].text);
				changeToExplode(cloudArray[i]);
				(function(div){
					setTimeout(function() {
						document.getElementById('main-wrapper').removeChild(div);
					}, 500);
				})(cloudArray[i].element);
				
				score++;
				document.getElementById('score').innerHTML = score;	
				cloudArray[i].x = getRandom(0, width - 70);
				cloudArray[i].y = 0;
				cloudArray[i].pixelMovement = getRandom(5,10);
				cloudArray[i].text = randomWords();
				cloudArray[i].init();
				cloudArray[i].redraw();
				typedWord = "";
				document.getElementById("type").innerHTML = typedWord;	
			}
		}		
	}
	else if(e.keyCode == 32) {
		typedWord = "";
		document.getElementById("type").innerHTML = typedWord;	
	}
	else if(e.keyCode == 8){//for backspace
		typedWord = typedWord.substring(0, typedWord.length-1);
		document.getElementById("type").innerHTML = typedWord;
		console.log("backspace pressed", typedWord);
	}
	else{
		var userInput = String.fromCharCode(e.keyCode || e.charCode);
		typedWord+= userInput.toLowerCase();
		document.getElementById("type").innerHTML = typedWord;		
		console.log("others pressed", typedWord);
	}
}

function checkOutOfBounds(value) {
	if(parseInt(value) < 0 || parseInt(value) >= width){
		console.log("out of bounds");
		return true;
	}
	return false;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Helper functions
function getRandom(max, min){
	return Math.random() * (max - min) + min;
}

function changeToExplode(div) {
	console.log("Change");
	// div.element.style.border = "none";
	// div.element.innerHTML = "";
	div.element.style.backgroundImage = "url('images/blast.gif')";
	div.element.style.backgroundSize = "contain";
}

function getCloudDistance(obstacle1, obstacle2) {
	obstacle1CenterX = obstacle1.element.offsetLeft + obstacle1.element.offsetWidth/2;
	obstacle1CenterY = obstacle1.element.offsetTop + obstacle1.element.offsetHeight/2;	
	obstacle2CenterX = obstacle2.element.offsetLeft + obstacle2.element.offsetWidth/2;
	obstacle2CenterY = obstacle2.element.offsetTop + obstacle2.element.offsetHeight/2;
	var distance = Math.sqrt(
		Math.abs(obstacle1CenterY - obstacle2CenterY) * Math.abs(obstacle1CenterY - obstacle2CenterY) 
		+ Math.abs(obstacle1CenterX - obstacle2CenterX) * Math.abs(obstacle1CenterX - obstacle2CenterX) 
		);
	return distance;

}

function randomWords() {
	var text = "";
	var possible = "abcdefghijklmnopqrstuvwxyz";

	for( var i=0; i < 5; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}