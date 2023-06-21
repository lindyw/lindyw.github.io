StageAfterBoss.prototype = new Stage(10);
StageAfterBoss.prototype.constructor = StageAfterBoss;
function StageAfterBoss() {
	this.nextStageId = 2;
	this.doneFadeIn = false;
	this.dialogIdx = 0;
	this.doneTalking = false;
}
StageAfterBoss.prototype.start = function() {
	this.prepare();
	sound.changeBgm(6);
	this.setBackground(36);
}
StageAfterBoss.prototype.render = function() {
	if (!this.doneFadeIn) {
		this.doneFadeIn = effect.fadeIn();
	} else if (!this.doneTalking) {
		if (this.dialogIdx == 0) {
			dialog.show(21, 'Hansel', 'Kids! Are you guys all right?');
		} else if (this.dialogIdx == 1) {
			dialog.show(21, 'Kids', 'We are fine, thank you. You are our BIG hero. Hansel!');
		} else if (this.dialogIdx == 2) {
			dialog.show(21, 'Hansel', 'Let’s go home together now.');
		} else {
			this.doneTalking = true;
		}
	} else {
		this.completed = effect.fadeOut();
	}
}
StageAfterBoss.prototype.handleInput = function(dt) {
	if (input.isPress('Z') && !holdKey && this.doneFadeIn && !this.doneTalking) {
		holdKey = true;
		this.dialogIdx++;
		sound.playSfx(2);
	}
}
