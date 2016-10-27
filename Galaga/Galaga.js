var myGamePiece;
var enemy1;
var enemy2;
var enemy3;
var enemy4;
var enemy5;
var enemy6;
var enemy7;
var enemyMoving= false;
var originalXPosition = [];
var lives = 100;
var enemiesKilled = 0;
var bullets = [];
var playerCooldown = 50;		//time for player to wait to shoot again to prevent holding down shoot
var enemys = [];				//array of enemies
var level = 0;
var sprites;
var srcX = 184;
var srcY = 55;
var enemySprites;
var enemySrcX =188 ;
var enemySrcY=178 ;
var bulletSprites;
var bulletSrcX = 366;
var bulletSrcY = 195;
var canvas = document.getElementById("ship");


function startGame() {
	sprites = new Image();
	sprites.src = 'images/sprites.png';
	enemySprites = new Image();
	enemySprites.src = 'images/sprites.png';
	bulletSprites = new Image();
	bulletSprites.src = 'images/sprites.png';
	switch(level){
		default:
			enemy1 = new enemy(9, 10, "blue",canvas.width/2,canvas.height/3);
			originalXPosition = [canvas.width/2];
			break;
		case 1:
			enemy1 = new enemy(9, 10, "blue",canvas.width/2,canvas.height/3);		//create the enemies
		    enemy2 = new enemy(9, 10, "blue",canvas.width/2.4,canvas.height/3);
		    enemy3 = new enemy(9, 10, "blue",canvas.width/3,canvas.height/3);
			originalXPosition = [canvas.width/2,canvas.width/2,canvas.width/3];    			//keep track of enemy start pos
			break;
		case 2:
			enemy1 = new enemy(9, 10, "blue",canvas.width/2,canvas.height/3);		//create the enemies
			enemy2 = new enemy(9, 10, "blue",canvas.width/2.4,canvas.height/3);
			enemy3 = new enemy(9, 10, "blue",canvas.width/3,canvas.height/3);
		    enemy4 = new enemy(9, 10, "blue",canvas.width/4,canvas.height/3);
		    enemy5 = new enemy(9, 10, "blue",canvas.width/6,canvas.height/3);
			originalXPosition = [canvas.width/2,canvas.width/2,canvas.width/3,canvas.width/4,canvas.width/6];
			break;
		case 3:
			enemy1 = new enemy(9, 10, "blue",canvas.width/2,canvas.height/3);		//create the enemies
			enemy2 = new enemy(9, 10, "blue",canvas.width/2.4,canvas.height/3);
			enemy3 = new enemy(9, 10, "blue",canvas.width/3,canvas.height/3);
			enemy4 = new enemy(9, 10, "blue",canvas.width/4,canvas.height/3);
			enemy5 = new enemy(9, 10, "blue",canvas.width/6,canvas.height/3);
		    enemy6 = new enemy(9, 10, "blue",canvas.width/1.7,canvas.height/3);
		    enemy7 = new enemy(9, 10, "blue",canvas.width/1.5,canvas.height/3);
			originalXPosition = [canvas.width/2,canvas.width/2,canvas.width/3,canvas.width/4,canvas.width/6,canvas.width/1.7,canvas.width/1.5];
			break;
	}
    myGamePiece = new component(15, 16, "red", canvas.width/2, canvas.height/1.2);	//create player
    myGameArea.start();
}
	
var myGameArea = {
	    canvas : document.getElementById("ship"),			//access canvas from html doc
	    start : function() {		//call to start game
	        this.context = this.canvas.getContext("2d");
	        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
			if(level==0){
				this.interval = setInterval(update, 20);
			}
	        window.addEventListener('keydown', function (e) {		//listen to a key being pressed
	        	myGameArea.keys = (myGameArea.keys || []);
	        	myGameArea.keys[e.keyCode] = true;
	        })
	        window.addEventListener('keyup', function (e) {			//listen to key up
	        	myGameArea.keys[e.keyCode] = false;
				if(e.keyCode.valueOf()==32){						//if space bar is let up then
					playerCooldown = playerCooldown -20;			//decrease the shoot cooldown
				}
				sprites.src ='images/sprites.png';
				srcX = 184;
				srcY = 55;
	        })
	    },
		clear: function() {			//clear the canvas
			this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
		},
		endGame : function(){		//call when game is over. Go to endgame page
			//call new html page or put text over canvas?
			//localStorage.setItem("enemiesKilled");
			localStorage.setItem("enemiesKilled", enemiesKilled);
			window.location = "EndGame.html";
		},
		loseGame : function(){		//call when game is over. Go to endgame page
			//call new html page or put text over canvas?
			//localStorage.setItem("enemiesKilled");
			window.location = "LoseGame.html";
		}
	}

	function component(width, height, color, x, y){			//create the player
	    this.width = width;
	    this.height = height;
	    this.x = x;
	    this.y = y;
	    this.speedX = 0;
		this.name = "player";
	    this.speedY = 0;
		this.ammmo = 1;
	    this.update = function(){		//redraw the player after it is cleared from canvas
			ctx = myGameArea.context;
			ctx.drawImage(sprites,srcX,srcY,this.width,this.height,this.x,this.y,this.width,this.height);
			//ctx.fillStyle = color;
			//ctx.fillRect(this.x, this.y, this.width, this.height);
			playerCooldown--;			//decrease cooldown on every update
	    }
	    this.newPos = function() {		//gets the new position of the player
	        this.x += this.speedX;
	        this.y += this.speedY;
	        if(this.x<0){			//keeps the player on the screen
	        	this.x = 0;
	        }
	        if(this.x>canvas.width-this.width){
	        	this.x = canvas.width-this.width;
	        }
	    }
	    this.shoot = function(){		//shoot function for the player
	    	if(this.ammmo!=0 && playerCooldown<=0) {
				bullets.push(new myBullet(3, 8, "green", this.x, this.y, 7, 0, "player"));
				playerCooldown = 50;
				this.ammmo=1;
			}else{
				playerCooldown--;
			}
			if(playerCooldown<=0){
				this.ammmo=1;
			}
	    }
	    this.crashWith = function(otherobj){					//determines if the player hits an enemy
	    	var myleft = this.x;								//define parameters 
	        var myright = this.x + (this.width);
	        var mytop = this.y;
	        var mybottom = this.y + (this.height);
	        var otherleft = otherobj.x;
	        var otherright = otherobj.x + (otherobj.width);
	        var othertop = otherobj.y;
	        var otherbottom = otherobj.y + (otherobj.height);
	        var crash = true;									//say there was a crash
	        if ((mybottom < othertop) ||						//??
	               (mytop > otherbottom) ||
	               (myright < otherleft) ||
	               (myleft > otherright)) {
	           crash = false;
	        }
	        return crash;
	    }
	    this.clear = function(){								//decrease players lives
			lives--;
			document.getElementById("lives").innerHTML = lives + " Lives Left";
	    }
	}


	function enemy(width,height,color,x,y){				//create an enemy
		this.width = width;
	    this.height = height;
	    this.x = x;
	    this.y = y;
	    this.speedX=0;
	    this.speedY=3;
		this.name = "enemy";
		this.age = Math.floor(Math.random() * 128);		//??
		this.ammmo=3;									//give the enemy 3 shots
		this.cooldown = 10;

	    this.update = function(){						//redraw the enemy
	        ctx = myGameArea.context;
			ctx.drawImage(enemySprites,enemySrcX,enemySrcY,this.width,this.height,this.x,this.y,this.width,this.height);
	    }
	    this.newPos = function(i) {						//give the enemy a new position
	    	enemyMoving = true;							//if the code gets here then the enemy is moving
			if(this.y + this.speedY>=50 && this.ammmo>0) {		//if the bullet is moving?
				if(this.cooldown<=0){			//if the shoot has cooled down already, then enemy can shoot 
					this.shoot();
					this.ammmo--;
					this.cooldown = 10;			//make sure the enemy cools down
				}
				this.cooldown--;
			}
	    	this.y +=this.speedY;
			this.x +=this.speedX;
			this.speedX = 3 * Math.sin(this.age * Math.PI / 64);		//??
			this.age ++;												//??
			if(this.x<0){			//keep the enemies in bounds
				this.x = 0;
			}
			if(this.x>canvas.width-this.width){
				this.x = canvas.width-this.width;
			}
	    	if(this.y>canvas.height){			//if the enemy goes out of frame put it back in the start position
	    		this.y = canvas.height/3;
				this.x = originalXPosition[i];
	    		enemyMoving = false;			//declare that it is not moving so that a different enemy can move
				this.ammmo=3;					//restart the ammmo and cooldown
				this.cooldown = 10;
	    	}
	    }
		this.shoot = function(){		//let the enemy shoot. add a bullet to the array. give it a color size and location. Last give it a random path to follow
			if(this.ammmo==1) {
				bullets.push(new myBullet(3, 8, "orange", this.x, this.y, (Math.random() * (10 - 8)) + 8, ((Math.random() * (6 - 4))-5)*3, "enemy"));
			}
			if(this.ammmo==2){
				bullets.push(new myBullet(3, 8, "orange", this.x, this.y,(Math.random() * (10 - 8)) + 8 , ((Math.random() * (6 - 4))-5)*3*-1, "enemy"));
			}
			if(this.ammmo==3){
				bullets.push(new myBullet(3, 8, "orange", this.x, this.y, (Math.random() * (10 - 8)) + 8, (Math.random() * (6 - 4)), "enemy")) + 6;
			}
		};
	    enemys.push(this);		//add the enemy to the array
	}

	function myBullet(width,height,color,x,y,speedY,speedX,name){		//function for each bullet 
		this.width = width;												//set the parameters
		this.height = height;
		this.name = name;
		this.x = x;
	    this.y = y;
	    this.speedY = speedY;
		this.speedX = speedX;
	    this.update = function(){			//redraw the bullet
	        ctx = myGameArea.context;
			if(this.name=="player"){
				ctx.drawImage(bulletSprites,bulletSrcX,bulletSrcY,this.width,this.height,this.x,this.y,this.width,this.height);
			}else{
				bulletSrcX = 374;
				bulletSrcY = 51;
				ctx.drawImage(bulletSprites,bulletSrcX,bulletSrcY,this.width,this.height,this.x,this.y,this.width,this.height);
				bulletSrcX = 366;
				bulletSrcY = 195;
			}
	    }
	    this.newPos = function() {			//get the new position of the bullet
	    	if(name=="player") {			//if it is the players bullet it will go towards the top of the canvas
				this.y -= this.speedY;
				if (this.y < 0) {
					bullets.shift();		//if the bullet goes out of the canvas then delete it from the array
				}
			}else{							//enemy bullets have an x and y component
				this.y+=this.speedY;
				this.x+=this.speedX;
				if(this.y>canvas.height){
					bullets.shift();
				}
			}
	    }
	    this.crashWith = function(otherobj) {		//called if the bullet crashes with something
	    	if(otherobj.name!=this.name) {
				var myleft = this.x;
				var myright = this.x + (this.width);
				var mytop = this.y;
				var mybottom = this.y + (this.height);
				var otherleft = otherobj.x;
				var otherright = otherobj.x + (otherobj.width);
				var othertop = otherobj.y;
				var otherbottom = otherobj.y + (otherobj.height);
				var crash = true;
				if ((mybottom < othertop) ||			//??
					(mytop > otherbottom) ||
					(myright < otherleft) ||
					(myleft > otherright)) {
					crash = false;
				}
				return crash;
			}else{
				return false;
			}
	    }
	}
	
function update(){					//function to update all components of the game
	myGameArea.clear();				//clear the canvas
	if(lives == 0){					//if the player loses, end the game
		myGameArea.loseGame();
	}
	if(enemys.length==0 && lives!=0){
		if(level == 3)
			myGameArea.endGame();
		else{
			level++;
			startGame();
		}
	}
	myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {
    	myGamePiece.speedX = -4;
		srcX = 138;
    }
    if (myGameArea.keys && myGameArea.keys[39]) {
    	myGamePiece.speedX = 4;
		sprites.src = 'images/spritesTurned.png';
		srcX = 312;
		srcY = 40;
    }
    if (myGameArea.keys && myGameArea.keys[32]) {
    	myGamePiece.shoot();
    }
    if(bullets.length>0){
    	var i;
    	for(i=0;i<bullets.length;i++){
    		bullets[i].newPos();
    		bullets[i].update();
    	}
    }
    if(!enemyMoving){
    	enemyNumber = Math.floor(Math.random() * (enemys.length-1));
    }
	if(enemys.length>0){
		for(var k=0;k<enemys.length;k++){
			if(k == enemyNumber){
				enemys[k].newPos(k);
				//enemys[k].shoot();
			}
			enemys[k].update();
		}
	}
	for(var z=0;z<enemys.length;z++){
		for(var j=0;j<bullets.length;j++){
			if(bullets[j].crashWith(enemys[z])){
				if(z==enemyNumber){
					enemyMoving = false;
				}
				bullets.splice(j,1);
				enemys.splice(z,1);
				enemiesKilled++;
				originalXPosition.splice(z,1);
				if(enemyNumber>z){
					enemyNumber--;
				}
				break;
			}
			if(bullets[j].crashWith(myGamePiece)){
				bullets.splice(j,1);
				myGamePiece.clear();
			}
		}
	}
    myGamePiece.newPos();
	myGamePiece.update();
    if(myGamePiece.crashWith(enemys[enemyNumber])){
    	enemys.splice(enemyNumber,1);
		enemiesKilled++;
    	myGamePiece.clear();
    }
	myGamePiece.update();
}