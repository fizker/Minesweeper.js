var Lobby = (function() {
	"use strict";
	var games = [],
		elements = {};
	
	function setup(container) {
		var games = document.createElement('div');
		games.className = 'lobby_games c_abs c_fill';
		container.appendChild(games);
		
		elements.container = container;
	};
	function listGames() {
		
	};
	
	return {
		setup: setup,
		listGames: listGames
	};
}());