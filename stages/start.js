StageStart.prototype = new Stage(0);
StageStart.prototype.constructor = StageStart;
function StageStart() {
	this.nextStageId = 11;
	this.startBgIdx = 13;
	this.countFrame = 0;
}
StageStart.prototype.start = function() {
	this.prepare();
	sound.changeBgm(0);
	var startBtn = document.createElement('div');
	startBtn.style.position = 'relative';
	startBtn.style.top = '580px';
	startBtn.style.left = '400px';
	startBtn.style.width = '200px';
	startBtn.style.height = '60px';
	startBtn.style.cursor = 'pointer';
	startBtn.setAttribute('onclick', 'sound.playSfx(3); curStage.completed = true;');
	panel.appendChild(startBtn);
	this.showHtmlPanel();
}
StageStart.prototype.render = function() {
	ctx.drawImage(images[this.startBgIdx], 0, 0, 1000, 700);
	this.countFrame++;
	if (this.countFrame % 7 == 0) {
		this.startBgIdx++;
	}
	if (this.startBgIdx > 17) {
		this.startBgIdx = 13;
	}
}
StageStart.prototype.handleInput = function(dt) {
	if (input.isPress('Z') && !holdKey) {
		holdKey = true;
		sound.playSfx(3);
		this.completed = true;
	}
}
