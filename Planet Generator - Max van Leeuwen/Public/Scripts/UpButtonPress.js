// Max van Leeuwen
// instagram @max.van.leeuwen
// maxvanleeuwen.com




//@input SceneObject[] Planets



// only if tap is allowed
if(!global.NoButtons){

	for (var i = 0; i < script.Planets.length; i++) {

		if(global.UpButtonToggle){

			global.tweenManager.startTween(script.Planets[i].getParent(), "MoveDown")
			global.tweenManager.startTween(script.getSceneObject(), "PointUp");
			global.UpButtonToggle = false;
		
		}else{

			global.tweenManager.startTween(script.Planets[i].getParent(), "MoveUp")
			global.tweenManager.startTween(script.getSceneObject(), "PointDown");
			global.UpButtonToggle = true;

		}

	}

	global.tweenManager.startTween(script.getSceneObject(), "TapAnimation");

}