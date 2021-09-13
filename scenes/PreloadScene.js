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
	
		const assetsRoot = "https://raw.githubusercontent.com/suzukichi/duckigotchu/main/assets/";
		
		// Frame assets
	   this.load.image('background', assetsRoot + 'bg.png');
	   this.load.image('mushroomFrameRed', assetsRoot + 'frame/red.png');
	   this.load.image('mushroomFrameYellow', assetsRoot + 'frame/yellow.png');
	   this.load.image('mushroomFrameBlue', assetsRoot + 'frame/blue.png');
	   this.load.image('bread1Frame', assetsRoot + 'frame/bread1.png');
	   this.load.image('bread2Frame', assetsRoot + 'frame/bread2.png');
	   this.load.image('bread3Frame', assetsRoot + 'frame/bread3.png');
	   this.load.image('settingsBg', assetsRoot + 'settingsBg.png');
	   
	   // Buttons
	   this.load.spritesheet('buttonA', assetsRoot + 'buttonA.png', {frameWidth: 80, frameHeight: 80});
	   this.load.spritesheet('buttonB', assetsRoot + 'buttonB.png', {frameWidth: 80, frameHeight: 80});
	   this.load.spritesheet('buttonC', assetsRoot + 'buttonC.png', {frameWidth: 80, frameHeight: 80});
	   this.load.image('settingsButton', assetsRoot + 'setting.png');
	   this.load.image('closeButton', assetsRoot + 'close.png');
	   this.load.image('soundButton', assetsRoot + 'unmute.png');
	   this.load.image('muteButton', assetsRoot + 'mute.png');
	   this.load.image('frameChangeButton', assetsRoot + 'frameButton.png');
	   this.load.image('resetButton', assetsRoot + 'reset.png');
	   this.load.image('aboutButton', assetsRoot + 'aboutButton.png');

	   
	   // Font
	   this.loadFont('piyik', assetsRoot + 'fonts/Piyik-Regular.ttf');
      
      
		// Common sprites
		this.load.spritesheet('mushroom', assetsRoot + 'mushrooms.png', {frameHeight: 40, frameWidth: 40});
		this.load.image('separatorBar', assetsRoot + 'separatorBar.png');
		
		this.load.spritesheet('hungerBar', assetsRoot + 'hungerBar.png', {frameWidth: 50, frameHeight: 130});
		this.load.spritesheet('levelBar', assetsRoot + 'levelBar.png', {frameWidth: 50, frameHeight: 130});
		this.load.spritesheet('menu', assetsRoot + 'menuIcons.png', {frameWidth: 80, frameHeight: 60});
		
		// Animations
		this.load.spritesheet('stab', assetsRoot + 'stab.png', {frameWidth: 300, frameHeight: 140});
		this.load.spritesheet('duckEat', assetsRoot + 'duckEat.png', {frameWidth: 150, frameHeight: 120});
		this.load.spritesheet('duckCommon', assetsRoot + 'duckCommon.png', {frameWidth: 150, frameHeight: 120});
		this.load.spritesheet('duckLevelUp', assetsRoot + 'levelUp.png', {frameWidth: 210, frameHeight: 140});
		this.load.spritesheet('thoughts', assetsRoot + 'thoughts.png', {frameWidth: 220, frameHeight: 140});
		this.load.spritesheet('mushroomClean', assetsRoot + 'mushroomClean.png', {frameWidth: 270, frameHeight: 130});
	
	
		// Ducks
		this.load.spritesheet('statIcons', assetsRoot + 'statLevels.png', {frameWidth: 130, frameHeight: 60});
		this.load.spritesheet('duck0', assetsRoot + 'duck0.png', {frameWidth: 140, frameHeight: 120});
		this.load.spritesheet('duck0-1', assetsRoot + 'duck0-1.png', {frameWidth: 140, frameHeight: 120});
		this.load.spritesheet('duck0-2', assetsRoot + 'duck0-2.png', {frameWidth: 140, frameHeight: 120});
		this.load.spritesheet('duck0-3', assetsRoot + 'duck0-3.png', {frameWidth: 140, frameHeight: 120});
		this.load.spritesheet('duck0-4', assetsRoot + 'duck0-4.png', {frameWidth: 140, frameHeight: 120});
		this.load.spritesheet('duck0-5', assetsRoot + 'duck0-5.png', {frameWidth: 200, frameHeight: 120});
		this.load.spritesheet('duck0-6', assetsRoot + 'duck0-6.png', {frameWidth: 200, frameHeight: 120});
		this.load.spritesheet('duck-shroom', assetsRoot + 'duck-mushroom.png', {frameWidth: 140, frameHeight: 120});
		this.load.spritesheet('duck-scissors', assetsRoot + 'duckScissors.png', {frameWidth: 150, frameHeight: 125});
		this.load.spritesheet('duck-poop', assetsRoot + 'duck-poop.png', {frameWidth: 140, frameHeight: 120});
	
		// Sounds
		const soundRoot = assetsRoot + 'sfx/';
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
