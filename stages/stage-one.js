StageOne.prototype = new Stage(5);
StageOne.prototype.constructor = StageOne;
function StageOne() {
	this.nextStageId = 3;
	this.wave = 1;
	this.maxWave = 3;
}
StageOne.prototype.start = function() {
	this.prepare();
	this.setBackground(1);
	upgradeStage.nextStageId = 6;
	gs.inBattle = true;
	sound.changeBgm(4);
	// Player Settings
	gs.player.weapon = magicSword;
	gs.player.drawPos = [930, 375];
	gs.player.actPos = [930 + 17, 375 + 42];
	allEntities.push(gs.player);
	// Generates blocks.
	this.blockGen.generateBlocks(1, 5);
	// Chasing Enemy - Fluffy
	this.monsterGen.generateFluffy(2, fluffyWeapon);
}
StageOne.prototype.render = function() {
	var enemyCount = 0;
	for (var i = 0; i < allEntities.length; i++) {
		if (allEntities[i].isAttackPlayer) {
			enemyCount++;
		}
	}
	if (this.wave <= this.maxWave && enemyCount == 0) {
		this.wave++;
		if (this.wave <= this.maxWave) {
			sound.playSfx(6);
			this.monsterGen.generateFluffy(3, fluffyWeapon);
		}
	}
	if (this.wave > 3) {
		gs.inBattle = false;
		this.completed = effect.fadeOut();
	}
}
