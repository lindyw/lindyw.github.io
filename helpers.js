// Obtains the suitable animation method supported by browser.
var rAF = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

// Preloads an array of images.
function preloadImages(imgArr) {
	var newImgArr = [];
	var loadedImages = 0;
	var doneLoading = function() {}
	function imageLoaded() {
		loadedImages++;
		if (loadedImages == imgArr.length) {
			doneLoading(newImgArr);
		}
	}
	for (var i = 0; i < imgArr.length; i++) {
		if (!imgArr[i]) {
			imageLoaded();
		} else {
			newImgArr[i] = new Image();
			newImgArr[i].src = imgArr[i];
			newImgArr[i].onload = function() {
				imageLoaded();
			}
		}
	}
	return {
		done: function(f) {
			doneLoading = f || doneLoading;
		}
	}
}

// Input Helper
(function() {
	var pressedKeys = [];
	
	function setKey(e, stat) {
		var code = e.keyCode;
		var key;
		
		if (code == 32) {
			key = 'SPACE';
		} else if (code == 37) {
			key = 'LEFT';
			e.preventDefault();
		} else if (code == 38) {
			key = 'UP';
			e.preventDefault();
		} else if (code == 39) {
			key = 'RIGHT';
			e.preventDefault();
		} else if (code == 40) {
			key = 'DOWN';
			e.preventDefault();
		} else if (code == 90) {
			key = 'Z';
		} else if (code == 13) {
			key = 'ENTER';
			e.preventDefault();
		} else {
			key = String.fromCharCode(code);
		}
		
		pressedKeys[key] = stat;
	}
	
	document.addEventListener('keydown', function(e) {
		setKey(e, true);
	});
	document.addEventListener('keyup', function(e) {
		setKey(e, false);
		holdKey = false;
	});
	window.addEventListener('blur', function(e) {
		pressedKeys = [];
	});
	
	window.input = {
		isPress: function(key) {
			return pressedKeys[key.toUpperCase()];
		}
	};
})();

// Checks if the given object is an Array.
function isArray(val) {
	return (Object.prototype.toString.call(val) == '[object Array]');
}

// Generates a position that is not occupied by anything.
function givePos(size) {
	var pos = [];
	while (true) {
		var valid = true;
		pos[0] = Math.floor(Math.random() * 1000 - size[0]);
		pos[1] = Math.floor(Math.random() * 700 - size[1]);
		if (pos[0] < 0) {
			pos[0] = 0;
		}
		if (pos[1] < 0) {
			pos[1] = 0;
		}
		for (var j = 0; j < allEntities.length; j++) {
			if (allEntities[j].isWithinRange(pos[0], pos[1], pos[0] + size[0] + 80, pos[1] + size[1] + 80)) {
				valid = false;
				break;
			}
			if (allEntities[j].id == 0) {
				if (allEntities[j].isWithinRange(pos[0], pos[1], pos[0] + size[0] + 150, pos[1] + size[1] + 150)) {
					valid = false;
					break;
				}
			}
		}
		for (var j = 0; j < allBlockEntities.length; j++) {
			if (allBlockEntities[j].isWithinRange(pos[0], pos[1], pos[0] + size[0] + 80, pos[1] + size[1] + 80)) {
				valid = false;
				break;
			}
		}
		if (valid) {
			break;
		}
	}
	return pos;
}

// Mute / Unmute
function mute() {
	var muteLnk = document.getElementById('mute');
	sound.mute();
	if (muteLnk.innerHTML == 'Mute') {
		muteLnk.innerHTML = 'Unmute';
	} else {
		muteLnk.innerHTML = 'Mute';
	}
}
