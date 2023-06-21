StageFour.prototype = new Stage(8);
StageFour.prototype.constructor = StageFour;
function StageFour() {
	this.nextStageId = 10;
}
StageFour.prototype.start = function() {
	this.prepare();
	this.setBackground(32);
	sound.changeBgm(7);
	gs.inBattle = true;
	// Player Settings
	gs.player.weapon = magicSword;
	gs.player.drawPos = [470, 96];
	gs.player.sprite.moveDown = true;
	gs.player.actPos = [470 + 17, 96 + 42];
	allEntities.push(gs.player);
	// Generates blocks.
	this.blockGen.generateBlocks(4, 0);
	// Chasing Enemy - Witch
	this.monsterGen.generateWitch(1, witchWeapon);
}
StageFour.prototype.render = function() {
	var enemyCount = 0;
	for (var i = 0; i < allEntities.length; i++) {
		if (allEntities[i].isAttackPlayer) {
			enemyCount++;
		}
	}
	if (enemyCount == 0) {
		gs.inBattle = false;
		this.completed = effect.fadeOut();
	}
}
