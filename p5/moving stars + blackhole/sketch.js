let stars = [];
let logo;
let timer = 1000;
let sliderSpeed;
let selectNumber;
let blackHole = undefined;
let idCount = 0;

function restart() {
  background('#222629');
  stars = [];
  for (let i = 0; i < selectNumber.value(); i++) {
    stars.push(new Star());
  }
  logo = loadImage('logo-dark.svg');
  selectNumber.changed(() => {
    restart();
  })
}

function setup() {
  let myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent("canvas-parent");
  sliderSpeed = createSlider(0.2, 2, 0.01);
  sliderSpeed.position(20, 5);
  selectNumber = createSelect("dsd");
  selectNumber.position(sliderSpeed.x + sliderSpeed.width + 20, 5)
  selectNumber.option(30);
  selectNumber.option(40);
  selectNumber.option(50);
  selectNumber.option(60);
  selectNumber.option(70);
  selectNumber.selected(50);
  restart();
}

function draw() {
  background('#222629');
  fill('white');
  stars.forEach((s) => {
    s.display();
    s.move();
  })

  timer += 1000 / frameRate() * random(3);
  if (timer > 1000) {
    for (let i = 0; i < 5; i++) {
      let isStarChosen = false;
      while (!isStarChosen) {
        let chosenStar = random([...stars]);
        if (!chosenStar.isGlowing && !chosenStar.isCaptured) {
          chosenStar.isGlowing = true;
          isStarChosen = true;
        }
      }
      timer = 0;
    }
  }

  if (blackHole) {
    blackHole.display();
  }

  // let imgWidth = 200;
  // let imgHeight = 200;
  // image(logo, width / 2 - imgWidth / 2, height / 2 - imgHeight / 2, imgWidth, imgHeight);
}

class Star {
  constructor() {
    this.pos = createVector(random(width), random(height))
    this.reset();
    this.id = idCount++;
  }

  display() {
    noStroke();
    fill(255, 255, 255, this.opacity);
    for (let i = 1; i < 5; i++) {
      ellipse(this.pos.x, this.pos.y, this.r * i / 2);
    }

    if (this.isGlowing) {
      this.glowOpacity += 2;
      fill(255, 255, 255, this.glowOpacity);
      ellipse(this.x, this.y, this.r * 1.5);
      star(this.pos.x, this.pos.y, this.r * 2, this.r / 2, 4);
      fill(255, 255, 255, this.glowOpacity / 2);
      star(this.pos.x, this.pos.y, this.r * 3, this.r, 4);
      fill(255, 255, 255, this.glowOpacity / 4);
      star(this.pos.x, this.pos.y, this.r * 2, this.r * 2, 4);
      if (this.glowOpacity >= 150) {
        this.isGlowing = false;
        this.isFading = true;
      }
    }
    else if (this.isFading) {
      this.glowOpacity -= 5;
      fill(255, 255, 255, this.glowOpacity);
      ellipse(this.pos.x, this.pos.y, this.r * 1.5)
      star(this.pos.x, this.pos.y, this.r * 3, this.r / 4, 4);
      if (this.glowOpacity <= 0) {
        this.isFading = false;
      }
    }
  }

  move() {
    if(this.isCaptured){
      let index = stars.findIndex(star=>star.id === this.id);
      stars.splice(index, 1);
      let s = new Star();
      s.pos.x = width + 3;
      s.pos.y = random(height);
      stars.push(s);
    }
    if ((blackHole) && (blackHole.pos.dist(this.pos) - blackHole.r < 100)) {
      let distance = p5.Vector.sub(blackHole.pos, this.pos).setMag(0.05);
      if (this.isCaptured) {
        this.pos = blackHole.pos;
        return;
      }
      else if (blackHole.pos.dist(this.pos) < 20) {
        this.isCaptured = true;
        blackHole.numStars++;
      }
      else {
        this.vel.add(distance);
      }

    }
    // else {
    // this.vel.mult(sliderSpeed.value());
    let speed = p5.Vector.mult(this.vel, createVector(sliderSpeed.value(), 1));
    this.pos.add(speed);
    if ((this.pos.x < - 5) || (this.pos.x > width + 5) || (this.pos.y > height + 5) || (this.pos.y < - 5)) {
      this.pos.x = width + 3;
      this.pos.y = random(height);
      this.reset();
    }
    // }

  }

  reset() {
    this.r = random(2, 5);
    this.vel = createVector(-(this.r / 8) * random(0.8, 1.2), 0);
    this.acc = p5.Vector.random2D();
    this.opacity = 70;
    this.isGlowing = false;
    this.isFading = false;
    this.glowOpacity = 0;
    this.isCaptured = false;
    this.isDestroyed = false;
  }
}

class BlackHole {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
    this.numStars = 0;
    this.auraWidth = 0;
    this.isGlowing = true;
    this.isGrowing = true;
    this.growth = 0;
  }

  display() {
    noStroke();
    if (this.isGrowing) {
      this.growth += 20 / this.r;
      this.handleAura(this.growth);
      fill("black");
      ellipse(this.pos.x, this.pos.y, this.growth /*+ (this.numStars * 5)*/);
      if (this.growth >= this.r) {
        this.isGrowing = false;
      }
    }
    else {
      this.handleAura(this.r);
      fill("black");
      ellipse(this.pos.x, this.pos.y, this.r /*+ (this.numStars * 5)*/);
    }
  }

  handleAura(radius) {
    if (this.auraWidth > 3) {
      this.isGlowing = false;
    }
    else if (this.auraWidth <= 0) {
      this.isGlowing = true;
    }
    if (this.isGlowing) {
      for (let i = 0; i < 5; i++) {
        fill(200, 100, 0, 200 / i);
        ellipse(this.pos.x, this.pos.y, radius + (i * 3) + this.auraWidth);
      }
      this.auraWidth += 0.07;
    }
    else {
      for (let i = 0; i < 5; i++) {
        fill(200, 100, 0, 200 / i);
        ellipse(this.pos.x, this.pos.y, radius + (i * 3) + this.auraWidth);
      }
      this.auraWidth -= 0.07;
    }
  }
}

function mouseClicked() {
  if (blackHole === undefined) {
    blackHole = new BlackHole(mouseX, mouseY, 30);
  }
  else {
    let mouseDist = createVector(mouseX, mouseY).dist(blackHole.pos);
    if(mouseDist < (blackHole.r / 2) + blackHole.auraWidth){
      blackHole = undefined;
    }
  }
}


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