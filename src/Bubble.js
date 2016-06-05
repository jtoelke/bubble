import animate;
import ui.View;
import ui.ImageView;
import ui.resource.Image as Image;

var bubble_blue_img = new Image({url: "resources/images/bubbles/ball_blue.png"}),
	bubble_green_img = new Image({url: "resources/images/bubbles/ball_green.png"}),
	bubble_purple_img = new Image({url: "resources/images/bubbles/ball_purple.png"}),
	bubble_red_img = new Image({url: "resources/images/bubbles/ball_red.png"}),
	bubble_yellow_img = new Image({url: "resources/images/bubbles/ball_yellow.png"});

var flying = false;;

exports = Class(ui.View, function (supr) {

	this.init = function (opts) {
		supr(this, 'init', [{
			width:	opts,
			height:	opts
		}]);
		this.size = opts;
		this.build();
	};

	this.is_flying = function () {
		return flying;
	}

	this.set_flying = function () {
		flying = true;
	}

	this.animateShot = function (waypoints) {
		for (var i = 0; i < waypoints.length; i++) {
			var x = waypoints[i].x - this.size/2 - this.style.x;
			var y = waypoints[i].y - this.size/2 - this.style.y;
			this._animator.then({x, y}, 500);
		}
		this._animator.then(function(){flying = false;});
	};

	this.animateLoad = function (x, y) {
		this._animator.now({x, y}, 200);
	};

	this.build = function () {
		this._bubble = new ui.ImageView({
			superview: this,
			image: bubble_blue_img,
			x: 0,
			y: 0,
			width: this.size,
			height: this.size
		});

		this._animator = animate(this._bubble);
	};
});
