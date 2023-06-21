StageUpgrade.prototype = new Stage(3);
StageUpgrade.prototype.constructor = StageUpgrade;
function StageUpgrade() {
	this.nextStageId = 0;
	this.doneFadeIn = false;
	this.idx = 0;
}
StageUpgrade.prototype.start = function() {
	this.prepare();
	this.idx = 0;
	this.doneFadeIn = false;
	panel.innerHTML += '<div style="font-size: 48pt; margin-top: 50px; text-align: center;">UPGRADE</div>';
	panel.innerHTML += '<div style="color: #78f26b; font-size: 48pt; margin-top: 50px; text-align: center;">';
	panel.innerHTML += '<div style="color: #78f26b; font-size: 48pt; margin-top: 50px; text-align: center;" id="abilHp">HP +50</div>';
	panel.innerHTML += '<div style="color: #78f26b; font-size: 48pt; margin-top: 50px; text-align: center;" id="abilPwr">Power +10</div>';
	panel.innerHTML += '<div style="color: #78f26b; font-size: 48pt; margin-top: 50px; text-align: center;" id="abilDef">Defence +5</div>';
	this.showHtmlPanel();
}
StageUpgrade.prototype.highlight = function() {
	var hp = document.getElementById('abilHp');
	var pwr = document.getElementById('abilPwr');
	var def = document.getElementById('abilDef');
	if (this.idx == 0) {
		hp.style.border = '5px #78f26b solid';
		pwr.style.border = '0';
		def.style.border = '0';
	} else if (this.idx == 1) {
		hp.style.border = '0';
		pwr.style.border = '5px #78f26b solid';
		def.style.border = '0';
	} else if (this.idx == 2) {
		hp.style.border = '0';
		pwr.style.border = '0';
		def.style.border = '5px #78f26b solid';
	}
}
StageUpgrade.prototype.handleInput = function() {
	if (input.isPress('UP') && !holdKey) {
		holdKey = true;
		sound.playSfx(2);
		if (this.idx > 0) {
			this.idx--;
		}
	} else if (input.isPress('DOWN') && !holdKey) {
		holdKey = true;
		sound.playSfx(2);
		if (this.idx < 2) {
			this.idx++;
		}
	} else if (input.isPress('Z') && !holdKey) {
		holdKey = true;
		sound.playSfx(4);
		if (this.idx == 0) {
			gs.player.addedHp += 50;
		} else if (this.idx == 1) {
			gs.player.addedPwr += 10;
		} else if (this.idx == 2) {
			gs.player.addedDef += 5;
		}
		this.completed = true;
	}
	this.highlight();
}
