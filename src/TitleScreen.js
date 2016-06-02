
import ui.View;
import ui.ImageView;
import ui.TextView;
import ui.resource.Image as Image;

var ceiling_img = new Image({url: "resources/images/ui/bg1_header.png"});
var app_width = 576,
	app_height = 1024;

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
		var ceiling = new ui.ImageView({
			superview: this,
			image: ceiling_img,
			x: 0,
			y: 0,
			width: ceiling_img.getWidth(),
			height: ceiling_img.getHeight()
		});
		var startbutton = new ui.TextView({
			superview: this,
			text: 'START',
			color: 'black',
			x: app_width/2 - app_width/4,
			y: app_height/2 - app_height/8,
			width: app_width/2,
			height: 100
		});

		startbutton.on('InputSelect', bind(this, function () {
			this.emit('titlescreen:start');
		}));
	};
});
