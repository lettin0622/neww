// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

let font;
let camSize, camX, camY;
let gameStarted = false;

// 題庫與遊戲狀態
let questions = [
  {
    question: "淡江大學教育科技系的英文是?",
    options: ["TKUET", "TKUIT"],
    answer: 0
  },
  // 可繼續加入更多題目
];
let currentQuestion = 0;
let showResult = false;
let resultText = "";

// 秒數計時
let playStartTime = 0;
let playSeconds = 0;
let showFinalTime = false;

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
  // 如果有字型檔案可用以下方式載入
  // font = loadFont('YourFont.ttf');
}

function mousePressed() {
  // 點擊開始按鈕時，啟動遊戲
  if (!gameStarted) {
    if (
      mouseX > width / 2 - 60 &&
      mouseX < width / 2 + 60 &&
      mouseY > height - 100 &&
      mouseY < height - 50
    ) {
      gameStarted = true;
      playStartTime = millis();
      playSeconds = 0;
      currentQuestion = 0;
      showFinalTime = false;
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

  // 左上角顯示遊玩秒數
  fill(0);
  textSize(24);
  textAlign(LEFT, TOP);
  if (gameStarted && !showFinalTime) {
    playSeconds = int((millis() - playStartTime) / 1000);
  }
  text("秒數：" + playSeconds, 20, 20);

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

  // 顯示最終時間
  if (showFinalTime) {
    fill(0, 180);
    rect(0, 0, width, height);
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("全部答對！\n總秒數：" + playSeconds + " 秒", width / 2, height / 2);
    return;
  }

  // 顯示題目
  textSize(28);
  fill(0);
  textAlign(CENTER, TOP);
  text(questions[currentQuestion].question, width / 2, 60);

  // 顯示兩個答案方框
  let boxW = 180, boxH = 60;
  let boxY = height - 180;
  let box1X = width / 2 - 120;
  let box2X = width / 2 + 120 - boxW;

  fill(255, 255, 200, 180);
  stroke(200, 180, 80);
  rect(box1X, boxY, boxW, boxH, 15);
  rect(box2X, boxY, boxW, boxH, 15);

  fill(80, 80, 0);
  textSize(24);
  textAlign(CENTER, CENTER);
  text(questions[currentQuestion].options[0], box1X + boxW / 2, boxY + boxH / 2);
  text(questions[currentQuestion].options[1], box2X + boxW / 2, boxY + boxH / 2);

  // 只偵測兩隻手的食指，並將座標對應到攝影機區域
  if (hands.length > 0 && !showResult) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
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
          let px = map(indexKeypoint.x, 0, video.width, camX, camX + camSize);
          let py = map(indexKeypoint.y, 0, video.height, camY, camY + camSize);
          circle(px, py, 20);

          // 判斷是否碰到答案方框
          if (
            px > box1X && px < box1X + boxW &&
            py > boxY && py < boxY + boxH
          ) {
            checkAnswer(0);
          }
          if (
            px > box2X && px < box2X + boxW &&
            py > boxY && py < boxY + boxH
          ) {
            checkAnswer(1);
          }
        }
      }
    }
  }

  // 顯示答對/答錯
  if (showResult) {
    fill(0, 180);
    rect(0, 0, width, height);
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text(resultText, width / 2, height / 2);
  }
}

function checkAnswer(selected) {
  if (!showResult) {
    if (selected === questions[currentQuestion].answer) {
      resultText = "答對了！";
      setTimeout(() => {
        showResult = false;
        currentQuestion++;
        if (currentQuestion >= questions.length) {
          showFinalTime = true;
        }
      }, 1000);
    } else {
      resultText = "答錯囉！";
      setTimeout(() => {
        showResult = false;
      }, 1000);
    }
    showResult = true;
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
