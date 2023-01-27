p5.disableFriendlyErrors = true;

let stars = [];
let shootingStars = [];
let timer = 1000;
let blackHole = undefined;
let idCount = 0;
let numStars = 150;
let starCooldown = 1000;

function setup() {
  let myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent("canvas-parent");
  background('#222629');

  for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
  }
}

function draw() {
  background('black');
  fill('white');

  if (millis() > starCooldown) {
    shootingStars.push(new ShootingStar());
    starCooldown = millis() + random(3000, 10000);
  }

  if(mouseIsPressed && floor(millis()) % 5 === 0 ){
    shootingStars.push(new ShootingStar());
  }

  shootingStars.forEach((ss) => {
    ss.display();
    ss.move();
  })

  stars.forEach((s) => {
    s.display();
  });

  // Draw FPS (rounded to 2 decimal places) at the bottom left of the screen
  let fps = frameRate();
  fill(255);
  stroke(0);
  text("FPS: " + fps.toFixed(2), 10, height - 10);
}

class Star {
  constructor() {
    this.id = idCount++;
    this.pos = createVector(random(width), random(height))
    this.r = random(1, 3);
    this.opacity = 100;
    this.glowCounter = 0;
    this.makeGlow = random(0, 1000);
    this.isGlowing = false;
    this.isFading = false;
    this.glowOpacity = 0;
  }

  display() {
    this.glowCounter++;
    if (this.glowCounter >= this.makeGlow) {
      this.isGlowing = true;
      this.makeGlow = random(0, 1000);
    }
    noStroke();
    fill(255, 255, 255, this.opacity);
    for (let i = 1; i < 5; i++) {
      ellipse(this.pos.x, this.pos.y, this.r * i / 2);
    }

    if (this.isGlowing) {
      this.glowCounter = 0;
      this.glowOpacity += 1;
      fill(255, 255, 255, this.glowOpacity);
      ellipse(this.x, this.y, this.r * 1.5);
      star(this.pos.x, this.pos.y, this.r * 4, this.r / 2, 4);
      fill(255, 255, 255, this.glowOpacity / 2);
      star(this.pos.x, this.pos.y, this.r * 4, this.r, 4);
      fill(255, 255, 255, this.glowOpacity / 4);
      star(this.pos.x, this.pos.y, this.r * 5, this.r * 2, 4);
      if (this.glowOpacity >= 150) {
        this.isGlowing = false;
        this.isFading = true;
      }
    }
    else if (this.isFading) {
      this.glowOpacity -= 2;
      fill(255, 255, 255, this.glowOpacity);
      ellipse(this.pos.x, this.pos.y, this.r * 1.5)
      star(this.pos.x, this.pos.y, this.r * 4, this.r, 4);
      if (this.glowOpacity <= 0) {
        this.isFading = false;
      }
    }
  }
}

class ShootingStar extends Star {
  constructor() {
    super();
    this.r = random(2, 5);
    this.pos = createVector(random(- height / 2, width * 0.8), 0);
    this.vel = p5.Vector.fromAngle(radians(random(45, 50)), 1);
  }
  display() {
    noStroke();
    fill(255, 255, 255, this.opacity);
    let dir;
    for (let i = 1; i < 10; i += 1) {
      dir = this.vel.setMag(i * 3);
      ellipse(this.pos.x + dir.x, this.pos.y + dir.y, this.r * i / 3);
    }
  }
  move() {
    this.pos.add(this.vel.setMag(this.r * 5));
    if ((this.pos.x < - 30) || (this.pos.x > width + 30) || (this.pos.y > height + 30) || (this.pos.y < - 30)) {
      let index = shootingStars.findIndex(item => item.id === this.id);
      shootingStars.splice(index, 1);
    }
  }
}

// function mouseClicked() {
//   let pos = createVector(mouseX, mouseY);
//   let vel = p5.Vector.fromAngle(radians(50), 2);
//   let shootingStar = new ShootingStar(pos, vel);
//   shootingStars.push(shootingStar);
// }

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function star(x, y, r1, r2, numPoints) {
  let angle = TWO_PI / numPoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * r2;
    let sy = y + sin(a) * r2;
    vertex(sx, sy);
    sx = x + cos(a + angle / 2) * r1;
    sy = y + sin(a + angle / 2) * r1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}