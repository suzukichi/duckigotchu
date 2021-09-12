/**
 * Duckigotchu was built by Suzukichi for Sol. Any unauthorized use is strictly prohibited.
 */
import {gameWidth, gameHeight} from './constants.js';
import PreloadScene from './scenes/PreloadScene.js'
import TamaScene from './scenes/TamaScene.js'
import MenuScene from './scenes/MenuScene.js'
import FeedScene from './scenes/FeedScene.js'
import StabScene from './scenes/StabScene.js'
import InfoScene from './scenes/InfoScene.js'

const Phaser = window.Phaser;

const config = {
	type: Phaser.AUTO,
	width: gameWidth,
	height: gameHeight,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [PreloadScene, TamaScene, MenuScene, FeedScene, StabScene, InfoScene],
	backgroundColor: '#ffffff',
	parent: 'duckigotchuContainer'
}

export default new Phaser.Game(config)