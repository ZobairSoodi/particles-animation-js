let circles = [];
let logo;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 70; i++) {
    circles.push(new Circle());
  }
  logo = loadImage('logo-dark.svg');
}

function draw() {
  background('#111');
  fill('white');
  circles.forEach((c) => {
    c.display();
    c.move();
  })
  let imgWidth = 300;
  let imgHeight = 300;
  image(logo, width / 2 - imgWidth / 2, height / 2 - imgHeight / 2, imgWidth, imgHeight);
}

class Circle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.r = random(3, 6);
    this.speed = this.r / 5;
  }

  display() {
    noStroke();
    // fill(255);
    fill(255, 255, 100, 50);
    for (let i = 1; i < 5; i++) {
      ellipse(this.x, this.y, this.r * i/2);
    }
  }

  move() {
    this.x += this.speed;
    if (this.x > width) {
      this.x = 0;
      this.y = random(height);
    }
  }

}