// Max van Leeuwen
// instagram @max.van.leeuwen
// maxvanleeuwen.com




//@input SceneObject Planet



// only if tap is allowed
if(!global.NoButtons){

	script.Planet.getComponent("Component.Script").api.RepeatAnimationToggle();


	if(global.RepeatButtonToggle){

		global.tweenManager.startTween(script.getSceneObject(), "MakeRepBigger");
		global.RepeatButtonToggle = false;

	}else{

		global.tweenManager.startTween(script.getSceneObject(), "MakeRepSmaller");
		global.RepeatButtonToggle = true;

	};

}