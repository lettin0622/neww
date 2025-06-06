// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

let font;
let camSize, camX, camY;
let gameStarted = false;

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
  // 如果有字型檔案可用以下方式載入
  // font = loadFont('YourFont.ttf');
}

function mousePressed() {
  // 點擊開始按鈕時，啟動遊戲
  if (!gameStarted) {
    // 檢查滑鼠是否在按鈕範圍內
    if (
      mouseX > width / 2 - 60 &&
      mouseX < width / 2 + 60 &&
      mouseY > height - 100 &&
      mouseY < height - 50
    ) {
      gameStarted = true;
    }
  }
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  // 若有字型，避免未載入錯誤
  if (font && font.font && textFont) {
    textFont(font);
  }
  background('#edf6f9');
  camSize = min(width, height) * 0.7;
  camX = (width - camSize) / 2;
  camY = (height - camSize) / 2;

  fill(0);
  textSize(36);
  textAlign(CENTER, TOP);
  text("淡江大學教育科技系", width / 2, 20);

  stroke(0);
  strokeWeight(2);
  fill(255);
  rect(camX, camY, camSize, camSize, 20);
  image(video, camX, camY, camSize, camSize);

  if (!gameStarted) {
    drawStartButton();
    return;
  }

  // 只偵測兩隻手的食指，並將座標對應到攝影機區域
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 找出食指 keypoint（名稱可能是 "index_finger_tip" 或 "indexFinger"）
        let indexKeypoint = hand.keypoints.find(
          kp => kp.name === "index_finger_tip" || kp.part === "indexFinger"
        );
        if (indexKeypoint) {
          // 左手紫色，右手黃色
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }
          noStroke();
          // 將座標對應到攝影機區域
          circle(
            map(indexKeypoint.x, 0, video.width, camX, camX + camSize),
            map(indexKeypoint.y, 0, video.height, camY, camY + camSize),
            20
          );
        }
      }
    }
  }
}

// 畫開始按鈕
function drawStartButton() {
  fill('#00b4d8');
  rect(width / 2 - 60, height - 100, 120, 50, 10);
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("開始遊戲", width / 2, height - 75);
}
