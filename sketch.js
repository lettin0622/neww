// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
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
  image(video, 0, 0);

  // 只偵測兩隻手的食指
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
          circle(indexKeypoint.x, indexKeypoint.y, 20);
        }
      }
    }
  }
}
