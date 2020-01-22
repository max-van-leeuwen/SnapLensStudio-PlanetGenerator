// Max van Leeuwen
// instagram @max.van.leeuwen
// maxvanleeuwen.com




//@ui {"widget":"label", "label":"Planet Generator by Max van Leeuwen"}
//@ui {"widget":"separator"}
//@ui {"widget":"label"}

//@input bool AnimateForever
//@ui {"widget":"label"}

// non-shader

//@input float PlanetSize = 50
//@input vec3 TotalRotation = {0, 0, 23.5} // Earth tilt is 23.5 degrees

//@input float Moon1Size = 0
//@input float Moon2Size = 2.5
//@input float Moon3Size = 0

//@ui {"widget":"label"}




// surface

//@input vec3 TerrainDeep = {.19, .14, 1} {"widget":"color"}
//@input float TerrainColorScale = 2.5
//@input float TerrainScale = 3
//@input float TerrainSeed = 0
//@input float TerrainColorOffset = 0
//@input vec3 TerrainAverage = {.11, .53, .14} {"widget":"color"}
//@input vec3 TerrainPeaks = {.7, 1, .15} {"widget":"color"}
//@input float TerrainHeight = 4.5
//@ui {"widget":"label"}

//@input float RimExponent = 3
//@input float RimIntensity = 10

//@input float Water = 1




// thin clouds

//@input vec3 CloudColor = {1, 1, 1} {"widget":"color"}
//@input float CloudScale = 1.7
//@input float CloudVariation = .15
//@input float CloudOpacity = 1
//@ui {"widget":"label"}




// moon

//@input vec3 MoonColor1 = {.82, .82, .82} {"widget":"color"}
//@input vec3 MoonColor2 = {.25, .25, .25} {"widget":"color"}
//@input float MoonScale = .5
//@input float MoonOffset = 0
//@ui {"widget":"label"}




// Advanced (get objects)

//@input bool Advanced

//@input SceneObject PlanetSurface {"showIf":"Advanced"}
//@input SceneObject ThinClouds {"showIf":"Advanced"}

//@input SceneObject Moon01 {"showIf":"Advanced"}
//@input SceneObject Moon02 {"showIf":"Advanced"}
//@input SceneObject Moon03 {"showIf":"Advanced"}

//@input SceneObject Moon01Anchor {"showIf":"Advanced"}
//@input SceneObject Moon02Anchor {"showIf":"Advanced"}
//@input SceneObject Moon03Anchor {"showIf":"Advanced"}

//@input float RotateSpeed = .1 {"showIf":"Advanced"}






// length an animation should take
var morph = .7;

// current animation ratio
var ratio = 0;

// check if animating non-stop
var AnimateForever = script.AnimateForever;





// get all shaders
var surface = script.PlanetSurface.getComponent("Component.RenderMeshVisual").getMaterial(0);
var thinclouds = script.ThinClouds.getFirstComponent("Component.RenderMeshVisual").getMaterial(0);
var moon01 = script.Moon01.getFirstComponent("Component.RenderMeshVisual").getMaterial(0);
var moon02 = script.Moon02.getFirstComponent("Component.RenderMeshVisual").getMaterial(0);
var moon03 = script.Moon03.getFirstComponent("Component.RenderMeshVisual").getMaterial(0);

// get transforms
var thisTransf = script.getSceneObject().getTransform();
var thinCloudTransf = script.ThinClouds.getTransform();
var Moon01Transf = script.Moon01Anchor.getTransform();
var Moon02Transf = script.Moon02Anchor.getTransform();
var Moon03Transf = script.Moon03Anchor.getTransform();




// on script load, make variables

var PlanetSize = script.PlanetSize;
var TotalRotation = new vec3( script.TotalRotation.x * Math.PI/180, script.TotalRotation.y * Math.PI/180, script.TotalRotation.z * Math.PI/180 ); // degrees to radians

var Moon1Size = script.Moon1Size;
var Moon2Size = script.Moon2Size;
var Moon3Size = script.Moon3Size;

var TerrainDeep = script.TerrainDeep;
var TerrainColorScale = script.TerrainColorScale;
var TerrainScale = script.TerrainScale;
var TerrainSeed = script.TerrainSeed;
var TerrainColorOffset = script.TerrainColorOffset;
var TerrainAverage = script.TerrainAverage;
var TerrainPeaks = script.TerrainPeaks;
var TerrainHeight = script.TerrainHeight;
var Water = script.Water;

var CloudColor = script.CloudColor;
var CloudScale = script.CloudScale;
var CloudVariation = script.CloudVariation;
var CloudOpacity = script.CloudOpacity;

var MoonColor1 = script.MoonColor1;
var MoonColor2 = script.MoonColor2;
var MoonScale = script.MoonScale;
var MoonOffset = script.MoonOffset;




// placeholders for animation, set start and end to current user input

STARTPlanetSize = PlanetSize;
STARTTotalRotation = TotalRotation;

STARTMoon1Size = Moon1Size;
STARTMoon2Size = Moon2Size;
STARTMoon3Size = Moon3Size;

STARTTerrainDeep = TerrainDeep;
STARTTerrainColorScale = TerrainColorScale;
STARTTerrainScale = TerrainScale;
STARTTerrainSeed = TerrainSeed;
STARTTerrainColorOffset = TerrainColorOffset;
STARTTerrainAverage = TerrainAverage;
STARTTerrainPeaks = TerrainPeaks;
STARTTerrainHeight = TerrainHeight;
STARTWater = Water;

STARTCloudColor = CloudColor;
STARTCloudScale = CloudScale;
STARTCloudVariation = CloudVariation;
STARTCloudOpacity = CloudOpacity;

STARTMoonColor1 = MoonColor1;
STARTMoonColor2 = MoonColor2;
STARTMoonScale = MoonScale;
STARTMoonOffset = MoonOffset;



ENDMoon1Size = Moon1Size;
ENDMoon2Size = Moon2Size;
ENDMoon3Size = Moon3Size;

ENDPlanetSize = PlanetSize;
ENDTotalRotation = TotalRotation;

ENDTerrainDeep = TerrainDeep;
ENDTerrainColorScale = TerrainColorScale;
ENDTerrainScale = TerrainScale;
ENDTerrainSeed = TerrainSeed;
ENDTerrainColorOffset = TerrainColorOffset;
ENDTerrainAverage = TerrainAverage;
ENDTerrainPeaks = TerrainPeaks;
ENDTerrainHeight = TerrainHeight;
ENDWater = Water;

ENDCloudColor = CloudColor;
ENDCloudScale = CloudScale;
ENDCloudVariation = CloudVariation;
ENDCloudOpacity = CloudOpacity;

ENDMoonColor1 = MoonColor1;
ENDMoonColor2 = MoonColor2;
ENDMoonScale = MoonScale;
ENDMoonOffset = MoonOffset;




// set total rotation on start
script.getTransform().setLocalRotation(quat.fromEulerVec( STARTTotalRotation ));








// on update
function EveryFrame (eventData){

	// scroll through morph animation
	ratio += getDeltaTime() * 1/morph;

	// clamp at 1
	if(ratio > 1){

		ratio = 1;


		// or, if AnimateForever, restart
		if(AnimateForever){

			NewRandomParameters();
			ratio = 0;

		}

	}

	// animate
	if(ratio < 1){

		UpdateAll();

	}





	// rotate planet a bit every frame
	RotateABit(thisTransf, Math.PI * getDeltaTime() * script.RotateSpeed);

	// slightly counter-rotate thin clouds, to give it more depth
	RotateABit(thinCloudTransf, -.35 * Math.PI * getDeltaTime() * script.RotateSpeed);

	// rotate moons
	RotateABit(Moon01Transf,  3 * Math.PI * getDeltaTime() * script.RotateSpeed);
	RotateABit(Moon02Transf, .2 * Math.PI * getDeltaTime() * script.RotateSpeed);
	RotateABit(Moon03Transf, .7 * Math.PI * getDeltaTime() * script.RotateSpeed);

}

// bind to update
var EveryFrame_event = script.createEvent("UpdateEvent");
EveryFrame_event.bind(EveryFrame);






// on touch move
var event = script.createEvent("TouchMoveEvent");
event.bind(function(eventData)
{

	// disable buttons
	global.NoButtons = true;

});




// on touch end
var event = script.createEvent("TouchEndEvent");
event.bind(function(eventData)
{

	// re-enable buttons
	global.NoButtons = false;

});




// rotation function
function RotateABit(transf, rot){

	var rotation = transf.getLocalRotation();
	var rotateBy = quat.angleAxis(rot, vec3.up());
	rotation = rotation.multiply(rotateBy);
	transf.setLocalRotation(rotation);

}




// full morph animation to new planet
function NewPlanet(){

	// make new random planet parameters
	NewRandomParameters();

	// reset animation ratio
	ratio = 0;

}

// make api accessible
script.api.NewPlanet = NewPlanet;




// function to keep on animating
function RepeatAnimationToggle(){

	AnimateForever = !AnimateForever;

}

// make api accessible
script.api.RepeatAnimationToggle = RepeatAnimationToggle;




// covert HSV to RGB
function HSVtoRGB(h, s, v){
	
	h /= 255;
	s /= 255;
	v /= 255;

	var r, g, b;

	var i = Math.floor(h * 6);
	var f = h * 6 - i;
	var p = v * (1 - s);
	var q = v * (1 - f * s);
	var t = v * (1 - (1 - f) * s);

	switch (i % 6) {

		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;

	}


	return new vec3(r, g, b);

}



// get linearly distributed random value
function rand(min, max){

	return Math.random() * max + min;

}



// come up with new values for each parameter, start animation
function NewRandomParameters(){

	// store original values

	STARTPlanetSize = ENDPlanetSize;
	STARTTotalRotation = ENDTotalRotation;

	STARTMoon1Size = ENDMoon1Size;
	STARTMoon2Size = ENDMoon2Size;
	STARTMoon3Size = ENDMoon3Size;

	STARTTerrainDeep = ENDTerrainDeep;
	STARTTerrainColorScale = ENDTerrainColorScale;
	STARTTerrainScale = ENDTerrainScale;
	STARTTerrainSeed = ENDTerrainSeed;
	STARTTerrainColorOffset = ENDTerrainColorOffset;
	STARTTerrainAverage = ENDTerrainAverage;
	STARTTerrainPeaks = ENDTerrainPeaks;
	STARTTerrainHeight = ENDTerrainHeight;
	STARTWater = Water;
	
	STARTCloudColor = ENDCloudColor;
	STARTCloudScale = ENDCloudScale;
	STARTCloudVariation = ENDCloudVariation;

	STARTMoonColor1 = ENDMoonColor1;
	STARTMoonColor2 = ENDMoonColor2;
	STARTMoonScale = ENDMoonScale;
	STARTMoonOffset = ENDMoonOffset;


	// set random new end values, with custom ranges for good results

	ENDPlanetSize			=		rand(30, 60);
	ENDTotalRotation		=		new vec3( rand(0, Math.PI*2), rand(0, Math.PI*2), rand(0, Math.PI*2) );

	ENDMoon1Size			=		AnimateForever ? 0 : rand(.5, 4) * Math.round(rand(0,1)) * ENDPlanetSize/50; // random size, with 50% chance of being 0 (and thus invisible). Multiplied by normalized planet scale. 0 when on animation loop
	ENDMoon2Size			=		AnimateForever ? 0 : rand(.5, 4) * Math.round(rand(0,1)) * ENDPlanetSize/50;
	ENDMoon3Size			=		AnimateForever ? 0 : rand(.5, 4) * Math.round(rand(0,1)) * ENDPlanetSize/50;

	ENDTerrainDeep 			= 		HSVtoRGB( rand(0, 255), 220, 255 ); // random hue, set saturation, and set value
	ENDTerrainColorScale 	= 		rand(-1, 6);
	ENDTerrainScale 		= 		rand(1, 10);
	ENDTerrainSeed 			= 		TerrainSeed + rand(.5, 2.5); // current seed + new random value
	ENDTerrainColorOffset 	= 		getRandNear( 2 , 0.5 ) - .5; // normal distribution number around 0, outer range about -1 - 1
	ENDTerrainAverage 		= 		HSVtoRGB( rand(0, 255), 202, 135 );
	ENDTerrainPeaks 		= 		HSVtoRGB( rand(0, 255), 217, 255 );
	ENDTerrainHeight 		= 		getRandNear( 20, 7 ); // normal distribution around 7, outer range about 3 - 10
	ENDWater 				= 		1; // Changed my mind, let's not make this random. Just always on.     Math.round(rand(0, 1)) // water bool, but as float so it only animates from true to false when animation is at full speed (looks better)
	
	ENDCloudColor 			= 		HSVtoRGB( rand(0, 255), rand (0, 190), 255 ); // random hue, random saturation but till about .5 maximum, set value
	ENDCloudScale 			= 		rand(.8, 4);
	ENDCloudVariation 		= 		rand(0, .15);
	ENDCloudOpacity			=		rand(0, 1);

	ENDMoonColor1 			= 		HSVtoRGB( rand(0, 255), rand(0, 100), rand(80, 240) );
	ENDMoonColor2 			= 		HSVtoRGB( rand(0, 255), rand(0, 100), rand(20, 80) );
	ENDMoonScale 			= 		getRandNear(2, .5);
	ENDMoonOffset 			= 		MoonOffset + rand(.1, 6);

}



// set current values to all parameters
function UpdateAll(){

	var preMoon1Size = cubic( ratio, STARTMoon1Size, ENDMoon1Size, false );
	var preMoon2Size = cubic( ratio, STARTMoon2Size, ENDMoon2Size, false );
	var preMoon3Size = cubic( ratio, STARTMoon3Size, ENDMoon3Size, false );

	script.Moon01.getTransform().setLocalScale(new vec3( preMoon1Size, preMoon1Size, preMoon1Size ));
	script.Moon02.getTransform().setLocalScale(new vec3( preMoon2Size, preMoon2Size, preMoon2Size ));
	script.Moon03.getTransform().setLocalScale(new vec3( preMoon3Size, preMoon3Size, preMoon3Size ));


	var preSurfaceSize = cubic( ratio, STARTPlanetSize, ENDPlanetSize, false );
	script.PlanetSurface.getTransform().setLocalScale(new vec3( preSurfaceSize, preSurfaceSize, preSurfaceSize ));



	if(!AnimateForever) {

		script.getTransform().setLocalRotation(quat.fromEulerVec( cubic( ratio, STARTTotalRotation, ENDTotalRotation, true ) ));

	}



	surface.mainPass.TerrainDeep 			=		cubic( ratio, STARTTerrainDeep, ENDTerrainDeep, true );
	surface.mainPass.TerrainColorScale 		=		cubic( ratio, STARTTerrainColorScale, STARTTerrainColorScale, false );
	surface.mainPass.TerrainScale 			=		cubic( ratio, STARTTerrainScale, ENDTerrainScale, false );
	surface.mainPass.TerrainSeed 			=		cubic( ratio, STARTTerrainSeed, ENDTerrainSeed, false );
	surface.mainPass.TerrainColorOffset		=		cubic( ratio, STARTTerrainColorOffset, STARTTerrainColorOffset, false );
	surface.mainPass.TerrainAverage 		=		cubic( ratio, STARTTerrainAverage, ENDTerrainAverage, true );
	surface.mainPass.TerrainPeaks 			=		cubic( ratio, STARTTerrainPeaks, ENDTerrainPeaks, true );
	surface.mainPass.TerrainHeight 			=		cubic( ratio, STARTTerrainHeight, ENDTerrainHeight, false );
	surface.mainPass.Water 					=		cubic( ratio, STARTWater, ENDTerrainHeight, false );
	thinclouds.mainPass.CloudColor 			=		cubic( ratio, STARTCloudColor, ENDCloudColor, true );
	thinclouds.mainPass.CloudScale 			=		cubic( ratio, STARTCloudScale, ENDCloudScale, false );
	thinclouds.mainPass.CloudVariation 		=		cubic( ratio, STARTCloudVariation, ENDCloudVariation, false );
	thinclouds.mainPass.CloudOpacity		=		cubic( ratio, STARTCloudOpacity, ENDCloudOpacity, false )


	var preMoonColor1						=		cubic( ratio, STARTMoonColor1, ENDMoonColor1, true );
	var preMoonColor2						=		cubic( ratio, STARTMoonColor2, ENDMoonColor2, true );
	var preMoonScale						=		cubic( ratio, STARTMoonScale, ENDMoonScale, false );
	var preMoonOffset						=		cubic( ratio, STARTMoonOffset, ENDMoonOffset, false );

	moon01.mainPass.MoonColor1 				=		preMoonColor1;
	moon01.mainPass.MoonColor2 				=		preMoonColor2;
	moon01.mainPass.MoonScale 				=		preMoonScale;
	moon01.mainPass.MoonOffset 				=		preMoonOffset;

	moon02.mainPass.MoonColor1 				=		preMoonColor1;
	moon02.mainPass.MoonColor2 				=		preMoonColor2;
	moon02.mainPass.MoonScale 				=		preMoonScale;
	moon02.mainPass.MoonOffset 				=		preMoonOffset;

	moon03.mainPass.MoonColor1 				=		preMoonColor1;
	moon03.mainPass.MoonColor2 				=		preMoonColor2;
	moon03.mainPass.MoonScale 				=		preMoonScale;
	moon03.mainPass.MoonOffset 				=		preMoonOffset;

}



// function for linear to cubic converter (both in and out), custom start and end value, works on vec3 and single values
function cubic(t, start, end, isVec3){

	// store values
	var values = [];

	// get input as an array
	var inputStart = [];
	var inputEnd = [];


	// convert to array if necessary
	if (isVec3){

		c = 3;

		inputStart = [start.x, start.y, start.z];
		inputEnd = [end.x, end.y, end.z];
	
	}else{

		c = 1;

		inputStart = [start];
		inputEnd = [end];

	}


	// for each value in input array (if array, else just once)
	for (var i = 0; i < c; i++) {

		// set handles
		var c1 = 0;
		var v1 = inputStart[i];
		var c2 = 1 / 2;
		var v2 = v1;
		var c3 = 1 / 2;
		var v3 = inputEnd[i];
		var c4 = 1;
		var v4 = inputEnd[i];

		// return curve
		var cY = Math.pow(1 - t, 3) * v1 + 3*t * Math.pow(1 - t, 2) * v2 + 3*t*t * (1 - t) * v3 + Math.pow(t, 3) * v4;

		values.push(cY);

	}


	// return values array, or just the one item if only one
	return isVec3 ? new vec3(values[0], values[1], values[2]) : values[0];

}



// get numbers (enter as many as needed, one will randomly be picked) on bell curve's probability (within remapped range)
function getRandNear( range ) {

	// placeholder for list of random numbers
	var nums = [];

	for (var i = 0; i < arguments.length; i++) {

		// do not include range
		if( i > 0 ){

			// placeholder
			var num = -1;
			var rangeNum = -1;

			// only allow between 0-1, else just recalculate
			while(num < 0 || num > 1){

				var u = 0
				var v = 0;

				//Converting [0,1) to (0,1)
				while(u === 0) u = Math.random();
				while(v === 0) v = Math.random();

				// make curve
				var num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

				// Translate to 0 -> 1
				num = num / 10.0 + 0.5;

				// translate to range
				rangeNum = (num - .5) * range + arguments[i];

			}

			// add to list
			nums.push(rangeNum);

		}

	}


	// get random num from nums
	var chosenNum = nums[ Math.floor(Math.random()*nums.length) ];

	// return
	return chosenNum;

}