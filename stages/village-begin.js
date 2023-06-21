StageVillageBegin.prototype = new Stage(4);
StageVillageBegin.prototype.constructor = StageVillageBegin;
function StageVillageBegin() {
	this.nextStageId = 5;
	this.doneFadeIn = false;
	this.dialogIdx = 0;
	this.doneTalking = false;
	this.partOneWalk = false;
	this.partOneTalk = false;
	this.partTwoWalk = false;
	this.partTwoTalk = false;
	this.partThreeWalk  = false;
	this.partThreeTalk = false;
	this.walking = false;
}
StageVillageBegin.prototype.start = function() {
	this.prepare();
	sound.changeBgm(1);
	this.setBackground(0);
	gs.player.sprite.moveRight = true;
	gs.player.drawPos = [0, playerInitY + 30];
	gs.player.actPos = [17, playerInitY + 72];
	allEntities.push(gs.player);
}
StageVillageBegin.prototype.render = function() {
	if (!this.doneFadeIn) {
		this.doneFadeIn = effect.fadeIn();
	} else if (!this.partOneWalk) {
		this.walking = true;
		if (gs.player.moveRightTo(dt, 586)) {
			this.partOneWalk = gs.player.moveUpTo(dt, 352);
		}
	} else if (!this.partOneTalk) {
		this.walking = false;
		if (this.dialogIdx == 0) {
			dialog.show(23, 'Hansel', 'Hi, Lady Margaret! Why are you looking so worried?');
		} else if (this.dialogIdx == 1) {
			dialog.show(23, 'Lady Margaret', 'My kids have lost for few days!');
		} else if (this.dialogIdx == 2) {
			dialog.show(23, 'Hansel', 'I could help you to find them. By the way,', 'I haven’t seen Uncle Sam these days. Where is he?');
		} else if (this.dialogIdx == 3) {
			dialog.show(23, 'Lady Margaret', 'My husband (Uncle Sam) went to the forest and tried to find', 'them few days ago. But then, he doesn’t come back anymore.',
				'I am really worried what happened to them…');
		} else if (this.dialogIdx == 4) {
			dialog.show(23, 'Hansel', 'Oh my goodness! Don’t worry! I will go to the forest', 'and find them out.', 'Everything will be fine, Lady Margaret.');
		} else if (this.dialogIdx == 5) {
			dialog.show(22, 'Lady Margaret', 'Thank your so much, Hansel!');
		} else {
			this.partOneTalk = true;
		}
	} else if (!this.partTwoWalk) {
		this.walking = true;
		this.partTwoWalk = gs.player.moveRightTo(dt, 737);
	} else if (!this.partTwoTalk) {
		this.walking = false;
		if (this.dialogIdx == 6) {
			dialog.show(19, 'Hansel', 'Uncle Culson, I need to get into the forest and', 'find our lost villagers. Do you have any equipment provided?');
		} else if (this.dialogIdx == 7) {
			dialog.show(19, 'Culson', 'Sure! I got many well-made equipment. But the forest has already', 'inflected by some dark power, it is dangerous! Everyone is not',
				'suggested to go there. Are you sure you want to go?');
		} else if (this.dialogIdx == 8) {
			dialog.show(19, 'Hansel', 'Yes. I can’t stand there and do nothing. Kids are in dangerous too.');
		} else if (this.dialogIdx == 9) {
			dialog.show(19, 'Culson', 'All right. Wear on this equipment then, they can protect you well.', 'By the way, Our Head (Uncle John) was finding you',
				'this morning, maybe you should talk with him first.');
		} else if (this.dialogIdx == 10) {
			dialog.show(19, 'Hansel', 'Thanks a lot, Uncle Culson! Let me find Uncle John first.', 'Bye!');
		} else if (this.dialogIdx == 11) {
			dialog.show(19, 'Culson', 'Bye. Wish you a safe journey, Hansel!');
		} else {
			this.partTwoTalk = true;
		}
	} else if (!this.partThreeWalk) {
		this.walking = true;
		this.partThreeWalk = gs.player.moveUpTo(dt, 299);
	} else if (!this.partThreeTalk) {
		this.walking = false;
		if (this.dialogIdx == 12) {
			dialog.show(20, 'Hansel', 'Are you finding me, Uncle John?');
		} else if (this.dialogIdx == 13) {
			dialog.show(20, 'Uncle John', 'Oh! Yes, little boy. Finally you are here. I heard that', 'you want to enter the forest and find our lost kids, right?');
		} else if (this.dialogIdx == 14) {
			dialog.show(20, 'Hansel', 'Yes. I am ready to go.');
		} else if (this.dialogIdx == 15) {
			dialog.show(20, 'Uncle John', 'I am investigating our kids’ mysterious disappearances these days.', 'Something important I need to tell you before you go.',
				'Have you heard about the story of ‘The Red Witch’?');
		} else if (this.dialogIdx == 16) {
			dialog.show(20, 'Hansel', 'Yes. I heard it before. It was a tale, isn’t it?', 'Is it related to their disappearances?');
		} else if (this.dialogIdx == 17) {
			dialog.show(20, 'Uncle John', '20 years ago, the Red Witch kidnapped kids.', 'But no one has seen her before.',
				'The forest was inflected, plants and trees were poisoned.');
		} else if (this.dialogIdx == 18) {
			dialog.show(20, 'Uncle John', 'As you know, your father was a great warrior too. He was the one', 'who saved our kids. Unfortunately, your father died after',
				'he rescued them. Therefore, he was called as a witch hunter.');
		} else if (this.dialogIdx == 19) {
			dialog.show(20, 'Hansel', 'The Red Witch…I will kill her by myself!', 'Revenge for my father and save those innocent kids!');
		} else if (this.dialogIdx == 20) {
			dialog.show(20, 'Uncle John', 'Be careful! There are many dangerous monsters outside.', 'Also, the only sword that can defeat the Red Witch', 'is the one your father left to you.');
		} else if (this.dialogIdx == 21) {
			dialog.show(20, 'Uncle John', 'This sword sealed the magic power from the Red Witch.', 'Remember to bring along the sword with you.', 'Be careful and safe return!');
		} else if (this.dialogIdx == 22) {
			dialog.show(20, 'Hansel', 'All right! I will bring my father’s sword and', 'kill that evil witch!');
		} else {
			this.partThreeTalk = true;
			this.doneTalking = true;
		}
	} else {
		this.completed = effect.fadeOut();
	}
}
StageVillageBegin.prototype.handleInput = function(dt) {
	if (input.isPress('Z') && !holdKey && this.doneFadeIn && !this.walking && !this.doneTalking) {
		holdKey = true;
		this.dialogIdx++;
		sound.playSfx(2);
	}
}
