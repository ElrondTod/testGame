const state = {
	LOGO: 'logo',
	MENU: 'menu',
	GAME: 'game'
}

var appState = state.LOGO

var splashTimer = 2000;

var renderer;
var stage;
var ticker;

	//load sprites
var splash = PIXI.Sprite.from('https://i.imgur.com/e2pABP2.png');
var ufo = PIXI.Texture.from('https://i.imgur.com/Dd0PVIC.png');
var	logo = PIXI.Sprite.from('https://i.imgur.com/jC8vvgh.png');
var	ship = PIXI.Sprite.from('https://i.imgur.com/tohidyS.png');
var	rocketTex = PIXI.Texture.from('https://i.imgur.com/u6r6bSE.png');
var parDot = PIXI.Texture.from('https://i.imgur.com/yiFRuQU.png');
var farTex = PIXI.Texture.from('https://i.imgur.com/FISKhWf.png');
var planetsTex = PIXI.Texture.from('https://i.imgur.com/JFfbP5c.png');

var background;

var far;
var planets;

var textureButton = PIXI.Texture.from('https://i.imgur.com/ur6vn36.png');
var textureButtonDown = PIXI.Texture.from('https://i.imgur.com/WDGuX1h.png');
var textureButtonOver = PIXI.Texture.from('https://i.imgur.com/bhm2m29.png');

var menuUfo1 = new PIXI.Sprite(ufo);
var menuUfo2 = new PIXI.Sprite(ufo);

var dir1 = 1;
var dir2 = -1;

var enemyTimer = 2000;
var enemyList = [];
var enemyMoveList = [];

var rocketList = [];

var particleContainerList = [];
var particleList = [];

let left = keyboard("ArrowLeft");
let up = keyboard("ArrowUp");
let right = keyboard("ArrowRight");
let down = keyboard("ArrowDown");
let space = keyboard(" ");

space.press = () => {
	rocketList.push(shootRocket());
	stage.addChild(rocketList[rocketList.length -1]);
}

function keyboard(value) {
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);
  
  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );
  
  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };
  
  return key;
}

function onGameButtonDown() {
    this.isdown = true;
    this.texture = textureButtonDown;
	appState = state.GAME;
	setupGame();
}

function onExitButtonDown() {
    this.isdown = true;
    this.texture = textureButtonDown;
	
	appState = state.LOGO;
	splash.alpha = 1;
	splashTimer = 2000
	ticker.stop();
	stage.removeChildren();
	startApp();
	
}

function onButtonUp() {
    this.isdown = false;
    if (this.isOver) {
        this.texture = textureButtonOver;
    }
    else {
        this.texture = textureButton;
    }
}

function onButtonOver() {
    this.isOver = true;
    if (this.isdown) {
        return;
    }
    this.texture = textureButtonOver;
}

function onButtonOut() {
    this.isOver = false;
    if (this.isdown) {
        return;
    }
    this.texture = textureButton;
}

function createButton(txt, x, y, fnc){
	var btn = new PIXI.Sprite(textureButton);
	btn.position.set(x, y);
	var btnTxt = new PIXI.Text(txt);
	btnTxt.anchor.set(0.5, 0.5);
	btnTxt.position.set(100, 50)
	btn.addChild(btnTxt)
	
	btn.interactive = true;
    btn.buttonMode = true;
	
	btn.on('pointerdown', fnc)
         .on('pointerup', onButtonUp)
         .on('pointerupoutside', onButtonUp)
         .on('pointerover', onButtonOver)
         .on('pointerout', onButtonOut);
		 
	return btn;
}

function setupGame() {
	stage.removeChildren();
	
	far = new PIXI.TilingSprite(farTex, 800, 600);
	far.position.set(0, 0);
	far.tilePosition.x = 0;
	far.tilePosition.y = 0;
	stage.addChild(far);
	
	planets = new PIXI.TilingSprite(planetsTex, 1600, 600);
	planets.position.set(0, 0);
	planets.tilePosition.x = 0;
	planets.tilePosition.y = 0;
	stage.addChild(planets);
	
	
	ship.anchor.set(0.5, 0.5);
	ship.position.set(90, 300);
	ship.transparent = true;
	
	ship.blownup = false;
	stage.addChild(ship);
}

function setupMenu() {	
	logo.position.set((renderer.width/2 - 100), 30);
	stage.addChild(logo);	
	
	menuUfo1.anchor.set(0.5, 0.5);
	menuUfo1.position.set(150, 500);
	menuUfo1.transparent = true;
	stage.addChild(menuUfo1);
	
	menuUfo2.anchor.set(0.5, 0.5);
	menuUfo2.position.set(650, 100);
	stage.addChild(menuUfo2);
	
	stage.addChild(createButton('GAME1', (renderer.width/2 - 100), 140, onGameButtonDown));
	stage.addChild(createButton('GAME2', (renderer.width/2 - 100), 250, onGameButtonDown));
	stage.addChild(createButton('GAME3', (renderer.width/2 - 100), 360, onGameButtonDown));
	stage.addChild(createButton('EXIT', (renderer.width/2 - 100), 470, onExitButtonDown));
}

function shootRocket()
{
	var rocket = new PIXI.Sprite(rocketTex);
	rocket.anchor.set(0.5, 0.5)
	rocket.position.set(ship.position.x + ship.width, ship.position.y);
	
	return rocket;
}

function spawnEnemy() {
	
	var max = 569;
	var min = 31;
	var enemy = new PIXI.Sprite(ufo);
	enemy.anchor.set(0.5, 0.5);
	enemy.position.set(750, (Math.floor(Math.random() * (+max - +min)) + +min));
	
	return enemy;
}

function collisionDetect(a, b) {
	var recA = a.getBounds();
	var recB = b.getBounds();
	return recA.x + recA.width > recB.x && recA.x < recB.x + recB.width && recA.y + recA.height > recB.y && recA.y < recB.y + recB.height;
}

function updateEnemy(){
	var i;
	for(i = 0;i<enemyList.length;i++) {
		enemyList[i].position.x += enemyMoveList[i].x;
		enemyList[i].position.y += enemyMoveList[i].y;
		
		if(enemyList[i].position.y < 31 || enemyList[i].position.y > 569) {
			enemyMoveList[i].y *= -1;
		}
		
		if(enemyList[i].position.x < -50) {
			stage.removeChild(enemyList[i]);
			enemyList[i].destroy();
			enemyList.splice(i, 1);
			enemyMoveList.splice(i, 1);
		}
			
	}
}

function updateRocket() {
    var i;
	for(i = 0;i<rocketList.length;i++) {
		rocketList[i].position.x += 1;				
		
		if(rocketList[i].position.x > 850) {
			stage.removeChild(rocketList[i]);
			rocketList[i].destroy();
			rocketList.splice(i, 1);
			
		}
	}
}

function checkEnemyCollision()
{	
	var i, j;
	for(i = 0;i<enemyList.length; i++) {
		for(j = 0;j<rocketList.length;j++) {
			if(collisionDetect(enemyList[i], rocketList[j])) {
				
				stage.removeChild(enemyList[i]);
				var particle = new PIXI.ParticleContainer(500);
				particle.width = 100;
				particle.height = 100;
				var particles = [];
				for (let i = 0; i < 500; ++i)
				{
					var min = 3;
					var max = 97;
					
					var dot = new PIXI.Sprite(parDot);
					dot.anchor.set(0.5, 0.5);
					dot.x = Math.floor(Math.random() * (+max - +min)) + +min;
					dot.y = Math.floor(Math.random() * (+max - +min)) + +min;
					
					dot.direction = Math.random() * Math.PI * 2;
					
					particles.push(dot);
					
					particle.addChild(dot);
				}
				particleList.push(particles);
				particle.position.set(enemyList[i].x, enemyList[i].y);
				particleContainerList.push(particle);
				stage.addChild(particle);
						
				enemyList.splice(i, 1);
				enemyMoveList.splice(i, 1);
				
				stage.removeChild(rocketList[j]);
				rocketList.splice(j, 1);
				
				break;
				i--;
			}
		}
	}
}

function checkShipCollision()
{
	for(i = 0;i<enemyList.length; i++) {
		if(collisionDetect(enemyList[i], ship) && !ship.blownup) {
			ship.blownup = true;
			stage.removeChild(ship);
			var particle = new PIXI.ParticleContainer(500);
			particle.width = 100;
			particle.height = 100;
			var particles = [];
			for (let i = 0; i < 500; ++i)
			{
				var min = 3;
				var max = 97;
				
				var dot = new PIXI.Sprite(parDot);
				dot.anchor.set(0.5, 0.5);
				dot.x = Math.floor(Math.random() * (+max - +min)) + +min;
				dot.y = Math.floor(Math.random() * (+max - +min)) + +min;
				
				dot.direction = Math.random() * Math.PI * 2;
				
				particles.push(dot);
				
				particle.addChild(dot);
			}
			particleList.push(particles);
			particle.position.set(ship.x, ship.y);
			particleContainerList.push(particle);
			stage.addChild(particle);
			
		}
	}
}

function updateParticles() {
	for(var i = 0;i<particleList.length;i++) {
		for(var j = 0;j<particleList[i].length;j++) {
			dot = particleList[i][j];
			dot.x += Math.cos(dot.direction) * 2;
			dot.y += Math.sin(dot.direction) * 2;
			
			if(dot.x < 0 || dot.y < 0 ||dot.x > 100 || dot.y > 100) {
				particleContainerList[i].removeChild(dot);
				dot.destroy();
				particleList[i].splice(j, 1);
				j--;
			}
		}
		if(particleList[i].length == 0) {
			stage.removeChild(particleContainerList[i]);
			particleContainerList[i].destroy();
			particleContainerList.splice(i, 1);
			
			particleList.splice(i, 1);
			
			i--;
		}
	}
}

function setupApp() {
	// setup renderer and ticker
	renderer = new PIXI.Renderer({ width: 800, height: 600, backgroundColor: 0x1099bb });
	document.body.appendChild(renderer.view);
	stage = new PIXI.Container();

	// setup ticker
	ticker = new PIXI.Ticker();
	ticker.add(() => {
		renderer.render(stage);
	}, PIXI.UPDATE_PRIORITY.LOW);
	
	//add main ticker function
	ticker.add(function(delta) {
		switch(appState){
			case state.LOGO:
				splashTimer -= ticker.elapsedMS;
				if(splashTimer < 0){
					splash.alpha -= 0.01;
				}
				if(splash.alpha <= 0){
					appState = state.MENU;
					stage.removeChild(splash);
					setupMenu();
				}
				break;
			case state.MENU:
				if(menuUfo1.y > 500 || menuUfo1.y < 100){
					dir1 = dir1 * -1;
				}
				
				if(menuUfo2.y > 500 || menuUfo2.y < 100){
					dir2 = dir2 * -1;
				}
				
				menuUfo1.y = menuUfo1.y + (1 * dir1);
				menuUfo2.y = menuUfo2.y + (1 * dir2);
				break;
			case state.GAME:
				far.tilePosition.x -= 0.128;
				planets.tilePosition.x += -0.64
			
				if(left.isDown && ship.position.x > 75)
				{
					ship.position.x -= 1.5;
				}
				if(right.isDown && ship.position.x < 725)
				{
					ship.position.x += 1.5;
				}
				if(up.isDown && ship.position.y > 20)
				{
					ship.position.y -= 1.5;
				}
				if(down.isDown && ship.position.y < 580)
				{
					ship.position.y += 1.5;
				}
				
				enemyTimer -= ticker.elapsedMS;
				if(enemyTimer < 0) {
					var min = -1;
					var max = 1;
					enemyList.push(spawnEnemy());
					var ranX = Math.random() - 1;
					var ranY = (Math.random() * (+max - +min)) + +min;
					var dir = {x: ranX, y: ranY};
					enemyMoveList.push(dir);
					stage.addChild(enemyList[enemyList.length - 1]);
					enemyTimer = 2000;
				}
				
				updateEnemy();
				updateRocket();
				
				checkEnemyCollision();
				checkShipCollision();
				
				updateParticles();
				
				if(ship.blownup && particleContainerList.length == 0) {
					rocketList = [];
					enemyList = [];
					enemyMoveList = [];
					enemyTimer = 2000;
					appState = state.MENU;
					stage.removeChildren();
					stage.addChild(background);
					setupMenu();
				}
				
				break;
		}
	});
}

function startApp() {
	background = new PIXI.Sprite(farTex);
	background.position.set(0, 0);
	stage.addChild(background);
	
	splash.position.set(0,0);
	stage.addChild(splash);
	
	ticker.start();
}

setupApp();
startApp();

