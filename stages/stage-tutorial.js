StageTutorial.prototype = new Stage(11);
StageTutorial.prototype.constructor = StageTutorial;
function StageTutorial() {
	this.nextStageId = 4;
	this.confirmed = false;
	this.doneFadeIn = false;
}
StageTutorial.prototype.start = function() {
	this.prepare();
}
StageTutorial.prototype.render = function() {
	ctx.drawImage(images[37], 0, 0, 1000, 700);
	if (!this.doneFadeIn) {
		this.doneFadeIn = effect.fadeIn();
	}
	if (this.confirmed && this.doneFadeIn) {
		this.completed = effect.fadeOut();
	}
}
StageTutorial.prototype.handleInput = function(dt) {
	if (input.isPress('Z') && !holdKey) {
		holdKey = true;
		sound.playSfx(3);
		this.confirmed = true;
	}
}
