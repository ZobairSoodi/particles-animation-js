let circles = [];
let master;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 200; i++) {
    circles.push(new Circle(100, 100, random(10, 5)));
  }
}

function draw() {
  background('#222');
  circles.forEach(c => {
    fill(255);
    noStroke();
    c.display();
    c.move();
  });
  fill(255);
  master = circle(mouseX, mouseY, 20);
}

class Circle {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
    this.vel = p5.Vector.random2D();
    this.vel.mult(r);
  }

  display() {
    circle(this.pos.x, this.pos.y, this.r);
  }

  move() {
    let mouse = createVector(mouseX, mouseY);
    this.acc = p5.Vector.sub(mouse, this.pos);
    this.acc.setMag(0.1);
    this.vel.add(this.acc);
    this.vel.limit(random([5, 10, 15]));
    this.pos.add(this.vel);
  }
}