
import animate;
import ui.View;
import ui.ImageView;
import ui.TextView;
import src.Cannon as Cannon;
import src.Ceiling as Ceiling;

var game_on = false,
	game_length = 5000,
	countdown_secs = game_length / 1000,
	lang = 'en';

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

		var ceiling = new Ceiling();
		this.addSubview(ceiling);

		var cannon = new Cannon();
		this.addSubview(cannon);
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
