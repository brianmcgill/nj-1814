(function($){
	$(document).ready(function() {
	
		$('#capitolLabels').hide();
		
var ready = false,
	userDrag = false,
	spinner, // CanvasLoader
	monitorStartTime = 0,
	monitorInt = 10,
	ticker = 0,
	speedMultiplier = 14,
	totalFrames = 33,
	pointerStartPosX = 0,
	pointerEndPosX = 0,
	pointerDistance = 0,
	currentFrame = 0,
	frames = [],
	endFrame = 0,
	loadedImages = 0;
		
		//canvasloader
		function addSpinner () {
			spinner = new CanvasLoader("spinner");
			spinner.setShape("spiral");
			spinner.setDiameter(70);
			spinner.setDensity(70);
			spinner.setRange(1);
			spinner.setSpeed(4);
			spinner.setColor("#ed1c24");
			spinner.show();
			$("#spinner").fadeIn("slow");
		};
		
		function loadImage() {
			var createDiv = document.createElement("div");
			var imageName = "images/cap-" + (loadedImages + 1) + ".jpg";
			
			var imageAll = $('<img>').attr('src', imageName).addClass("otherImg").appendTo(createDiv);
			frames.push(imageAll);
			$("#capitolmain").append(createDiv);

			$(imageAll).load(function() {
				imageLoaded();
			});
		};
		
		function imageLoaded() {
			loadedImages++;
			$("#spinner span").text(Math.floor(loadedImages / totalFrames * 100) + "%");
			if (loadedImages == totalFrames) {
				frames[0].removeClass("otherImg").addClass("currentImg");
				
				$("#spinner").fadeOut("slow", function(){
					spinner.hide();
	 				spinwooo(); 
					$('#capitolLabels').show();
				});
			} else { loadImage(); }
		};
		
		function spinwooo () {
			ready = true;
			
			if (currentFrame == -66) { 
				endFrame = -33; 
			} else  { 
			 	endFrame = -66; 
			}
		}; 
		

		addSpinner();

		loadImage(); // load 1st jpg
		
		function render () {
			if(currentFrame !== endFrame) {	
				var frameEasing = endFrame < currentFrame ? Math.floor((endFrame - currentFrame) * 0.1) : Math.ceil((endFrame - currentFrame) * 0.1);
				hidePreviousFrame();
				currentFrame += frameEasing;
				showCurrentFrame();
			} else {
				window.clearInterval(ticker);
				ticker = 0;
			}
		};
		
		function refresh () {
			if (ticker === 0) {
				ticker = self.setInterval(render, Math.round(1000 / 60));
			}
		};
		
		function hidePreviousFrame() {
			frames[getNormalizedCurrentFrame()].removeClass("currentImg").addClass("otherImg");
		};
		
		function showCurrentFrame() {
			frames[getNormalizedCurrentFrame()].removeClass("otherImg").addClass("currentImg");
		};
		
		function getNormalizedCurrentFrame() {
			var c = -Math.ceil(currentFrame % totalFrames);
			if (c < 0) c += (totalFrames - 1);
			return c;
		};
		
		function getPointerEvent(event) {
			return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event;
		};
		
		$("#wrapper").mousedown(function (event) {
			event.preventDefault();
			pointerStartPosX = getPointerEvent(event).pageX;
			userDrag = true;
			
			$('#capitolLabels').fadeOut();
		});
		
		$(document).mouseup(function (event){
			event.preventDefault();
			userDrag = false;
		});
		
		$(document).mousemove(function (event){
			event.preventDefault();
			trackPointer(event);
		});
		
		$("#wrapper").live("touchstart", function (event) {
			event.preventDefault();
			pointerStartPosX = getPointerEvent(event).pageX;
			userDrag = true;
		});
		
		$("#wrapper").live("touchmove", function (event) {
			event.preventDefault();
			trackPointer(event);
		});
		
		$("#wrapper").live("touchend", function (event) {
			event.preventDefault();
			userDrag = false;
		});
		
		function trackPointer(event) {
			if (ready && userDrag) {
				pointerEndPosX = getPointerEvent(event).pageX;
				if(monitorStartTime < new Date().getTime() - monitorInt) {
					pointerDistance = pointerEndPosX - pointerStartPosX;
					endFrame = currentFrame + Math.ceil((totalFrames - 1) * speedMultiplier * (pointerDistance / $("#wrapper").width()));
					refresh();
					monitorStartTime = new Date().getTime();
					pointerStartPosX = getPointerEvent(event).pageX;
				}
			}
		};
		
		//bind mousedown to spin
		$('#capitolLabels').bind('mousedown', function (event) {
			event.preventDefault();
			pointerStartPosX = getPointerEvent(event).pageX;
			userDrag = true;
			$('#capitolLabels').fadeOut();
		});
		
		
	});
})(jQuery);
