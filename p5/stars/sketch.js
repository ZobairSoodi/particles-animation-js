let circles = [];
let logo;
let timer = 1000;
let sliderSpeed;
let selectNumber;

function restart(){
  background('#222629');
  circles = [];
  for (let i = 0; i < selectNumber.value(); i++) {
    circles.push(new Circle());
  }
  logo = loadImage('logo-dark.svg');
  selectNumber.changed(()=>{
    restart();
  })
}

function setup() {
  let myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent("canvas-parent");
  sliderSpeed = createSlider(1, 10, 0.01);
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

  // let imgWidth = 200;
  // let imgHeight = 200;
  // image(logo, width / 2 - imgWidth / 2, height / 2 - imgHeight / 2, imgWidth, imgHeight);
}

class Circle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.r = random(2, 5);
    this.speed = (this.r / 8) * random(0.8, 1.2);
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
    this.x -= this.speed * sliderSpeed.value();
    if (this.x < 0) {
      this.x = width;
      this.y = random(height);
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