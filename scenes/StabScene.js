/**
 * Duckigotchu was built by Suzukichi for Sol. Any unauthorized use is strictly prohibited.
 */
import {addButtons, addFrame, randInt, loadGameData} from '../utils.js';
import {gameWidth, gameHeight} from '../constants.js';

const Phaser = window.Phaser

// How many enemies to hit before you win
const MAX_ENEMIES = 8;

const DUCK_Y = gameHeight / 2 + 55;

export default class StabScene extends Phaser.Scene {
	constructor() {
		super('stab-scene');
		this.animations = {
			good: [],
			bad: []
		};
	}
	
	preload() {
		this.createAnimations();
	}

	create() {
		loadGameData(this);

		addFrame(this);
        addButtons(this, this.noop, this.stab, this.noop);
		this.sound.pauseOnBlur = false;

		
		this.hp = 3;
		this.hits = 0;
		this.canStab = true;
		
		this.isCurrentEnemy = true;
		
		this.targetSprite = this.add.sprite(gameWidth / 2, DUCK_Y, 'thoughts', 0);
		this.targetSprite.on('animationupdate', this.playThoughtTimerSound, this);

		this.changeTarget();
	}
	
	loseGame() {
		this.scene.start('tama-scene', {
			fight: {
				win: false,
			}
		});
	}
	
	winGame() {
		this.scene.start('tama-scene', {
			fight: {
				win: true,
			}
		});
	}
	
	stab(game) {
		if (!game.canStab) {
			return;
		}
				
		game.canStab = false;
		game.sound.play('stab');
		game.targetSprite.play('stab')
			.once('animationcomplete', function() {
				if (game.isCurrentEnemy) {					
					game.success();
				} else {
					game.decreaseHp();
				}
			});
	}
		
    decreaseHp() {
		this.canStab = false;
		this.hp -= 1;
		// Play oh no animation
		this.targetSprite.play('miss')
		    .once('animationcomplete', function() {
				if (this.hp == 0) {
					this.loseGame();
				} else {
					this.changeTarget();
				}
			}, this);
		this.sound.play('endStabBad');
	}
	
	changeTarget() {
		this.canStab = true;
		this.isCurrentEnemy = randInt(0, 1) == 0;
		
		var spriteOpts = this.isCurrentEnemy ? this.animations.bad : this.animations.good;
		
		var animationName = spriteOpts[Math.floor(Math.random() * spriteOpts.length)];
		
		this.targetSprite
			.play(animationName)
			.once('animationcomplete', function() {
				if (this.targetSprite.anims.currentAnim.key === animationName) {
					this.changeTargetAnim();
				}
			}, this);
	}
	
	createAnimations() {
		for(var i = 0; i < 15; i+= 2) {
			this.animations.bad.push(this.createThoughtAnim('bad', i));
		} 
		for (var i = 16; i < 31; i+= 2) {
			this.animations.good.push(this.createThoughtAnim('good', i));
		}
		
		// Stabs
		this.anims.create({
			key: 'hit',
			frames: this.anims.generateFrameNumbers('stab', {start: 6, end: 8}),
			frameRate: 3,
			repeat: 0
		});
		
		this.anims.create({
			key: 'miss',
			frames: this.anims.generateFrameNumbers('stab', {start: 3, end: 5}),
			frameRate: 3,
			repeat: 1
		});
		this.anims.create({
			key: 'stab',
			frames: this.anims.generateFrameNumbers('stab', {start: 0, end: 2}),
			frameRate: 4,
			repeat: 0
		});
	}
	
	success() {
		// Play success animation
		this.hits += 1;
		this.sound.play('endStabGood');

		this.targetSprite.play('hit')
			.once('animationcomplete', this.changeTarget, this);
		if (this.hits >= MAX_ENEMIES) {
			this.winGame();
		}
	}
	
	createThoughtAnim(type, ndx) {
		var key = type + '-' + ndx;
		var anim = this.anims.create({
			key: key,
			frames: this.anims.generateFrameNumbers('thoughts', {start: ndx, end: ndx + 1}),
			frameRate: 2,
			repeat: 2
		});
		return key;
	}
	
	playThoughtTimerSound() {
		if (['hit', 'miss', 'stab'].includes(this.targetSprite.anims.currentAnim.key)) {
			return;
		}
		
		this.sound.play('select');
	}
	
	changeTargetAnim() {
		if (['hit', 'miss'].includes(this.targetSprite.anims.currentAnim.key)) {
			return;
		}
		
		// Let an enemy elapse without stabbing
		if (this.isCurrentEnemy) {
			this.decreaseHp();
		} else {
			// Let a good thought pass without stabbing
			this.success();
		}
	}
	
	noop(game) {}	
}