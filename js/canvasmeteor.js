(function(){
	var Meteor = {
		collection: [],
		stars: [],
		option: {
			id: "",
			bgColor: "#424242",
			lightColor: "#a4a4a4",
			deg: 30,
			meteor: 5,
			star: 40,
		},
		init: function(option){
			var self = this;
			this.extend(option);
			this.canvas = document.getElementById(option.id);

			this.width = document.body.offsetWidth;
			this.height = document.body.offsetHeight;

			this.canvas.setAttribute("width", this.width);
			this.canvas.setAttribute("height", this.height);

			window.addEventListener("resize", function(){
				self.resize(self);
			});

			if(this.canvas.getContext){
				this.ctx = this.canvas.getContext("2d");
			}

			//this.bgColor = "#424242";
			//this.lightColor = "a4a4a4";

			//this.deg = 30;

			this.initMeteor(this.option.meteor);
			this.initStar(this.option.star);

			this.loop();
		},
		extend: function(setOptions){
			for(var key in setOptions){
				this.option[key] = setOptions[key];
			}
			return this.option;
		},
		resize: function(self){
			self.width = document.body.offsetWidth;
			self.height = document.body.offsetHeight;

			self.canvas.setAttribute("width", self.width);
			self.canvas.setAttribute("height", self.height);
		},
		drawLine: function(meteor){
			var startx = meteor.x;
			var starty = meteor.y;
			var len = meteor.len;

			var stopx = Math.cos(2*Math.PI/360*this.option.deg) * len + startx;
			var stopy = Math.sin(2*Math.PI/360*this.option.deg) * len + starty;

			var gradient = this.ctx.createLinearGradient(startx, starty, stopx, stopy);
			gradient.addColorStop(0, this.option.bgColor);
			gradient.addColorStop(1, this.option.lightColor);

			this.ctx.beginPath();
			this.ctx.moveTo(startx, starty);
			this.ctx.lineTo(stopx, stopy);
			this.ctx.lineWidth = meteor.width;
			this.ctx.shadowBlur = 0;
			this.ctx.strokeStyle = gradient;
			this.ctx.stroke();
		},
		drawCircle: function(star){
			this.ctx.beginPath();
			this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI*2, true);

			this.ctx.shadowOffsetX = 0;
			this.ctx.shadowOffsetY = 0;

			if(Math.random() > 0.9){
				this.ctx.shadowBlur = star.radius * 3;
			}else{
				this.ctx.shadowBlur = 0;
			}

			this.ctx.shadowColor = this.option.lightColor;

			this.ctx.fillStyle = this.option.lightColor; 
			this.ctx.fill();
		},
		loop: function(){
			var self = this;
			var doloop = function(){
				self.clearSceen();
				for(var i in self.stars){
					self.drawCircle(self.stars[i]);
				}
				for(var i in self.collection){
					var item = self.collection[i];
					self.drawLine(item);
					self.collection[i] = self.renewMeteor(item);
				}
				setTimeout(doloop, 40);
			};
			doloop();
		},
		initMeteor: function(number){
			for (var i = 0; i < number; i++) {
				this.newMeteor();
			};
		},
		newMeteor: function(){
			var self = this;
			var meteor = {
				x: -Math.random() * self.width,
				y: -Math.random() * self.height,
				width: Math.random() * 1 + 0.2,
				len: Math.random() * 200 + 200,
				speed: Math.random() * 50 + 50,
			};
			this.collection.push(meteor);
		},
		renewMeteor: function(meteor){
			if(meteor.x > this.canvas.offsetWidth || meteor.y > this.canvas.offsetHeight){
				meteor.x = -Math.random() * this.width;
				meteor.y = -Math.random() * this.height;
			}else{
				meteor.x = Math.cos(2*Math.PI/360*this.option.deg) * meteor.speed + meteor.x;
				meteor.y = Math.sin(2*Math.PI/360*this.option.deg) * meteor.speed + meteor.y;
			}

			return meteor;
		},
		initStar: function(number){
			var self = this;
			for (var i = 0; i < number; i++) {
				var star = {
					x: Math.random() * self.width,
					y: Math.random() * self.height,
					radius: Math.random(),
				};
				this.stars.push(star);
			};
		},
		clearSceen: function(){
			var cheight = this.canvas.offsetHeight;
			var cwidth = this.canvas.offsetWidth;
			this.ctx.fillStyle = this.option.bgColor;
			this.ctx.fillRect(0, 0, this.width, this.height);
		},
	};

	Meteor.init({id: "meteor"});
	
})();