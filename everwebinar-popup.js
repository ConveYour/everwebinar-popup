(function(w){

    function EverWebinar() {

    }

    (function(p){

        p.content_id = 'wj-frame-content';
        p.frame_id = 'wj-frame';
        p.tz = null;
        p.hidden = 'wj-hidden';
        p.popup = 'wj-popup';
        
        p.addCss = function(){
            var css = '.wj-registration-modal-opened{overflow-y:hidden;} .wj-hidden{ visibility:hidden;pointer-events:none; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            iframeOffsetHeight = 0,
            iframeOffsetTop = 0;

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);
            return this;
        }

        p.init = function(){
            p.addCss();
            window.addEventListener('message', this.onMessage.bind(this), false);
            window.addEventListener("resize", this.resize.bind(this), false);
            p.setup();
            p.getTimezone();
            p.listeners();
            return this;
        }

        p.setup = function(){

            var odiv=$("<div>", { 
                'id' : this.content_id,
                'class' : this.hidden
                })
                .css({
                    "webkit-overflow-scrolling":"touch !important", 
                    "overflow-y":"hidden", 
                    "top":0, 
                    "left":0, 
                    "background":"rgba(0,0,0,0.8)", 
                    "position":"fixed", 
                    "width":"100vw", 
                    "height":"100vh",
                    "z-index":2147483647
                });

            var div1 = $("<div>").attr("id","div-wj-1").css({"width":"100%", "height": "100%", "position": "relative"});
            var div2 = $("<div>").attr("id","div-wj-2").css({"margin":"auto", "height": "100%"});
            div1.append(div2);
            odiv.append(div1);

            var existing = $(this.content_id);

            if ( existing.get(0) ) {
                // clean up legacy codes out there
                // data-wjs-required is used on login pages
                if ( existing.attr('data-wjs-required') != 1) {
                    existing.remove();
                }
            }

            $("body").append(odiv);

            return this
        }

        p.getTimezone = function(){
            var d = new Date();
            var offset = -d.getTimezoneOffset();
            var tz_xhr = $.post('https://events.genndi.com/register/detectTimezone', {offset: offset});
            var self = this;

            tz_xhr.done(function(data){
                self.tz = data.timezone;
            });

            return tz_xhr;
        }

        p.resize = function(){
            if (document.getElementById(this.frame_id) === null) {
                return false;
            }

            var receiver = document.getElementById(this.frame_id).contentWindow;

            receiver.postMessage({"a":"getOffsetHeight"}, '*');
            receiver.postMessage({"a":"getOffsetTop"}, '*');
            setTimeout(this.realResize.bind(this), 50);
        }

        p.realResize = function(){
            var windowHeight3 = window.innerHeight;
            $('#' + this.frame_id).height(windowHeight3).fadeIn();
        }

        p.onMessage = function(messageEvent){
            if (messageEvent.data.a == 'resize') {
                this.resize();
            }
            if (messageEvent.data.a == 'setOffsetHeight') {
                iframeOffsetHeight = messageEvent.data.v;
            }
            if (messageEvent.data.a == 'setOffsetTop') {
                iframeOffsetTop = messageEvent.data.v;
            }
            if (messageEvent.data.a == 'close') {
                this.hide();
            }
        }

        p.load = function(memberid, webicode, tz){
            var container = $('#div-wj-2');

            var existing = $('#' + this.frame_id);

            if( existing.get(0) ){
                if( existing.data('webicode') === webicode){
                    return true;
                }
                else{
                    existing.remove();
                }
            }

            var url = "https://events.genndi.com/registerBoxEvergreen/"+memberid+"/"+webicode+"?page=&page_tag=formregistration&ts="+Date.now();

            var _tz = tz || this.tz;

            if( _tz ){
                url += "&tz=" + _tz;
            }

            var frame = $('<iframe>', {
                src: url,
                id:  this.frame_id,
                frameborder: 0,
                name: this.frame_id,
                scrolling: 'no'
            }).appendTo(container);

            frame.data('webicode', webicode).css({'width':'100%', 'z-index':250});
        }

        p.content = function(){
            return $('#' + this.content_id);
        }

        p.onClick = function(e){

            var _this = $(e.target);
            
            if( !_this.hasClass( this.popup ) ){
                _this = _this.closest( '.' + this.popup );
            }

            var memberid = _this.data('memberid');
            var webicode = _this.data('webicode')
            var tz = _this.data('tz');

            if( !memberid || !webicode ){
                console.log('missing memberid or webicode');
                return true;
            }

            this.load(memberid, webicode, tz);
            this.show();
        }

        p.hide = function(){
            this.content().addClass(this.hidden);
            return this;
        }

        p.show = function(e){
            this.content().removeClass(this.hidden);
            return this;
        }   

        p.listeners = function(){
            $('.' + this.popup).on('click', this.onClick.bind(this) );
        } 


    })(EverWebinar.prototype);

  
    w.EverWebinar = EverWebinar;

})(window, window.jQuery);