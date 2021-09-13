/**
 * Duckigotchu was built by Suzukichi for Sol. Any unauthorized use is strictly prohibited.
 */
import {gameWidth, gameHeight, frameOptions, storageKey, globalStorageKey} from './constants.js';

export const addFrame = function(game) {
	// Also add the bg to the back.
	game.add.image(0, 0, 'background').setOrigin(0, 0);
	
	game.border = game.add.image(0, 0, frameOptions[game.borderNum]);
	game.border.setOrigin(0,0);
	game.border.setDepth(1);
}

export const addButtons = function (game, actionOnClickA, actionOnClickB, actionOnClickC) {
	let edgeButton = gameWidth / 3.8;
	let height = gameHeight - gameHeight / 7;
	const buttonDown = game.sound.add('buttonDown');

	addButton(game, 'buttonA', function() {
		if (game.lockActions) {return;}
		buttonDown.play();
		actionOnClickA(game);
	}, edgeButton, height);
	addButton(game, 'buttonB', function() {
		if (game.lockActions) {return;}
		buttonDown.play();
		actionOnClickB(game);
	}, gameWidth / 2, height + 20);
	addButton(game, 'buttonC', function() {
		if (game.lockActions) {return;}

		buttonDown.play();
		actionOnClickC(game);
	}, gameWidth - edgeButton, height);
	
	// Add settings button
	addButton(
		game, 
		'settingsButton', 
		function () { openSettingsMenu(game);},
		gameWidth - 40,
		40,
		2, 
		true);
}

function openSettingsMenu(game) {
	if (game.settingMenuOpen) {
		return;
	}
	game.settingMenuOpen = true;
	game.lockActions = true;
		
	var popupDepth = 3;
	var popupWidth = gameWidth * 3 / 4;
	var popupHeight = gameHeight * 3 / 4;
	
	var popupRelativeWidth = gameWidth / 2 + popupWidth / 2;
	var popupRelativeHeight = gameHeight / 2 + popupHeight / 2;
	
	var menuGroup = game.add.group();
	
	// BG
	var menu = game.add.sprite(gameWidth / 2, gameHeight / 2, 'settingsBg');
	menu.setDepth(popupDepth);
	
	menuGroup.add(menu);
	
	// Sound
	var soundBtn = addButton(game, getSoundButtonSprite(game.isMuted), function() {
		// Mute/unmute sound.
		game.isMuted = !game.isMuted;
		game.sound.mute = game.isMuted;
		// Switch the image to the correct state
		soundBtn.setTexture(getSoundButtonSprite(game.isMuted));
		saveData(game, true);
	}, gameWidth / 2 - 75, popupRelativeHeight - 150, popupDepth + 1, true);
	menuGroup.add(soundBtn);
	
	// Frame change
	var frameBtn = addButton(game, 'frameChangeButton', function() {
		// Swap game frame.
		game.borderNum = game.borderNum + 1 >= frameOptions.length ? 0 : game.borderNum + 1;
		game.border.setTexture(frameOptions[game.borderNum]);
		saveData(game, true);
	},gameWidth / 2 + 75, popupRelativeHeight - 150, popupDepth + 1, true);
	menuGroup.add(frameBtn);

	// Reset button
	var resetBtn = addButton(game, 'resetButton', function() {
		resetData(game);
		game.settingMenuOpen = false;

		game.scene.start('tama-scene', {
			reset: true
		});
	}, gameWidth / 2, popupRelativeHeight - 70, popupDepth + 1, true);
	menuGroup.add(resetBtn);
	
	// About button
	var aboutBtn = addButton(game, 'aboutButton', function() {
		const style = {fontFamily: 'piyik,cursive', fontSize: '18px', fill: '#7d5e52', wordWrap: {width: 300, useAdvancedWrap: true}};
		const txt = 'Made with love by';
		const aboutDetails = game.add.text(aboutBtn.x - 50, aboutBtn.y + 75, txt, style);
		aboutDetails.setDepth(popupDepth + 1);
		const concatenator = game.add.text(aboutDetails.x + aboutDetails.width + 36, aboutDetails.y, "and", style);
		concatenator.setDepth(popupDepth + 1);
		menuGroup.add(concatenator);
		menuGroup.add(aboutDetails);
		
		const byLines = [
			{
				name: "Sol",
				url: "https://twitter.com/komomorebi",
				paddingX: aboutDetails.width + 6
			}, 
			{
				name: "Suzukichi", 
				url: "https://twitter.com/suzukichiu", 
				paddingX: aboutDetails.width + 72
			}
		];
		byLines.forEach(info => {
			const byLine = game.add.text(aboutDetails.x + info.paddingX, aboutDetails.y, info.name, style);
					   
		   const resetCol = function() {
			   byLine.setColor("#788c9b");
		   };
			resetCol();
			
			byLine.setDepth(popupDepth + 1);
			byLine.setInteractive({cursor: 'pointer'});
			menuGroup.add(byLine);
			
			byLine.on('pointerover', function() {
			   byLine.setColor("#eba14a");
		   });

		   
		   byLine.on('pointerout', resetCol);
		   byLine.on('pointerup', function() {
			 window.open(info.url,  "_blank");
		   });

		});
		
		aboutBtn.disableInteractive(false);
		resetBtn.destroy();
		frameBtn.destroy();
		soundBtn.destroy();
		
	}, soundBtn.x, soundBtn.y - 100, popupDepth + 1, true);
	menuGroup.add(aboutBtn);
	
	
	// Close Button
	var closeBtn = addButton(game, 'closeButton', function() {
		menuGroup.destroy(true);
		game.lockActions = false;
		game.settingMenuOpen = false;
	}, gameWidth - 40, 40,
	popupDepth + 1, true);
	menuGroup.add(closeBtn);
};

function addButton(game, spriteName, actionOnClick, x, y, depth = 2, isSingleImage = false) {
   var btn = game.add.sprite(x, y, spriteName);
   btn.setInteractive({ cursor: 'pointer' });
   btn.setDepth(depth || 2);
   
   if (!isSingleImage) {
	   btn.on('pointerover', function() {
		   btn.setFrame(1);
	   });
	   btn.on('pointerout', function() {
		   btn.setFrame(0);
	   });
	   btn.on('pointerup', function() {
		   btn.setFrame(0);
	   });
   }
   btn.on('pointerdown', function() {
       if (!isSingleImage) {
		   btn.setFrame(2);
	   }
	   actionOnClick(game);
   });

   
   return btn;
}

function getSoundButtonSprite(isMuted = false) {
	return isMuted ? 'muteButton' : 'soundButton' ;
}

export const randInt = function(low, high) {
	return Math.floor(Math.random() * (high - low + 1)) + low;
}

export function resetData(game) {
	// Keep global settings by only removing the duck data
	localStorage.removeItem(storageKey);
}

export function getGlobalGameDataJson(game) {
	return JSON.stringify({
		borderNum: game.borderNum,
		isMuted: game.isMuted || false
	});
};

export function getGameDataJson(game) {
	return JSON.stringify({
		duckType: game.duckType,
		level: game.level,
		wins: game.wins,
		lastInteraction: game.lastInteraction,
		lastHunger: game.lastHunger,
		numMushrooms: game.numMushrooms,
		lastMushroom: game.lastMushroom,
		feedHistory: game.feedHistory,
		hunger: game.hunger,
	});
}

export function saveData(game, global = false) {
	if (global) { 
        window.localStorage.setItem(globalStorageKey, getGlobalGameDataJson(game));
    } else {
		window.localStorage.setItem(storageKey, getGameDataJson(game));
	}
}

export function popSavedData(key) {
	return JSON.parse(window.localStorage.getItem(key) || "{}");
}

export function loadGameData(game, global = true) {
		if (global) {
			// Load global settings
			const savedGlobalData = popSavedData(globalStorageKey);

			game.borderNum = savedGlobalData.borderNum || 0;
			game.isMuted = !!savedGlobalData.isMuted;
			game.sound.mute = game.isMuted;
		} else {
			// Load duck info
			const savedDuckData = popSavedData(storageKey);

			game.lastInteraction = savedDuckData.lastInteraction || Date.now();
			game.lastMushroom = savedDuckData.lastMushroom || game.lastInteraction;
			
			game.duckType = savedDuckData.duckType || 0;
			
			game.level = savedDuckData.level || 0;
			
			game.numMushrooms = savedDuckData.numMushrooms || 0;
			
			game.feedHistory = savedDuckData.feedHistory || [];
			game.lastHunger = savedDuckData.lastHunger || Date.now();
			game.hunger = savedDuckData.hunger || 0;
			game.wins = savedDuckData.wins || 0;
		}
		saveData(game, global);
}
