/**
 * Duckigotchu was built by Suzukichi for Sol. Any unauthorized use is strictly prohibited.
 */
import {gameWidth, gameHeight} from '../constants.js';
const Phaser = window.Phaser;

export default class PreloadScene extends Phaser.Scene {
	constructor() {
		super('preload-scene');
	}
	
	preload() {
		var loadingText = this.add.text(gameWidth / 2, gameHeight / 2, "0%", { fontSize: '32px', fill: '#000' });
		this.load.on('progress', this.updateProgress, {loadingText:loadingText});
		this.load.on('complete', this.complete, {scene:this.scene});
	
		
		// Frame assets
	   this.load.image('background', 'assets/bg.png');
	   this.load.image('mushroomFrameRed', 'assets/frame/red.png');
	   this.load.image('mushroomFrameYellow', 'assets/frame/yellow.png');
	   this.load.image('mushroomFrameBlue', 'assets/frame/blue.png');
	   this.load.image('bread1Frame', 'assets/frame/bread1.png');
	   this.load.image('bread2Frame', 'assets/frame/bread2.png');
	   this.load.image('bread3Frame', 'assets/frame/bread3.png');
	   this.load.image('settingsBg', 'assets/settingsBg.png');
	   
	   // Buttons
	   this.load.spritesheet('buttonA', 'assets/buttonA.png', {frameWidth: 80, frameHeight: 80});
	   this.load.spritesheet('buttonB', 'assets/buttonB.png', {frameWidth: 80, frameHeight: 80});
	   this.load.spritesheet('buttonC', 'assets/buttonC.png', {frameWidth: 80, frameHeight: 80});
	   this.load.image('settingsButton', 'assets/setting.png');
	   this.load.image('closeButton', 'assets/close.png');
	   this.load.image('soundButton', 'assets/unmute.png');
	   this.load.image('muteButton', 'assets/mute.png');
	   this.load.image('frameChangeButton', 'assets/frameButton.png');
	   this.load.image('resetButton', 'assets/reset.png');
	   this.load.image('aboutButton', 'assets/aboutButton.png');

	   
	   // Font
	   this.loadFont('piyik', 'assets/fonts/Piyik-Regular.ttf');
      
      
		// Common sprites
		this.load.spritesheet('mushroom', 'assets/mushrooms.png', {frameHeight: 40, frameWidth: 40});
		this.load.image('separatorBar', 'assets/separatorBar.png');
		
		this.load.spritesheet('hungerBar', 'assets/hungerBar.png', {frameWidth: 50, frameHeight: 130});
		this.load.spritesheet('levelBar', 'assets/levelBar.png', {frameWidth: 50, frameHeight: 130});
		this.load.spritesheet('menu', 'assets/menuIcons.png', {frameWidth: 80, frameHeight: 60});
		
		// Animations
		this.load.spritesheet('stab', 'assets/stab.png', {frameWidth: 300, frameHeight: 140});
		this.load.spritesheet('duckEat', 'assets/duckEat.png', {frameWidth: 150, frameHeight: 120});
		this.load.spritesheet('duckCommon', 'assets/duckCommon.png', {frameWidth: 150, frameHeight: 120});
		this.load.spritesheet('duckLevelUp', 'assets/levelUp.png', {frameWidth: 210, frameHeight: 140});
		this.load.spritesheet('thoughts', 'assets/thoughts.png', {frameWidth: 220, frameHeight: 140});
		this.load.spritesheet('mushroomClean', 'assets/mushroomClean.png', {frameWidth: 270, frameHeight: 130});
	
	
		// Ducks
		this.load.spritesheet('statIcons', 'assets/statLevels.png', {frameWidth: 130, frameHeight: 60});
		this.load.spritesheet('duck0', 'assets/duck0.png', {frameWidth: 140, frameHeight: 120});
		this.load.spritesheet('duck0-1', 'assets/duck0-1.png', {frameWidth: 140, frameHeight: 120});
		this.load.spritesheet('duck0-2', 'assets/duck0-2.png', {frameWidth: 140, frameHeight: 120});
		this.load.spritesheet('duck0-3', 'assets/duck0-3.png', {frameWidth: 140, frameHeight: 120});
		this.load.spritesheet('duck0-4', 'assets/duck0-4.png', {frameWidth: 140, frameHeight: 120});
		this.load.spritesheet('duck0-5', 'assets/duck0-5.png', {frameWidth: 200, frameHeight: 120});
		this.load.spritesheet('duck0-6', 'assets/duck0-6.png', {frameWidth: 200, frameHeight: 120});
		this.load.spritesheet('duck-shroom', 'assets/duck-mushroom.png', {frameWidth: 140, frameHeight: 120});
		this.load.spritesheet('duck-scissors', 'assets/duckScissors.png', {frameWidth: 150, frameHeight: 125});
		this.load.spritesheet('duck-poop', 'assets/duck-poop.png', {frameWidth: 140, frameHeight: 120});
	
		// Sounds
		const soundRoot = 'assets/sfx/';
		this.load.audio('buttonDown', soundRoot + 'buttonDown.wav');
		this.load.audio('select', soundRoot + 'select.wav');
		this.load.audio('eatFood', soundRoot + 'eatFood.wav');
		this.load.audio('eatOther', soundRoot + 'eatOther.wav');
		this.load.audio('endHappy', soundRoot + 'happyEnd.wav');
		this.load.audio('endSad', soundRoot + 'sadEnd.wav');
		this.load.audio('stab', soundRoot + 'stab.wav');
		this.load.audio('endStabGood', soundRoot + 'stabEndGood.wav');
		this.load.audio('endStabBad', soundRoot + 'stabEndBad.wav');
		this.load.audio('levelUp', soundRoot + 'levelUp.wav');
		this.load.audio('hungryIdle', soundRoot + 'hungryIdle.wav');
		this.load.audio('reject', soundRoot + 'reject.wav');
		this.load.audio('mushroomGrow', soundRoot + 'shroomGrow.wav');
	}

	updateProgress(percentage) {
		this.loadingText.setText(Math.floor(percentage * 100) + "%");
	}

	complete() {
		this.scene.start('tama-scene', {});
	}
   
   loadFont(name, url) {
       var newFont = new FontFace(name, `url(${url})`);
       newFont.load().then(function (loaded) {
           document.fonts.add(loaded);
       }).catch(function (error) {
           return error;
       });
   }
}