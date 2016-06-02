
import animate;
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

exports = Class(ui.View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			width: 576,
			height: 1024,
		});

		supr(this, 'init', [opts]);

		this.build();
	};

	this.build = function () {
		this.on('app:start', start_game_flow.bind(this));

		this.on('InputSelect', function (event, point) {
			console.log("View clicked at position: " + point.x + "," + point.y);
			var animator = animate(this._current_bubble);
			animate(this._current_bubble).now({x: point.x, y: point.y}, 500);
		});

		var cannon_base_x =  576/2 - cannon_base_img.getWidth()/2;
		var cannon_base_y = 1024 - cannon_base_img.getHeight();
		var cannon_top_x =  576/2 - cannon_top_img.getWidth()/2;
		var cannon_top_y = 1024 - cannon_base_img.getHeight() - cannon_top_img.getHeight() + 40;

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

		var pad = 2;
		var row_length = 9;
		var row_amount = 5;
		var wall_width = 64;
		var x_offset = -16;
		var board_length = ceiling_img.getWidth() - 2*wall_width;
		var bubble_size = board_length/(row_length - pad);
		var bubble_distance = board_length / row_length;
		var x_offset_even = wall_width + bubble_size/2;
		var y_offset = ceiling_img.getHeight() - bubble_size/2;

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
		}

		this._current_bubble = new ui.ImageView({
								superview: this,
								image: bubble_img,
								x: cannon_top_x + cannon_top_img.getWidth()/2 - bubble_size/2,
								y: cannon_top_y + 2*cannon_top_img.getHeight()/3 - bubble_size/2,
								width: bubble_size,
								height: bubble_size
							});

		this._next_bubble = new ui.ImageView({
								superview: this,
								image: bubble_img,
								x: cannon_base_x + cannon_base_img.getWidth()/2 - bubble_size/2,
								y: cannon_base_y + 0.6*cannon_base_img.getHeight() - bubble_size/2,
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
