import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  styles: [`@mixin display-flex {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -moz-flex;
  display: -ms-flexbox;
  display: flex;
}

@mixin transform($val) {
  -webkit-transform: $val;
  transform: $val;
}

@mixin translate3d($x, $y, $z) {
  @include transform(translate3d($x, $y, $z));
}

@mixin transition($transition...) {
  -webkit-transition: $transition;
  transition: $transition;
}

body {
  background: url(http://rats-funnybone.com/wp-content/uploads/2013/08/aura-background-large-1.jpg) no-repeat;
  background-size: 100%;
}

$fab-menu-padding: 20px;

.fab-menu {

  @include display-flex();
  @include translate3d(0, 0, 0);
  @include transform(scale(2));

  position: absolute;
  top: auto;
  right: auto;
  left: 0;
  bottom: 0;
  z-index: 99;
  padding: $fab-menu-padding;

  &.fab-menu-left {
    top: auto;
    right: auto;
    left: 0;
    bottom: 0;
  }

  &.fab-menu-right {
    top: auto;
    right: 0;
    left: auto;
    bottom: 0;
  }

  .fab-menu-button {
    position: absolute;
    bottom: $fab-menu-padding;
    left: $fab-menu-padding;
    z-index: 101;
  }
}

.fab-menu-items {
  /**
   * @see http://hugogiraudel.com/2013/04/02/items-on-circle/
   */
  $item-size: 56px; // FAB Button size

  //display: none;

  z-index: 99;

  .fab-menu.active & {
    display: block;
  }

  position: absolute;
  width: 168px;
  height: 168px;
  top: auto;
  right: auto;
  bottom: 0;
  left: 0;
  border-radius: 50%;
  list-style: none;
  > li {
    @include transition(all 0.5s ease 0s);
    display: block;
    position: absolute;
    width: $item-size;
    height: $item-size;
    top: auto;
    right: auto;
    bottom: $fab-menu-padding;
    left: $fab-menu-padding;

  }
}

.fab-menu-overlay {
  @include transition(all 0.2s ease 0.2s);
  position: fixed;
  display: none;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
  z-index: 98;

  &.active {
    display: block;
  }
}`]
  //  styleUrls: ['../home/home.scss']


})
export class HomePage {

  public options = {
    baseAngle: 270,
    rotationAngle: 30,
    distance: 112,
    animateInOut: 'all', // can be slide, rotate, all
  };
  public buttons;
  public buttonContainers;
  public buttonsContainer;
  lastDragTime = 0;
  currentX = 0;
  currentY = 0;
  previousSpeed = 15;
  public fabMenu = {
    active: false
  };


  constructor(public navCtrl: NavController) {}

  public fabMenuToggle() {
    if (this.fabMenu.active) { // Close Menu
      this.animateButtonsOut();
    } else { // Open Menu
      this.animateButtonsIn();
    }
    this.fabMenu.active = !this.fabMenu.active;
  }


  ionViewDidLoad() {
    this.buttons = document.getElementsByClassName('fab-menu-button-item');
    this.buttonContainers = document.querySelectorAll('.fab-menu-items > li');
    this.buttonsContainer = document.getElementsByClassName('fab-menu-items');
    for (var i = 0; i < this.buttonContainers.length; i++) {
      var button = this.buttonContainers.item(i);
      var angle = (this.options.baseAngle + (this.options.rotationAngle * i));
      button.style.transform = "rotate(" + this.options.baseAngle + "deg) translate(0px) rotate(-" + this.options.baseAngle + "deg) scale(0)";
      button.style.WebkitTransform = "rotate(" + this.options.baseAngle + "deg) translate(0px) rotate(-" + this.options.baseAngle + "deg) scale(0)";
      button.setAttribute('angle', '' + angle);
    }

  }


  tapEvent(event) {
    //drag and release
    if (event.timeStamp - this.lastDragTime > 100) {
      var direction = 1,
        deltaX = event.deltaX - this.currentX,
        deltaY = event.deltaY - this.currentY,
        delta = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));

      if ((deltaX <= 0 && deltaY <= 0) || (deltaX <= 0 && Math.abs(deltaX) > Math.abs(deltaY))) {
        direction = -1;
      } else if ((deltaX >= 0 && deltaY >= 0) || (deltaY <= 0 && Math.abs(deltaX) < Math.abs(deltaY))) {
        direction = 1;
      }
      this.rotateButtons(direction, delta);
      this.lastDragTime = event.timeStamp;
      this.currentX = event.deltaX;
      this.currentY = event.deltaY;
    }


  }


  public animateButtonsIn() {
    for (var i = 0; i < this.buttonContainers.length; i++) {
      var button = this.buttonContainers.item(i);
      var angle = button.getAttribute('angle');
      button.style.transform = "rotate(" + angle + "deg) translate(" + this.options.distance + "px) rotate(-" + angle + "deg) scale(1)";
      button.style.WebkitTransform = "rotate(" + angle + "deg) translate(" + this.options.distance + "px) rotate(-" + angle + "deg) scale(1)";
    }
  }

  public animateButtonsOut = function () {
    for (var i = 0; i < this.buttonContainers.length; i++) {
      var button = this.buttonContainers.item(i);
      var angle = (this.options.baseAngle + (this.options.rotationAngle * i));
      button.setAttribute('angle', '' + angle);
      button.style.transform = "rotate(" + this.options.baseAngle + "deg) translate(0px) rotate(-" + this.options.baseAngle + "deg) scale(0)";
      button.style.WebkitTransform = "rotate(" + this.options.baseAngle + "deg) translate(0px) rotate(-" + this.options.baseAngle + "deg) scale(0)";
    }
  }



  public rotateButtons(direction, speed) {

    // still looking for a better solution to handle the rotation speed
    // the direction will be used to define the angle calculation

    // max speed value is 25 // can change this :)
    // used previousSpeed to reduce the speed diff on each tick
    speed = (speed > 15) ? 15 : speed;
    speed = (speed + this.previousSpeed) / 2;
    this.previousSpeed = speed;

    var moveAngle = (direction * speed);

    // if first item is on top right or last item on bottom left, move no more
    if ((parseInt(this.buttonContainers.item(0).getAttribute('angle')) + moveAngle >= 285 && direction > 0) ||
      (parseInt(this.buttonContainers.item(this.buttonContainers.length - 1).getAttribute('angle')) + moveAngle <= 345 && direction < 0)
    ) {
      return;
    }

    for (var i = 0; i < this.buttonContainers.length; i++) {

      var button = this.buttonContainers.item(i),
        angle = parseInt(button.getAttribute('angle'));

      angle = angle + moveAngle;

      button.setAttribute('angle', '' + angle);

      button.style.transform = "rotate(" + angle + "deg) translate(" + this.options.distance + "px) rotate(-" + angle + "deg) scale(1)";
      button.style.WebkitTransform = "rotate(" + angle + "deg) translate(" + this.options.distance + "px) rotate(-" + angle + "deg) scale(1)";
    }
  }



  public endRotateButtons = function () {

    for (var i = 0; i < this.buttonContainers.length; i++) {

      var button = this.buttonContainers.item(i),
        angle = parseInt(button.getAttribute('angle')),
        diff = angle % this.options.rotationAngle;
      // Round the angle to realign the elements after rotation ends
      angle = diff > this.options.rotationAngle / 2 ? angle + this.options.rotationAngle - diff : angle - diff;

      button.setAttribute('angle', '' + angle);

      button.style.transform = "rotate(" + angle + "deg) translate(" + this.options.distance + "px) rotate(-" + angle + "deg) scale(1)";
      button.style.WebkitTransform = "rotate(" + angle + "deg) translate(" + this.options.distance + "px) rotate(-" + angle + "deg) scale(1)";
    }
  };


}
