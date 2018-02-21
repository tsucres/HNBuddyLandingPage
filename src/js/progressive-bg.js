
$(function(){

  	

    progressivelyLoadBackground = function(root_el) {
        var self = this;
        this.root_el = root_el;
        this.canvas = $(root_el).find(".progressive-img-load-canvas")[0];
        this.thumbnailImg = $(root_el).find(".thumbnail")[0];
        // 1) Draw the thumbnail in the canvas
        
        var thumbnail = new Image();
        thumbnail.onload = function () {
            var canvasImage = new CanvasImage(self.canvas, thumbnail);
            canvasImage.blur(2);

        };
        thumbnail.src = this.thumbnailImg.src;


        // 2) Download & load the full size image
        this.fullBackgroundImage = $(root_el).find('.full-bg-image')[0];

        function fullBackgroundImageLoaded() {
            $(self.root_el).css('background-image', 'url(' + self.fullBackgroundImage.src + ')');
            $(self.canvas).css({opacity: 0});
            self.thumbnailImg.remove();
            self.fullBackgroundImage.remove();
            
        }

        if (this.fullBackgroundImage.complete) {
            fullBackgroundImageLoaded();
        } else {
            this.fullBackgroundImage.addEventListener('load', fullBackgroundImageLoaded);
            this.fullBackgroundImage.addEventListener('error', function() {
                // Keep the blured canvas?
            })
        }    
    }

    $('.progressive-bg-image').each(function(){
        new progressivelyLoadBackground($(this)[0]);
    });
});




// source: pilpil.js
CanvasImage = function (e, t) {
    this.image = t;
    this.element = e;
    e.width = t.width;
    e.height = t.height;
    this.context = e.getContext('2d');
    this.context.drawImage(t, 0, 0);
};

CanvasImage.prototype = {
    blur:function(e) {
        this.context.globalAlpha = 0.5;
        for(var t = -e; t <= e; t += 2) {
            for(var n = -e; n <= e; n += 2) {
                this.context.drawImage(this.element, n, t);
                var blob = n >= 0 && t >= 0 && this.context.drawImage(this.element, -(n -1), -(t-1));
            }
        }
    }
};