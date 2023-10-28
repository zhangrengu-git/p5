class Particle {
  constructor(x, y, xOffset, yOffset) {
    // Initialize particle properties
    this.loc = createVector(x, y);

    // Generate a random angle and set velocity
    let randDegrees = random(360);
    this.vel = p5.Vector.fromAngle(radians(randDegrees));
    this.vel.mult(random(5));

    // Initialize acceleration, lifespan, and other properties
    this.acc = createVector(0, 0);
    this.lifeSpan = int(random(30, 90));
    this.decay = random(0.75, 0.9);
    this.c = color(random(255), random(255), 255);
    this.weightRange = random(3, 50);

    // Offset values for noise function
    this.xOffset = xOffset;
    this.yOffset = yOffset;

    // Initialize life tracking variables
    this.passedLife = 0;
    this.dead = false;
  }

  update() {
    // Check if particle has exceeded its lifespan
    if (this.passedLife >= this.lifeSpan) {
      this.dead = true;
    } else {
      this.passedLife++;
    }

    // Calculate alpha and weight based on particle's lifespan
    this.alpha = ((this.lifeSpan - this.passedLife) / this.lifeSpan) * 70 + 50;
    this.weight =
      ((this.lifeSpan - this.passedLife) / this.lifeSpan) * this.weightRange;

    // Reset acceleration vector
    this.acc.set(0, 0);

    // Calculate noise-based direction and magnitude
    let rn =
      (noise(
        (this.loc.x + frameCount + this.xOffset) * 0.01,
        (this.loc.y + frameCount + this.yOffset) * 0.01
      ) -
        0.5) *
      Math.PI *
      4;
    let mag = noise(
      (this.loc.y - frameCount) * 0.01,
      (this.loc.x - frameCount) * 0.01
    );
    let dir = p5.Vector.fromAngle(rn);
    dir.mult(mag);
    this.acc.add(dir);

    // Add a random vector for additional randomness
    let randRn = random(Math.PI * 2);
    let randV = p5.Vector.fromAngle(randRn);
    randV.mult(0.25);
    this.acc.add(randV);

    // Update velocity, apply decay, and limit speed
    this.vel.add(this.acc);
    this.vel.mult(this.decay);
    this.vel.limit(3);

    // Update particle's position
    this.loc.add(this.vel);
  }

  display() {
    // Draw the particle with a dynamic stroke weight and alpha
    strokeWeight(this.weight + 1.5);
    stroke(0, this.alpha);
    point(this.loc.x, this.loc.y);

    // Draw the particle with its color and weight
    strokeWeight(this.weight);
    stroke(this.c);
    point(this.loc.x, this.loc.y);
  }
}

// Declare variables
let pts; // Array to store particles
let onPressed,
  showInstruction = true; // Flags for mouse and instruction display
let f; // Unused variable (may be removed)
let song; // Variable to store the song
let isPlaying = false;

function preload() {
  song = loadSound("test.wav");
}

function setup() {
  // Create a canvas to fill the entire window

  createCanvas(windowWidth, windowHeight);

  // Set drawing parameters
  smooth();
  colorMode(HSB);
  rectMode(CENTER);

  // Initialize the array for particles
  pts = [];
  
  // Set the background color to white
  background(255);
}

function draw() {
  
  // Create new particles when the mouse is pressed
  if (onPressed) {
    if(!song.isPlaying()){
      song.play();
    }
    isPlaying = true;
    for (let i = 0; i < 10; i++) {
      let newP = new Particle(mouseX, mouseY, i + pts.length, i + pts.length);
      pts.push(newP);
    }
  }

  // Update and display existing particles
  for (let i = pts.length - 1; i >= 0; i--) {
    let p = pts[i];
    if (p.dead) {
      pts.splice(i, 1);
      if (pts.length === 0) {
        isPlaying = false;
        song.stop();
      }
    } else {
      p.update();
      p.display();
    }
  }
  
}

function mousePressed() {
  // Set the mouse pressed flag to true
  onPressed = true;

  // If the instruction is shown, clear the background and hide the instruction
  // if (showInstruction) {
  //   background(255);
  //   showInstruction = false;
  // }
}

function mouseReleased() {
  // Set the mouse pressed flag to false when the mouse is released
  onPressed = false;
}

function keyPressed() {
  if (key === "a") {
    // If the 'a' key is pressed, remove all particles
    for (let i = pts.length - 1; i >= 0; i--) {
      pts.splice(i, 1);
    }

    // Clear the background to reset the canvas
    background(255);
  }
}
