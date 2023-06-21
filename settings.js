/**
 * Image Paths
 */
var imgPaths = [];
imgPaths[0] = 'images/village_w_ppl.png';
imgPaths[1] = 'images/background1.png';
imgPaths[2] = 'images/block.png';
imgPaths[3] = null;
imgPaths[4] = 'images/prince_moving_54_71_attack_LR_64_71_D_60_70_U_48_72.png';
imgPaths[5] = 'images/momo_moving_47_70_attack_LR_65_70_D_48_70_U_48_80.png';
imgPaths[6] = 'images/ghost_70_75.png';
imgPaths[7] = null; //'images/background.png';
imgPaths[8] = 'images/fluffy_moving_60_80_attack_LR_89_76_D_76_86_U_72_100.png';
imgPaths[9] = 'images/witch_moving_56_80_attack_LR_82_64_DU_48_112.png';
imgPaths[10] = 'images/wood84x70.png';
imgPaths[11] = 'images/pumpkin44x44.png';
imgPaths[12] = 'images/fireTree.png';
imgPaths[13] = 'images/Start_00.png';
imgPaths[14] = 'images/Start_01.png';
imgPaths[15] = 'images/Start_02.png';
imgPaths[16] = 'images/Start_03.png';
imgPaths[17] = 'images/Start_04.png';
imgPaths[18] = null//'images/village.png';
imgPaths[19] = 'images/dlg/H-to-C.png';
imgPaths[20] = 'images/dlg/H-to-J(Head).png';
imgPaths[21] = 'images/dlg/H-to-KIDS.png';
imgPaths[22] = 'images/dlg/H-to-L(happy).png';
imgPaths[23] = 'images/dlg/H-to-L(worries).png';
imgPaths[24] = 'images/dlg/H-to-W.png';
imgPaths[25] = null;
imgPaths[26] = null;
imgPaths[27] = null;
imgPaths[28] = null;
imgPaths[29] = null;
imgPaths[30] = 'images/background2.png';
imgPaths[31] = 'images/background3.png';
imgPaths[32] = 'images/finalbackground.png';
imgPaths[33] = 'images/gameover.png';
imgPaths[34] = 'images/theend.png';
imgPaths[35] = 'images/finalbackground(pre-bossFight).png';
imgPaths[36] = 'images/finalbackground(afterKilledWitch).png';
imgPaths[37] = 'images/operations.png';

/**
 * Sound Effects
 */
// Effects
var sfx = new Array();
sfx[0] = 'sounds/swing.mp3';
sfx[1] = 'sounds/hurt.mp3';
sfx[2] = 'sounds/ding.mp3';
sfx[3] = 'sounds/start.mp3';
sfx[4] = 'sounds/confirm.mp3';
sfx[5] = 'sounds/death.mp3';
sfx[6] = 'sounds/monsterGen.mp3';
sfx[7] = 'sounds/monsterAttack.mp3';

// BGM
var bgm = new Array();
bgm[0] = 'sounds/title.mp3';
bgm[1] = 'sounds/worried.mp3';
bgm[2] = 'sounds/gameover.mp3';
bgm[3] = 'sounds/complete.mp3';
bgm[4] = 'sounds/map1.mp3';
bgm[5] = 'sounds/tense.mp3';
bgm[6] = 'sounds/released.mp3';
bgm[7] = 'sounds/boss.mp3';

/**
 * Player Settings
 */
// Player's Initial Position
var playerInitX = 500;
var playerInitY = 350;
// Player's Initial HP
var playerInitHp = 100;
// Player's Speed
var playerSpeed = 200;

/**
 * NPC Settings
 */
// Common NPC's Initial HP
var comNpcInitHp = 15;
var flfyInitHp = 20;
var ghostFireInitHp = 25;
var momoInitHp = 200;
var witchInitHp = 500;

// Witch special control
var witchStage = 1;
var witchGenMonsterTime = 10;
var witchGenMonster = witchGenMonsterTime;
var witchCount = 1;

/**
 * ID
 */
// Default Entity ID
var defaultId = 10;
// Block ID
var blockId = 100;
// Witch ID
var witchId = 20;
var flfyId = 30;
var gfId = 40;
var momoId = 50;
/**
 * Others
 */
// System Controlled Character's Speed Factors
var speedFactorPlayer = 0.01;
var speedFactorFlfy = 0.01;
var speedFactorGhostFire = 0.012; //0.02
var speedFactorMomo = 0.008; //0.005
var speedFactorWitch = 0.01;
// Frame Speed Factor for certain Animations
var frameSpeedFactorPlayer = 5;
var frameSpeedFactorFlfy = 6;
var frameSpeedFactorGhostFire = 5;
var frameSpeedFactorMomo = 16;
var frameSpeedFactorWitch = 7;
