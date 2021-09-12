/**
 * Duckigotchu was built by Suzukichi for Sol. Any unauthorized use is strictly prohibited.
 */

import {addButtons, addFrame, loadGameData} from '../utils.js';
import {gameWidth, gameHeight} from '../constants.js';

const Phaser = window.Phaser

export default class FeedScene extends Phaser.Scene {
	constructor() {
		super('feed-scene');
	}
	
	preload() {
		loadGameData(this);
	}

	create() {
	   addFrame(this);
       addButtons(this, this.scrollIndicator, this.actionOnB, this.actionOnC);

	   this.opt1 = this.add.sprite(gameWidth / 2, gameHeight / 1.8, 'menu', 1);
	   this.opt2 = this.add.sprite(gameWidth / 2, gameHeight / 1.5, 'menu', 4);
	   
	   this.foodOptions = [
		{
			key: 'candy',
			foodPts: 1,
			pos: 1
		},
		{
			key: 'cookie',
			foodPts: 1,
			pos: 4
		},
		{
			key: 'boba',
			foodPts: 1,
			pos: 6
		},
		{
			key: 'tears',
			foodPts: -1,
			pos: 3
		},
		{
			key: 'money',
			foodPts: 0,
			pos: 2
		},
		{
			key: 'frog',
			foodPts: 0,
			pos: 5
		}
	   ];
	   
		this.selectIndicator = this.add.text(gameWidth / 3.3, gameHeight, ">",  {fill: '#000'});
		this.selectedIndex = -1;
		this.scrollIndicator(this);
	    this.selectedIcon = this.opt1;

	}
	
	scrollIndicator(game) {
		// Scroll through menu
		game.selectedIndex++;
		if (game.selectedIndex >= game.foodOptions.length) {
			game.selectedIndex = 0;
		}
		if (game.selectedIcon == game.opt1) {
			game.selectedIcon = game.opt2;
		} else {
			game.selectedIcon = game.opt1;

			// Scroll page down
			game.opt1.setFrame(game.foodOptions[game.selectedIndex].pos);
			game.opt2.setFrame(game.foodOptions[Math.min(game.selectedIndex + 1, game.foodOptions.length - 1)].pos);
		}
		game.selectIndicator.setY(game.selectedIcon.y);
	}
	
	actionOnB(game) {
		// Pick the selected option.		
		var selectedFood = game.foodOptions[game.selectedIndex];
		
		// Update tamascene to add foodPts to exp.
		game.scene.start('tama-scene', {food: selectedFood});
	}
	
	actionOnC(game) {
		// Return to menu scene
		game.scene.start('tama-scene', {});

	}
}