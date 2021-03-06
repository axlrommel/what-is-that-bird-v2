var CROP = (function () {

	return function () {

		// Code Dependant Variables
		this.eles = {
			ele: undefined,
			container: undefined,
			img: undefined,
			overlay: undefined,
			preview: undefined,

			original: undefined,
		};

		this.img = undefined;
		this.imgInfo = {
			aw: 0,
			ah: 0,
			w: 0,
			h: 0,
			at: 0,
			al: 0,
			t: 0,
			l: 0,
			s: 1 // scale
		};

		this.init = function(ele) {

			$(ele.container)
				.attr({
					'data-imgcrop': '',
					'data-mask': ele.mask
				})
				.append('<input type="range" value="'+ele.zoom.min+'" min="'+ele.zoom.min+'" max="'+ele.zoom.max+'" step="'+ele.zoom.steps+'"><div class="cropMain"></div>');

			// set min zoom
			this.imgInfo.s = ele.zoom.min;



			/*
				Elements
			*/
			var umm = ele,
				shell = $(ele.container),
				zoom = shell.find('input'),
				cropMain = shell.find('.cropMain'),
				cropPreview = ele.preview,
				img,
				container,
				overlay,
				that = this;


			/*
				Container
			*/
			container = $('<div />')
				.attr({
				class: 'crop-container'
			})
				.css({
				width: ele.width + 'px',
				height: ele.height + 'px'
			});

			/*
				Image
			*/
			img = $('<img />')
					.attr('class', 'crop-img')
					.css({
						zIndex: 5999,
						top: 0,
						left: 0
					});




			/*
				Crop Overlay
			*/
			overlay = $('<div />')
				.attr({
				class: 'crop-overlay',
				draggable: "true"
			})
				.css({
				zIndex: 6000
			});


			// Add Elements
			container.append(overlay);
			container.append(img);
			cropMain.append(container);

			this.eles.ele = cropMain;
			this.eles.container = container;
			this.eles.img = img;
			this.eles.overlay = overlay;
			this.eles.preview = cropPreview;

			// load image
			this.loadImg(ele.image);

			// bind events
			container.resize(function () {
				that.imgSize();
			});

			// overlay movements
			overlay.bind('mousedown touchstart', function (e) {

				// apply grab cursor
				$('body').addClass('grabcursor');

				var o = $(this),
					mousedown = {
						x: (e.originalEvent.pageX || e.originalEvent.touches[0].pageX),
						y: (e.originalEvent.pageY || e.originalEvent.touches[0].pageY)
					},
					elepos = {
						x: o.parent().offset().left,
						y: o.parent().offset().top
					};

				e.preventDefault();


				$(document).bind('mousemove touchmove', function (e) {


					var mousepos = {
						x: (e.originalEvent.pageX || e.originalEvent.changedTouches[0].pageX || mousedown.x),
						y: (e.originalEvent.pageY || e.originalEvent.changedTouches[0].pageY || mousedown.y)
					};


					if (mousedown.y !== mousepos.y) {

						if (parseInt(o.css('top')) === 0) o.css({
							top: that.eles.ele.offset().top,
							left: that.eles.ele.offset().left
						});

						// Move Image
						that.imgMove({
							t: parseInt(o.css('top')) - (elepos.y - (mousedown.y - mousepos.y)),
							l: parseInt(o.css('left')) - (elepos.x - (mousedown.x - mousepos.x))
						});

						// Reposition Overlay
						o.css({
							left: elepos.x - (mousedown.x - mousepos.x),
							top: elepos.y - (mousedown.y - mousepos.y)
						});

					}

				});

				$(document).bind('mouseup touchend', function (e) {

					// remove grab cursor
					$('body').removeClass('grabcursor');

					$(document).unbind('mousemove touchmove');
					overlay.css({
						top: 0,
						left: 0
					});
				});

				return false;
			});


			//  config slide
			// --------------------------------------------------------------------------

			$('input[type=range]').on("input change", function () {

				that.slider(zoom.val());
				rangeColor(zoom);

			});

			that.zoom = function(num) {

				if(num === 'min' || num === 'max')
					var num = parseInt(zoom.attr(num));

				that.slider(num);
				zoom.val(num);
				rangeColor(zoom);

			};


			// zoom slider progress color
			function rangeColor(self) {

				var val = self.val(),
					min = self.attr('min'),
					max = self.attr('max'),
					pos = Math.round(((val - min) / (max - min)) * 100),
					style = "background: linear-gradient(to right, #fbc93d " + pos + "%, #eee " + (pos + 0.1) + "%);";

				// apply background color to range progress
				self.attr('style', style);

			}

		};



		this.loadImg = function (url) {

			var that = this,
				original = new Image(),
				canvas = document.createElement('canvas');

			original.src = url;
			original.onload = function() {

				canvas.width = original.naturalWidth;
				canvas.height = original.naturalHeight;

				canvas.getContext('2d').drawImage(original, 0, 0);

				that.originalImage = {
					width: original.naturalWidth,
					height: original.naturalHeight,
					type: canvas.toDataURL("image/jpeg").split(",")[0].split(":")[1].split(";")[0].split("/")[1],
					string: canvas.toDataURL("image/jpeg"),
				};

			};

			this.eles.img.removeAttr('style').attr('src', url).load(function () {
				that.imgSize();
			});

		};



		this.imgSize = function () {
			var img = this.eles.img,
				imgSize = {
					w: img.css('width', '').width(),
					h: img.css('height', '').height()
				},
				c = this.eles.container;

			var holderRatio = {
				wh: this.eles.container.width() / this.eles.container.height(),
				hw: this.eles.container.height() / this.eles.container.width()
			};

			this.imgInfo.aw = imgSize.w;
			this.imgInfo.ah = imgSize.h;

			if (imgSize.w * holderRatio.hw < imgSize.h * holderRatio.wh) {

				this.imgInfo.w = c.width();
				this.imgInfo.h = Math.round(this.imgInfo.w * (imgSize.h / imgSize.w));
				this.imgInfo.al = 0;

			} else {

				this.imgInfo.h = c.height();
				this.imgInfo.w = Math.round(this.imgInfo.h * (imgSize.w / imgSize.h));
				this.imgInfo.at = 0;
			}

			this.imgResize();
		};


		this.imgResize = function (scale) {

			var img = this.eles.img,
				imgInfo = this.imgInfo,
				oldScale = imgInfo.s;

			imgInfo.s = scale || imgInfo.s;

			img.css({
				width: imgInfo.w * imgInfo.s,
				height: imgInfo.h * imgInfo.s
			});

			// Move Image Based on Size Changes
			this.imgMove({
				t: -Math.round((imgInfo.h * oldScale) - (imgInfo.h * imgInfo.s)) / 2,
				l: -Math.round((imgInfo.w * oldScale) - (imgInfo.w * imgInfo.s)) / 2
			});
		};

		this.imgMove = function (move) {

			var img = this.eles.img,
				imgInfo = this.imgInfo,
				c = this.eles.container;

			imgInfo.t += move.t;
			imgInfo.l += move.l;

			var t = imgInfo.at - imgInfo.t,
				l = imgInfo.al - imgInfo.l;


			if (t >= 0) t = imgInfo.t = 0;

			else if (t < -((imgInfo.h * imgInfo.s) - c.height())) {
				t = -((imgInfo.h * imgInfo.s) - c.height());
				imgInfo.t = ((imgInfo.at === 0) ? (imgInfo.h * imgInfo.s) - c.height() : (imgInfo.h * imgInfo.s) - c.height());
			}

			if (l >= 0) l = imgInfo.l = 0;

			else if (l < -((imgInfo.w * imgInfo.s) - c.width())) {
				l = -((imgInfo.w * imgInfo.s) - c.width());
				imgInfo.l = ((imgInfo.al === 0) ? (imgInfo.w * imgInfo.s) - c.width() : (imgInfo.w * imgInfo.s) - c.width());
			}

			// Set Position
			img.css({
				top: t,
				left: l
			});


			if(this.eles.preview)
				this.preview(this.eles.preview.width, this.eles.preview.height, this.eles.preview.container);

		};



		//  slider change
		// --------------------------------------------------------------------------

		this.slider = function (slideval) {
			this.imgResize(slideval);
		};

		var sliderSetup = function(numItems) {
			var change_img_time = 4000,
			transition_speed = 400;

			var listItems = $("#slider").children('li'),
			dotItems = $('#dots').children('li'),
			listLen = numItems,
			current,
			changeTimeout;

			function moveTo(newIndex){
				
				var i = newIndex;

			    if (newIndex == 'prev') {
			        i = (current > 0) ? (current - 1) : (listLen - 1);
			    }

			    if (newIndex == 'next') {
			        i = (current < listLen - 1) ? (current + 1) : 0;
			    }

			    dotItems.removeClass('active')
			            .eq(i).addClass('active');

			    listItems.fadeOut(transition_speed)
			             .eq(i).fadeIn(transition_speed);

			    current = i;

			    //resets time interval if user clicks on slider dot; then begin automated slider
			    clearTimeout(changeTimeout);
			    changeTimeout = setTimeout(function() { moveTo('next'); }, change_img_time);
			}
			
			// Event handlers
			$("#dots li").click(function () {
			var i = $('#dots li').index(this);
			moveTo(i);
			});

			$("#prev").click(function () {
			moveTo('prev');
			});

			$("#next").click(function () {
			moveTo('next');
			});
			
			moveTo('next');
		};
		
		this.upload = function (width, height, type, link) {

			$.ajax({
				type: "POST",
				url: "JSONServlet2",
				data: this.cropAndUpload(width, height, type),
				error: function (jqXHR, exception) {
		            var msg = '';
		            if (jqXHR.status === 0) {
		                msg = 'Not connect.\n Verify Network.';
		            } else if (jqXHR.status == 404) {
		                msg = 'Requested page not found. [404]';
		            } else if (jqXHR.status == 500) {
		                msg = 'Internal Server Error [500].';
		            } else if (exception === 'parsererror') {
		                msg = 'Requested JSON parse failed.';
		            } else if (exception === 'timeout') {
		                msg = 'Time out error.';
		            } else if (exception === 'abort') {
		                msg = 'Ajax request aborted.';
		            } else {
		                msg = 'Uncaught Error, really!.\n' + jqXHR.responseText;
		            }
		            alert(msg);
		        },
		      	success: function(data) {
		      		
		      	// remove all child nodes from pict
		      		var mContainer1 = document.getElementsByClassName("pict")[0];
			      		while (mContainer1.firstChild) {
			      			mContainer1.removeChild(mContainer1.firstChild);
			      		}
		      		
			      	var numBirds = document.createElement("li");
			      	var txtA = document.createTextNode("total number of birds searched: " + data.numBirds);
			      	numBirds.appendChild(txtA);
		      		mContainer1.appendChild(numBirds);
			      	
		      		var numSpecies = document.createElement("li");
			      	var txtB = document.createTextNode("total number of species searched: " + data.numSpecies);
			      	numSpecies.appendChild(txtB);
		      		mContainer1.appendChild(numSpecies);
		      		
		      		// remove all child nodes from container
		      		var mContainer = document.getElementsByClassName("container")[0];
		      		while (mContainer.firstChild) {
		      			mContainer.removeChild(mContainer.firstChild);
		      		}
		      		
		      		//create slider and dots elements and add to container
		      		var mSlider = document.createElement("ul");
		      		mSlider.id = "slider";
		      		mContainer.appendChild(mSlider);
		      		
		      		var mDots = document.createElement("ul");
		      		mDots.id = "dots";
		      		mContainer.appendChild(mDots);
		      		
		      		var button1 = document.createElement("button");
		      		button1.id = "prev";
		      		var txt1 = document.createTextNode("Prev");
		      		button1.appendChild(txt1);
		      		mContainer.appendChild(button1);
		      		
		      		var button2 = document.createElement("button");
		      		button2.id = "next";
		      		var txt2 = document.createTextNode("Next");
		      		button2.appendChild(txt2);
		      		mContainer.appendChild(button2);
		      		
		      		// sort results high to low
		      		data.bResults.sort(sort_by('overallScore',true,parseFloat));
		      		for (var i = 0; i < data.bResults.length; i++) {
		      		    var counter = data.bResults[i];
		      		    // sort individual results
		      		    counter.fResults.sort(sort_by('result',true,parseFloat));
		      		  
			      		var li = document.createElement("li");
			      			
			      		var img = document.createElement('img');
			      		img.src = 'img/croppedImages/' + counter.path;
			      		var path = document.createElement('caption');
			      		//print top result + and filter
			      		var txt3 = document.createTextNode(counter.birdName + " - " + 
			      				counter.fResults[0].filter + " filter: " + 
			      				counter.fResults[0].result.toFixed(2)*100 + "% match");
			      		path.appendChild(txt3);
			      		li.appendChild(img);
			      		li.appendChild(path);
			      		mSlider.appendChild(li);
			      		
			      		var li1 = document.createElement("li");
			      		if(i == 0) {
			      			li1.className = "active";
			      		}
			      		mDots.appendChild(li1);
			      		
		      		}
		      		// need to be called in the success function of ajax because of ajax being asynch
		      		sliderSetup(data.bResults.length);
			    }
		   });
		};
		
		//sort array
		var sort_by = function(field, reverse, primer){

			   var key = primer ? 
			       function(x) {return primer(x[field])} : 
			       function(x) {return x[field]};

			   reverse = !reverse ? 1 : -1;

			   return function (a, b) {
			       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
			     } 
			}
		
		//  return cropped data: coordinates & base64 string
		// --------------------------------------------------------------------------

		this.crop = function(width, height, type) {

			var imgInfo = this.imgInfo,
				c = this.eles.container,
				img = this.eles.img,
				original = new Image(),
				canvas = document.createElement('canvas');

			original.src = img.attr('src');
			canvas.width = width;
			canvas.height = height;

			var w = Math.round(c.width() * (imgInfo.aw / (imgInfo.w * imgInfo.s))),
				h = Math.round(c.height() * (imgInfo.ah / (imgInfo.h * imgInfo.s))),
				x = Math.round(-parseInt(img.css('left')) * (imgInfo.aw / (imgInfo.w * imgInfo.s))),
				y = Math.round(-parseInt(img.css('top')) * (imgInfo.ah / (imgInfo.h * imgInfo.s)));

			canvas.getContext('2d').drawImage(original, x, y, w, h, 0, 0, width, height);

			return {
				width: width,
				height: height,
				type: type || 'png',
				string: canvas.toDataURL("image/" + type || 'png'),
			};

		};

	

		//  return original data: coordinates & base64 string
		// --------------------------------------------------------------------------

		this.original = function() {
			return this.originalImage;
		};



		//  show preview
		// --------------------------------------------------------------------------

		this.preview = function(width, height, target) {

			var c = this.eles.container,
				img = this.eles.img;

			// create #preview if it doesn't exist
			if(!$(target + ' img').length)
				$(target)
					.css({
						'height': c.height(),
						'width': c.width(),
						'overflow':'hidden',
						'margin':'0 auto',
						'padding':0,
						'transform': 'scale('+this.eles.preview.ratio+')',
					})
					.append('<img>');

			// position and resize image
			$(target + ' img')
				.attr('src', img.attr('src'))
				.attr('style', 'position:relative;' + $('.crop-img').attr('style'));

		};



		//  flip image
		// --------------------------------------------------------------------------

		this.flip = function() {

			var self = this,
				imgInfo = self.imgInfo,
				c = self.eles.container,
				img = self.eles.img;

			// get current width & height
			var original = new Image();
				original.src = img.attr('src');
				height = original.naturalHeight;
				width = original.naturalWidth;

			canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;

			canvas.getContext('2d').translate(width, 0);
			canvas.getContext('2d').scale(-1, 1);
			canvas.getContext('2d').drawImage(original, 0, 0);
			canvas.getContext('2d').translate(width, 0);
			canvas.getContext('2d').scale(-1, 1);

			c.find('.crop-img')
				.removeAttr('style')
				.attr('src', canvas.toDataURL());

		};



		//  rotate 90 degrees
		// --------------------------------------------------------------------------

		this.rotate = function() {

			var self = this,
				imgInfo = self.imgInfo,
				c = self.eles.container,
				img = self.eles.img;

			// get current width & height
			var original = new Image();
				original.src = img.attr('src');
				height = original.naturalHeight;
				width = original.naturalWidth;

			canvas = document.createElement('canvas');
			canvas.width = height;
			canvas.height = width;

			canvas.getContext('2d').translate(canvas.width / 2, canvas.height / 2);
			canvas.getContext('2d').rotate(Math.PI / 2);
			canvas.getContext('2d').drawImage(original, -width / 2, -height / 2);
			canvas.getContext('2d').rotate(-Math.PI / 2);
			canvas.getContext('2d').translate(-canvas.width / 2, -canvas.height / 2);

			c.find('.crop-img')
				.removeAttr('style')
				.attr('src', canvas.toDataURL());

		};


		this.cropAndUpload = function(width, height, type) {
			
			var self = this,
			imgInfo = self.imgInfo,
			c = self.eles.container,
			img = self.eles.img;

			var original = new Image();
				original.src = img.attr('src');
	
			// draw image to canvas
			var canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
	
			var w = Math.round(c.width() * (imgInfo.aw / (imgInfo.w * imgInfo.s))),
				h = Math.round(c.height() * (imgInfo.ah / (imgInfo.h * imgInfo.s))),
				x = Math.round(-(parseInt(img.css('left'))) * (imgInfo.aw / (imgInfo.w * imgInfo.s))),
				y = Math.round(-(parseInt(img.css('top'))) * (imgInfo.ah / (imgInfo.h * imgInfo.s)));
	
			canvas.getContext('2d').drawImage(original, x, y, w, h, 0, 0, width, height);
		
			return {
				width: width,
				height: height,
				type: type || 'jpeg',
				image: canvas.toDataURL("image/" + type || 'jpeg'),
			};
		}

		//  download image
		// --------------------------------------------------------------------------

		this.download = function(width, height, filename, type, link) {

			var self = this,
				imgInfo = self.imgInfo,
				c = self.eles.container,
				img = self.eles.img;

			var original = new Image();
				original.src = img.attr('src');

			// draw image to canvas
			var canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;

			var w = Math.round(c.width() * (imgInfo.aw / (imgInfo.w * imgInfo.s))),
				h = Math.round(c.height() * (imgInfo.ah / (imgInfo.h * imgInfo.s))),
				x = Math.round(-(parseInt(img.css('left'))) * (imgInfo.aw / (imgInfo.w * imgInfo.s))),
				y = Math.round(-(parseInt(img.css('top'))) * (imgInfo.ah / (imgInfo.h * imgInfo.s)));

			canvas.getContext('2d').drawImage(original, x, y, w, h, 0, 0, width, height);

			$('#' + link)
				.attr('href', canvas.toDataURL("image/"+type))
				.attr('download', filename + '.' + type);

		};



		//  import new image
		// --------------------------------------------------------------------------

		this.import = function() {
			var that = this;

			$('body').append('<input type="file" id="importIMG" style="display:none">');

			var self = this,
				imgInfo = self.imgInfo,
				c = self.eles.container,
				img = self.eles.img;

			oFReader = new FileReader();

			$('#importIMG').change(function() {

				if(document.getElementById("importIMG").files.length === 0) return;
				var oFile = document.getElementById("importIMG").files[0];
				if(!/^(image\/gif|image\/jpeg|image\/png)$/i.test(oFile.type)) return;
				oFReader.readAsDataURL(oFile);

				$('#importIMG').remove();

			});

			oFReader.onload = function (oFREvent) {

				c.find('.crop-img')
					.removeAttr('style')
					.attr('src', oFREvent.target.result);

				// original
				var original = new Image();
				original.src = oFREvent.target.result;
				that.originalImage = {
					width: original.naturalWidth,
					height: original.naturalHeight,
					type: oFREvent.target.result.split(",")[0].split(":")[1].split(";")[0].split("/")[1],
					string: oFREvent.target.result,
				};

			};

			$('#importIMG').click();

		};

	};

}());