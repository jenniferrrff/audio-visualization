let song;
let fft;
let img;

function preload() {
    song = loadSound("audio/sample-visualisation.mp3");
    img = loadImage("image/pinkcloud.jpg");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    fft = new p5.FFT();
    song.play();
}

function draw() {
    background(255);

    // Display the image
    image(img, width / 2, height / 2, width, height);

    // Get the amplitude values from the FFT
    let spectrum = fft.analyze();

    // Draw the spectrum as vertical bars
    for (let i = 0; i < spectrum.length; i++) {
        let amp = spectrum[i];
        let y = map(amp, 0, 256, height, 0);
        fill(i, 255, 255);
        rect(i * (width / spectrum.length), y, width / spectrum.length, height - y);
    }
}

function mouseClicked() {
    if (song.isPlaying()) {
        song.pause();
    } else {
        song.play();
    }
}
