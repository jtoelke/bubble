
import math.geom.Circle as Circle;
import math.geom.intersect as intersect;
import math.geom.Line as Line;
import math.geom.Point as Point;
import ui.View;
import ui.ImageView;
import ui.TextView;
import ui.resource.Image as Image;

import src.Bubble as Bubble;

var game_on = false,
	game_length = 5000,
	countdown_secs = game_length / 1000,
	lang = 'en';

var ceiling_img = new Image({url: "resources/images/ui/bg1_header.png"}),
	cannon_base_img = new Image({url: "resources/images/ui/cannon_base.png"}),
	cannon_top_img = new Image({url: "resources/images/ui/cannon_top.png"});

var app_width = 576,
	app_height = 1024;

var row_length = 9,
	row_max_amount = 14;

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
			if (!this._current_bubble.is_flying()) {
				if (point.y < bottom) {
					this.shoot(point);
				}
			}
		});

		this.shoot = function (point) {
			waypoints = [];
			var bubble_x = this._current_bubble.style.x + bubble_size/2;
			var bubble_y = this._current_bubble.style.y + bubble_size/2;

			if (point.x - bubble_x != 0) {
				var slope = (point.y - bubble_y) / (point.x - bubble_x);
				var con = point.y - slope * point.x;
				var pos = this.find_destination(point, slope, con);
			} else {
				var pos = new Point({x: point.x, y: ceiling});
			}

			var hit_dest = this.check_bubble_hit(new Line(bubble_x, bubble_y, pos.x, pos.y));
			if (hit_dest != null) {
				waypoints.push(new Point({x: hit_dest.x, y: hit_dest.y}));
			} else {
				waypoints.push(pos);
				var bubble_x = pos.x;
				var bubble_y = pos.y;
				for (var i = 0; i < 5; i++) {
					if (pos.y > ceiling) {
						slope = -slope;
						con = pos.y - slope * pos.x;
						pos = this.find_destination(pos, slope, con);
						var hit_dest = this.check_bubble_hit(new Line(bubble_x, bubble_y, pos.x, pos.y));
						if (hit_dest != null) {
							waypoints.push(hit_dest);
							break;
						} else {
							waypoints.push(pos);
						}
					}
				}
			}

			this._current_bubble.set_flying();
			this._current_bubble.animateShot(waypoints);
		}

		this.find_destination = function (start_pos, slope, con) {
			var y_intersect_left = slope * left_wall + con;
			var y_intersect_right = slope * right_wall + con;
			var x_intersect_ceiling = (ceiling - con) / slope;

			if (x_intersect_ceiling > left_wall && x_intersect_ceiling < right_wall) {
				var dest_x = x_intersect_ceiling;
				var dest_y = ceiling;
			} else if (y_intersect_left > ceiling && y_intersect_left < bottom && y_intersect_left != start_pos.y) {
				var dest_x = left_wall;
				var dest_y = y_intersect_left;
			} else {
				var dest_x = right_wall;
				var dest_y = y_intersect_right;
			}
			return dest = new Point({x: dest_x, y: dest_y});
		}

		this.check_bubble_hit = function (line) {
			for (var b = this._bubbles.length - 1; b >= 0; b--) {
				if (this._bubbles[b] == null) {
					continue;
				}
				var bubble_pos = this.pos_by_index(b);
				var bubble_circle = new Circle(bubble_pos.x + bubble_size/2, bubble_pos.y + bubble_size/2, bubble_size/2);
				if (intersect.circleAndLine(bubble_circle, line)) {
					neigh = this.get_neighbors(b);
					var intersecting_neigh = [];
					for (var n = 0; n < 6; n++) {
						if (neigh[n] != -1 && this._bubbles[neigh[n]] == null) { // neighbor position exists and is empty
							bubble_circle = new Circle(this._bubbles[n].x + bubble_size/2, this._bubbles[n].y + bubble_size/2, bubble_size/2);
							if (intersect.circleAndLine(bubble_circle, line)) {
								intersecting_neigh.push(neigh[n]);
							}
						}
					}
					var closest_empty_neigh = intersecting_neigh[0];
					var closest_dist = 2 * app_height;
					for (var i = 0; i < intersecting_neigh.length; i++) {
						var empty_pos = this.pos_by_index(i);
						dist_x = line.start.x - empty_pos.x + bubble_size/2;
						dist_y = line.start.y - empty_pos.y + bubble_size/2;
						var dist = Math.sqrt(dist_x * dist_x + dist_y * dist_y);
						if (dist < closest_dist) {
							closest_dist = dist;
							closest_empty_neigh = intersecting_neigh[i];
						}
					}
					var neigh_pos = this.pos_by_index(closest_empty_neigh);
					return new Point({x: neigh_pos.x + bubble_size/2, y: neigh_pos.y + bubble_size/2});
				}
			}
			// did not hit any bubble, check if it hits ceiling
			if (line.end.y == ceiling) {
				var index = Math.floor((line.end.x - left_wall) / bubble_distance);
				var pos = this.pos_by_index(index);
				this._bubbles[pos] = this._current_bubble;
				return new Point({x: pos.x + bubble_size/2, y: pos.y + bubble_size/2});
			} else {
				return null;
			}
		}

		this.pos_by_index = function (i) {
			var row = Math.floor(i / row_length);
			var col = i % row_length;
			var pos_x = x_offset + wall_width + (row % 2) * bubble_size/2 + col * bubble_distance;
			var pos_y = y_offset + row * bubble_distance;
			return new Point({x: pos_x, y: pos_y});
		}

		this.neighbor_lower_left = function (i) {
			if (i % (2 * row_length) == 0) {
				return -1;
			} else {
				if (i % (2 * row_length) < row_length) { // uneven row
					return i + row_length - 1;
				} else {
					return i + row_length;
				}
			}
		}
		this.neighbor_lower_right = function (i) {
			if (i % (2 * row_length) == (2 * row_length) - 1) {
				return -1;
			} else {
				if (i % (2 * row_length) < row_length) { // uneven row
					return i + row_length;
				} else {
					return i + row_length + 1;
				}
			}
		}
		this.neighbor_left = function (i) {
			if (i % row_length == 0) {
				return -1;
			} else {
				return i - 1;
			}
		}
		this.neighbor_right = function (i) {
			if (i % row_length == row_length - 1) {
				return -1;
			} else {
				return i + 1;
			}
		}
		this.neighbor_upper_left = function (i) {
			if (i < row_length || i % (2 * row_length) == 0) {
				return -1;
			} else {
				if (i % (2 * row_length) < row_length) { // uneven row
					return i - row_length - 1;
				} else {
					return i - row_length;
				}
			}
		}
		this.neighbor_upper_right = function (i) {
			if (i < row_length || i % (2 * row_length) == (2 * row_length) - 1) {
				return -1;
			} else {
				if (i % (2 * row_length) < row_length) { // uneven row
					return i - row_length;
				} else {
					return i - row_length + 1;
				}
			}
		}

		this.get_neighbors = function (i) {
			return [this.neighbor_upper_left(i), this.neighbor_upper_right(i),
					this.neighbor_right(i), this.neighbor_lower_right(i),
					this.neighbor_lower_left(i), this.neighbor_left(i),
					];
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

		this._bubbles = [];
		var start_row_amount = 5;

		for (var i = 0; i < start_row_amount * row_length; i++) {
			var pos = this.pos_by_index(i);
			var bubble = new Bubble(bubble_size);
			bubble.style.x = pos.x;
			bubble.style.y = pos.y;
			this.addSubview(bubble);
			this._bubbles.push(bubble);
		}
		for (var i = start_row_amount * row_length; i < row_max_amount * row_length; i++) {
			this._bubbles.push(null);
		}

		this._current_bubble = new Bubble(bubble_size);
		this._current_bubble.style.x = current_bubble_x;
		this._current_bubble.style.y = current_bubble_y;
		this.addSubview(this._current_bubble);

		this._next_bubble = new Bubble(bubble_size);
		this._next_bubble.style.x = next_bubble_x;
		this._next_bubble.style.y = next_bubble_y;
		this.addSubview(this._next_bubble);
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
