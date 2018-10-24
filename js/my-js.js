var gameFieldArrey = [[], [], [], [], [], [], [], [], [], []];
var enemyTank = {direction: 0, x:0, y:0};
var myTank = {direction: 0, x:0, y:0};
var enemyShell = {direction: 0, x:0, y:0};
var myShell = {direction: 0, x:0, y:0};
var cellSize = 10;
var score = 0;
var enemyTank2 = {direction: 0, x:15, y:15};
var enemyShell2 = {direction: 0, x:0, y:0};
var tankMove = false;

function init() {
	start();
	restart();
	myTankMove();
	myTankShot();
}

function flag () {
	if ($("#my-shell").length > 0) {
		return true;
	}
	else return false;
}

function checkHit () {
	if ($("#hit").length > 0) {
		return true;
	}
	else return false;
}

function checkHit2 () {
	if ($("#hit2").length > 0) {
		return true;
	}
	else return false;
}

function checkHit3 () {
	if ($("#hit3").length > 0) {
		return true;
	}
	else return false;
}

function checkEnemy () {
	if ($("#enemy-tank2").length > 0) {
		return true;
	}
	else return false;
}

function reinit () {
	gameFieldArrey = [[], [], [], [], [], [], [], [], [], []];
	score = 0;
	myTank.x = 0;
	myTank.y = 9;
	myTank.direction = 0;
	$("#score-num").text("0");
	$.each(gameFieldArrey, function(line_index, line) {
		for(var i = 0; i < 10; i++) {
			line.push(0);
		}
	});
	reBuild();
	myTankMove();
	myTankShot();
}

function reBuild() {
	$.each(gameFieldArrey, function(line_index, line) {
		$.each(line, function(cell_index, cell) {
			var id = "#line_" + line_index + "_cell_" + cell_index;
			$(id).removeClass();
			$(id).addClass('cell_type_' + cell);
		});
	});
} 

function getRandomObj() {
   var num = Math.random();
   if(num < 0.80) return 0;
   else if(num < 0.95) return 1;
   else return 2;
}

function getRandom (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function start () {
	$("#start").on("click", function() {
		$("#start-page").css("display", "none");
		gameFieldArrey = [[], [], [], [], [], [], [], [], [], []];
		$.each(gameFieldArrey, function(line_index, line) {
		for(var i = 0; i < 10; i++) {
			line.push(getRandomObj());
		}
		});
		reBuild();
		createEnemy();
	})
}

function restart () {
	$("#restart").on("click", function() {
		score = 0;
		$("#start-page").css("display", "block");
		$("#end-page").css("display", "none");
		$("#my-tank").removeClass();
		$("#enemy-tank").remove();
		$("#enemy-tank2").remove();
		$("#enemy-shell").remove();
		$("#enemy-shell2").remove();
		$("#my-tank").removeAttr("style");
		window.clearInterval(window.myShotId);
		window.clearInterval(window.shotId);
		window.clearInterval(window.moveId);
		window.clearInterval(window.turnId);
		window.clearInterval(window.shot2Id);
		window.clearInterval(window.move2Id);
		window.clearInterval(window.turn2Id);
		reinit();
	})
}

function myTankShot () {
	$("html").keydown(function(ev){
		switch (ev.keyCode) {
			case 32:
				if (flag() == false) {
					createMyShell();
				}
		}
	})
}

function createEnemy () {
	$("<div/>", {
    	id: "enemy-tank"
	}).appendTo("#game-field");
	enemyTank.direction = getRandom(0,3);
	enemyTank.x = getRandom(0,9);
	enemyTank.y = 0;
	$("#enemy-tank").addClass("tank_turn_" + enemyTank.direction);
	$("#enemy-tank").css("top", enemyTank.y);
	$("#enemy-tank").css("left", enemyTank.x * cellSize + "%");
	enemyActions();
	createShell();
}

function createShell() {
	$("<div/>", {
    	id: "enemy-shell"
	}).appendTo("#game-field");
	enemyShell.direction = enemyTank.direction;
	enemyShell.y = enemyTank.y;
	enemyShell.x = enemyTank.x;
	$("#enemy-shell").addClass("tank_turn_" + enemyShell.direction);
	$("#enemy-shell").css("top", enemyShell.y * cellSize + "%");
	$("#enemy-shell").css("left", enemyShell.x * cellSize + "%");
	window.shotId = window.setInterval(shot, 250);
}

function createMyShell () {
	$("<div/>", {
    	id: "my-shell"
	}).appendTo("#game-field");
	myShell.direction = myTank.direction;
	myShell.y = myTank.y;
	myShell.x = myTank.x;
	$("#my-shell").addClass("tank_turn_" + myShell.direction);
	$("#my-shell").css("top", myShell.y * cellSize + "%");
	$("#my-shell").css("left", myShell.x * cellSize + "%");
	window.myShotId = window.setInterval(myShot, 250);
}

function createMyHit () {
	if (checkHit() == false) {
		$("<div/>", {
    		id: "hit"
		}).appendTo("#game-field");
		setTimeout(function () {
		$("#hit").remove();
		},1000);
	}
}

function createEnemyHit () {
	if (checkHit2() == false) {
		$("<div/>", {
    		id: "hit2"
		}).appendTo("#game-field");
		setTimeout(function () {
		$("#hit2").remove();
		},1000);
	}
}

function createEnemyHit2 () {
	if (checkHit3() == false) {
		$("<div/>", {
    		id: "hit3"
		}).appendTo("#game-field");
		setTimeout(function () {
		$("#hit3").remove();
		},1000);
	}
}

function enemyActions () {
	window.moveId = window.setInterval(move, 700);
	window.turnId = window.setInterval(turn, 3000);
}

function shot () {
	shellOff();
	switch (enemyShell.direction) {
		case 0:
			enemyShell.y--;
			$("#enemy-shell").css("top", enemyShell.y * cellSize + "%");
			break;
		case 1:
			enemyShell.x++;
			$("#enemy-shell").css("left", enemyShell.x * cellSize + "%");
			break;
		case 2:
			enemyShell.y++;
			$("#enemy-shell").css("top", enemyShell.y * cellSize + "%");
			break;
		case 3:
			enemyShell.x--;
			$("#enemy-shell").css("left", enemyShell.x * cellSize + "%");
			break;			
	}
}

function myShot () {
	myShellOff();
	switch (myShell.direction) {
		case 0:
			myShell.y--;
			$("#my-shell").css("top", myShell.y * cellSize + "%");
			break;
		case 1:
			myShell.x++;
			$("#my-shell").css("left", myShell.x * cellSize + "%");
			break;
		case 2:
			myShell.y++;
			$("#my-shell").css("top", myShell.y * cellSize + "%");
			break;
		case 3:
			myShell.x--;
			$("#my-shell").css("left", myShell.x * cellSize + "%");
			break;			
	}
}

function myShellOff() {
	if (myShell.y > 9) {
		$("#my-shell").remove();
		window.clearInterval(window.myShotId);
		createMyHit();
		$("#hit").css("top", (myShell.y - 0.5) * cellSize + "%");
		$("#hit").css("left", myShell.x * cellSize + "%");
	}
	if (myShell.y < 0) {
		$("#my-shell").remove();
		window.clearInterval(window.myShotId);
		createMyHit();
		$("#hit").css("top", (myShell.y + 0.5) * cellSize + "%");
		$("#hit").css("left", myShell.x * cellSize + "%");
	}
	if (myShell.x > 9) {
		$("#my-shell").remove();
		window.clearInterval(window.myShotId);
		createMyHit();
		$("#hit").css("top", myShell.y * cellSize + "%");
		$("#hit").css("left", (myShell.x - 0.5) * cellSize + "%");
	}
	if (myShell.x < 0) {
		$("#my-shell").remove();
		window.clearInterval(window.myShotId);
		createMyHit();
		$("#hit").css("top", myShell.y * cellSize + "%");
		$("#hit").css("left", (myShell.x + 0.5) * cellSize + "%");
	}
	if (
		gameFieldArrey[myShell.y] &&
		gameFieldArrey[myShell.y][myShell.x] == 1
	) {
		var idMyCell = "#line_" + myShell.y + "_cell_" + myShell.x;
		$(idMyCell).removeClass();
		$(idMyCell).addClass('cell_type_0');
		gameFieldArrey[myShell.y][myShell.x] = 0;
		$("#my-shell").remove();
		window.clearInterval(window.myShotId);
		createMyHit();
		$("#hit").css("top", myShell.y * cellSize + "%");
		$("#hit").css("left", myShell.x * cellSize + "%");
	}
	if (myShell.x == enemyTank.x && myShell.y == enemyTank.y) {
		$("#enemy-tank").remove();
		$("#my-shell").remove();
		$("#enemy-shell").remove();
		createMyHit();
		$("#hit").css("top", myShell.y * cellSize + "%");
		$("#hit").css("left", myShell.x * cellSize + "%");
		window.clearInterval(window.myShotId);
		window.clearInterval(window.shotId);
		window.clearInterval(window.moveId);
		window.clearInterval(window.turnId);
		score++;
		$("#score-num").text(score);
		createEnemy();
	}
	if (myShell.x == enemyTank2.x && myShell.y == enemyTank2.y) {
		$("#enemy-tank2").remove();
		$("#my-shell").remove();
		$("#enemy-shell2").remove();
		createMyHit();
		$("#hit").css("top", myShell.y * cellSize + "%");
		$("#hit").css("left", myShell.x * cellSize + "%");
		window.clearInterval(window.myShotId);
		window.clearInterval(window.shot2Id);
		window.clearInterval(window.move2Id);
		window.clearInterval(window.turn2Id);
		score++;
		$("#score-num").text(score);
		createEnemy2();
	}
	if(score == 10 && checkEnemy() == false) {
		createEnemy2();
	}
}

function shellOff() {
	if (enemyShell.y > 9) {
		$("#enemy-shell").remove();
		window.clearInterval(window.shotId);
		createEnemyHit();
		$("#hit2").css("top", (enemyShell.y - 0.5) * cellSize + "%");
		$("#hit2").css("left", enemyShell.x * cellSize + "%");
		createShell();
	}
	if (enemyShell.y < 0) {
		$("#enemy-shell").remove();
		window.clearInterval(window.shotId);
		createEnemyHit();
		$("#hit2").css("top", (enemyShell.y + 0.5) * cellSize + "%");
		$("#hit2").css("left", enemyShell.x * cellSize + "%");
		createShell();
	}
	if (enemyShell.x > 9) {
		$("#enemy-shell").remove();
		window.clearInterval(window.shotId);
		createEnemyHit();
		$("#hit2").css("top", enemyShell.y * cellSize + "%");
		$("#hit2").css("left", (enemyShell.x - 0.5) * cellSize + "%");
		createShell();
	}
	if (enemyShell.x < 0) {
		$("#enemy-shell").remove();
		window.clearInterval(window.shotId);
		createEnemyHit();
		$("#hit2").css("top", enemyShell.y * cellSize + "%");
		$("#hit2").css("left", (enemyShell.x + 0.5) * cellSize + "%");
		createShell();
	}
	if (gameFieldArrey[enemyShell.y] &&
		gameFieldArrey[enemyShell.y][enemyShell.x] == 1
	) {
		createEnemyHit();
		$("#hit2").css("top", enemyShell.y * cellSize + "%");
		$("#hit2").css("left", enemyShell.x * cellSize + "%");
		var idCell = "#line_" + enemyShell.y + "_cell_" + enemyShell.x;
		$(idCell).removeClass();
		$(idCell).addClass('cell_type_0');
		gameFieldArrey[enemyShell.y][enemyShell.x] = 0;
		$("#enemy-shell").remove();
		window.clearInterval(window.shotId);
		createShell();
	}
	if (enemyShell.x == myTank.x && enemyShell.y == myTank.y) {
		$("#my-tank").addClass("my-tank_none")
		$("#enemy-tank").remove();
		$("#enemy-shell").remove();
		window.clearInterval(window.shotId);
		$("#enemy-tank2").remove();
		$("#enemy-shell2").remove();
		window.clearInterval(window.shot2Id);
		$("#end-page").css("display", "block");
		var result = $("#score-num").text();
		$("#end_destroed").text(result);
		$('html').off("keyup");
	}
}

function move () {
	if (enemyTank.y == 0 && enemyTank.direction == 0) {
		enemyTank.direction = 2;
		$("#enemy-tank").removeClass();
		$("#enemy-tank").addClass("tank_turn_" + enemyTank.direction);
	}
	if (enemyTank.y == 9 && enemyTank.direction == 2) {
		enemyTank.direction = 0;
		$("#enemy-tank").removeClass();
		$("#enemy-tank").addClass("tank_turn_" + enemyTank.direction);
	}
	if (enemyTank.x == 0 && enemyTank.direction == 3) {
		enemyTank.direction = 1;
		$("#enemy-tank").removeClass();
		$("#enemy-tank").addClass("tank_turn_" + enemyTank.direction);
	}
	if (enemyTank.x == 9 && enemyTank.direction == 1) {
		enemyTank.direction = 3;
		$("#enemy-tank").removeClass();
		$("#enemy-tank").addClass("tank_turn_" + enemyTank.direction);
	}
	switch (enemyTank.direction) {
		case 0:
			if (enemyTank.y !== 0 && gameFieldArrey[enemyTank.y - 1][enemyTank.x] !== 1 && gameFieldArrey[enemyTank.y - 1][enemyTank.x] !== 2) enemyTank.y--;
			$("#enemy-tank").css("top", enemyTank.y * cellSize + "%");
			break;
		case 1:
			if (enemyTank.x !== 9 && gameFieldArrey[enemyTank.y][enemyTank.x + 1] !== 1 && gameFieldArrey[enemyTank.y][enemyTank.x + 1] !== 2) enemyTank.x++;
			$("#enemy-tank").css("left", enemyTank.x * cellSize + "%");
			break;
		case 2:
			if (enemyTank.y !== 9 && gameFieldArrey[enemyTank.y + 1][enemyTank.x] !== 1 && gameFieldArrey[enemyTank.y + 1][enemyTank.x] !== 2) enemyTank.y++;
			$("#enemy-tank").css("top", enemyTank.y * cellSize + "%");
			break;
		case 3:
			if (enemyTank.x !== 0 && gameFieldArrey[enemyTank.y][enemyTank.x - 1] !== 1 && gameFieldArrey[enemyTank.y][enemyTank.x - 1] !== 2) enemyTank.x--;
			$("#enemy-tank").css("left", enemyTank.x * cellSize + "%");
			break;
	}
}

function turn () {
	enemyTank.direction = getRandom(0,3);
	$("#enemy-tank").removeClass();
	$("#enemy-tank").addClass("tank_turn_" + enemyTank.direction);
}

function myTankMove () {
	myTank.x = 0;
	myTank.y = 9;
	$('html').keyup(function(event){
		if(tankMove) return;
		tankMove = true;
		setTimeout(function() {
			tankMove = false;
		}, 300);
  		switch (event.keyCode) {
  			case 38:
  				myTank.direction = 0;
  				$("#my-tank").removeClass();
  				$("#my-tank").addClass("tank_turn_" + myTank.direction);
  				if (myTank.y !== 0 && gameFieldArrey[myTank.y - 1][myTank.x] !== 1 && gameFieldArrey[myTank.y - 1][myTank.x] !== 2) myTank.y--;
				$("#my-tank").css("top", myTank.y * cellSize + "%");
				break;
			case 39:
  				myTank.direction = 1;
  				$("#my-tank").removeClass();
  				$("#my-tank").addClass("tank_turn_" + myTank.direction);
  				if (myTank.x !== 9 && gameFieldArrey[myTank.y][myTank.x + 1] !== 1 && gameFieldArrey[myTank.y][myTank.x + 1] !== 2) myTank.x++;
				$("#my-tank").css("left", myTank.x * cellSize + "%");
				break;
			case 40:
  				myTank.direction = 2;
  				$("#my-tank").removeClass();
  				$("#my-tank").addClass("tank_turn_" + myTank.direction);
  				if (myTank.y !== 9 && gameFieldArrey[myTank.y + 1][myTank.x] !== 1 && gameFieldArrey[myTank.y + 1][myTank.x] !== 2) myTank.y++;
				$("#my-tank").css("top", myTank.y * cellSize + "%");
				break;
			case 37:
  				myTank.direction = 3;
  				$("#my-tank").removeClass();
  				$("#my-tank").addClass("tank_turn_" + myTank.direction);
  				if (myTank.x !== 0 && gameFieldArrey[myTank.y][myTank.x - 1] !== 1 && gameFieldArrey[myTank.y][myTank.x - 1] !== 2) myTank.x--;
				$("#my-tank").css("left", myTank.x * cellSize + "%");
				break;			
  		}
	});
}

/*Create Second Enemy Tank*/

function createEnemy2 () {
	$("<div/>", {
    	id: "enemy-tank2"
	}).appendTo("#game-field");
	enemyTank2.direction = getRandom(0,3);
	enemyTank2.x = getRandom(0,9);
	enemyTank2.y = 9;
	$("#enemy-tank2").addClass("tank_turn_" + enemyTank2.direction);
	$("#enemy-tank2").css("top", enemyTank2.y * cellSize + "%");
	$("#enemy-tank2").css("left", enemyTank2.x * cellSize + "%");
	enemyActions2();
	createShell2();
}

function createShell2() {
	$("<div/>", {
    	id: "enemy-shell2"
	}).appendTo("#game-field");
	enemyShell2.direction = enemyTank2.direction;
	enemyShell2.y = enemyTank2.y;
	enemyShell2.x = enemyTank2.x;
	$("#enemy-shell2").addClass("tank_turn_" + enemyShell2.direction);
	$("#enemy-shell2").css("top", enemyShell2.y * cellSize + "%");
	$("#enemy-shell2").css("left", enemyShell2.x * cellSize + "%");
	window.shot2Id = window.setInterval(shot2, 250);
}

function enemyActions2 () {
	window.move2Id = window.setInterval(move2, 700);
	window.turn2Id = window.setInterval(turn2, 3000);
}

function move2 () {
	if (enemyTank2.y == 0 && enemyTank2.direction == 0) {
		enemyTank2.direction = 2;
		$("#enemy-tank2").removeClass();
		$("#enemy-tank2").addClass("tank_turn_" + enemyTank2.direction);
	}
	if (enemyTank2.y == 9 && enemyTank2.direction == 2) {
		enemyTank2.direction = 0;
		$("#enemy-tank2").removeClass();
		$("#enemy-tank2").addClass("tank_turn_" + enemyTank2.direction);
	}
	if (enemyTank2.x == 0 && enemyTank2.direction == 3) {
		enemyTank2.direction = 1;
		$("#enemy-tank2").removeClass();
		$("#enemy-tank2").addClass("tank_turn_" + enemyTank2.direction);
	}
	if (enemyTank2.x == 9 && enemyTank2.direction == 1) {
		enemyTank2.direction = 3;
		$("#enemy-tank2").removeClass();
		$("#enemy-tank2").addClass("tank_turn_" + enemyTank2.direction);
	}
	switch (enemyTank2.direction) {
		case 0:
			if (enemyTank2.y !== 0 && gameFieldArrey[enemyTank2.y - 1][enemyTank2.x] !== 1 && gameFieldArrey[enemyTank2.y - 1][enemyTank2.x] !== 2) enemyTank2.y--;
			$("#enemy-tank2").css("top", enemyTank2.y * cellSize + "%");
			break;
		case 1:
			if (enemyTank2.x !== 9 && gameFieldArrey[enemyTank2.y][enemyTank2.x + 1] !== 1 && gameFieldArrey[enemyTank2.y][enemyTank2.x + 1] !== 2) enemyTank2.x++;
			$("#enemy-tank2").css("left", enemyTank2.x * cellSize + "%");
			break;
		case 2:
			if (enemyTank2.y !== 9 && gameFieldArrey[enemyTank2.y + 1][enemyTank2.x] !== 1 && gameFieldArrey[enemyTank2.y + 1][enemyTank2.x] !== 2) enemyTank2.y++;
			$("#enemy-tank2").css("top", enemyTank2.y * cellSize + "%");
			break;
		case 3:
			if (enemyTank2.x !== 0 && gameFieldArrey[enemyTank2.y][enemyTank2.x - 1] !== 1 && gameFieldArrey[enemyTank2.y][enemyTank2.x - 1] !== 2) enemyTank2.x--;
			$("#enemy-tank2").css("left", enemyTank2.x * cellSize + "%");
			break;
	}
}

function turn2 () {
	enemyTank2.direction = getRandom(0,3);
	$("#enemy-tank2").removeClass();
	$("#enemy-tank2").addClass("tank_turn_" + enemyTank2.direction);
}

function shot2 () {
	shellOff2();
	switch (enemyShell2.direction) {
		case 0:
			enemyShell2.y--;
			$("#enemy-shell2").css("top", enemyShell2.y * cellSize + "%");
			break;
		case 1:
			enemyShell2.x++;
			$("#enemy-shell2").css("left", enemyShell2.x * cellSize + "%");
			break;
		case 2:
			enemyShell2.y++;
			$("#enemy-shell2").css("top", enemyShell2.y * cellSize + "%");
			break;
		case 3:
			enemyShell2.x--;
			$("#enemy-shell2").css("left", enemyShell2.x * cellSize + "%");
			break;			
	}
}

function shellOff2() {
	if (enemyShell2.y > 9) {
		$("#enemy-shell2").remove();
		window.clearInterval(window.shot2Id);
		createEnemyHit2();
		$("#hit3").css("top", (enemyShell2.y - 0.5) * cellSize + "%");
		$("#hit3").css("left", enemyShell2.x * cellSize + "%");
		createShell2();
	}
	if (enemyShell2.y < 0) {
		$("#enemy-shell2").remove();
		window.clearInterval(window.shot2Id);
		createEnemyHit2();
		$("#hit3").css("top", (enemyShell2.y + 0.5) * cellSize + "%");
		$("#hit3").css("left", enemyShell2.x * cellSize + "%");
		createShell2();
	}
	if (enemyShell2.x > 9) {
		$("#enemy-shell2").remove();
		window.clearInterval(window.shot2Id);
		createEnemyHit2();
		$("#hit3").css("top", enemyShell2.y * cellSize + "%");
		$("#hit3").css("left", (enemyShell2.x - 0.5) * cellSize + "%");
		createShell2();
	}
	if (enemyShell2.x < 0) {
		$("#enemy-shell2").remove();
		window.clearInterval(window.shot2Id);
		createEnemyHit2();
		$("#hit3").css("top", enemyShell2.y * cellSize + "%");
		$("#hit3").css("left", (enemyShell2.x + 0.5) * cellSize + "%");
		createShell2();
	}
	if (gameFieldArrey[enemyShell2.y][enemyShell2.x] == 1) {
		createEnemyHit2();
		$("#hit3").css("top", enemyShell2.y * cellSize + "%");
		$("#hit3").css("left", enemyShell2.x * cellSize + "%");
		var idCell2 = "#line_" + enemyShell2.y + "_cell_" + enemyShell2.x;
		$(idCell2).removeClass();
		$(idCell2).addClass('cell_type_0');
		gameFieldArrey[enemyShell2.y][enemyShell2.x] = 0;
		$("#enemy-shell2").remove();
		window.clearInterval(window.shot2Id);
		createShell2();
	}
	if (enemyShell2.x == myTank.x && enemyShell2.y == myTank.y) {
		$("#my-tank").addClass("my-tank_none")
		$("#enemy-tank").remove();
		$("#enemy-shell").remove();
		window.clearInterval(window.shotId);
		$("#enemy-tank2").remove();
		$("#enemy-shell2").remove();
		window.clearInterval(window.shot2Id);
		$("#end-page").css("display", "block");
		var result = $("#score-num").text();
		$("#end_destroed").text(result);
		$('html').off("keyup");
	}
}

$(function() {
	init();
});
