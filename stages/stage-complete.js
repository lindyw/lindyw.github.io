StageComplete.prototype = new Stage(2);
StageComplete.prototype.constructor = StageComplete;
function StageComplete() {
	this.doneFadeIn = false;
}
StageComplete.prototype.start = function() {
	this.prepare();
	this.setBackground(34);
	sound.changeBgm(3);
}
StageComplete.prototype.render = function() {
	if (!this.doneFadeIn) {
		this.doneFadeIn = effect.fadeIn();
	}
}
StageComplete.prototype.handleInput = function(dt) {
	if (input.isPress('Z')) {
		location.reload();
	}
}
