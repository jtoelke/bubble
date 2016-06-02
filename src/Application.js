import device;
import ui.ImageView;
import ui.StackView as StackView;
import src.TitleScreen as TitleScreen;
import src.GameScreen as GameScreen;

var app_width = 576,
	app_height = 1024;

exports = Class(GC.Application, function () {

	this.initUI = function () {
		var titlescreen = new TitleScreen(),
				gamescreen = new GameScreen();

		var background = new ui.ImageView({
			superview: this.view,
			x: 0,
			y: 0,
			width: this.view.style.width,
			height: this.view.style.height,
			image: "resources/images/ui/bg1_center.png"
		});

		var rootView = new StackView({
			superview: this,
			x: 0,
			y: 0,
			width: app_width,
			height: app_height,
			clip: true,
			scale: device.width / app_width
		});

		rootView.push(titlescreen);

		titlescreen.on('titlescreen:start', function () {
			rootView.push(gamescreen);
			gamescreen.emit('app:start');
		});

		gamescreen.on('gamescreen:end', function () {
			rootView.pop();
		});
	};

	this.launchUI = function () {};
});
