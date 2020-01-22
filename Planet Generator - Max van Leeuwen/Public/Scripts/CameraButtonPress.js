// Max van Leeuwen
// instagram @max.van.leeuwen
// maxvanleeuwen.com




//@input SceneObject Sky
//@input SceneObject Shadow


// only if tap is allowed
if(!global.NoButtons){

	var bgSize = 5000;


	if(script.Shadow.enabled){

		script.Shadow.enabled = false;
		script.Sky.getTransform().setWorldScale(new vec3(bgSize, bgSize, bgSize));
		global.tweenManager.startTween(script.getSceneObject(), "MakeCamSmaller");

	}else{

		script.Shadow.enabled = true;
		script.Sky.getTransform().setWorldScale(new vec3(0, 0, 0));
		global.tweenManager.startTween(script.getSceneObject(), "MakeCamBigger");

	}

}