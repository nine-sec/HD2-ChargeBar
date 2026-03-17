const { ipcRenderer } = require('electron');
const iohook = require('iohook');

const fill = document.getElementById('fill');
const bar = document.getElementById('barContainer');

let charging = false;
let startTime = 0;
let renderMode = 0;
let rightMouseDown = false;


function updateBar() {
  // 根据渲染模式和右键状态控制显示
  if (renderMode === 0) {
    bar.style.display = 'none';
  } else if (renderMode === 1) {
    bar.style.display = rightMouseDown ? 'block' : 'none';
  } else {
    bar.style.display = 'block';
  }

  if (charging && bar.style.display !== 'none') {
    const elapsed = (Date.now() - startTime) / 1000;
    let ratio = Math.min(elapsed / 3, 1);
    fill.style.height = `${ratio * 100}%`;
    if (elapsed < 2) fill.style.backgroundColor = 'green';
    else if (elapsed < 2.5) fill.style.backgroundColor = 'yellow';
    else fill.style.backgroundColor = 'red';
  } else {
    fill.style.height = '0%';
    fill.style.backgroundColor = 'green';
  }

  requestAnimationFrame(updateBar);
}
updateBar();

iohook.on('mousedown', event => {
  if (event.button === 1) { 
    charging = true; 
    startTime = Date.now(); 
  }
  if (event.button === 2) { // 右键按下
    rightMouseDown = true;
  }
});

iohook.on('mouseup', event => {
  if (event.button === 1) charging = false;
  if (event.button === 2) rightMouseDown = false; // 右键松开
});

iohook.start();

ipcRenderer.on('toggle-render-mode', () => {
  renderMode = (renderMode + 1) % 3;
  const bar = document.getElementById('barContainer');
  if (bar) {
    if (renderMode === 2) bar.style.display = 'none';
    else bar.style.display = 'block';
  }
});