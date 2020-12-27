StageTwo.prototype = new Stage(6);
StageTwo.prototype.constructor = StageTwo;
function StageTwo() {
	this.nextStageId = 3;
	this.wave = 1;
	this.maxWave = 3;
}
StageTwo.prototype.start = function() {
	this.prepare();
	this.setBackground(30);
	upgradeStage.nextStageId = 7;
	gs.inBattle = true;
	// Player Settings
	gs.player.weapon = magicSword;
	gs.player.drawPos = [45, 125];
	gs.player.actPos = [45 + 17, 125 + 42];
	allEntities.push(gs.player);
	// Generates blocks.
	this.blockGen.generateBlocks(2, 5);
	// Chasing Enemy - Ghost Fire
	this.monsterGen.generateGhostFire(2, ghostFireWeapon);
	// Chasing Enemy - Fluffy
	this.monsterGen.generateFluffy(2, fluffyWeapon);
	
}
StageTwo.prototype.render = function() {
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
			if (this.wave == 2) {
				this.monsterGen.generateFluffy(2, fluffyWeapon);
				this.monsterGen.generateGhostFire(2, ghostFireWeapon);
			} else {
				this.monsterGen.generateFluffy(2, fluffyWeapon);
				this.monsterGen.generateGhostFire(3, ghostFireWeapon);
			}
		}
	}
	if (this.wave > 3) {
		gs.inBattle = false;
		this.completed = effect.fadeOut();
	}
}
