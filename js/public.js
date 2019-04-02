var xx = xx || {};
xx.event=('ontouchstart' in window)?{start: 'touchstart', move: 'touchmove', end: 'touchend'} : {start: 'click', move: 'mousemove', end: 'mouseup'};

;(function ($) {
    //jquery
    var defaults = {
        classIn: 'moveIn',
        classOut: 'moveOut',
        onClass:'page-on',
        complete: function () { }
        // CALLBACKS
    };
    $.fn.moveIn = function (options) {
        var options = $.extend({},defaults, options);
        this.addClass(options.classIn).show();
        this.one('webkitAnimationEnd', function () {
            $(this).removeClass(options.classIn).addClass(options.onClass);
            options.complete();
        });
        return this;
    }
    $.fn.moveOut = function (options) {
        var options = $.extend({},defaults, options);
        this.addClass(options.classOut).show();
        this.one('webkitAnimationEnd', function () {
            $(this).removeClass(options.classOut+' '+options.onClass).hide();
            options.complete();
        });
        return this;
    }

    $.fn.tap=function(listener){
    	if('ontouchstart' in window){
    		this.on("touchstart",function(e){
                this._x_startTime=Date.now();
                this._x_startPos=[e.changedTouches[0].pageX,e.changedTouches[0].pageY];
	    		e.preventDefault();
	    	});
	    	this.on("touchend",function(e){
                var isMove=false,distLimit=10;
                var distX=Math.abs(this._x_startPos[0]-e.changedTouches[0].pageX),
                    distY=Math.abs(this._x_startPos[1]-e.changedTouches[0].pageY);
                if(distX>distLimit||distY>distLimit){
                    isMove=true;
                }
                
	    		if(!isMove&&(Date.now()-this._x_startTime)<=250){
	    			listener.call(this,e);
	    		};
	    		e.preventDefault();
	    	});
    	}else{
    		this.on("click",listener);
    	}
    }
    $.fn.offTap=function(){
    	if('ontouchstart' in window){
    		this.off("touchstart");
    		this.off("touchend");
    	}else{
    		this.off("click");
    	}
    }
})(jQuery);
xx.bgMp3 = function () {
    //背景音乐
    var btn = $('#js_music'),
    	oMedia = $('#media')[0];
    btn.tap(function () {
        if (oMedia.paused) {
            oMedia.play();
        } else {
            oMedia.pause();
        }
    });
    oMedia.load();
    oMedia.play();
    if (oMedia.paused) {
        $('#wrapper').one(xx.event.start, function (e) {
            oMedia.play();
            e.preventDefault();
        });
    };
    $(oMedia).on('play', function () {
        btn.addClass('play');
    });
    $(oMedia).on('pause', function () {
        btn.removeClass('play');
    });
}
xx.hint=function(text){
    //提示层
    if(xx.hint.lastHintText==text){
        return;
    }
    xx.hint.lastHintText=text;
    var box=$('<div class="hint">'+text+'</div>');
    box.appendTo('body');
    setTimeout(function(){
        box.moveOut({complete:function(){
            box.remove();
        }});
        xx.hint.lastHintText=null;
    },2000);
}
xx.page={
    now:null,
    last:null,
    _z:2,
    _timer:null,
    _defaults:{
        isMove:true,
        classMoveIn:"page-move-in",
        classMoveOut:"",
        classActive:"page-on",
        onComplete:function(){}
    },
    to:function(pid,options){
        var that=this;
        var options=options||{};
        options=Object.assign({},this._defaults,options);
        if(pid==this.now){
            options.onComplete("same");
            return;
        };
        this.last = this.now;
        this.now = pid;
        this._z++;
        var $nowPage=$(this.now),
            $lastPage=null;
        if(this.last) $lastPage=$(this.last);
        $nowPage.css('zIndex', this._z);
        
        //初始化
        this.reset($nowPage);
        clearTimeout(this._timer);

        if(options.isMove){
            $nowPage.addClass(options.classMoveIn).show();
            $nowPage.one('webkitAnimationEnd', function () {
                $nowPage.addClass(options.classActive);
                $nowPage.removeClass(options.classMoveIn);
                if($lastPage){
                    that.reset($lastPage);
                };
                options.onComplete();
            });
        }else{
            $nowPage.show();
            this._timer=setTimeout(function(){
                $nowPage.addClass(options.classActive);
                if($lastPage){
                    that.reset($lastPage);
                };
                options.onComplete();
            },300);
        };

        if($lastPage&&options.classMoveOut){
            $lastPage.addClass(options.classMoveOut);
        };
    },
    reset:function($page){
        //重置并添加页面最初的class，data-page-class="page class1 class2"
        var oPage=$page[0];
        var xclass="page";
        if(oPage&&oPage.dataset.pageClass){
            xclass=oPage.dataset.pageClass;
        }
        $page.hide().removeClass().addClass(xclass);
        $page.off("webkitAnimationEnd");
    }
};
;(function(){
    /**
     * @class ImgLoader 图片加载
     * @method load 开始加载
     * @method getImg 获取图片对象
     * @property {string} basePath  基础路径
     * @property {string} crossOrigin 源
     * @property {array} loadList 加载列表['src','src1','img/i1.jpg'……]；名称带 . 或 / 默认当成路径加载；其他值通过data-*获取元素加载，并且data-*不能含有- 和 大写字母
     * @property {number} time 单张图片最大加载时间
     * @property {function} onProgress 加载进度
     * @property {function} onComplete 加载完成
     */
    function ImgLoader(){this.basePath="",this.crossOrigin="",this.loadList=["src"],this.time=5e3,this.onProgress=function(){},this.onComplete=function(){},this._objList={}}ImgLoader.prototype.isAp=function(t){return-1!=t.indexOf("//")},ImgLoader.prototype.isPath=function(t){return!!/\.|\//i.test(t)},ImgLoader.prototype.load=function(){function t(){s++;var t=Math.ceil(s/i*100);e.onProgress(t),100!=t||n||(clearTimeout(o),e.onComplete())}var o,e=this,r=this._createQueue(this.loadList),i=r.length,s=0,n=!1,a=this.time;if(0==i)e.onComplete();else{o=setTimeout(function(){n=!0,e.onComplete()},a*i);for(var c=0;c<i;c++)this._loadOnce(r[c],t)}},ImgLoader.prototype._createQueue=function(t){for(var o=this,e=[],r=0;r<t.length;r++)if(o.isPath(t[r])){var i=new Image;o.crossOrigin&&(i.crossOrigin=o.crossOrigin);var s=t[r];e.push({tag:i,src:o.isAp(s)?s:o.basePath+s}),o._objList[s]=i}else for(var n=t[r],a=document.querySelectorAll("img[data-"+n+"]"),c=0;c<a.length;c++){var u=a[c];o.crossOrigin&&(u.crossOrigin=o.crossOrigin);var s=u.dataset[n];e.push({tag:u,src:o.isAp(s)?s:o.basePath+s}),o._objList[s]=u}return e},ImgLoader.prototype._loadOnce=function(t,o){var e=t.tag;e.src=t.src,e.complete?o():(e.onload=function(){e.onload=null,o()},e.onerror=function(){e.onerror=null,o()})},ImgLoader.prototype.getImg=function(t){return this._objList[t]};
    //############# API ####################
    xx.ImgLoader=ImgLoader;
})();
xx.page1=function(){

}
xx.main=function(){
    //延迟加载图片
    var imgLoader2=new xx.ImgLoader();
    imgLoader2.basePath=xx.cdn;
    imgLoader2.loadType=['src0'];
    imgLoader2.load();

    //进入页面
    setTimeout(function () {
        $('#page_loading').moveOut();
    }, 400);
    xx.page.to('#p1');

    //功能
    $('#p1Btn').tap(function(){
        xx.page.to('#end',{
            classMoveOut:'page-move-out'
        });
    });
    $('#return').tap(function(e){
        // xx.page.to('#p1');
        xx.page.to('#p1',{
            classMoveIn:'page-move-in-left',
            classMoveOut:'page-move-out-left'
        });
    });
    $('.end-con li').tap(function(e){
        console.log(this);
    	$(this).offTap();
    });
}
