
import ui.View;
import ui.ImageView;
import ui.resource.Image as Image;

var ceiling_img = new Image({url: "resources/images/ui/bg1_header.png"});

exports = Class(ui.View, function (supr) {

	this.init = function (opts) {
		opts = merge(opts, {
			width:	ceiling_img.getWidth(),
			height:	ceiling_img.getHeight()
		});

		supr(this, 'init', [opts]);

		this.build();
	};


	this.build = function () {
		var ceil = new ui.ImageView({
			superview: this,
			image: ceiling_img,
			x: 0,
			y: 0,
			width: ceiling_img.getWidth(),
			height: ceiling_img.getHeight()
		});
	};
});
