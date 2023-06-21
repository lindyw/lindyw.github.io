StageBeforeBoss.prototype = new Stage(9);
StageBeforeBoss.prototype.constructor = StageBeforeBoss;
function StageBeforeBoss() {
	this.nextStageId = 8;
	this.doneFadeIn = false;
	this.dialogIdx = 0;
	this.doneTalking = false;
}
StageBeforeBoss.prototype.start = function() {
	this.prepare();
	sound.changeBgm(5);
	this.setBackground(35);
}
StageBeforeBoss.prototype.render = function() {
	if (!this.doneFadeIn) {
		this.doneFadeIn = effect.fadeIn();
	} else if (!this.doneTalking) {
		if (this.dialogIdx == 0) {
			dialog.show(24, 'Hansel', 'Finally, found you, Red witch.  Prepare for death!');
		} else if (this.dialogIdx == 1) {
			dialog.show(24, 'The Red Witch', 'HAHAHA! Another silly human come and save their kids?', 'I have just killed a disgusting man before you came.');
		} else if (this.dialogIdx == 2) {
			dialog.show(24, 'Hansel', 'You killed Uncle Sam?!!!', 'Debts of blood must be paid in blood, you evil witch!');
		} else if (this.dialogIdx == 3) {
			dialog.show(24, 'The Red Witch', '…(Look at Hansel’s sword) Oh! Seems you are a ‘HUNTER’ as well…', 'No one can defeat me in this world. I will kill you and',
				'gain my power back from that sword!');
		}  else {
			this.doneTalking = true;
		}
	} else {
		this.completed = effect.fadeOut();
	}
}
StageBeforeBoss.prototype.handleInput = function(dt) {
	if (input.isPress('Z') && !holdKey && this.doneFadeIn && !this.doneTalking) {
		holdKey = true;
		this.dialogIdx++;
		sound.playSfx(2);
	}
}
