
import ui.View;
import ui.ImageView;
import ui.TextView;

import src.Ceiling as Ceiling;

exports = Class(ui.ImageView, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			image: "resources/images/ui/bg1_center.png"
		});

		supr(this, 'init', [opts]);

		this.build();
	};

	this.build = function() {
		var ceiling = new Ceiling();
		this.addSubview(ceiling);

		var startbutton = new ui.TextView({
			superview: this,
			text: 'START',
			color: 'black',
			x: 576/2 - 576/4,
			y: 1024/2 - 1024/8,
			width: 576/2,
			height: 100
		});

		startbutton.on('InputSelect', bind(this, function () {
			this.emit('titlescreen:start');
		}));
	};
});
