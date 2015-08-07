/**
 * @TODO: 地球の自転がおかしい
 */
(function(global){
  "use strict";

  global.app = global.app || {};


  global.app.Star = function(id, options){
    if (typeof options === 'undefined') {
      options = {};
    }
    this.elmSpeed = options.elmSpeed || $('#multi-speed');
    this.id = id;
    this.elm = $('#' + id);
    this.centerObj = options.centerObj || { top: 0, left: 0 };
    this.initialTop = options.top || (this.centerObj.elm.position().top - this.centerObj.elm.height()/2 + this.elm.height()/2 );
    this.initialLeft = options.left || (this.centerObj.elm.position().left - this.centerObj.elm.width()/2 + this.elm.width()/2);
    this.rotateR = (function(centerObj){
      if ('rotateR' in options) {
        return options.rotateR;
      } else if (typeof centerObj === 'object' && typeof centerObj.elm === 'object') {
        return centerObj.elm.width() * 3.0;
      } else {
        return 0;
      }
    })(this.centerObj);
    this.w = options.w || (360/365) * (Math.PI/180); // 角速度（公転）[ラジアン]
    this.selfW = options.selfW || (360/(24 * 60 * 60)); // 角速度（自転）[度]
    this.interval = 100; // [ms]
    this.selfRotateInterval = 100; // [ms]
    this.rotatable = ('rotatable' in options) ? options.rotatable : true;
    this.selfRotatable = ('selfRotatable' in options) ? options.selfRotatable : false;
    this.init();
    if (this.selfRotatable) {
      this.selfRotate();
    }
    if (this.rotatable) {
      this.rotate();
    }
  };
  global.app.Star.prototype = {
    init: function() {
      this.elm.css({
        top: this.initialTop + 'px',
        left: this.initialLeft + 'px'
      })
        .show();
    },
    selfRotate: function() {
      var that = this,
          speed,
          intR = 0,
          R = 0.0;
      setInterval(function() {
        speed = (function(){
          var speed_tmp = that.elmSpeed.val();
          if (!isNaN(speed_tmp) && speed_tmp > 0) {
            return parseInt(speed_tmp);
          }
          return 1;
        })();
        R += that.selfW * (speed / (1000/that.selfRotateInterval));
        if (speed >= 86400) {
          // skip
        } else {
          if (Math.floor(R) > intR) {
            intR = Math.floor(R);
            that.elm.velocity({
              rotateZ : intR + 'deg'
              //rotateZ : '+=2deg'
            });
          }
        }
      }, that.selfRotateInterval);
    },
    rotate: function() {
      var that = this,
          R = 0;

      setInterval(function(){
        var speed,
            centerObjPos = that.centerObj.elm.position(),
            left = ( centerObjPos.left + (that.centerObj.elm.width()/2)
                    - (that.elm.width()/2) + ( that.rotateR * Math.cos( R ) )),
            top = ( centerObjPos.top + (that.centerObj.elm.height()/2)
                    - (that.elm.height()/2) - ( that.rotateR * Math.sin( R ) ));
        that.elm.css({
          left: left + 'px',
          top: top + 'px'
        });
        speed = (function(){
          var speed_tmp = that.elmSpeed.val();
          if (!isNaN(speed_tmp) && speed_tmp > 0) {
            return parseInt(speed_tmp);
          }
          return 1;
        })();
        R += (that.w * (speed / (1000/that.interval)));
      }, that.interval);

    }
  };


  global.app.solarSystem = (function(global){

    var container, sun, earth, moon, cooCenter,
        multiSpeed = {};

    var run = function() {

      initialize();

    };

    var initialize = function() {

      multiSpeed = $('#multi-speed');
      container = $('#starContainer');
      cooCenter = {
        top: container.height()/2,
        left: container.width()/2
      };
      sun  = new global.app.Star('sun', {
        top: cooCenter.top,
        left: cooCenter.left,
        rotatable: false
      });
      earth  = new global.app.Star('earth', {
        centerObj: sun,
        w: (360/(365 * 24 * 60 * 60)) * (Math.PI/180),
        selfW: 360/(24 * 60 * 60), // [度/sec]
        selfRotatable: true
      });
      moon  = new global.app.Star('moon', {
        centerObj: earth,
        rotateR: earth.elm.width()*1.2,
        w: (360/(30 * 24 * 60 * 60)) * (Math.PI/180)
      });

    };

    return {
      run: run,
      multiSpeed: multiSpeed
    };

  })(global);


  //------------
  // Main
  //------------
  $(function(){

    global.app.solarSystem.run();

  });

})((typeof window === 'object' && window) || global);
