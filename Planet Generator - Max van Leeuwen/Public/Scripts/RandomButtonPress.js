// Max van Leeuwen
// instagram @max.van.leeuwen
// maxvanleeuwen.com




//@input SceneObject[] Planets


// only if tap is allowed
if(!global.NoButtons){

	for (var i = 0; i < script.Planets.length; i++) {

		script.Planets[i].getComponent("Component.Script").api.NewPlanet();

	}

	global.tweenManager.startTween(script.getSceneObject(), "TapAnimation");

}