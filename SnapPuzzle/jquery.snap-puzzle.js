// https://github.com/Pixabay/jQuery-snapPuzzle
!function(t){t.fn.snapPuzzle=function(a){function s(a){var s="sp_"+(new Date).getTime(),e=a.wrap('<span class="snappuzzle-wrap"/>').closest("span"),i=a.attr("src"),p=a.width()/o.columns,l=a.height()/o.rows,n=t(o.pile).addClass("snappuzzle-pile"),h=n.width()-p,r=n.height()-l;o.puzzle_class=s,a.data("options",o);for(var d=0;d<o.rows;d++)for(var c=0;c<o.columns;c++)t('<div class="snappuzzle-piece '+s+'"/>').data("pos",d+"_"+c).css({width:p,height:l,position:"absolute",left:Math.floor(Math.random()*(h+1)),top:Math.floor(Math.random()*(r+1)),zIndex:Math.floor(10*Math.random()+1),backgroundImage:"url("+i+")",backgroundPosition:-c*p+"px "+-d*l+"px",backgroundSize:a.width()}).draggable({start:function(){t(this).removeData("slot")},stack:".snappuzzle-piece",containment:o.containment}).appendTo(n).data("lastSlot",n),t('<div class="snappuzzle-slot '+s+'"/>').data("pos",d+"_"+c).css({width:p,height:l,left:c*p,top:d*l}).appendTo(e).droppable({accept:"."+s,hoverClass:"snappuzzle-slot-hover",drop:function(e,i){var p=t(this).data("pos");return t(".snappuzzle-piece."+s).each(function(){t(this).data("slot")==p&&(p=!1)}),p?(i.draggable.data("lastSlot",t(this)).data("slot",p),i.draggable.position({of:t(this),my:"left top",at:"left top"}),void(i.draggable.data("pos")==p&&(i.draggable.addClass("correct"),t(this).droppable("disable").css("opacity",1).fadeOut(1e3),i.draggable.css({opacity:0,cursor:"default"}).draggable("disable"),t(".snappuzzle-piece.correct."+s).length==o.rows*o.columns&&o.onComplete(a)))):!1}})}var o=t.extend({pile:"",containment:"document",rows:5,columns:5,onComplete:function(){}},a);return"string"==typeof a?(this.each(function(){var s=t(this),o=s.data("options"),e=s.width()/o.columns,i=s.height()/o.rows,p=t(o.pile),l=p.width()-e,n=p.height()-i,h=s.closest("span").offset(),r=p.offset();"destroy"==a?(t("."+o.puzzle_class).remove(),s.unwrap().removeData("options"),p.removeClass("snappuzzle-pile")):"refresh"==a&&(t(".snappuzzle-slot."+o.puzzle_class).each(function(){var a=t(this).data("pos").split("_"),s=a[0],o=a[1];t(this).css({width:e,height:i,left:o*e,top:s*i})}),t(".snappuzzle-piece."+o.puzzle_class).each(function(){if(t(this).data("slot")){var a=t(this).data("slot").split("_"),o=a[0],p=a[1],a=t(this).data("pos").split("_"),d=a[0],c=a[1];t(this).css({width:e,height:i,left:p*e+h.left-r.left,top:o*i+h.top-r.top,backgroundPosition:-c*e+"px "+-d*i+"px",backgroundSize:s.width()})}else{var a=t(this).data("pos").split("_"),u=a[0],f=a[1];t(this).css({width:e,height:i,left:Math.floor(Math.random()*(l+1)),top:Math.floor(Math.random()*(n+1)),backgroundPosition:-f*e+"px "+-u*i+"px",backgroundSize:s.width()})}}))}),this):this.each(function(){this.complete?s(t(this)):t(this).load(function(){s(t(this))})})}}(jQuery);
// jQuery UI Touch Punch 0.2.3 - must load after jQuery UI
// enables touch support for jQuery UI
!function(a){function f(a,b){if(!(a.originalEvent.touches.length>1)){a.preventDefault();var c=a.originalEvent.changedTouches[0],d=document.createEvent("MouseEvents");d.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null),a.target.dispatchEvent(d)}}if(a.support.touch="ontouchend"in document,a.support.touch){var e,b=a.ui.mouse.prototype,c=b._mouseInit,d=b._mouseDestroy;b._touchStart=function(a){var b=this;!e&&b._mouseCapture(a.originalEvent.changedTouches[0])&&(e=!0,b._touchMoved=!1,f(a,"mouseover"),f(a,"mousemove"),f(a,"mousedown"))},b._touchMove=function(a){e&&(this._touchMoved=!0,f(a,"mousemove"))},b._touchEnd=function(a){e&&(f(a,"mouseup"),f(a,"mouseout"),this._touchMoved||f(a,"click"),e=!1)},b._mouseInit=function(){var b=this;b.element.bind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),c.call(b)},b._mouseDestroy=function(){var b=this;b.element.unbind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),d.call(b)}}}(jQuery);
//Custom SnappPuzzle
$(document).ready(function(){
    var $containment = $('.puzzle_paddedWrap');
    var $puzzleContainer_pile = $('#puzzle_Main');
    var $snappuzzlePiece = $('.snappuzzle-piece');
    var puzzle_startTime, puzzle_endTime;//make global
    $('.shuffle_puzzle').css({"opacity": "0.6","cursor": "not-allowed"}).prop('disabled',true);
    //Start puzzle
    $('.puzzle_img').hide();
    $('.start_puzzle').on('click', function(){
      $puzzleContainer_pile.height($('.puzzle_img').height());
      $('.start_puzzle').css({"opacity": "0.6","cursor": "not-allowed"}).prop('disabled',true);
      $('.shuffle_puzzle').css({"opacity": "1","cursor": "pointer"}).prop('disabled',false).attr('data-grid',+$(this).data("grid"));
      start_puzzle($(this).data('grid'));
    });

    //shuffle puzzle
    $('.shuffle_puzzle').on('click', function(){
      var $grid = $(this).data('grid');
      $('.puzzle_img').snapPuzzle('destroy');
      start_puzzle($grid);
    });
    //restart puzzle
    $('.restart_puzzle').on('click', function(){
        location.reload();
    });
    //update puzzle on resize
    $(window).resize($.debounce(250, updatePuzzleImageHeight));
    //set puzzle_startTime once puzzlePiece dragged
    $(document).one('drag', $snappuzzlePiece, function(){
      console.log('puzzle piece was clicked!');
      puzzle_startTime = Date.parse(new Date());
      console.log(puzzle_startTime);
    });

    //functs
    function updatePuzzleImageHeight(){
        $puzzleContainer_pile.height($('.puzzle_img').height());
        $('.puzzle_img').snapPuzzle('refresh');
    }

    function start_puzzle(x, y){
            if(!y){
                y = x;
            }
            $('.puzzle_img').show();
            $('.puzzle_img').snapPuzzle({
                rows: x,
                columns: y,
                pile: $puzzleContainer_pile,//where our puzzle while be contained, MUST be defined in the dom
                containment: $containment,
                onComplete: function(){
                    console.log('puzzle completed!');
                    puzzle_endTime = Date.parse(new Date());
                    getKompletionTime_str(puzzle_startTime, puzzle_endTime);
                    $('.shuffle_puzzle').css({"opacity": "0.6","cursor": "not-allowed"}).prop('disabled',true);
                }
            });
    }
    function getKompletionTime_str(puzzle_startTime, puzzle_endTime){
            var timeTaken = puzzle_endTime - puzzle_startTime,
                seconds = Math.floor((timeTaken/1000)%60),
                minutes = Math.floor((timeTaken/1000/60)%60),
                hours = Math.floor((timeTaken/(1000*60*60))%60),
                kompletionTime_str = '';
                console.log(puzzle_endTime);
                kompletionTime_str = 'Wow! You completed the puzzle in ' + setHours_str(hours) +  setMinutes_str(minutes) + seconds + ' seconds!!!'
                console.log(kompletionTime_str);
                setTimeout(function(){
                    alert(kompletionTime_str);
                },999);
            //utilities
            function setHours_str(hours){return hours < 1 ? '': hours + ' hrs. ';}
            function setMinutes_str(minutes){return minutes < 1 ? '': minutes + ' mins. ';}
        }

});
