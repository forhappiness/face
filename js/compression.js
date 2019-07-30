(function() {
	var compression = function(array){
        var _this = this;
        _this.array = array;
        _this.array.fidelity = _this.array.fidelity == undefined ? 1 : _this.array.fidelity ; 
        var listType = ["jpeg","png"];
        if(listType.indexOf(_this.array.type) == -1  &&  _this.array.type != undefined){
            _this.array.type = undefined ; 
        }
        _this.array.type = _this.array.type == undefined ? "jpeg" : _this.array.type.toLowerCase() ; 
        _this.array.imgFile = _this.array.imgFile == undefined ? function(base64){
          
        } : _this.array.imgFile;
        var domId = document.getElementById(_this.array.domId);
        domId.style.position = "relative";
        var input = document.createElement("input");
        input.type = "file";
        input.style.position = "absolute";
        input.style.width = "100%";
        input.style.height = "100%";
        input.style.left = 0;
        input.style.top = 0;
        input.style.opacity = 0;
        input.accept = "image/jpeg,image/jpg,image/png";
        domId.appendChild(input);
        input.onchange = function(e){
        	_this.inputChange(e);
        }
	}
	compression.prototype = {
		inputChange(event){
			var _this = this;
	        for (var i = 0; i < event.target.files.length; i++) {
	          _this.compress(_this.getObjectURL(event.target.files[i]),"1000","1000");
	        }
		    event.target.value = "";
		},
		getObjectURL:function(file) {
	        var url = null;
	        if (window.createObjectURL != undefined) { // basic
	          url = window.createObjectURL(file);
	        } else if (window.URL != undefined) { // mozilla(firefox)
	          url = window.URL.createObjectURL(file);
	        } else if (window.webkitURL != undefined) { // webkit or chrome
	          url = window.webkitURL.createObjectURL(file);
	        }
	        return url;
        },
         compress:function(img, MaximgW, MaximgH) {
	        var _this = this;
	        var image = new Image();
	        image.src = img ;
	        var imageWidth =  "";
	        var imageHeight = "";
	        image.onload = function () {
	          var canvas = document.createElement('canvas');
	          if (image.width < MaximgW && image.height < MaximgH) {
	            imageWidth = image.width;
	            imageHeight = image.height;
	          } else {
	            if (image.width > image.height) {
	              imageWidth = MaximgW;
	              imageHeight = MaximgW * (image.height / image.width);
	            } else if (image.width < image.height) {
	              imageHeight = MaximgH;
	              imageWidth = MaximgH * (image.width / image.height);
	            } else {
	              imageWidth = MaximgW;
	              imageHeight = MaximgH;
	            }
	          }
	          canvas.width = imageWidth;
	          canvas.height = imageHeight;
	          var con = canvas.getContext('2d');
	          con.clearRect(0, 0, canvas.width, canvas.height);
	          con.drawImage(image, 0, 0, imageWidth, imageHeight);
	          var base64 = canvas.toDataURL('image/' + _this.array.type, _this.array.fidelity).substr(0);
	          console.log(base64)
	          _this.array.imgFile(base64);
	        }
	     },
	}
	window.compression = compression;
	  
}())