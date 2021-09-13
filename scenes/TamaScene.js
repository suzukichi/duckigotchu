/**
 * Duckigotchu was built by Suzukichi for Sol. Any unauthorized use is strictly prohibited.
 */
import {addButtons, addFrame, randInt, loadGameData, saveData} from '../utils.js';
import {gameWidth, gameHeight} from '../constants.js';
import {duckOpts, duckInfo} from '../ducks.js';

const Phaser = window.Phaser

const DUCK_Y = gameHeight / 2 + 60;
const MIN_IDLE_SEC = 15 * 60 * 1000;
const IDLE_SPAWN_INTERVAL_SEC = 3 * 60 * 1000;
const GAME_SCREEN_BUFFER = gameWidth / 3;

const IDLE_HUNGER_INTERVAL_SEC = 5 * 60 * 1000;

const MAX_LEVEL = 6;
const MAX_FEED = 10;
const MAX_FEED_HISTORY = 15;

const RECENT_FEED_TIMEOUT_MS = 3 * 60 * 1000;
const NUM_RECENT_FEED = 5;

const MIN_WINS_FOR_LEVEL = 3;

export default class TamaScene extends Phaser.Scene {
	constructor() {
		super('tama-scene');
		
		loadGameData(this, false);
		this.mushrooms = [];
				
		this.oldLevel = this.level;
		this.lockActions = false;
		this.oldDuckType = this.duckType;
	}
	
	preload() {
		this.makeAnimations();
	}

	setUpScene() {
		loadGameData(this);

		addFrame(this);
		addButtons(this, this.actionOnA, this.actionOnB, this.actionOnC);
	    this.sound.pauseOnBlur = false;

		let duckVariations = duckInfo[this.duckType];
		let info = duckVariations[Math.min(this.level, duckVariations.length -1)];

	    this.duckSprite = this.add.sprite(gameWidth / 2, DUCK_Y, info.spritesheet);
						
		for (var i = 0; i < Math.min(this.numMushrooms, 60); i++) {
			this.addMushroom();
		}
		
		// Bars
		this.hungerBar = this.add.sprite(gameWidth / 4.4, gameHeight / 2, 'hungerBar');
		this.hungerBar.setOrigin(0, 0);
		this.hungerBar.setFrame(this.hunger);
		
		this.levelBar = this.add.sprite(gameWidth - gameWidth / 4.4, gameHeight / 2.05, 'levelBar');
		this.levelBar.setOrigin(1, 0);
		this.levelBar.setFrame(this.level);
	}
	
	create(data) {
		this.setUpScene();
		// Handle scene transitions:
		if (data.reset) {
			loadGameData(this, false);
			this.loadDuckAnimations();

			this.mushrooms = [];	
			this.oldLevel = this.level;
			this.lockActions = false;
			this.oldDuckType = this.duckType;
			
			this.hungerBar.setFrame(this.hunger);
			this.levelBar.setFrame(this.level);
			
			this.moveDuck();
		} else if (data.food) {
			this.lockActions = true;
			// Reject eating if ate more than NUM_RECENT_FEED times in the last RECENT_FEED_TIMEOUT_MS.
			if (this.hunger > 0 && 
			  this.feedHistory.length >= NUM_RECENT_FEED && 
		      Date.now() - this.feedHistory[NUM_RECENT_FEED - 1].time < RECENT_FEED_TIMEOUT_MS) {
				this.duckReject();
				return;
			}
			
			// Play an animation
			this.duckSprite.play('feed-' + data.food.key)

			if (data.food.foodPts > 0) {
				this.lastHunger = Date.now();

				this.duckSprite.on('animationupdate', function() {
					this.sound.play('eatFood');
				}, this);
			} else if (data.food.foodPts == 0) {
				this.sound.play('eatOther');
			} else {
				this.sound.play('endSad');
			}
			
			this.duckSprite.once('animationcomplete', function() {
				// Stop playing sounds on update:
				this.duckSprite.off('animationupdate');
				
				// Increase food after animation is done.
				this.setHunger(this.hunger + data.food.foodPts);
				
				this.feedHistory.unshift({type: data.food.key, time: Date.now()});
				if (this.feedHistory.length > MAX_FEED_HISTORY) {
					this.feedHistory.pop();
				}
								
				if (this.hunger > MAX_FEED) {
					this.setHunger(0);
					this.levelUp();
				} else {
					this.moveDuck();
					this.lockActions = false;
				}
				
				this.lastInteraction = Date.now();
								
				this.checkDuckChange();
				saveData(this);
			}, this);
		} else if (data.fight) {
			this.lockActions = true;
			
			if (data.fight.win) {
				this.setHunger(this.hunger - 1);
				this.sound.play('endHappy');
				this.duckSprite.play('fight-win');
				
				this.wins++;

				
			} else {
				this.setHunger(this.hunger - 2);
				this.sound.play('endSad');
				this.duckSprite.play('fight-lose');	
			}
			
			this.duckSprite.once('animationcomplete', function() {
					if (this.wins >= MIN_WINS_FOR_LEVEL) {
						this.levelUp();
					} else {
						this.moveDuck();
						this.lockActions = false;
					}
					saveData(this);
				}, this);
		} else if (data.refuse) {
			this.duckReject();
		} else {
			this.moveDuck();
		}
	}
	
	update() {
		// Idle too long? Add a mushroom.
		const now = Date.now();
		const idleTime = now - this.lastInteraction;
		if (idleTime >= MIN_IDLE_SEC && this.lastMushroom >= IDLE_SPAWN_INTERVAL_SEC) {			
			// Use the duration div the idle time, so if the page was inactive, many mushrooms show up.
			// Mushrooms begin showing up every IDLE_SPAWN_INTERVAL_SEC after MIN_IDLE_SEC have passed.
			const timeSinceLastMush = Math.min(now - this.lastMushroom, idleTime - MIN_IDLE_SEC + IDLE_SPAWN_INTERVAL_SEC);
			const mushroomsToAdd = Math.floor(timeSinceLastMush / IDLE_SPAWN_INTERVAL_SEC);
			this.numMushrooms += mushroomsToAdd;
			
			for (var i = 0; i < mushroomsToAdd; i++) {
				this.addMushroom();
			}
			
			if (mushroomsToAdd > 0) {
				this.sound.play('mushroomGrow');

				this.lastMushroom = Date.now();
				saveData(this);
			}
		}
		
		if (this.hunger >= 1 && (Date.now() - this.lastHunger >= IDLE_HUNGER_INTERVAL_SEC)) {
			// Get hungry
			this.lastHunger = Date.now();

			this.lockActions = true;
			this.setHunger(this.hunger - 1);
			saveData(this);

			this.sound.play('hungryIdle');
			this.duckSprite.play(this.anims.get('hungry'))
				.once('animationcomplete', function() {
				   this.lockActions = false;
			   }, this);
		    this.duckSprite.once('animationrepeat', function() {
					this.sound.play('hungryIdle');
			   }, this);
			saveData(this);
		}
	}
	
	setHunger(newHunger) {
		this.hunger = Math.max(newHunger, 0);
		this.hungerBar.setFrame(this.hunger);
	}
	
	moveDuck() {
		this.tweens.killAll();
		// Randomly decide to move or stay steady.
		var isStand = Math.random() < 0.60;
		if (Date.now() - this.lastInteraction >= MIN_IDLE_SEC) {
			// Sleep
			this.duckSprite.play(this.anims.get('duckSleep'));
			isStand = true;
		} else {
			this.duckSprite.play(this.anims.get('duckWalk'));
		}
		
		// Move the duck.
		var targetX = isStand ? this.duckSprite.x : randInt(GAME_SCREEN_BUFFER, gameWidth - GAME_SCREEN_BUFFER);
		this.duckSprite.setFlipX(this.duckSprite.x > targetX);
		
		this.tweens.add({
			 targets: this.duckSprite,
			 x: targetX,
			 duration: 1000 * (isStand ? randInt(1, 4) : 3),
			 ease: 'Sine.easeInOut',
			 yoyo: false,
			 repeat: 0,
			 onComplete: this.moveDuck,
			 onCompleteScope: this,
		});	
	}
	
	// Determines if the duckType should change
	checkDuckChange() {
		duckOpts.filter(duck => duck.combo.length <= this.feedHistory.length).forEach(duck => {
			let nextDuckVer = duck.key;
			// Loop through duck combo
			let comboLen = duck.combo.length;
			for (let i = 0; i < comboLen; i++) {
				if (duck.combo[i] != this.feedHistory[i].type) {
					if (duck.combo[comboLen - i - 1] != this.feedHistory[i].type) {
						return;
					} else {
						nextDuckVer = 0;
					}
				}
			}
			
			this.oldDuckType = this.duckType;
			this.duckType = nextDuckVer;
			this.loadDuckAnimations();
			
			this.duckSprite.play(`levelUp-${this.duckType}-${this.level}`);
			this.duckSprite.on('animationcomplete', function() {
				this.lockActions = false;
				this.moveDuck();
			}, this);
		});		
	}
	
	actionOnA(game) {
		if(game.lockActions) {
			return;
		}
		// Bring up menu
		game.lastInteraction = Date.now();
		game.scene.start('menu-scene', {hunger: game.hunger});
	}
	
	actionOnB(game) {
		if(game.lockActions) {
			return;
		}
		
		game.lockActions = true;
		
		game.lastInteraction = Date.now();

		game.duckSprite.visible = false;
	    game.hungerBar.visible = false;
		game.levelBar.visible = false;
		
		game.tweens.killAll();

		
		// Play stab animation
		game.sound.play('stab');
		let stabAnim = game.add.sprite(gameWidth / 2 + 4, DUCK_Y - 4);
		stabAnim.play('stab')
		 .once('animationcomplete', function() {
			stabAnim.destroy();
			game.duckSprite.visible = true;
			
			game.sound.play('endHappy');
			
			game.duckSprite.play('mushroomClean').once('animationcomplete', function () {
				game.lockActions = false;
				
				game.hungerBar.visible = true;
				game.levelBar.visible = true;
				game.moveDuck();
			});
	 	 });

		
		// Delete all mushrooms
		game.numMushrooms = 0;
		game.mushrooms.forEach(mushroom => mushroom.destroy());
		saveData(game);
	}
	
	actionOnC(game) {
		if(game.lockActions) {
			return;
		}
		game.scene.start('info-scene', {variation: game.duckType, level: game.level});
	}
	
	// Note this doesn't add mushrooms to the total for you.
	addMushroom() {
		if (this.mushrooms.length < 60) {
			const newMushroom = this.add.sprite(randInt(GAME_SCREEN_BUFFER, gameWidth - GAME_SCREEN_BUFFER), DUCK_Y + 20 + randInt(15, 30), 'mushroom', randInt(0, 1));
			newMushroom.rotation += Math.random() - 0.5;

			this.mushrooms.push(newMushroom);
		}
	}
	
	levelUp() {
		this.sound.play('levelUp');
		this.lockActions = true;

		this.wins = 0;
		this.oldLevel = this.level;
		this.level = Math.min(this.level + 1, MAX_LEVEL);
		this.loadDuckAnimations();

		if (this.level != this.oldLevel) {
			this.duckSprite.play(`levelUp-${this.duckType}-${this.level}`);
			this.duckSprite.on('animationcomplete', function() {
				this.lockActions = false;
				this.moveDuck();
			}, this);
		}
		this.levelBar.setFrame(Math.min(this.level, MAX_LEVEL));
	}
	
	duckReject() {
		this.lockActions = true;
		this.duckSprite.play('rejectFood');
		this.duckSprite.on('animationupdate', function() {
			this.sound.play('reject');
		}, this);
		this.duckSprite.once('animationcomplete', function() {
			this.duckSprite.off('animationupdate');
			this.lockActions = false;
			this.moveDuck();
		}, this);
	}
	
	loadDuckAnimations() {
		if (this.oldDuckType != this.duckType || this.level != this.oldLevel) {
			this.duckWalk.destroy();
			this.duckSleep.destroy();
		}
		
		let duckVariations = duckInfo[this.duckType];
		let info = duckVariations[Math.min(this.level, duckVariations.length - 1)];
		
		this.duckWalk = this.anims.create({
			key: 'duckWalk',
			frames: this.anims.generateFrameNumbers(info['spritesheet'], { start: 0, end: 3 }),
			frameRate: 2,
			repeat: -1,
			skipMissedFrames: false
		});
		
		this.duckSleep = this.anims.create({
			key: 'duckSleep',
			frames: this.anims.generateFrameNumbers(info['spritesheet'], { start: 4, end: 5 }),
			frameRate: 1,
			repeat: -1,
			skipMissedFrames: true
		});
	}
	
	makeAnimations() {
		this.loadDuckAnimations();
		
		Object.keys(duckInfo).forEach(function (duckType) {
			Object.keys(duckInfo[duckType]).forEach(function (level) {
				const dInfo = duckInfo[duckType][level];
				this.anims.create({
					key: `levelUp-${duckType}-${level}`,
					frames: dInfo.levelUpFrames ? this.anims.generateFrameNumbers('duckLevelUp', dInfo.levelUpFrames) : this.anims.generateFrameNumbers('duckCommon', {start: 25, end: 26}),
					frameRate: 2,
					repeat: 1,
				});
			}.bind(this));
		}.bind(this));
		
		this.anims.create({
			key: 'stab',
			frames: this.anims.generateFrameNumbers('stab', {start: 0, end: 2}),
			frameRate: 5,
			repeat: 1,
		});
		
		this.anims.create({
			key: 'mushroomClean',
			frames: this.anims.generateFrameNumbers('mushroomClean'),
			frameRate: 2,
			repeat: 0,
			skipMissedFrames: true
		});
		
		this.anims.create({
			key: 'rejectFood',
			frames: this.anims.generateFrameNumbers('duckCommon', {start: 27, end: 28}),
			frameRate: 2,
			repeat: 1
		});
		
		const happyEnd = this.anims.generateFrameNumbers('duckCommon', {start: 0, end: 1});
		const mehEnd = this.anims.generateFrameNumbers('duckCommon', {start: 2, end: 3});
		const sadEnd = this.anims.generateFrameNumbers('duckCommon', {start: 4, end: 5});
		
		this.anims.create({
			key: 'feed-candy',
			frames: this.anims.generateFrameNumbers('duckCommon', {start: 8, end: 9}).concat(happyEnd),
			frameRate: 2,
			repeat: 0
		});
		
		this.anims.create({
			key: 'feed-cookie',
			frames: this.anims.generateFrameNumbers('duckCommon', {start: 10, end: 11}).concat(happyEnd),
			frameRate: 2,
			repeat: 0
		});
		
		this.anims.create({
			key: 'feed-frog',
			frames: this.anims.generateFrameNumbers('duckCommon', {start: 12, end: 13}).concat(mehEnd),
			frameRate: 3,
			repeat: 0
		});
		
		this.anims.create({
			key: 'feed-tears',
			frames: this.anims.generateFrameNumbers('duckCommon', {start: 16, end: 17}).concat(sadEnd),
			frameRate: 1,
			repeat: 0
		});
		
		this.anims.create({
			key: 'feed-money',
			frames: this.anims.generateFrameNumbers('duckCommon', {start: 14, end: 15}).concat(mehEnd),
			frameRate: 3,
			repeat: 0
		});
		
		this.anims.create({
			key: 'feed-boba',
			frames: this.anims.generateFrameNumbers('duckCommon', {start: 6, end: 7}).concat(happyEnd),
			frameRate: 2,
			repeat: 0
		});
		
		this.anims.create({
			key: 'fight-lose',
			frames: this.anims.generateFrameNumbers('duckCommon', {start: 18, end: 19}),
			frameRate: 3,
			repeat: 1
		});
		this.anims.create({
			key: 'fight-win',
			frames: this.anims.generateFrameNumbers('duckCommon', {start: 20, end: 22}),
			frameRate: 2,
			repeat: 0
		});
		
		this.anims.create({
			key: 'hungry',
			frames: this.anims.generateFrameNumbers('duckCommon', {start: 23, end: 24}),
			frameRate: 2,
			repeat: 1
		});
	}
}
