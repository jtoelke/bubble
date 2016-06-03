
import animate;
import math.geom.Point as Point;
import ui.View;
import ui.ImageView;
import ui.TextView;
import ui.resource.Image as Image;

var game_on = false,
	game_length = 5000,
	countdown_secs = game_length / 1000,
	lang = 'en';

var ceiling_img = new Image({url: "resources/images/ui/bg1_header.png"}),
	cannon_base_img = new Image({url: "resources/images/ui/cannon_base.png"}),
	cannon_top_img = new Image({url: "resources/images/ui/cannon_top.png"}),
	bubble_img = new Image({url: "resources/images/bubbles/ball_blue.png"});

var app_width = 576,
	app_height = 1024;

var row_length = 9,
	row_amount = 5;

var wall_width = 64,
	left_wall = wall_width,
	right_wall = app_width - wall_width,
	ceiling = ceiling_img.getHeight(),
	bottom = app_height - cannon_base_img.getHeight() - cannon_top_img.getHeight() + 40;

var x_offset = -16,
	board_length = ceiling_img.getWidth() - 2*wall_width,
	bubble_size = board_length/(row_length - 2), // use -2 to have bubbles slightly overlapping
	bubble_distance = board_length / row_length,
	x_offset_even = wall_width + bubble_size/2,
	y_offset = ceiling_img.getHeight() - bubble_size/2;

var cannon_base_x =  app_width/2 - cannon_base_img.getWidth()/2,
	cannon_base_y = app_height - cannon_base_img.getHeight(),
	cannon_top_x =  app_width/2 - cannon_top_img.getWidth()/2,
	cannon_top_y = bottom;

var current_bubble_x = cannon_top_x + cannon_top_img.getWidth()/2 - bubble_size/2,
	current_bubble_y = cannon_top_y + 2*cannon_top_img.getHeight()/3 - bubble_size/2,
	next_bubble_x = cannon_base_x + cannon_base_img.getWidth()/2 - bubble_size/2,
	next_bubble_y = cannon_base_y + 0.6*cannon_base_img.getHeight() - bubble_size/2;

exports = Class(ui.View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			width: app_width,
			height: app_height,
		});

		supr(this, 'init', [opts]);

		this.build();
	};

	this.build = function () {
		this.on('app:start', start_game_flow.bind(this));

		this.on('InputSelect', function (event, point) {
			console.log("View clicked at position: " + point.x + "," + point.y);
			if (point.y < bottom) {
				this.shoot(point);
			}
		});

		this.shoot = function (point) {
			var bubble_y = this._current_bubble.style.y + bubble_size/2;
			var bubble_x = this._current_bubble.style.x + bubble_size/2;
			var slope = (point.y - bubble_y) / (point.x - bubble_x);
			var con = point.y - slope * point.x;

			var dest = this.find_destination(point, slope, con);

			console.log("Destination calculated as : " + dest.x + "," + dest.y);
			var animator = animate(this._current_bubble);
			animate(this._current_bubble).now({x: dest.x - bubble_size/2, y: dest.y - bubble_size/2}, 500);
			animate(this._current_bubble).then({x: current_bubble_x, y: current_bubble_y}, 500);
		}

		this.find_destination = function (start_pos, slope, con) {
			var dest_x = start_pos.x;
			var dest_y = start_pos.y;
			if (start_pos.x < app_width/2) {		// tapped in the left half of the screen
				console.log("Left wall.");
				dest_y = slope * left_wall + con;
				if (dest_y > ceiling) {
					dest_x = left_wall;
				}
			} else if (start_pos.x > app_width/2) {	// tapped in the right half of the screen
				console.log("Right wall.");
				dest_y = slope * right_wall + con;
				if (dest_y > ceiling) {
					dest_x = right_wall;
				}
			}
			if (dest_x == start_pos.x) {			// hitting ceiling
				console.log("Ceiling.");
				dest_y = ceiling;
				dest_x = (ceiling - con) / slope;
			}
			return dest = new Point({x: dest_x, y: dest_y});
		}

		this._ceiling = new ui.ImageView({
			superview: this,
			image: ceiling_img,
			x: 0,
			y: 0,
			width: ceiling_img.getWidth(),
			height: ceiling_img.getHeight()
		});
		this._cannon_base = new ui.ImageView({
			superview: this,
			image: cannon_base_img,
			x: cannon_base_x,
			y: cannon_base_y,
			width: cannon_base_img.getWidth(),
			height: cannon_base_img.getHeight()
		});
		this._cannon_top = new ui.ImageView({
			superview: this,
			image: cannon_top_img,
			x: cannon_top_x,
			y: cannon_top_y,
			width: cannon_top_img.getWidth(),
			height: cannon_top_img.getHeight()
		});
/*
		this._bubbles = [];

		for (var row = 0; row < row_amount; row++) {
			for (var col = 0; col < row_length; col++) {
				var bubble = new ui.ImageView({
								superview: this,
								image: bubble_img,
								x: x_offset + wall_width + (row % 2) * bubble_size/2 + col * bubble_distance,
								y: y_offset + row * bubble_distance,
								width: bubble_size,
								height: bubble_size
							});
				this.addSubview(bubble);
				this._bubbles.push(bubble);
			}
		}*/

		this._current_bubble = new ui.ImageView({
								superview: this,
								image: bubble_img,
								x: current_bubble_x,
								y: current_bubble_y,
								width: bubble_size,
								height: bubble_size
							});

		this._next_bubble = new ui.ImageView({
								superview: this,
								image: bubble_img,
								x: next_bubble_x,
								y: next_bubble_y,
								width: bubble_size,
								height: bubble_size
							});
	};
});

function start_game_flow () {
	var that = this;
	game_on = true;
	play_game.call(that);
}

function play_game () {
	var i = setInterval(update_countdown.bind(this), 1000);

	setTimeout(bind(this, function () {
		game_on = false;
		clearInterval(i);
		setTimeout(end_game_flow.bind(this), 1000);
	}), game_length);
}

function update_countdown () {
	countdown_secs -= 1;
}

function end_game_flow () {
	setTimeout(emit_endgame_event.bind(this), 1000);
}

function emit_endgame_event () {
	this.once('InputSelect', function () {
		this.emit('gamescreen:end');
		reset_game.call(this);
	});
}

function reset_game () {
	countdown_secs = game_length / 1000;
}
