StageGameOver.prototype = new Stage(1);
StageGameOver.prototype.constructor = StageGameOver;
function StageGameOver() {
	this.doneFadeIn = false;
}
StageGameOver.prototype.start = function() {
	this.prepare();
	this.setBackground(33);
	sound.changeBgm(2);
	var reloadBtn = document.createElement('div');
	reloadBtn.style.position = 'relative';
	reloadBtn.style.top = '550px';
	reloadBtn.style.left = '400px';
	reloadBtn.style.width = '200px';
	reloadBtn.style.height = '60px';
	reloadBtn.style.cursor = 'pointer';
	reloadBtn.setAttribute('onclick', 'location.reload();');
	panel.appendChild(reloadBtn);
	this.showHtmlPanel();
}
StageGameOver.prototype.render = function() {
	if (!this.doneFadeIn) {
		this.doneFadeIn = effect.fadeIn();
	}
}
StageGameOver.prototype.handleInput = function(dt) {
	if (input.isPress('Z')) {
		location.reload();
	}
}
