const baseSize = 100;
function setRem() {
  const scale = window.innerWidth / 1920;
  document.documentElement.style.fontSize = baseSize * scale + "px";
}
// 初始化
setRem();
window.onresize = function() {
  setRem();
};