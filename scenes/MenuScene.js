/**
 * Duckigotchu was built by Suzukichi for Sol. Any unauthorized use is strictly prohibited.
 */
import {addButtons, addFrame, loadGameData} from '../utils.js';
import {gameWidth, gameHeight} from '../constants.js';

const Phaser = window.Phaser

export default class MenuScene extends Phaser.Scene {	
	constructor() {
		super('menu-scene');
    }
	
	create(data) {
		loadGameData(this);

		this.data = data;
		addFrame(this);
        addButtons(this, this.scrollIndicator, this.actionOnB, this.actionOnC);
		
	    this.feedOption = this.add.sprite(gameWidth / 2, gameHeight / 1.8, 'menu', 1);
	    this.stabOption = this.add.sprite(gameWidth / 2, gameHeight / 1.5, 'menu', 0);
		
		this.foodSelected = false;

		this.selectIndicator = this.add.text(gameWidth / 2.8, gameHeight, ">",  {fill: '#000'});
		this.scrollIndicator(this);
	}
	
	scrollIndicator(game) {
		// Scroll through menu
		game.foodSelected = !game.foodSelected;
		
		game.selectIndicator.setY(game.foodSelected ? game.feedOption.y : game.stabOption.y);
	}
	
	actionOnB(game) {
		// Pick the selected option.
		if (game.foodSelected) {
			// Open feed menu
			game.scene.start('feed-scene');
		} else {
			// Open stab game
			if (game.data.hunger < 2) {
				game.scene.start('tama-scene', {refuse: true});
			} else {
				game.scene.start('stab-scene');
			}
		}
	}
	
	actionOnC(game) {
		// return to tama scene
		game.scene.start('tama-scene', {});
	}
}