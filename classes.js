// Entity
function Entity() {
	this.id = null;
	this.drawPos = [0, 0];
	this.actPos = [0, 0];
	this.actSize = [0, 0];
	this.sprite = null;
	this.stepCount = 0;
	this.isAttackPlayer = false;
	this.weapon = null;
	this.colidedEntity = null;
	this.colidedBlockEntity = null;
	this.holdAttack = false;
	this.speedFactor = speedFactorPlayer;
}
Entity.prototype.colide = function() {
	for (i = 0; i < allEntities.length; i++) {
		if (allEntities[i].actPos[0] != this.actPos[0] || allEntities[i].actPos[1] != this.actPos[1]) {
				if (this.actPos[1] < allEntities[i].actPos[1] + allEntities[i].actSize[1] &&
					this.actPos[1] + this.actSize[1] > allEntities[i].actPos[1] &&
					this.actPos[0] + this.actSize[0] > allEntities[i].actPos[0] &&
					this.actPos[0] < allEntities[i].actPos[0] + allEntities[i].actSize[0]) {
					this.colidedEntity = allEntities[i];
					if ((this.isAttackPlayer && !allEntities[i].isAttackPlayer) || !this.isAttackPlayer) {
						return true;
					}
				}
		}
	}
	for (i = 0; i < allBlockEntities.length; i++) {
		if (allBlockEntities[i].actPos[0] != this.actPos[0] || allBlockEntities[i].actPos[1] != this.actPos[1]) {
				if (this.actPos[1] < allBlockEntities[i].actPos[1] + allBlockEntities[i].actSize[1] &&
					this.actPos[1] + this.actSize[1] > allBlockEntities[i].actPos[1] &&
					this.actPos[0] + this.actSize[0] > allBlockEntities[i].actPos[0] &&
					this.actPos[0] < allBlockEntities[i].actPos[0] + allBlockEntities[i].actSize[0]) {
					this.colidedBlockEntity = allBlockEntities[i];
					console.log(1);
					return true;
				}
		}
	}
	return false;
}
Entity.prototype.isWithinRange = function(startX, startY, endX, endY) {
	return (this.drawPos[1] < endY &&
		this.drawPos[1] + this.sprite.size[1] > startY &&
		this.drawPos[0] + this.sprite.size[0] > startX &&
		this.drawPos[0] < endX);
}
Entity.prototype.moveUp = function(dt) {
	if (this.drawPos[1] > 1 && !this.colide()) {
		this.drawPos[1] -= playerSpeed * dt;
		this.actPos[1] -= playerSpeed * dt;
		if (this.colide()) {
			this.drawPos[1] += playerSpeed * dt;
			this.actPos[1] += playerSpeed * dt;
		}
	}
	this.sprite.animateUp();
}
Entity.prototype.moveDown = function(dt) {
	if (this.drawPos[1] < (699 - this.sprite.size[1]) && !this.colide()) {
		this.drawPos[1] += playerSpeed * dt;
		this.actPos[1] += playerSpeed * dt;
		if (this.colide()) {
			this.drawPos[1] -= playerSpeed * dt;
			this.actPos[1] -= playerSpeed * dt;
		}
	}
	this.sprite.animateDown();
}
Entity.prototype.moveLeft = function(dt) {
	if (this.drawPos[0] > 1 && !this.colide()) {
		this.drawPos[0] -= playerSpeed * dt;
		this.actPos[0] -= playerSpeed * dt;
		if (this.colide()) {
			this.drawPos[0] += playerSpeed * dt;
			this.actPos[0] += playerSpeed * dt;
		}
	}
	this.sprite.animateLeft();
}
Entity.prototype.moveRight = function(dt) {
	if (this.drawPos[0] < (999 - this.sprite.size[0]) && !this.colide()) {
		this.drawPos[0] += playerSpeed * dt;
		this.actPos[0] += playerSpeed * dt;
		if (this.colide()) {
			this.drawPos[0] -= playerSpeed * dt;
			this.actPos[0] -= playerSpeed * dt;
		}
	}
	this.sprite.animateRight();
}
Entity.prototype.moveUpTo = function(dt, y) {
	if (this.actPos[1] > y) {
		this.moveUp(dt);
		return false;
	} else {
		return true;
	}
}
Entity.prototype.moveDownTo = function(dt, y) {
	if (this.actPos[1] < y) {
		this.moveDown(dt);
		return false;
	} else {
		return true;
	}
}
Entity.prototype.moveLeftTo = function(dt, x) {
	if (this.actPos[0] > x) {
		this.moveLeft(dt);
		return false;
	} else {
		return true;
	}
}
Entity.prototype.moveRightTo = function(dt, x) {
	if (this.actPos[0] < x) {
		this.moveRight(dt);
		return false;
	} else {
		return true;
	}
}

Entity.prototype.witchSpecialAction = function() {
	p = Math.random();
	if (this.hp <= witchInitHp * 0.8 && p < 0.05) {
		if (witchGenMonster == 0) {
			sound.playSfx(6);
			var monsterGen = new MonsterGenerator();
			monsterGen.generateMomo(1, momoWeapon);
			monsterGen.generateFluffy(1, fluffyWeapon);
			monsterGen.generateGhostFire(1, ghostFireWeapon);
			witchGenMonster = witchGenMonsterTime * witchCount;
		}
		else {
			witchGenMonster--;
		}
	}
	if (this.hp <= witchInitHp * 0.5 && witchStage == 1) {
		sound.playSfx(6);
		var monsterGen = new MonsterGenerator();
		monsterGen.generateWitch(2, witchWeapon);
		// allEntities[allEntities.length-1].drawPos = [240, 120];
		// allEntities[allEntities.length-1].actPos = [253, 157];
		allEntities[allEntities.length-1].hp = this.hp;
		// allEntities[allEntities.length-2].drawPos = [730, 120];
		// allEntities[allEntities.length-2].actPos = [743, 157];
		allEntities[allEntities.length-2].hp = this.hp;
		this.drawPos = givePos(this.sprite.size);
		this.actPos = [this.drawPos[0] + 13, this.drawPos[1] + 57];
		// this.drawPos = [485, 120];
		// this.actPos = [498, 157];
		witchStage = 0;
		witchCount = 3;
	}
}

Entity.prototype.attack = function() {
	if (this.weapon && !this.holdAttack) {
		if (this.id == 0 && gs.inBattle) {
			sound.playSfx(0);
		}
		
		if (this.sprite.type == 1) {
			this.sprite.animateAttack();
		}
		
		if (this.sprite.moveRight) {
			var startX = this.drawPos[0] + this.sprite.size[0];
			var startY = this.drawPos[1];
			var endX = startX + this.weapon.range[0];
			var endY = startY + this.weapon.range[1];
			for (var i = 0; i < allEntities.length; i++) {
				var curEntity = allEntities[i];
				if (curEntity.isWithinRange(startX, startY, endX, endY) && curEntity.id != this.id && (!this.isAttackPlayer || curEntity.id == 0)) {
					if (curEntity.id == 0) {
						var power = this.weapon.power - gs.player.addedDef;
						if (power < 1) {
							power = 1;
						}
						curEntity.hp -= power;
						sound.playSfx(7);
					}
					if (this.id == 0) {
						curEntity.hp -= (this.weapon.power + gs.player.addedPwr);
						sound.playSfx(1);
					}					
					curEntity.flash();
				}
			}
		} else if (this.sprite.moveLeft) {
			var startX = this.drawPos[0] - this.weapon.range[0];
			var startY = this.drawPos[1];
			var endX = startX + this.weapon.range[0];
			var endY = startY + this.weapon.range[1];
			for (var i = 0; i < allEntities.length; i++) {
				var curEntity = allEntities[i];
				if (curEntity.isWithinRange(startX, startY, endX, endY) && curEntity.id != this.id && (!this.isAttackPlayer || curEntity.id == 0)) {
					if (curEntity.id == 0) {
						var power = this.weapon.power - gs.player.addedDef;
						if (power < 1) {
							power = 1;
						}
						curEntity.hp -= power;
						sound.playSfx(7);
					}
					if (this.id == 0) {
						curEntity.hp -= (this.weapon.power + gs.player.addedPwr);
						sound.playSfx(1);
					}
					curEntity.flash();
				}
			}
		} else if (this.sprite.moveUp) {
			var startX = this.drawPos[0];
			var startY = this.drawPos[1] - this.weapon.range[0];
			var endX = startX + this.weapon.range[1];
			var endY = startY + this.weapon.range[0];
			for (var i = 0; i < allEntities.length; i++) {
				var curEntity = allEntities[i];
				if (curEntity.isWithinRange(startX, startY, endX, endY) && curEntity.id != this.id && (!this.isAttackPlayer || curEntity.id == 0)) {
					if (curEntity.id == 0) {
						var power = this.weapon.power - gs.player.addedDef;
						if (power < 1) {
							power = 1;
						}
						curEntity.hp -= power;
						sound.playSfx(7);
					}
					if (this.id == 0) {
						curEntity.hp -= (this.weapon.power + gs.player.addedPwr);
						sound.playSfx(1);
					}
					curEntity.flash();
				}
			}
		} else if (this.sprite.moveDown) {
			var startX = this.drawPos[0];
			var startY = this.drawPos[1] + this.sprite.size[1];
			var endX = startX + this.weapon.range[1];
			var endY = startY + this.weapon.range[0];
			for (var i = 0; i < allEntities.length; i++) {
				var curEntity = allEntities[i];
				if (curEntity.isWithinRange(startX, startY, endX, endY) && curEntity.id != this.id && (!this.isAttackPlayer || curEntity.id == 0)) {
					if (curEntity.id == 0) {
						var power = this.weapon.power - gs.player.addedDef;
						if (power < 1) {
							power = 1;
						}
						curEntity.hp -= power;
						sound.playSfx(7);
					}
					if (this.id == 0) {
						curEntity.hp -= (this.weapon.power + gs.player.addedPwr);
						sound.playSfx(1);
					}
					curEntity.flash();
				}
			}
		}
		this.holdAttack = true;
	}
}
Entity.prototype.flash = function() {
	this.sprite.flash();
	if (this.hp <= 0) {
		sound.playSfx(5);
	}
}
/* Entity.prototype.chasePlayer = function() {
	ex = this.drawPos[0];
	ey = this.drawPos[1];
	ew = this.sprite.size[0];
	eh = this.sprite.size[1];
	px = gs.player.drawPos[0];
	py = gs.player.drawPos[1];
	pw = gs.player.sprite.size[0];
	ph = gs.player.sprite.size[1];
					
	if (this.stepCount == 0) {
		this.p = Math.random();
		this.stepCount = 10 + Math.floor(this.p * 15);
	}
	if (this.colidedBlockEntity) {
		if (this.sprite.forceRight) {
			if ((this.sprite.preForceDown && py + ph < this.colidedBlockEntity.drawPos[1]) ||
				(this.sprite.preForceUp && py > this.colidedBlockEntity.drawPos[1] + this.colidedBlockEntity.sprite.size[1])) {
				this.colidedBlockEntity = null;
				this.sprite.preForceDown = this.sprite.preForceUp = this.sprite.forceRight = false;
			}else if (ex <= this.colidedBlockEntity.drawPos[0] + this.colidedBlockEntity.sprite.size[0] + 3) {
				this.moveRight(this.speedFactor);
			} else {
				this.colidedBlockEntity = null;
				this.sprite.preForceDown = this.sprite.preForceUp = this.sprite.forceRight = false;
			}
		}
		if (this.sprite.forceLeft) {
			if ((this.sprite.preForceDown && py + ph < this.colidedBlockEntity.drawPos[1]) ||
				(this.sprite.preForceUp && py > this.colidedBlockEntity.drawPos[1] + this.colidedBlockEntity.sprite.size[1])) {
				this.colidedBlockEntity = null;
				this.sprite.preForceDown = this.sprite.preForceUp = this.sprite.forceLeft = false;
			}else if (ex + ew + 3 >= this.colidedBlockEntity.drawPos[0]) {
				this.moveLeft(this.speedFactor);
			} else {
				this.colidedBlockEntity = null;
				this.sprite.preForceDown = this.sprite.preForceUp = this.sprite.forceLeft = false;
			}
		}
		if (this.sprite.forceUp) {
			if ((this.sprite.preForceLeft && px > this.colidedBlockEntity.drawPos[0] + this.colidedBlockEntity.sprite.size[0]) ||
				(this.sprite.preForceRight && px + pw < this.colidedBlockEntity.drawPos[0] )) {
				this.colidedBlockEntity = null;
				this.sprite.preForceLeft = this.sprite.preForceRight = this.sprite.forceUp = false;
			}else if (ey + eh + 3>= this.colidedBlockEntity.drawPos[1]) {
				this.moveUp(this.speedFactor);
			} else {
				this.colidedBlockEntity = null;
				this.sprite.preForceLeft = this.sprite.preForceRight = this.sprite.forceUp = false;
			}
		}
		if (this.sprite.forceDown) {
			if ((this.sprite.preForceLeft && px > this.colidedBlockEntity.drawPos[0] + this.colidedBlockEntity.sprite.size[0]) ||
				(this.sprite.preForceRight && px + pw < this.colidedBlockEntity.drawPos[0] )) {
				this.colidedBlockEntity = null;
				this.sprite.preForceLeft = this.sprite.preForceRight = this.sprite.forceDown = false;
			}else if (ey <= this.colidedBlockEntity.drawPos[1] + this.colidedBlockEntity.sprite.size[1] + 3) {
				this.moveDown(this.speedFactor);
			} else {
				this.colidedBlockEntity = null;
				this.sprite.preForceLeft = this.sprite.preForceRight = this.sprite.forceDown = false;
			}
		}
	} else {				
		if (ey < py) {
			if (ex < px) {
				if (this.p > 0.75631) {
					//this.moveDown(this.speedFactor);
					this.moveDown(this.speedFactor);
					this.moveRight(this.speedFactor);
					this.colidedBlockEntity = null;
				} else if (this.p > 0.5) {
					this.moveDown(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.preForceDown = true;
						this.sprite.forceRight = true;
					}
				} else if (this.p > 0.24369) {
					this.moveRight(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.preForceRight = true;
						this.sprite.forceDown = true;
					}
				} else {
					this.moveDown(this.speedFactor);
					this.moveRight(this.speedFactor);
					this.colidedBlockEntity = null;
				}
				if (py - ey < 3) {
					this.drawPos[1] = py;
					this.actPos[1] += (py - ey);
				}
				if (px - ex < 3) {
					this.drawPos[0] = px;
					this.actPos[0] += (px - ex);
				}
			} else if (ex > px) {
				if (this.p > 0.75631) {
					this.moveDown(this.speedFactor);
					this.moveLeft(this.speedFactor);
					this.colidedBlockEntity = null;
				} else if (this.p > 0.5) {
					this.moveDown(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.preForceDown = true;
						this.sprite.forceLeft = true;
					}
				} else if (this.p > 0.24369) {
					this.moveLeft(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.preForceLeft = true;
						this.sprite.forceDown = true;
					}
				} else {
					this.moveDown(this.speedFactor);
					this.moveLeft(this.speedFactor);
					this.colidedBlockEntity = null;
				}
				if (py - ey < 3) {
					this.drawPos[1] = py;
					this.actPos[1] += (py - ey);
				}
				if (ex - px < 3) {
					this.drawPos[0] = px;
					this.actPos[0] -= (ex - px);
				}
			} else{
				this.moveDown(this.speedFactor);
				if (this.colidedBlockEntity) {
					this.sprite.preForceDown = true;
					this.sprite.forceRight = true;
				}
				if (py - ey < 3) {
					this.drawPos[1] = py;
					this.actPos[1] += (py - ey);
				}
			}
			this.stepCount--;
		} else if (ey > py) {
			if (ex < px) {
				if (this.p > 0.75631) {
					this.moveUp(this.speedFactor);
					this.moveRight(this.speedFactor);
					this.colidedBlockEntity = null;
				} else if (this.p > 0.5) {
					this.moveUp(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.preForceUp = true;
						this.sprite.forceRight = true;
					}
				} else if (this.p > 0.24369) {
					this.moveRight(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.preForceRight = true;
						this.sprite.forceUp = true;
					}
				} else {
					this.moveUp(this.speedFactor);
					this.moveRight(this.speedFactor);
					this.colidedBlockEntity = null;
				}
				if (ey - py < 3) {
					this.drawPos[1] = py;
					this.actPos[1] -= (ey - py);
				}
				if (px - ex < 3) {
					this.drawPos[0] = px;
					this.actPos[0] += (px - ex);
				}
			} else if (ex > px) {
				if (this.p > 0.75631) {
					this.moveUp(this.speedFactor);
					this.moveLeft(this.speedFactor);
					this.colidedBlockEntity = null;
				} else if (this.p > 0.5) {
					this.moveUp(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.preForceUp = true;
						this.sprite.forceLeft = true;
					}
				} else if (this.p > 0.24369) {
					this.moveLeft(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.preForceLeft = true;
						this.sprite.forceUp = true;
					}
				} else {
					this.moveUp(this.speedFactor);
					this.moveLeft(this.speedFactor);
					this.colidedBlockEntity = null;
				}
				if (ey - py < 3) {
					this.drawPos[1] = py;
					this.actPos[1] -= (ey - py);
				}
				if (ex - px < 3) {
					this.drawPos[0] = px;
					this.actPos[0] -= (ex - px);
				}
			} else{
				this.moveUp(this.speedFactor);
				if (this.colidedBlockEntity) {
					this.sprite.preForceUp = true;
					this.sprite.forceLeft = true;
				}
				if (ey - py < 3) {
					this.drawPos[1] = py;
					this.actPos[1] -= (ey - py);
				}
			}
			this.stepCount--;
		} else if (ex < px) {
			if (ey < py) {
				if (this.p > 0.75631) {
					this.moveDown(this.speedFactor);
					this.moveRight(this.speedFactor);
					this.colidedBlockEntity = null;
				} else if (this.p > 0.5) {
					this.moveDown(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.preForceDown = true;
						this.sprite.forceRight = true;
					}
				} else if (this.p > 0.24369) {
					this.moveRight(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.preForceRight = true;
						this.sprite.forceDown = true;
					}
				} else {
					this.moveDown(this.speedFactor);
					this.moveRight(this.speedFactor);
					this.colidedBlockEntity = null;
				}
				if (py - ey < 3) {
					this.drawPos[1] = py;
					this.actPos[1] += (py - ey);
				}
				if (px - ex < 3) {
					this.drawPos[0] = px;
					this.actPos[0] += (px - ex);
				}
			} else if (ey > py) {
				if (this.p > 0.75631) {
					this.moveUp(this.speedFactor);
					this.moveRight(this.speedFactor);
					this.colidedBlockEntity = null;
				} else if (this.p > 0.5) {
					this.moveUp(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.preForceUp = true;
						this.sprite.forceRight = true;
					}
				} else if (this.p > 0.24369) {
					this.moveRight(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.preForceRight = true;
						this.sprite.forceUp = true;
					}
				} else {
					this.moveUp(this.speedFactor);
					this.moveRight(this.speedFactor);
					this.colidedBlockEntity = null;
				}
				if (ey - py < 3) {
					this.drawPos[1] = py;
					this.actPos[1] -= (ey - py);
				}
				if (px - ex < 3) {
					this.drawPos[0] = px;
					this.actPos[0] += (px - ex);
				}
			} else{
				this.moveRight(this.speedFactor);
				if (this.colidedBlockEntity) {
					this.sprite.preForceRight = true;
					this.sprite.forceUp = true;
				}
				if (px - ex < 3) {
					this.drawPos[0] = px;
					this.actPos[0] += (px - ex);
				}
			}
			this.stepCount--;
		} else if (ex > px) {
			if (ey < py) {
				if (this.p > 0.75631) {
					this.moveDown(this.speedFactor);
					this.moveLeft(this.speedFactor);
					this.colidedBlockEntity = null;
				} else if (this.p > 0.5) {
					this.moveDown(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.preForceDown = true;
						this.sprite.forceLeft = true;
					}
				} else if (this.p > 0.24369) {
					this.moveLeft(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.preForceLeft = true;
						this.sprite.forceDown = true;
					}
				} else {
					this.moveDown(this.speedFactor);
					this.moveLeft(this.speedFactor);
					this.colidedBlockEntity = null;
				}
				if (py - ey < 3) {
					this.drawPos[1] = py;
					this.actPos[1] += (py - ey);
				}
				if (ex - px < 3) {
					this.drawPos[0] = px;
					this.actPos[0] -= (ex - px);
				}
			} else if (ey > py) {
				if (this.p > 0.75631) {
					this.moveUp(this.speedFactor);
					this.moveLeft(this.speedFactor);
					this.colidedBlockEntity = null;
				} else if (this.p > 0.5) {
					this.moveUp(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.preForceUp = true;
						this.sprite.forceLeft = true;
					}
				} else if (this.p > 0.24369) {
					this.moveLeft(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.preForceLeft = true;
						this.sprite.forceUp = true;
					}
				} else {
					this.moveUp(this.speedFactor);
					this.moveLeft(this.speedFactor);
					this.colidedBlockEntity = null;
				}
				if (ey - py < 3) {
					this.drawPos[1] = py;
					this.actPos[1] -= (ey - py);
				}
				if (ex - px < 3) {
					this.drawPos[0] = px;
					this.actPos[0] -= (ex - px);
				}
			} else{
				this.moveLeft(this.speedFactor);
				if (this.colidedBlockEntity) {
					this.sprite.preForceLeft = true;
					this.sprite.forceUp = true;
				}
				if (ex - px < 3) {
					this.drawPos[0] = px;
					this.actPos[0] -= (ex - px);
				}
			}
			this.stepCount--;
		}
	}
}
*/
/* Entity.prototype.chasePlayer = function() {

	ex = this.drawPos[0];
	ey = this.drawPos[1];
	ew = this.sprite.size[0];
	eh = this.sprite.size[1];
	px = gs.player.drawPos[0];
	py = gs.player.drawPos[1];
	pw = gs.player.sprite.size[0];
	ph = gs.player.sprite.size[1];
					
	if (this.stepCount == 0) {
		this.p = Math.random();
		this.stepCount = 10 + Math.floor(this.p * 15);
	}
	if (this.colidedBlockEntity) {
		if (this.sprite.forceRight) {
			if (this.sprite.forceCount == 0) {
				this.colidedBlockEntity = null;
				this.sprite.forceRight = false;
				if (this.sprite.preForceUp) {
					this.sprite.preForceUp = false;
					this.moveDown(this.speedFactor);
				}
				if (this.sprite.preForceDown) {
					this.sprite.preForceDown = false;
					this.moveUp(this.speedFactor);
				}
				this.sprite.forceCount = 25;
			} else {
				if (ex <= this.colidedBlockEntity.drawPos[0] + this.colidedBlockEntity.sprite.size[0] + 3) {
					this.moveRight(this.speedFactor);
				} else {
					this.colidedBlockEntity = null;
					this.sprite.forceRight = false;
				}
				this.sprite.forceCount--;
			}
		}
		if (this.sprite.forceLeft) {
			if (this.sprite.forceCount == 0) {
				this.colidedBlockEntity = null;
				this.sprite.forceLeft = false;
				if (this.sprite.preForceUp) {
					this.sprite.preForceUp = false;
					this.moveDown(this.speedFactor);
				}
				if (this.sprite.preForceDown) {
					this.sprite.preForceDown = false;
					this.moveUp(this.speedFactor);
				}
				this.sprite.forceCount = 25;
			} else {
				if (ex + ew + 3 >= this.colidedBlockEntity.drawPos[0]) {
					this.moveLeft(this.speedFactor);
				} else {
					this.colidedBlockEntity = null;
					this.sprite.forceLeft = false;
				}
				this.sprite.forceCount--;
			}
		}
		if (this.sprite.forceUp) {
			if (this.sprite.forceCount == 0) {
				this.colidedBlockEntity = null;
				this.sprite.forceUp = false;
				if (this.sprite.preForceLeft) {
					this.sprite.preForceLeft = false;
					this.moveDown(this.speedFactor);
				}
				if (this.sprite.preForceRight) {
					this.sprite.preForceRight = false;
					this.moveUp(this.speedFactor);
				}
				this.sprite.forceCount = 25;
			} else {
				if (ey + eh + 3>= this.colidedBlockEntity.drawPos[1]) {
					this.moveUp(this.speedFactor);
				} else {
					this.colidedBlockEntity = null;
					this.sprite.forceUp = false;
				}
				this.sprite.forceCount--;
			}
		}
		if (this.sprite.forceDown) {
			if (this.sprite.forceCount == 0) {
				this.colidedBlockEntity = null;
				this.sprite.forceDown = false;
				if (this.sprite.preForceLeft) {
					this.sprite.preForceLeft = false;
					this.moveDown(this.speedFactor);
				}
				if (this.sprite.preForceRight) {
					this.sprite.preForceRight = false;
					this.moveUp(this.speedFactor);
				}
				this.sprite.forceCount = 25;
			} else {
				if (ey <= this.colidedBlockEntity.drawPos[1] + this.colidedBlockEntity.sprite.size[1] + 3) {
					this.moveDown(this.speedFactor);
				} else {
					this.colidedBlockEntity = null;
					this.sprite.forceDown = false;
				}
				this.sprite.forceCount--;
			}
		}
	} else {				
		if (ey < py) {
			if (ex < px) {
				if (py - ey < 3) {
					this.moveRight(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceDown = true;
						this.sprite.preForceRight = true;
					}
				} else if (px - ex < 3) {
					this.moveDown(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceRight = true;
						this.sprite.preForceDown = true;
					}
				} else {
					if (this.p > 0.75631) {
						this.moveDown(this.speedFactor);
						this.moveRight(this.speedFactor);
						this.colidedBlockEntity = null;
					} else if (this.p > 0.5) {
						this.moveDown(this.speedFactor);
						if (this.colidedBlockEntity) {
							this.sprite.forceRight = true;
							this.sprite.preForceDown = true;
						}
					} else if (this.p > 0.24369) {
						this.moveRight(this.speedFactor);
						if (this.colidedBlockEntity) {
							this.sprite.forceDown = true;
							this.sprite.preForceRight = true;
						}
					} else {
						this.moveDown(this.speedFactor);
						this.moveRight(this.speedFactor);
						this.colidedBlockEntity = null;
					}
				}				
			} else if (ex > px) {
				if (py - ey < 3) {
					this.moveLeft(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceDown = true;
						this.sprite.preForceLeft = true;
					}
				} else if (ex - px < 3) {
					this.moveDown(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceLeft = true;
						this.sprite.preForceDown = true;
					}
				} else {
					if (this.p > 0.75631) {
						this.moveDown(this.speedFactor);
						this.moveLeft(this.speedFactor);
						this.colidedBlockEntity = null;
					} else if (this.p > 0.5) {
						this.moveDown(this.speedFactor);
						if (this.colidedBlockEntity) {
							this.sprite.forceLeft = true;
							this.sprite.preForceDown = true;
						}
					} else if (this.p > 0.24369) {
						this.moveLeft(this.speedFactor);
						if (this.colidedBlockEntity) {
							this.sprite.forceDown = true;
							this.sprite.preForceLeft = true;
						}
					} else {
						this.moveDown(this.speedFactor);
						this.moveLeft(this.speedFactor);
						this.colidedBlockEntity = null;
					}
				}
			} else{
				this.moveDown(this.speedFactor);
				if (this.colidedBlockEntity) {
					this.sprite.forceRight = true;
					this.sprite.preForceDown = true;
				}
			}
			this.stepCount--;
		} else if (ey > py) {
			if (ex < px) {
				if (ey - py < 3) {
					this.moveRight(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceUp = true;
						this.sprite.preForceRight = true;
					}
				} else if (px - ex < 3) {
					this.moveUp(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceRight = true;
						this.sprite.preForceUp = true;
					}
				} else {
					if (this.p > 0.75631) {
						this.moveUp(this.speedFactor);
						this.moveRight(this.speedFactor);
						this.colidedBlockEntity = null;
					} else if (this.p > 0.5) {
						this.moveUp(this.speedFactor);
						if (this.colidedBlockEntity) {
							this.sprite.forceRight = true;
							this.sprite.preForceUp = true;
						}
					} else if (this.p > 0.24369) {
						this.moveRight(this.speedFactor);
						if (this.colidedBlockEntity) {
							this.sprite.forceUp = true;
							this.sprite.preForceRight = true;
						}
					} else {
						this.moveUp(this.speedFactor);
						this.moveRight(this.speedFactor);
						this.colidedBlockEntity = null;
					}
				}
			} else if (ex > px) {
				if (ey - py < 3) {
					this.moveLeft(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceUp = true;
						this.sprite.preForceLeft = true;
					}
				} else if (ex - px < 3) {
					this.moveUp(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceLeft = true;
						this.sprite.preForceUp = true;
					}
				} else {
					if (this.p > 0.75631) {
						this.moveUp(this.speedFactor);
						this.moveLeft(this.speedFactor);
						this.colidedBlockEntity = null;
					} else if (this.p > 0.5) {
						this.moveUp(this.speedFactor);
						if (this.colidedBlockEntity) {
							this.sprite.forceLeft = true;
							this.sprite.preForceUp = true;
						}
					} else if (this.p > 0.24369) {
						this.moveLeft(this.speedFactor);
						if (this.colidedBlockEntity) {
							this.sprite.forceUp = true;
							this.sprite.preForceLeft = true;
						}
					} else {
						this.moveUp(this.speedFactor);
						this.moveLeft(this.speedFactor);
						this.colidedBlockEntity = null;
					}
				}
			} else{
				this.moveUp(this.speedFactor);
				if (this.colidedBlockEntity) {
					this.sprite.forceLeft = true;
					this.sprite.preForceUp = true;
				}
			}
			this.stepCount--;
		} else if (ex < px) {
			if (ey < py) {
				if (py - ey < 3) {
					this.moveRight(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceDown = true;
						this.sprite.preForceRight = true;
					}
				} else if (px - ex < 3) {
					this.moveDown(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceRight = true;
						this.sprite.preForceDown = true;
					}
				} else {
					if (this.p > 0.75631) {
						this.moveDown(this.speedFactor);
						this.moveRight(this.speedFactor);
						this.colidedBlockEntity = null;
					} else if (this.p > 0.5) {
						this.moveDown(this.speedFactor);
						if (this.colidedBlockEntity) {
							this.sprite.forceRight = true;
							this.sprite.preForceDown = true;
						}
					} else if (this.p > 0.24369) {
						this.moveRight(this.speedFactor);
						if (this.colidedBlockEntity) {
							this.sprite.forceDown = true;
							this.sprite.preForceRight = true;
						}
					} else {
						this.moveDown(this.speedFactor);
						this.moveRight(this.speedFactor);
						this.colidedBlockEntity = null;
					}
				}
			} else if (ey > py) {
				if (ey - py < 3) {
					this.moveRight(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceUp = true;
						this.sprite.preForceRight = true;
					}
				} else if (px - ex < 3) {
					this.moveUp(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceRight = true;
						this.sprite.preForceUp = true;
					}
				} else {
					if (this.p > 0.75631) {
						this.moveUp(this.speedFactor);
						this.moveRight(this.speedFactor);
						this.colidedBlockEntity = null;
					} else if (this.p > 0.5) {
						this.moveUp(this.speedFactor);
						if (this.colidedBlockEntity) {
							this.sprite.forceRight = true;
							this.sprite.preForceUp = true;
						}
					} else if (this.p > 0.24369) {
						this.moveRight(this.speedFactor);
						if (this.colidedBlockEntity) {
							this.sprite.forceUp = true;
							this.sprite.preForceRight = true;
						}
					} else {
						this.moveUp(this.speedFactor);
						this.moveRight(this.speedFactor);
						this.colidedBlockEntity = null;
					}
				}
			} else{
				this.moveRight(this.speedFactor);
				if (this.colidedBlockEntity) {
					this.sprite.forceUp = true;
					this.sprite.preForceRight = true;
				} 	
			}
			this.stepCount--;
		} else if (ex > px) {
			if (ey < py) {
				if (py - ey < 3) {
					this.moveLeft(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceDown = true;
						this.sprite.preForceLeft = true;
					}
				} else if (ex - px < 3) {
					this.moveDown(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceLeft = true;
						this.sprite.preForceDown = true;
					}
				} else {
					if (this.p > 0.75631) {
						this.moveDown(this.speedFactor);
						this.moveLeft(this.speedFactor);
						this.colidedBlockEntity = null;
					} else if (this.p > 0.5) {
						this.moveDown(this.speedFactor);
						if (this.colidedBlockEntity) {
							this.sprite.forceLeft = true;
							this.sprite.preForceDown = true;
						}
					} else if (this.p > 0.24369) {
						this.moveLeft(this.speedFactor);
						if (this.colidedBlockEntity) {
							this.sprite.forceDown = true;
							this.sprite.preForceLeft = true;
						}
					} else {
						this.moveDown(this.speedFactor);
						this.moveLeft(this.speedFactor);
						this.colidedBlockEntity = null;
					}
				}
			} else if (ey > py) {
				if (ey - py < 3) {
					this.moveLeft(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceUp = true;
						this.sprite.preForceLeft = true;
					}
				} else if (ex - px < 3) {
					this.moveUp(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceLeft = true;
						this.sprite.preForceUp = true;
					}
				} else {
					if (this.p > 0.75631) {
						this.moveUp(this.speedFactor);
						this.moveLeft(this.speedFactor);
						this.colidedBlockEntity = null;
					} else if (this.p > 0.5) {
						this.moveUp(this.speedFactor);
						if (this.colidedBlockEntity) {
							this.sprite.forceLeft = true;
							this.sprite.preForceUp = true;
						}
					} else if (this.p > 0.24369) {
						this.moveLeft(this.speedFactor);
						if (this.colidedBlockEntity) {
							this.sprite.forceUp = true;
							this.sprite.preForceLeft = true;
						}
					} else {
						this.moveUp(this.speedFactor);
						this.moveLeft(this.speedFactor);
						this.colidedBlockEntity = null;
					}
				}
			} else{
				this.moveLeft(this.speedFactor);
				if (this.colidedBlockEntity) {
					this.sprite.forceUp = true;
						this.sprite.preForceLeft = true;
				} 	
			}
			this.stepCount--;
		}
	}
}
*/
Entity.prototype.chasePlayer = function() {
	ex = this.drawPos[0];
	ey = this.drawPos[1];
	ew = this.sprite.size[0];
	eh = this.sprite.size[1];
	px = gs.player.drawPos[0];
	py = gs.player.drawPos[1];
					
	if (this.stepCount == 0) {
		this.p = Math.random();
		this.stepCount = 10 + Math.floor(this.p * 15);
	}
	if (this.colidedBlockEntity) {
		if (this.sprite.forceRight) {
			if (ex <= this.colidedBlockEntity.drawPos[0] + this.colidedBlockEntity.sprite.size[0] + 3) {
				this.moveRight(this.speedFactor);
			} else {
				this.colidedBlockEntity = null;
				this.sprite.forceRight = false;
			}
		}
		if (this.sprite.forceLeft) {
			if (ex + ew + 3 >= this.colidedBlockEntity.drawPos[0]) {
				this.moveLeft(this.speedFactor);
			} else {
				this.colidedBlockEntity = null;
				this.sprite.forceLeft = false;
			}
		}
		if (this.sprite.forceUp) {
			if (ey + eh + 3>= this.colidedBlockEntity.drawPos[1]) {
				this.moveUp(this.speedFactor);
			} else {
				this.colidedBlockEntity = null;
				this.sprite.forceUp = false;
			}
		}
		if (this.sprite.forceDown) {
			if (ey <= this.colidedBlockEntity.drawPos[1] + this.colidedBlockEntity.sprite.size[1] + 3) {
				this.moveDown(this.speedFactor);
			} else {
				this.colidedBlockEntity = null;
				this.sprite.forceDown = false;
			}
		}
	} else {				
		if (ey < py) {
			if (ex < px) {
				if (this.p > 0.75631) {
					//this.moveDown(this.speedFactor);
					this.moveDown(this.speedFactor);
					this.moveRight(this.speedFactor);
					this.colidedBlockEntity = null;
				} else if (this.p > 0.5) {
					this.moveDown(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceRight = true;
					}
				} else if (this.p > 0.24369) {
					this.moveRight(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceDown = true;
					}
				} else {
					this.moveDown(this.speedFactor);
					this.moveRight(this.speedFactor);
					this.colidedBlockEntity = null;
				}
				if (py - ey < 3) {
					this.drawPos[1] = py;
				}
				if (px - ex < 3) {
					this.drawPos[0] = px;
				}
			} else if (ex > px) {
				if (this.p > 0.75631) {
					this.moveDown(this.speedFactor);
					this.moveLeft(this.speedFactor);
					this.colidedBlockEntity = null;
				} else if (this.p > 0.5) {
					this.moveDown(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceLeft = true;
					}
				} else if (this.p > 0.24369) {
					this.moveLeft(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceDown = true;
					}
				} else {
					this.moveDown(this.speedFactor);
					this.moveLeft(this.speedFactor);
					this.colidedBlockEntity = null;
				}
				if (py - ey < 3) {
					this.drawPos[1] = py;
				}
				if (ex - px < 3) {
					this.drawPos[0] = px;
				}
			} else{
				this.moveDown(this.speedFactor);
				if (this.colidedBlockEntity) {
					this.sprite.forceRight = true;
				}
				if (py - ey < 3) {
					this.drawPos[1] = py;
				}
			}
			this.stepCount--;
		} else if (ey > py) {
			if (ex < px) {
				if (this.p > 0.75631) {
					this.moveUp(this.speedFactor);
					this.moveRight(this.speedFactor);
					this.colidedBlockEntity = null;
				} else if (this.p > 0.5) {
					this.moveUp(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceRight = true;
					}
				} else if (this.p > 0.24369) {
					this.moveRight(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceUp = true;
					}
				} else {
					this.moveUp(this.speedFactor);
					this.moveRight(this.speedFactor);
					this.colidedBlockEntity = null;
				}
				if (ey - py < 3) {
					this.drawPos[1] = py;
				}
				if (px - ex < 3) {
					this.drawPos[0] = px;
				}
			} else if (ex > px) {
				if (this.p > 0.75631) {
					this.moveUp(this.speedFactor);
					this.moveLeft(this.speedFactor);
					this.colidedBlockEntity = null;
				} else if (this.p > 0.5) {
					this.moveUp(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceLeft = true;
					}
				} else if (this.p > 0.24369) {
					this.moveLeft(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceUp = true;
					}
				} else {
					this.moveUp(this.speedFactor);
					this.moveLeft(this.speedFactor);
					this.colidedBlockEntity = null;
				}
				if (ey - py < 3) {
					this.drawPos[1] = py;
				}
				if (ex - px < 3) {
					this.drawPos[0] = px;
				}
			} else{
				this.moveUp(this.speedFactor);
				if (this.colidedBlockEntity) {
					this.sprite.forceLeft = true;
				}
				if (ey - py < 3) {
					this.drawPos[1] = py;
				}
			}
			this.stepCount--;
		} else if (ex < px) {
			if (ey < py) {
				if (this.p > 0.75631) {
					this.moveDown(this.speedFactor);
					this.moveRight(this.speedFactor);
					this.colidedBlockEntity = null;
				} else if (this.p > 0.5) {
					this.moveDown(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceRight = true;
					}
				} else if (this.p > 0.24369) {
					this.moveRight(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceDown = true;
					}
				} else {
					this.moveDown(this.speedFactor);
					this.moveRight(this.speedFactor);
					this.colidedBlockEntity = null;
				}
				if (py - ey < 3) {
					this.drawPos[1] = py;
				}
				if (px - ex < 3) {
					this.drawPos[0] = px;
				}
			} else if (ey > py) {
				if (this.p > 0.75631) {
					this.moveUp(this.speedFactor);
					this.moveRight(this.speedFactor);
					this.colidedBlockEntity = null;
				} else if (this.p > 0.5) {
					this.moveUp(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceRight = true;
					}
				} else if (this.p > 0.24369) {
					this.moveRight(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceUp = true;
					}
				} else {
					this.moveUp(this.speedFactor);
					this.moveRight(this.speedFactor);
					this.colidedBlockEntity = null;
				}
				if (ey - py < 3) {
					this.drawPos[1] = py;
				}
				if (px - ex < 3) {
					this.drawPos[0] = px;
				}
			} else{
				this.moveRight(this.speedFactor);
				if (this.colidedBlockEntity) {
					this.sprite.forceUp = true;
				}
				if (px - ex < 3) {
					this.drawPos[0] = px;
				}
			}
			this.stepCount--;
		} else if (ex > px) {
			if (ey < py) {
				if (this.p > 0.75631) {
					this.moveDown(this.speedFactor);
					this.moveLeft(this.speedFactor);
					this.colidedBlockEntity = null;
				} else if (this.p > 0.5) {
					this.moveDown(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceLeft = true;
					}
				} else if (this.p > 0.24369) {
					this.moveLeft(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceDown = true;
					}
				} else {
					this.moveDown(this.speedFactor);
					this.moveLeft(this.speedFactor);
					this.colidedBlockEntity = null;
				}
				if (py - ey < 3) {
					this.drawPos[1] = py;
				}
				if (ex - px < 3) {
					this.drawPos[0] = px;
				}
			} else if (ey > py) {
				if (this.p > 0.75631) {
					this.moveUp(this.speedFactor);
					this.moveLeft(this.speedFactor);
					this.colidedBlockEntity = null;
				} else if (this.p > 0.5) {
					this.moveUp(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceLeft = true;
					}
				} else if (this.p > 0.24369) {
					this.moveLeft(this.speedFactor);
					if (this.colidedBlockEntity) {
						this.sprite.forceUp = true;
					}
				} else {
					this.moveUp(this.speedFactor);
					this.moveLeft(this.speedFactor);
					this.colidedBlockEntity = null;
				}
				if (ey - py < 3) {
					this.drawPos[1] = py;
				}
				if (ex - px < 3) {
					this.drawPos[0] = px;
				}
			} else{
				this.moveLeft(this.speedFactor);
				if (this.colidedBlockEntity) {
					this.sprite.forceUp = true;
				}
				if (ex - px < 3) {
					this.drawPos[0] = px;
				}
			}
			this.stepCount--;
		}
	}
}

// Player
Player.prototype = new Entity();
Player.prototype.constructor = Player;
function Player() {
	this.id = 0;
	this.hp = playerInitHp;
	this.addedHp = 0;
	this.addedPwr = 0;
	this.addedDef = 0;
}

// Npc
Npc.prototype = new Entity();
Npc.prototype.constructor = Npc;
function Npc() {
	this.id = 10;
	this.hp = comNpcInitHp;
}

// Weapon
function Weapon(id, name, power, range) {
	this.id     = id;
	this.name   = name;
	this.power  = power;
	this.range  = range;
}

// Sprite
function Sprite(img, pos, size, speed, frames, direction, animateOnce) {
	this.type = 0;
	this.img = img;
	this.pos = pos; // Current first frame position [x, y] of the row in image.
	this.correctPos = null; // CorrectPos for attack frames.
	this.attackPos = null; // First attack frame position [x, y] of the row in image.
	this.tempPos = null;
	this.size = size;
	this.renderSize = null;
	this.speed = speed || 0;
	this.frames = frames;
	this.direction = direction || 'h';
	this.animateOnce = animateOnce;
	this.animateOnceDone = false;
	this.attackState = false;
	this.idx = 0;
	this.forceRight = false;
	this.forceLeft = false;
	this.forceUp = false;
	this.forceDown = false;
	// this.forceCount = 25;
	// this.preForceRight = false;
	// this.preForceLeft = false;
	// this.preForceUp = false;
	// this.preForceDown = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.moveUp = false;
	this.moveDown = false;
	this.moveFrame = 0;
	this.isFlash = 0;
	this.flashFrame = 0;
	this.frameRowCount = 4;
	this.frameSpeedFactor = frameSpeedFactorPlayer;
}
Sprite.prototype.update = function(dt) {
	this.idx += this.speed * dt;
}
Sprite.prototype.flash = function() {
	this.isFlash = true;
}
Sprite.prototype.animateUp = function() {
	this.moveDown = this.moveLeft = this.moveRight = false;
	this.moveUp = true;
	if(this.moveFrame == this.frameRowCount * this.frameSpeedFactor - 1)
		this.moveFrame = 0;
	else
		this.moveFrame += 1;
}
Sprite.prototype.animateDown = function() {
	this.moveUp = this.moveLeft = this.moveRight = false;
	this.moveDown = true;
	if(this.moveFrame == this.frameRowCount * this.frameSpeedFactor - 1)
		this.moveFrame = 0;
	else
		this.moveFrame += 1;
}
Sprite.prototype.animateLeft = function() {
	this.moveDown = this.moveUp = this.moveRight = false;
	this.moveLeft = true;
	if(this.moveFrame == this.frameRowCount * this.frameSpeedFactor - 1)
		this.moveFrame = 0;
	else
		this.moveFrame += 1;
}
Sprite.prototype.animateRight = function() {
	this.moveDown = this.moveLeft = this.moveUp = false;
	this.moveRight = true;
	if(this.moveFrame == this.frameRowCount * this.frameSpeedFactor - 1)
		this.moveFrame = 0;
	else
		this.moveFrame += 1;
}
Sprite.prototype.animateAttack = function() {
	this.tempPos = this.pos;
	this.pos = this.attackPos;
	this.moveFrame = 0;
	this.idx = 0;
	this.attackState = true;
}
Sprite.prototype.render = function(ctx) {
	var frame = 0;
	var x = this.pos[0];
	var y = this.pos[1];
	if (this.type == 1 && this.attackState) {
		frame = Math.floor(this.moveFrame / this.frameSpeedFactor);
		this.moveFrame = this.moveFrame + 1;
		if (this.moveLeft) {
			y = this.pos[1];
		}
		if (this.moveRight) {
			y = this.pos[1] + this.renderSize[0][1];
		}
		if (this.moveDown) {
			y = this.pos[1] + this.renderSize[0][1] + this.renderSize[1][1];
		}
		if (this.moveUp) {
			y = this.pos[1] + this.renderSize[0][1] + this.renderSize[1][1] + this.renderSize[2][1];
		}
		if (this.direction == 'v') {
			if (this.moveLeft) {
				y += frame * this.renderSize[0][1];
			}
			if (this.moveRight) {
				y += frame * this.renderSize[1][1];
			}
			if (this.moveDown) {
				y += frame * this.renderSize[2][1];
			}
			if (this.moveUp) {
				y += frame * this.renderSize[3][1];
			}
		} else {
			if (this.moveLeft) {
				x += frame * this.renderSize[0][0];
			}
			if (this.moveRight) {
				x += frame * this.renderSize[1][0];
			}
			if (this.moveDown) {
				x += frame * this.renderSize[2][0];
			}
			if (this.moveUp) {
				x += frame * this.renderSize[3][0];
			}
		}
		if (this.moveLeft) {
			ctx.drawImage(this.img, x, y, this.renderSize[0][0], this.renderSize[0][1], this.correctPos[0][0], this.correctPos[0][1], this.renderSize[0][0], this.renderSize[0][1]);
		}
		if (this.moveRight) {
			ctx.drawImage(this.img, x, y, this.renderSize[1][0], this.renderSize[1][1], this.correctPos[1][0], this.correctPos[1][1], this.renderSize[1][0], this.renderSize[1][1]);
		}
		if (this.moveDown) {
			ctx.drawImage(this.img, x, y, this.renderSize[2][0], this.renderSize[2][1], this.correctPos[2][0], this.correctPos[2][1], this.renderSize[2][0], this.renderSize[2][1]);
		}
		if (this.moveUp) {
			ctx.drawImage(this.img, x, y, this.renderSize[3][0], this.renderSize[3][1], this.correctPos[3][0], this.correctPos[3][1], this.renderSize[3][0], this.renderSize[3][1]);
		}
		if (frame == 3){
			this.pos = this.tempPos;
			this.moveFrame = 0;
			this.attackState = false;
		}
	} else {
		if (this.speed > 0) {
			var max = this.frames.length;
			var idx = Math.floor(this.idx);
			frame = this.frames[idx % max];
			if (this.animateOnce && idx >= max) {
				this.animateOnceDone = true;
				this.idx = 0;
				return;
			}
		} else {
			frame = Math.floor(this.moveFrame / this.frameSpeedFactor);
			if (this.type == 2) {
				y = this.pos[1];
			} else {
				if (this.moveLeft) {
					y = this.pos[1];
				}
				if (this.moveRight) {
					y = this.pos[1] + this.size[1];
				}
				if (this.moveUp) {
					y = this.pos[1] + this.size[1] * 3;
				}
				if (this.moveDown) {
					y = this.pos[1] + this.size[1] * 2;
				}
			}
		}
		if (this.direction == 'v') {
			y += frame * this.size[1];
		} else {
			x += frame * this.size[0];
		}
		ctx.drawImage(this.img, x, y, this.size[0], this.size[1], 0, 0, this.size[0], this.size[1]);
	}
}

// MonsterGenerator
function MonsterGenerator() { }
MonsterGenerator.prototype.generateMomo = function(number, weapon) {
	for (var i = 0; i < number; i++) {
		var momo = new Npc();
		momo.speedFactor = speedFactorMomo;
		momo.hp = momoInitHp;
		momo.id = momoId;
		momo.sprite = new Sprite(images[5], [0, 0], [47, 70], 0, [0, 1, 2, 3]);
		momo.sprite.type = 1;
		momo.sprite.renderSize = [[65, 70], [65, 70], [48, 70], [48, 80]];
		momo.sprite.correctPos = [[-20, 0], [0, 0], [0, 0], [0, 0]];
		momo.sprite.attackPos = [0, 280];
		momo.sprite.frameSpeedFactor = frameSpeedFactorMomo;
		momo.isAttackPlayer = true;
		momo.weapon = weapon;
		momo.drawPos = givePos(momo.sprite.size);
		momo.actPos = [momo.drawPos[0] + 5, momo.drawPos[1] + 46];
		momo.actSize = [38, 21];
		allEntities.push(momo);
	}
}
MonsterGenerator.prototype.generateGhostFire = function(number, weapon) {
	for (var i = 0; i < number; i++) {
		var gf = new Npc();
		gf.speedFactor = speedFactorGhostFire;
		gf.hp = ghostFireInitHp;
		gf.id = gfId;
		gf.sprite = new Sprite(images[6], [0, 0], [70, 75], 0, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
		gf.sprite.frameRowCount = 12;
		gf.sprite.frameSpeedFactor = frameSpeedFactorGhostFire;
		gf.weapon = weapon;
		gf.drawPos = givePos(gf.sprite.size);
		gf.actPos = [gf.drawPos[0] + 15, gf.drawPos[1] + 59];
		gf.actSize = [39, 15];
		gf.sprite.type = 2;
		gf.isAttackPlayer = true;
		allEntities.push(gf);
	}
}
MonsterGenerator.prototype.generateFluffy = function(number, weapon) {
	for (var i = 0; i < number; i++) {
		var flfy = new Npc();
		flfy.speedFactor = speedFactorFlfy;
		flfy.hp = flfyInitHp;
		flfy.id = flfyId;
		flfy.sprite = new Sprite(images[8], [0, 0], [60, 80], 0, [0, 1, 2, 3]);
		flfy.sprite.type = 1;
		flfy.sprite.renderSize = [[89, 76], [89, 76], [76, 86], [72, 100]];
		flfy.sprite.correctPos = [[-20, 0], [0, 0], [0, 0], [0, -20]];
		flfy.sprite.attackPos = [0, 320];
		flfy.sprite.frameSpeedFactor = frameSpeedFactorFlfy;
		flfy.isAttackPlayer = true;
		flfy.weapon = weapon;
		flfy.drawPos = givePos(flfy.sprite.size);
		flfy.actPos = [flfy.drawPos[0] + 14, flfy.drawPos[1] + 63];
		flfy.actSize = [34, 17];
		allEntities.push(flfy);
	}
}
MonsterGenerator.prototype.generateWitch = function(number, weapon) {
	for (var i = 0; i < number; i++) {
		var witch = new Npc();
		witch.speedFactor = speedFactorWitch;
		witch.id = witchId;
		witch.hp = witchInitHp;
		witch.sprite = new Sprite(images[9], [0, 0], [56, 80], 0, [0, 1, 2, 3]);
		witch.sprite.type = 1;
		witch.sprite.renderSize = [[82, 64], [82, 64], [48, 112], [48, 112]];
		witch.sprite.correctPos = [[-26, 0], [0, 4], [0, 0], [6, -32]];
		witch.sprite.attackPos = [0, 320];
		witch.sprite.frameSpeedFactor = frameSpeedFactorWitch;
		witch.isAttackPlayer = true;
		witch.weapon = weapon;
		witch.drawPos = givePos(witch.sprite.size);
		witch.actPos = [witch.drawPos[0] + 13, witch.drawPos[1] + 57];
		witch.actSize = [31, 20];
		allEntities.push(witch);
	}
}

// BlockGenerator
function BlockGenerator() { }
BlockGenerator.prototype.generateBlocks = function(stage, randWood) {
	// [x, y, w, h]
	var blockArr = new Array();
	if (stage == 1) {
		blockArr = [[468, 0, 532, 47], [425, 47, 574, 122], [814, 169, 80, 33], [929, 169, 71, 79],
			[0, 572, 842, 35], [0, 607, 878, 47], [0, 654, 913, 46]];
		blockImgIds = 10;
		blockDrawSize = [84, 70];
		blockActSize = [45, 30];
		blockPosDiff = [19, 40];		
	} else if (stage == 2) {
		blockArr = [[481, 0, 518, 78], [440, 78, 560, 90], [947, 163, 50, 374],
			[645, 547, 355, 153]];
		blockImgIds = 11;
		blockDrawSize = [44, 44];
		blockActSize = [44, 22];
		blockPosDiff = [0, 22];	
	} else if (stage == 3) {
		blockArr = [[633, 0, 367, 73], [945, 73, 55, 550], [633, 595, 367, 105]];
		blockImgIds = 12;
		blockDrawSize = [97, 122];
		blockActSize = [77, 60];
		blockPosDiff = [7, 62];
	}else {
		blockArr = [[0, 0, 95, 1000], [900, 0, 100, 1000], [95, 604, 805, 96], [750, 520, 150, 80]];
	}
	for (var i = 0; i < blockArr.length; i++) {
		var block = new Entity();
		block.actPos = [blockArr[i][0], blockArr[i][1]];
		block.actSize = [blockArr[i][2], blockArr[i][3]];
		block.sprite = new Sprite(images[2], [0, 0], [blockArr[i][2], blockArr[i][3]], 2, [0]);
		block.drawPos = [blockArr[i][0], blockArr[i][1]];
		block.id = blockId;
		allBlockEntities.push(block);
	}
	// Random Woods
	for (var i = 0; i < randWood; i++) {
		var block = new Entity();
		block.sprite = new Sprite(images[blockImgIds], [0, 0], blockDrawSize);
		block.actSize = blockActSize;
		block.drawPos = givePos([block.sprite.size[0], block.sprite.size[1]]);
		block.actPos = [block.drawPos[0] + blockPosDiff[0], block.drawPos[1] + blockPosDiff[1]];
		block.id = blockId;
		allBlockEntities.push(block);
	}
}

// GameState
function GameState() {
	this.player = new Player();
	this.isGameOver = false;
	this.isGameCompleted = false;
	this.inBattle = false;
}
GameState.prototype.renderStats = function() {
	if (this.player.hp < 0) {
		this.player.hp = 0;
	}
	if (gs.inBattle) {
		document.getElementById('game-stats').style.display = 'block';
	} else {
		document.getElementById('game-stats').style.display = 'none';
	}
	document.getElementById('hp').innerText = this.player.hp;
	document.getElementById('hp-bar').style.width = ((this.player.hp / (playerInitHp + gs.player.addedHp)) * 100 * 2).toString() + 'px';
}

// Sound
function Sound() {
	this.sfx = new Array();
	this.bgm = new Array();
	this.currentBgmIdx = null;
	this.muted = false;
}
Sound.prototype.init = function() {
	// Sound Effects
	// for (var i = 0; i < sfx.length; i++) {
		// this.sfx.push(new Audio(sfx[i]));
	// }
	// BGM
	for (var i = 0; i < bgm.length; i++) {
		var curBgm = new Audio(bgm[i]);
		curBgm.loop = true;
		this.bgm.push(curBgm);
	}
}
Sound.prototype.changeBgm = function(idx) {
	if (!this.muted) {
		if (this.currentBgmIdx != null) {
			this.bgm[this.currentBgmIdx].pause();
		}
		this.currentBgmIdx = idx;
		if (this.bgm[idx].readyState == 4) {
			this.bgm[idx].currentTime = 0;
		}
		this.bgm[idx].play();
	}
}
Sound.prototype.stopBgm = function() {
	if (this.currentBgmIdx != null) {
		this.bgm[this.currentBgmIdx].pause();
		this.currentBgmIdx = null;
	}
}
Sound.prototype.playSfx = function(idx) {
	if (!this.muted) {
		var aud = new Audio(sfx[idx]);
		aud.play();
	}
}
Sound.prototype.mute = function() {
	if (!this.muted && this.currentBgmIdx != null) {
		this.bgm[this.currentBgmIdx].pause();
	}
	if (this.muted && this.currentBgmIdx != null) {
		this.bgm[this.currentBgmIdx].play();
	}
	this.muted = !this.muted;
}

// Stage
function Stage(id) {
	this.id = id;
	this.blockGen = new BlockGenerator();
	this.monsterGen = new MonsterGenerator();
	this.started = false;
	this.completed = false;
	this.beginFullHealth = true;
	this.nextStageId = 0;
}
Stage.prototype.prepare = function() {
	allEntities = new Array();
	allBlockEntities = new Array();
	if (this.beginFullHealth) {
		gs.player.hp = playerInitHp + gs.player.addedHp;
	}
	curBackground = null;
	gs.inBattle = false;
	this.clearHtmlPanel();
}
Stage.prototype.setBackground = function(idx) {
	curBackground = images[idx];
}
Stage.prototype.showHtmlPanel = function(useHalfTransparentBg) {
	if (useHalfTransparentBg) {
		panel.style.backgroundImage = 'url(images/80tran.png)';
	} else {
		panel.style.backgroundImage = '';
	}
	panel.style.display = 'block';
}
Stage.prototype.clearHtmlPanel = function() {
	while (panel.firstChild) {
		panel.removeChild(panel.firstChild);
	}
	panel.style.display = 'none';
}
Stage.prototype.handleInput = function(dt) {
	if (gs.inBattle) {
		// if (input.isPress('UP') && input.isPress('LEFT') ||
			 // input.isPress('UP') && input.isPress('RIGHT') ||
			// input.isPress('DOWN') && input.isPress('LEFT') ||
			// input.isPress('DOWN') && input.isPress('RIGHT')){
			// dt = dt / Math.sqrt(2);
		// }
		// Direction Movements
		if (input.isPress('UP')) {
			gs.player.moveUp(dt);
		}
		if (input.isPress('DOWN')) {
			gs.player.moveDown(dt);
		}
		if (input.isPress('LEFT')) {
			gs.player.moveLeft(dt);
		}
		if (input.isPress('RIGHT')) {
			gs.player.moveRight(dt);
		}
		// Attack
		if (input.isPress('Z')) {
			gs.player.attack();
		}
	}
}
Stage.prototype.monitor = function() { }
Stage.prototype.render = function() { }

// Dialog
function Dialog() { }
Dialog.prototype.show = function(imgIdx, name, text, textTwo, textThree) {
	ctx.drawImage(images[imgIdx], 0, 0, 1000, 700);
	ctx.font = '30px Verdana';
	ctx.fillStyle = '#fff';
	ctx.fillText(name, 90, 480);
	ctx.font = '25px Verdana';
	ctx.fillStyle = '#fff';
	ctx.fillText(text, 115, 550);
	if (textTwo) {
		ctx.fillText(textTwo, 115, 595);
	}
	if (textThree) {
		ctx.fillText(textThree, 115, 640);
	}
}

// Effect
function Effect() {
	this.frameCount = 0;
	this.alpha = 1;
}
Effect.prototype.fadeIn = function() {
	if (this.alpha.toFixed(2) > 0.01) {
		this.frameCount++;
		if (this.frameCount % 3 == 0) {
			this.alpha -= 0.03;
		}
		ctx.globalAlpha = this.alpha;
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, 1000, 700);
		ctx.globalAlpha = 1;
		return false;
	} else {
		this.frameCount = 0;
		this.alpha = 1;
		return true;
	}
}
Effect.prototype.fadeOut = function() {
	if (this.frameCount == 0) {
		this.alpha = 0;
	}
	if (this.alpha.toFixed(2) < 0.99) {
		this.frameCount++;
		if (this.frameCount % 3 == 0) {
			this.alpha += 0.03;
		}
		ctx.globalAlpha = this.alpha;
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, 1000, 700);
		ctx.globalAlpha = 1;
		return false;
	} else {
		this.frameCount = 0;
		this.alpha = 1;
		return true;
	}
}
