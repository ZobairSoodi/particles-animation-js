let circles = [];
let logo;
let timer = 1000;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 50; i++) {
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

  timer += 1000 / frameRate() * random(3);
  if (timer > 1000) {
    for (let i = 0; i < 5; i++) {
      let isStarChosen = false;
      while (!isStarChosen) {
        let chosenStar = random([...circles]);
        if (chosenStar.isGlowing === false) {
          chosenStar.isGlowing = true;
          isStarChosen = true;
        }
      }
      timer = 0;
    }
  }

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
    this.opacity = 70;
    this.isGlowing = false;
    this.isFading = false;
    this.glowOpacity = 0;
  }

  display() {
    noStroke();
    fill(255, 255, 255, this.opacity);
    for (let i = 1; i < 5; i++) {
      ellipse(this.x, this.y, this.r * i / 2);
    }

    if (this.isGlowing) {
      this.glowOpacity += 2;
      fill(255, 255, 255, this.glowOpacity);
      ellipse(this.x, this.y, this.r * 1.5);
      star(this.x, this.y, this.r * 2, this.r / 2, 4);
      fill(255, 255, 255, this.glowOpacity / 2);
      star(this.x, this.y, this.r * 3, this.r, 4);
      fill(255, 255, 255, this.glowOpacity / 4);
      star(this.x, this.y, this.r * 2, this.r * 2, 4);
      if (this.glowOpacity >= 150) {
        this.isGlowing = false;
        this.isFading = true;
      }
    }
    else if (this.isFading) {
      this.glowOpacity -= 5;
      fill(255, 255, 255, this.glowOpacity);
      ellipse(this.x, this.y, this.r * 1.5)
      star(this.x, this.y, this.r * 3, this.r / 4, 4);
      if (this.glowOpacity <= 0) {
        this.isFading = false;
      }
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}