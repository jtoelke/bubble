import device;
import ui.ImageView;
import ui.StackView as StackView;
import src.TitleScreen as TitleScreen;
import src.GameScreen as GameScreen;

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
			width: 576,
			height: 1024,
			clip: true,
			scale: device.width / 576
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
