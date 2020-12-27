StageThree.prototype = new Stage(7);
StageThree.prototype.constructor = StageThree;
function StageThree() {
	this.nextStageId = 3;
	this.wave = 1;
	this.maxWave = 3;
}
StageThree.prototype.start = function() {
	this.prepare();
	this.setBackground(31);
	upgradeStage.nextStageId = 9;
	gs.inBattle = true;
	// Player Settings
	gs.player.weapon = magicSword;
	gs.player.drawPos = [250, 95];
	gs.player.actPos = [250 + 17, 95 + 42];
	allEntities.push(gs.player);
	// Generates blocks.
	this.blockGen.generateBlocks(3, 5);
	// Chasing Enemy - MoMo
	this.monsterGen.generateMomo(1, momoWeapon);
	// Chasing Enemy - Ghost Fire
	this.monsterGen.generateGhostFire(2, ghostFireWeapon);
}
StageThree.prototype.render = function() {
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
				this.monsterGen.generateMomo(2, momoWeapon);
				this.monsterGen.generateGhostFire(2, ghostFireWeapon);
			} else {
				this.monsterGen.generateMomo(2, momoWeapon);
				this.monsterGen.generateGhostFire(4, ghostFireWeapon);
			}
		}
	}
	if (this.wave > 3) {
		gs.inBattle = false;
		this.completed = effect.fadeOut();
	}
}
