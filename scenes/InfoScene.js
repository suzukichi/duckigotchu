/**
 * Duckigotchu was built by Suzukichi for Sol. Any unauthorized use is strictly prohibited.
 */
import {addButtons, addFrame, getGameDataJson, loadGameData} from '../utils.js';
import {duckInfo} from '../ducks.js';
import {gameWidth, gameHeight} from '../constants.js';

const Phaser = window.Phaser

export default class InfoScene extends Phaser.Scene {
	constructor() {
		super('info-scene');
    }
		
	create(data) {
		loadGameData(this);

		addFrame(this);
		addButtons(this, this.returnToTama, this.returnToTama, this.returnToTama);

		let duckVariations = duckInfo[data.variation];
		
		let info = duckVariations[Math.min(data.level, duckVariations.length - 1)];
		var img = this.add.sprite(gameWidth / 2 - 160, gameHeight / 2 - 8, 'statIcons', 0);
		img.setFrame(info.icon);
		img.setOrigin(0,0);
		var paddingY = 3;
		var titleText = this.add.text(gameWidth / 2 + 140, img.y + 20, info.name, { fontFamily: 'piyik,cursive', fontSize: '30px', fill: '#FFF', fontWeight: "bold", align: 'right'});	
		titleText.setOrigin(1, 0.5);
		
		var separator = this.add.image(gameWidth / 2, img.y + 48, 'separatorBar');
		
		var levelText = this.add.text(separator.x - separator.width / 2 - 5, separator.y + paddingY, "Lvl: " + info.level, { fontFamily: 'piyik,cursive', fontSize: '15px', fill: '#FFF'});
		levelText.alpha = 0.7;
		levelText.setOrigin(0, 0);
		var powerText = this.add.text(gameWidth / 2 + 130, separator.y + paddingY, "Pwr: " + info.power, { fontFamily: 'piyik,cursive', fontSize: '15px', fill: '#FFF', align: 'right'});
		powerText.setOrigin(1, 0);
		powerText.alpha = 0.7;

		var descText = this.add.text(levelText.x, levelText.y + levelText.height + paddingY - 3, info.description, { fontFamily: 'piyik,cursive', fontSize: '18px', fill: '#FFF', wordWrap: {width: 280, useAdvancedWrap: true}});
	}
	
	returnToTama(game) {
		game.scene.start('tama-scene', {});
	}
}
