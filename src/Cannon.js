

import ui.View;
import ui.ImageView;
import ui.resource.Image as Image;

var cannon_base_img = new Image({url: "resources/images/ui/cannon_base.png"}),
	cannon_top_img = new Image({url: "resources/images/ui/cannon_top.png"});

exports = Class(ui.View, function (supr) {

	this.init = function (opts) {
		opts = merge(opts, {
			width:	cannon_base_img.getWidth(),
			height:	cannon_base_img.getHeight() + cannon_top_img.getHeight()
		});

		supr(this, 'init', [opts]);

		this.build();
	};


	this.build = function () {
		var cannon_base = new ui.ImageView({
			superview: this,
			image: cannon_base_img,
			x: 576/2 - cannon_base_img.getWidth()/2,
			y: 1024 - cannon_base_img.getHeight(),
			width: cannon_base_img.getWidth(),
			height: cannon_base_img.getHeight()
		});
		var cannon_top = new ui.ImageView({
			superview: this,
			image: cannon_top_img,
			x: 576/2 - cannon_top_img.getWidth()/2,
			y: 1024 - cannon_base_img.getHeight() - cannon_top_img.getHeight() + 40,
			width: cannon_top_img.getWidth(),
			height: cannon_top_img.getHeight()
		});
	};
});
