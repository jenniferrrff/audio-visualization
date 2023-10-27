let song;
let fft;
let amplitudeSlider, panningSlider;
let bgImage;  // Variable to hold the sunset image

function preload() {
  song = loadSound('audio/sample-visualisation.mp3');
  bgImage = loadImage('sunset.jpg');  // Load the sunset image
}

function setup() {
  createCanvas(600, 400);
  fft = new p5.FFT();
  song.connect(fft);

  // Create sliders for user control
  amplitudeSlider = createSlider(0, 1, 0.5, 0.01);
  amplitudeSlider.position(10, height + 10);
  panningSlider = createSlider(-1, 1, 0, 0.01);
  panningSlider.position(10, height + 30);
}

function draw() {
  background(0);

  // Display the sunset image
  image(bgImage, 0, 0, width, height);

  if (getAudioContext().state !== 'running') {
    fill(255);
    text('Click to play', width / 2 - 50, height / 2);
    return;
  }

  let spectrum = fft.analyze();
  fill(0, 255, 0, 150);  // Added some transparency to see the image behind

  for (let i = 0; i < spectrum.length; i++) {
    let x = map(log(i), 0, log(spectrum.length), 0, width);
    let h = map(spectrum[i], 0, 255, 0, height);
    let rectangle_width = (log(i + 1) - log(i)) * (width / log(spectrum.length));
    rect(x, height, rectangle_width, -h);
  }

  let nyquist = 22050;
  let spectralCentroid = fft.getCentroid();
  let mean_freq_index = spectralCentroid / (nyquist / spectrum.length);
  let centroidplot = map(log(mean_freq_index), 0, log(spectrum.length), 0, width);

  stroke(255, 0, 0);
  rect(centroidplot, 0, width / spectrum.length, height);
  noStroke();
  fill(255);
  text('Centroid: ' + round(spectralCentroid) + ' Hz', 10, 20);

  // Adjust amplitude and panning based on sliders
  song.amp(amplitudeSlider.value());
  song.pan(panningSlider.value());
}

function mousePressed() {
  if (song.isPlaying()) {
    song.stop();
  } else {
    userStartAudio();  // Ensure audio starts in response to user interaction
    song.play();
  }
}
