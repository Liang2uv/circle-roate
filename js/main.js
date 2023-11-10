/**
 * 首页圆球转动特效
 */

// canvas 元素的宽度和高度
const width = 620;
const height = 730;
const canvas = document.getElementById("circle-canvas");
const pNode = document.getElementById("circle-canvas-bg");
canvas.width = width;
canvas.height = height;
const ctx = document.getElementById("circle-canvas").getContext("2d");  // 上下文

const cx = width / 2; // 圆半径
const size = 1.5; // 点大小
const colors = ['rgba(51, 96, 140, .9)', 'rgba(51, 96, 140, .3)', 'rgba(51, 96, 140, 0)'];  // 点颜色
const num = cx / (size + 4);  // 每条线的点数量
const distance = cx / num; // 点和点的距离
const lineNum = 200;  // 线总数
const lines = []; // 线示例对象集合
const moveLength = Math.floor(num / 3); // 线移动的最大距离
const speed = 80; // 移动速度，值越小移动越快
let lastTime = 0; // 时间戳

// 以下是向上位移的文字的相关属性
const fontArr = [];  //  文字数组
const fontSize = [20, 10, 12, 8, 6];  // 文字的大小
const fontColor = '#9df6e2';  // 文字颜色
const fontFamily = '造字工房悦黑粗体';  // 文字字体
const fontNum = 5;  // 文字列数量
const fontSpeed = 180;  // 文字列文字的变化速度，，值越小越快

// 随机数
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 点
class Dot {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  draw(color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath()
  }

  clear() {
    this.draw('rgba(0, 0, 0, 0)');
  }

}

// 线
class Line {
  constructor(angle) {
    this.angle = angle; // 线的角度
    this.propArr = [];  // 点属性集合
    this.dotArr = []; // 点示例对象集合
    this.moveNum = random(0, num - 1);  // 向内移动距离（单位：点）
    this.flag = true; // 移动方向：true-向内，false-向外
  }

  init() {
    for (let i = 0; i < num; i++) {
      // 储存每个小球的属性
      this.propArr.push({
        x: cx + Math.cos(this.angle) * distance * i,
        y: cx + Math.sin(this.angle) * distance * i,
        color: colors[random(0, colors.length - 1)]
      })
      // 储存小球实例
      const dot = new Dot(this.propArr[i].x, this.propArr[i].y);
      this.dotArr.push(dot);
    }
  }

  move() {
    for (let i = 0; i < num; i++) {
      if (i >= num - this.moveNum) {
        this.dotArr[i].clear();
      } else {
        this.dotArr[i].draw(this.propArr[i + this.moveNum].color);
      }
    }
    if (this.flag) {
      this.moveNum = this.moveNum + 1;
    } else {
      this.moveNum = this.moveNum - 1;
    }
    if (this.moveNum >= moveLength) {
      this.flag = false;
    } else if (this.moveNum <= 0) {
      this.flag = true;
    }
  }

}

// 单个文字
class Font {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.value = random(0, 1).toString();
    this.time = 0;
  }

  draw() {
    ctx.font = `${this.size}px ${fontFamily}`;
    ctx.fillStyle = fontColor;
    ctx.fillText(this.value, this.x, this.y);
  }

  move() {
    this.y = this.y - 3;
    if (this.y <= 540) {
      this.y = height;
    }
    const d = Date.now();
    if (d - this.time > fontSpeed) {
      this.time = d;
      this.value = random(0, 1).toString();
    }
    this.draw();
  }
}

// 文字列
class FontLine {
  constructor(x, size) {
    this.x = x;
    this.y = random(height - 100, height + 100);
    this.size = size;
    this.arr = [];
  }
  init() {
    for (let i = 0; i < 5; i++) {
      const font = new Font(this.x, this.y + i * this.size, this.size);
      font.draw();
      this.arr.push(font)
    }
  }
  move() {
    for (let i = 0; i < this.arr.length; i++) {
      this.arr[i].move();
    }
  }
}

// 自适应
function resize() {
  // 为了避免回流重回带来的性能损耗，使用缩放自适应
  canvas.style.transformOrigin = '0 0';
  canvas.style.transform = `scale(${pNode.offsetWidth / width})`;
}

// 缩放监听，应该做节流处理，懒得做了
window.addEventListener('resize', () => {
  this.resize()
})


// 渲染动画
function render() {
  if (Date.now() - lastTime > speed) {
    lastTime = Date.now();
    ctx.clearRect(0, 0, width, height)
    for (let i = 0; i < lineNum; i++) {
      lines[i].move();
    }
    for (let i = 0; i < fontArr.length; i++) {
      fontArr[i].move();
    }
  }
  requestAnimationFrame(render);
}

// 开始
function start() {
  for (let i = 0; i < lineNum; i++) {
    const line = new Line(Math.PI * 2 / lineNum * i);
    line.init();
    lines.push(line)
  }
  for (let i = 0; i < fontNum; i++) {
    const f = new FontLine(200 + i * Math.floor(200 / fontNum), fontSize[random(0, fontSize.length - 1)]);
    f.init();
    fontArr.push(f);
  }
  resize();
  render();
}

window.onload = () => {
  start();
}



