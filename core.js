try {
	// Initializes the GameState.
	var gs = new GameState();
	
	// Stores all entity objects.
	var allEntities = new Array();
	
	// Stores all block objects.
	var allBlockEntities = new Array();
	
	// Stores all stage objects.
	var allStages = new Array();
	var curStage = null;
	var gameOverStage = null;
	var upgradeStage = null;
	
	// Sound System
	var sound = new Sound();
	
	// Dialog System
	var dialog = new Dialog();
	
	// Effect System
	var effect = new Effect();
	
	// Current Background
	var curBackground = null;
	
	// Player's Weapon
	var magicSword = null;
	
	// NPC's Weapon;
	var fluffyWeapon = new Weapon(0, 'fluffy', 5, [100, 32]);
	var ghostFireWeapon = new Weapon(0, 'gf', 1, [100, 32]);
	var momoWeapon = new Weapon(0, 'momo', 10, [100, 32]);
	var witchWeapon = new Weapon(0, 'witch', 8, [100, 32]);

	// Frame Count for certain Functions
	var frameCount = 0;
	
	// For Holding Key
	var holdKey = false;
	
	// Value for Animations
	var dt = null;
	
	// Creates canvas context.
	var canvas = document.getElementById('game-screen');
	canvas.width = 1000;
	canvas.height = 700;
	var ctx = canvas.getContext && canvas.getContext('2d');
	// Preloads all images that will be used throughout the game.
	var images = [];
	preloadImages(imgPaths).done(function(imgArr) {
		images = imgArr;
		initGame();
	});
	
	// HTML Panel
	var panel = document.getElementById('ingame-html');
	
	// Updates all entities.
	function updateEntities(dt) {
		for (var i = 0; i < allEntities.length; i++) {
			// Checks whether the entity is dead.
			if (allEntities[i].hp <= 0) {
				if (!allEntities[i].id && allEntities[i].id == witchId) {
					witchCount--;
					witchGenMonster -= witchGenMonsterTime;
					if (witchGenMonster < 0) {
						witchGenMonster = 0;
					}
				}
				// Eliminates the dead entity.
				allEntities.splice(i, 1);
			} else {
				allEntities[i].sprite.update(dt);
			}
		}
	}
	
	// Updates the scene.
	function update(dt) {
		curStage.handleInput(dt);
		updateEntities(dt);
	}
	
	// Renders a single entity.
	function renderEntity(entity) {
		ctx.save();
		ctx.translate(entity.drawPos[0], entity.drawPos[1]);
		if (!entity.sprite.attackState) {
			entity.holdAttack = false;
		}
		if (entity.isAttackPlayer) {
			if (entity.id == witchId) {
				entity.witchSpecialAction();
			}
			if (entity.colidedEntity && entity.colidedEntity.id == 0) {
				entity.attack();
				entity.colidedEntity = null;
			} else if (!entity.holdAttack) {
				entity.chasePlayer();
			}
		}
		if (entity.sprite.isFlash) {
			if (entity.sprite.flashFrame >= 8) {
				entity.sprite.isFlash = false;
				entity.sprite.flashFrame = 0;
			} else {
				entity.sprite.flashFrame++;
				ctx.globalAlpha = 0.2;
			}
		}
		entity.sprite.render(ctx);
		ctx.globalAlpha = 1;
		ctx.restore();
	}
	
	// Renders all entities.
	function renderEntities() {
		var globalEntities = [];
		globalEntities = allEntities.concat(allBlockEntities);
		
		for (var i = 1; i < globalEntities.length; i++) {
			for (var j = i; j > 0; j--) {
				if (globalEntities[j].drawPos[1] < globalEntities[j - 1].drawPos[1] ||
					globalEntities[j - 1].drawPos[1] < globalEntities[j].drawPos[1] &&
					globalEntities[j].actPos[1] < globalEntities[j - 1].actPos[1] + globalEntities[j - 1].actSize[1]) {
					tempEntity = globalEntities[j];
					globalEntities[j] = globalEntities[j - 1];
					globalEntities[j - 1] = tempEntity;
				}
			}
		}
	
		// Renders all characters and blocks.
		for (var i = 0; i < globalEntities.length; i++) {
			renderEntity(globalEntities[i]);
		}
	}
	
	// Renders the background.
	function renderBackground() {
		if (curBackground) {
			ctx.drawImage(curBackground, 0, 0, 1000, 700, 0, 0, 1000, 700);
		} else {
			ctx.fillStyle = '#000';
			ctx.fillRect(0, 0, 1000, 700);
		}
	}
	
	// Renders everything.
	function render() {
		renderBackground();
		renderEntities();
		// Allows current stage to render its own stuff.
		curStage.render();
	}
	
	// Main Loop
	var time;
	function main() {
		// Stage Monitoring and Changing
		curStage.monitor();
		if (curStage.completed) {
			curStage.completed = false;
			if (curStage.nextStageId == 3) {
				curStage = upgradeStage;
			} else {
				for (var i = 0; i < allStages.length; i++) {
					if (allStages[i].id == curStage.nextStageId) {
						curStage = allStages[i];
						break;
					}
				}
			}
			curStage.start();
		}
		now = Date.now();
		dt = (now - time) / 1000.0;
		update(dt);
		render();
		// Game Over
		if (gs.player.hp <= 0) {
			gs.isGameOver = true;
			if (effect.fadeOut()) {
				gs.player.hp = 1;
				curStage = gameOverStage;
				curStage.start();
			}
		}
		time = now;
		gs.renderStats();
		rAF(main);
	}
	
	// Initializes the game.
	function initGame() {
		// Initializes Sound System.
		sound.init();
		
		// Player's Sprite
		gs.player.sprite = new Sprite(images[4], [0, 0], [54, 71], 0, [0, 1, 2, 3]);
		gs.player.sprite.type = 1;
		gs.player.sprite.renderSize = [[64, 71], [64, 71], [60, 70], [48, 72]];
		gs.player.sprite.correctPos = [[-20, -3], [10, 0], [0, 4], [0, 0]];
		gs.player.sprite.attackPos = [0, 284];
		gs.player.sprite.frameSpeedFactor = frameSpeedFactorPlayer;
		gs.player.actSize = [22, 28];
		magicSword = new Weapon(0, 'Magic Sword', 10, [50, 32]);
		
		// Loads stages.
		gameOverStage = new StageGameOver();
		upgradeStage = new StageUpgrade();
		allStages.push(new StageStart());
		allStages.push(new StageTutorial());
		allStages.push(new StageVillageBegin());
		allStages.push(new StageOne());
		allStages.push(new StageTwo());
		allStages.push(new StageThree());
		allStages.push(new StageBeforeBoss());
		allStages.push(new StageFour());
		allStages.push(new StageAfterBoss());
		allStages.push(new StageComplete());
		curStage = allStages[0];
		curStage.start();
		
		time = Date.now();
		// Starts Main Loop.
		main();
	}
} catch (error) {
	alert('********** ERROR **********\n\n' + error + '\n\nGame stopped.');
}
