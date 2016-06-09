import animate;
import ui.View;
import ui.ImageView;
import ui.resource.Image as Image;

var bubble_blue_img = new Image({url: "resources/images/bubbles/ball_blue.png"}),
	bubble_green_img = new Image({url: "resources/images/bubbles/ball_green.png"}),
	bubble_purple_img = new Image({url: "resources/images/bubbles/ball_purple.png"}),
	bubble_red_img = new Image({url: "resources/images/bubbles/ball_red.png"}),
	bubble_yellow_img = new Image({url: "resources/images/bubbles/ball_yellow.png"});

var colors = ["blue", "green", "purple", "red", "yellow"]

var flying = false;

exports = Class(ui.View, function (supr) {

	this.init = function (opts) {
		supr(this, 'init', [{
			width:	opts[0],
			height:	opts[0]
		}]);
		this.size = opts[0];
		this.color = opts[1];
		this.image = this.get_image(this.color);
		this.build();
	};

	this.get_image = function (color) {
		switch (color) {
			case "blue":
				return bubble_blue_img;
			case "green":
				return bubble_green_img;
			case "purple":
				return bubble_purple_img;
			case "red":
				return bubble_red_img;
			case "yellow":
				return bubble_yellow_img;
			default:
				console.log("Error in Bubble creation: Color " + color + " does not exist.")
				return bubble_blue_img;
		}
	};

	this.is_flying = function () {
		return flying;
	};

	this.set_flying = function () {
		flying = true;
	};


	this.animate_shot = function (waypoints) {
		for (var i = 0; i < waypoints.length; i++) {
			var x = waypoints[i].x - this.size/2 - this.style.x;
			var y = waypoints[i].y - this.size/2 - this.style.y;
			this._animator.then({x, y}, 250, animate.linear);
		}
		this._animator.then(function(){flying = false;});
	};

	this.animate_load = function (x, y) {
		this._animator.now({x, y}, 200, animate.linear);
	};

	this.build = function () {
		this._bubble = new ui.ImageView({
			superview: this,
			image: this.image,
			x: 0,
			y: 0,
			width: this.size,
			height: this.size
		});

		this._animator = animate(this._bubble);
	};
});
