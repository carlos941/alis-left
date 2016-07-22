(function() {
  var ElevatorModelView, modelView;

  ElevatorModelView = (function() {
    function ElevatorModelView() {
      var buttons, floor, me;
      this.floors = 16;
      this.cars = [
        {
          floor: 1,
          moving: false
        }, {
          floor: 1,
          moving: false
        }, {
          floor: 1,
          moving: false
        }, {
          floor: 1,
          moving: false
        }, {
          floor: 1,
          moving: false
        }, {
          floor: 1,
          moving: false
        }
      ];
      me = this;
      buttons = ((function() {
        var j, results;
        results = [];
        for (floor = j = 16; j >= 1; floor = j += -1) {
          results.push("<div id = 'button-floor-" + floor + "' class='button-floor'>\n  <button class='button up' data-floor='" + floor + "'><div class='up'></div></button>\n  <button class='button down' data-floor='" + floor + "'><div class='down'></div></button>\n</div>");
        }
        return results;
      })()).join('');
      $('#buttons').empty().append($(buttons)).off('click').on('click', 'button', function() {
        if ($(this).hasClass('on')) {
          return;
        }
        $(this).toggleClass('on');
        return $(me).trigger('pressed', [
          {
            floor: parseInt($(this)[0].dataset.floor),
            dir: $(this).children().hasClass('up') ? 'up' : 'down'
          }
        ]);
      });
    }

    ElevatorModelView.prototype.clearButton = function(floor, dir) {
      return $("#button-floor-" + floor + " > button > div." + dir).parent().removeClass('on');
    };

    ElevatorModelView.prototype.firstIdleCar = function() {
      var car, i;
      return ((function() {
        var j, len, ref, results;
        ref = this.cars;
        results = [];
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          car = ref[i];
          if (!car.moving) {
            results.push(i + 1);
          }
        }
        return results;
      }).call(this))[0];
    };

    ElevatorModelView.prototype.closestIdleCar = function(floor) {
      var a, car, closest, i, lowest, nonmoving;
      console.log("Finding closest car to " + floor + " from ", this.cars);
      nonmoving = (function() {
        var j, len, ref, results;
        ref = this.cars;
        results = [];
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          car = ref[i];
          if (!car.moving) {
            results.push([i + 1, Math.abs(floor - car.floor)]);
          }
        }
        return results;
      }).call(this);
      closest = nonmoving.reduce(function(a, b) {
        if (a[1] <= b[1]) {
          return a;
        } else {
          return b;
        }
      });
      lowest = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = nonmoving.length; j < len; j++) {
          a = nonmoving[j];
          if (a[1] === closest[1]) {
            results.push(a[0]);
          }
        }
        return results;
      })();
      console.log("Closest car to " + floor + " is " + closest + " from " + nonmoving);
      return lowest[Math.floor(Math.random() * lowest.length)];
    };

    ElevatorModelView.prototype.moveCar = function(car, floor) {
      var deferred, myCars;
      myCars = this.cars;
      deferred = $.Deferred();
      if (this.cars[car - 1].moving) {
        return deferred.reject();
      }
      if (floor < 1 || floor > this.floors) {
        return deferred.reject();
      }
      this.cars[car - 1].moving = true;
      $("#elevator" + car + " .car").animate({
        bottom: ((floor - 1) * 23) + "px"
      }, {
        duration: 500 * Math.abs(myCars[car - 1].floor - floor),
        easing: 'swing',
        complete: function() {
          myCars[car - 1].floor = floor;
          myCars[car - 1].moving = false;
          return deferred.resolve();
        }
      }).delay(75);
      $("#elevator" + car + " .car > div").animate({
        top: (-368 + floor * 23) + "px"
      }, {
        duration: 500 * Math.abs(myCars[car - 1].floor - floor),
        easing: 'swing'
      }).delay(75);
      return deferred;
    };

    return ElevatorModelView;

  })();

  modelView = new ElevatorModelView();

  $(modelView).on('pressed', function(e, arg) {
    var dir, floor;
    floor = arg.floor, dir = arg.dir;
    console.log("Pressed " + floor + "-" + dir);
    return modelView.moveCar(modelView.closestIdleCar(floor), floor).then(function() {
      return modelView.clearButton(floor, dir);
    });
  });

  modelView.moveCar(1, 16);

  modelView.moveCar(2, 4);

  modelView.moveCar(3, 8);

  modelView.moveCar(4, 9);

  modelView.moveCar(5, 12);

  modelView.moveCar(6, 1);

}).call(this);