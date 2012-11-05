(function(JE) {
	function SpaceCommander(id) {
		this._el = jQuery(id);
		this._context = this._el[0].getContext('2d');
		this.width = 500;
		this.height = 500;
	
		this._totalHeight = 3000;
	
		this._ship = new Image();
		this._ship.src = '../img/ship.png';
		this.x = (this.width / 2);
		this.y = (this.height - SpaceCommander.SHIP_HEIGHT) - 30;
	
		this.movement = 0;
	
		// default position
		this.spriteX = 72;
	
		this._stars = [];
		this._bullets = [];
	
		this._createStars();
	
		jQuery(window).bind('keydown', this._handleKeyDown.bind(this))
					.bind('keyup', this._handleKeyUp.bind(this));
	
		this.loop();
	}

	SpaceCommander.prototype._handleKeyDown = function(jEvt) {

		switch ( jEvt.keyCode ) {
			case 32: // space bar
				this._createBullet();
			  	break;
	        case 37: // left
				this.spriteX = 32;
				this.x -= SpaceCommander.ACC;
	          	break;
	        case 39: // right
				this.spriteX = 112;
				this.x += SpaceCommander.ACC;
				break;
			case 38: // up
				this.y -= SpaceCommander.ACC;
	         	break;
	        case 40: // down
				this.y += SpaceCommander.ACC;
	          	break;
			case 80: // pause
				this._paused = !this._paused;
				if (!this.paused) {
					this.loop();
				}
				break;
	      }
		  return false;
	};

	SpaceCommander.prototype._handleKeyUp = function(jEvt) {
		this.spriteX = 72;
	};

	SpaceCommander.prototype._createStars = function() {
		var multiplyer = this._totalHeight;
		for (var i = 0, l = 500; i < l; i++) {
			if (i > 50) {
				multiplyer = -multiplyer;
			}
			this._stars.push({x: this.width * Math.random(), y: multiplyer * Math.random(), alpha: Math.random(), size: 1});
		}
	};

	SpaceCommander.prototype._renderStars = function() {
		var c = this._context;
		this._stars.forEach(function(star) {
			c.fillStyle = 'rgba(255,255,255,' + star.alpha + ')';
			c.beginPath();
			c.arc(star.x, star.y + this.movement, star.size, 0, Math.PI*2, true);
			c.closePath();
			c.fill();
		}.bind(this));
	};

	SpaceCommander.prototype._createBullet = function() {
		this._bullets.push({
			x: this.x + (SpaceCommander.SHIP_WIDTH / 2),
			y: this.y - 2
		});
	};

	SpaceCommander.prototype._updateBullets = function() {
		this._bullets.forEach(function(bullet, i) {
			bullet.y -= 4;
			if (bullet.y < 0) {
				this._bullets.splice(i, 1);
			}
			this._context.rect(bullet.x, bullet.y, 2, 2);
			this._context.fillStyle = '#ff5721';
			this._context.fill();
		}.bind(this));
	};

	SpaceCommander.prototype.loop = function() {
		this._context.clearRect(0, 0, this.height, this.height);
		
		this._context.rect(0, 0, this.height, this.height);
		this._context.fillStyle = '#000';
		this._context.fill();
		if (this.movement <= this._totalHeight) {
			this.movement += SpaceCommander.SCREEN_ACC;
		}
		this._renderStars();
	
		this._updateBullets();
	
		this.x = Math.max(Math.min(this.x, this.width - SpaceCommander.SHIP_WIDTH), 0);
		this.y = Math.max(Math.min(this.y, this.height - SpaceCommander.SHIP_HEIGHT), 0);
	
		this._context.drawImage(this._ship, this.spriteX, 0, SpaceCommander.SHIP_WIDTH, SpaceCommander.SHIP_HEIGHT, this.x, this.y, SpaceCommander.SHIP_WIDTH, SpaceCommander.SHIP_HEIGHT);
		
		// var baddy = new Image();
		// 	baddy.src= '../img/enemies.png';
		// 	this._context.drawImage(baddy, 204, 182, 47, 20, 20, 20, 47, 20);
		// 	
		// 	this._context.drawImage(baddy, 152, 435, 18, 25, 100, 20, 18, 25);
		
		var baddy = new Image();
		baddy.src= '../img/boss.png';
		this._context.drawImage(baddy, 128, 629, 224, 163, 20, 20, 224, 163);
		
		if (!this._paused) {
			window.requestAnimFrame(this.loop.bind(this));	
		}
	};

	SpaceCommander.ACC = 12;

	SpaceCommander.SCREEN_ACC = 1.4;

	SpaceCommander.SHIP_WIDTH = 32;

	SpaceCommander.SHIP_HEIGHT = 27;

	// request animation frame polyfill
	window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       || 
	          window.webkitRequestAnimationFrame || 
	          window.mozRequestAnimationFrame    || 
	          window.oRequestAnimationFrame      || 
	          window.msRequestAnimationFrame     || 
	          function( callback ){
	            window.setTimeout(callback, 1000 / 60);
	          };
	})();
	
	JE.SpaceCommander = SpaceCommander;
}(window.JE));