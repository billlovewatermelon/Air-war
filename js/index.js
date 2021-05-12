var app = document.querySelector("#app");
// 获取主界面节点
var gameContain = document.querySelector(".game-contain");
// 获取按钮
var btns = gameContain.querySelectorAll("button");
console.log(btns);
// 获取游戏背景节点
var gameBack = document.querySelector(".game-back");
// 获取分数节点
var score = document.querySelector(".score");
console.log(score)
// 获取评分界面的节点
var restart = document.querySelector("#start");
var boxOffsetLeft = app.offsetLeft;
var boxOffsetTop = app.offsetTop;
// 动画浏览器兼容
window.requestAnimationFrame =
  window.requestAnimationFrame ||
  function (fn) {
    return setTimeout(fn, 1000 / 60);
  };
window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;
// 关卡选择
function checkPoint() {
  for (let i = 0; i < btns.length; i++) {
    // 给关卡绑定点击事件，调用开始游戏函数
    btns[i].addEventListener("click", function (ev) {
      ev = ev || window.event;
      console.log(i);
      startGame(i, {
        x: ev.clientX - boxOffsetLeft,
        y: ev.clientY - boxOffsetTop,
      });
    });
  }
}
checkPoint();
// 游戏开始的函数
function startGame(i, pos) {
  bgMove(i);
  hide();
  var p = aircraft(i, pos);
  EnemyAircraft(i,p);
  app.score = 0;
}
// 背景切换，背景移动
function bgMove(i) {
  gameBack.style.backgroundImage = "url('img/bg_" + (i + 1) + ".jpg')";
  gameBack.style.backgroundSize = "contain";
  //  背景移动，requestAnimationFrame()向浏览器请求执行动画
  (function m() {
    i++;
    gameBack.style.backgroundPositionY = i + "px";
    gameBack.bgTimer = requestAnimationFrame(m);
  })();
}
// 隐藏关卡选项
function hide() {
  gameContain.style.display = "none";
  score.style.display = "block";
}
// 创建我军飞机
function aircraft(i, pos) {
  console.log(pos);
  var aircraftImg = new Image();
  // 给飞机添加一个class属性,做绝对定位
  aircraftImg.setAttribute("class", "aircraft");
  if (i >= 2) {
    aircraftImg.src = "./img/plane_1.png";
  } else {
    aircraftImg.src = "./img/plane_0.png";
  }
  gameBack.appendChild(aircraftImg);
  aircraftImg.width = 70;
  aircraftImg.height = 70;
  // 拿到飞机出现的位置
  aircraftImg.style.left = pos.x - aircraftImg.width / 2 + "px";
  aircraftImg.style.top = pos.y - aircraftImg.height / 2 + "px";
  // 给飞机添加移动事件，以及飞机边界的限制
  document.addEventListener("mousemove", function (ev) {
    ev = ev || window.event;
    var left = ev.clientX - boxOffsetLeft - aircraftImg.width / 2;
    var top = ev.clientY - boxOffsetTop - aircraftImg.width / 2;
    // 飞机出现在游戏界面x轴最大的范围限制
    var leftMax = gameBack.clientWidth - aircraftImg.width / 2;
    // 飞机出现在游戏界面x轴最小的范围限制
    var leftMin = -aircraftImg.width / 2;
    // 飞机出现在游戏界面y轴最大的范围限制
    var topMax = gameBack.clientHeight - aircraftImg.height / 2;
    // 飞机出现在游戏界面y轴最小的范围限制
    var topMin = 0;
    left = Math.max(left, leftMin);
    left = Math.min(left, leftMax);
    // console.log(left);
    top = Math.max(top, topMin);
    top = Math.min(top, topMax);
    aircraftImg.style.left = left + "px";
    aircraftImg.style.top = top + "px";
  });
  bullet(aircraftImg, i);
  return aircraftImg;
}
// 创建我军子弹
var biuall = document.querySelector("#BiuAll");
function bullet(aircraftImg, i) {
  // 根据难度动态生成子弹
  app.timer = setInterval(() => {
    // score = 1000;
    if ( app.score >= 1000) {
      creatbullet(true, -1);
      creatbullet(true, 0);
      creatbullet(true, 1);
    } else if ( app.score >= 500) {
      creatbullet(true, -1);
      creatbullet(true, 1);
    } else {
      creatbullet(true, 0);
    }
  }, [200, 150, 100, 15][i]);
  // 生成子弹(flag,d代表出现几个子弹数)
  var creatbullet = (flag, d) => {
    var bulletImg = new Image();
    bulletImg.src = "./img/fire.png";
    bulletImg.width = 30;
    bulletImg.height = 30;
    bulletImg.setAttribute("class", "bullet");
    // 设置子弹出现的位置
    var left =
      aircraftImg.offsetLeft + aircraftImg.width / 2 - bulletImg.width / 2;
    var top = aircraftImg.offsetTop - bulletImg.height + 5;
    if (flag) {
      left += bulletImg.width * d;
    }
    bulletImg.style.left = left + "px";
    bulletImg.style.top = top + "px";
    biuall.appendChild(bulletImg);
    // 子弹发射
    function move() {
      var top = bulletImg.offsetTop - 20;
      // 当子弹发射到我们游戏界面的最上面的时候就移除子弹
      if (top < -bulletImg.height) {
        // console.log(bulletImg.height);
        biuall.removeChild(bulletImg);
      } else {
        bulletImg.style.top = top + "px";
        requestAnimationFrame(move);
      }
    }
    setTimeout(function () {
      requestAnimationFrame(move);
    }, 50);
    // move();
  };
}
// 创建敌军飞机
function EnemyAircraft(i,ownplane) {
  // num是计数器,代表小飞机
  var num = 1;
  app.EnemyInterval = setInterval(() => {
    var EnemyImg = new Image();
    // 设置大小敌机出场的比例
    var index = num % 30 ? 1 : 0;
    EnemyImg.index = index;
    // 设置大小敌机的血量
    EnemyImg.HP = [20, 1][index];
    // 设置大小敌机的宽高
    EnemyImg.setAttribute("class", "EnemyImg");
    EnemyImg.width = [104, 54][index];
    EnemyImg.height = [80, 40][index];
    // 设置敌机降落速度
    var speed = [5, 6, 7, 8][i];
    // 设置飞机不同的下降速度
    EnemyImg.speed = speed + (Math.random() * 0.6 - 0.3)* speed;
    // 设置大小飞机不同的下降速度
    EnemyImg.speed *= index ? 1 : 0.5;
    // console.log(EnemyImg.speed);
    EnemyImg.src = "img/enemy_" + ["big", "small"][index] + ".png";
    // 设置敌机默认出现的位置
    EnemyImg.style.left =
      Math.random() * gameBack.clientWidth - EnemyImg.width / 2 + "px";
    EnemyImg.style.top = -EnemyImg.height + "px";
    gameBack.appendChild(EnemyImg);
    num++;
    // 设置敌机偏移
    function enemyMove() {
      if (EnemyImg.parentNode) {
        //敌机往下偏移的总值
        var top = EnemyImg.offsetTop;
        // console.log(top);
        // 设置敌机的偏移值
        top += EnemyImg.speed;
        if (top >= gameBack.clientHeight) {
          app.score--;
          score.innerHTML = app.score;
          gameBack.removeChild(EnemyImg);
        } else {
          EnemyImg.style.top = top + "px";
          // 找到所有的子弹
          var allBullet = biuall.children;
          // 子弹碰撞检测
          for (var i = allBullet.length - 1; i >= 0; i--) {
            var objBullet = allBullet[i];
            // 如果子弹碰撞到敌军的飞机，子弹消失，对应的敌机血量就要减少
            if (collide(EnemyImg, objBullet)) {
              biuall.removeChild(objBullet);
              EnemyImg.HP--;
              if (!EnemyImg.HP) {
                app.score+=EnemyImg.index?2:20;
                score.innerHTML = app.score;
                blast(EnemyImg.offsetLeft,EnemyImg.offsetTop,EnemyImg.width,EnemyImg.height,index?0:2);
                gameBack.removeChild(EnemyImg);
                return;
              }
            }
          }
          // 我军碰撞检测
          if(ownplane.parentNode && collide(EnemyImg,ownplane)){
            // 敌军爆炸
            blast(EnemyImg.offsetLeft,EnemyImg.offsetTop,EnemyImg.width,EnemyImg.height,index?0:2);
            // 我军爆炸
            blast(ownplane.offsetLeft,ownplane.offsetTop,ownplane.width,ownplane.height,1);
            gameBack.removeChild(EnemyImg);
            gameBack.removeChild(ownplane);
            GameOver();
            return
          }
          requestAnimationFrame(enemyMove);
        }
      }
    }
    requestAnimationFrame(enemyMove);
  }, [350, 150, 120, 40][i]);
}
// 碰撞检测
function collide(obj1, obj2) {
  var t1 = obj1.offsetTop,
    b1 = t1 + obj1.clientHeight,
    l1 = obj1.offsetLeft,
    r1 = l1 + obj1.clientWidth;
  var t2 = obj2.offsetTop,
    b2 = t2 + obj2.clientHeight,
    l2 = obj2.offsetLeft,
    r2 = l2 + obj2.clientWidth;
  // 判断不会碰撞到的条件
  return !(b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2);
}
// 爆炸
function blast(left,top,width,height,t){
    var blastImg = new Image;
    blastImg.src = "img/"+["boom_small","plane_0","boom_big"] [t]+".png";
    blastImg.className = "blast"+['',2,''][t];
    blastImg.width = width;
    blastImg.height = height;
    blastImg.style.left = left+'px';
    blastImg.style.top = top+'px';
    gameBack.appendChild(blastImg);
    setTimeout(function(){
      blastImg.parentNode && gameBack.removeChild(blastImg);
  },[1200,2500,1200][t]);
}
 //游戏结束
 function GameOver(){
  document.onmousemove = null; //清除移动事件
  clearInterval(app.timer);//不再产生新子弹
  clearInterval(app.EnemyInterval);//不再产生新敌军
  restart2();
}
var allReChild = restart.children;
console.log(allReChild);
function restart2(){
  score.style.display = "none";

  var s = app.score;
  var honor;

  if ( s < -300 ){
      honor = "闪避+MAX！！！";
  }else if ( s < 10 ){
      honor = "菜得…算了我不想说了…";
  }else if ( s < 30 ){
      honor = "抠脚侠！";
  }else if ( s < 100 ){
      honor = "初级飞机大师";
  }else if ( s < 200 ){
      honor = "渐入佳境";
  }else if ( s < 500 ){
      honor = "中级飞机大师";
  }else if ( s < 1000 ){
      honor = "高级飞机大师";
  }else if ( s < 5000 ){
      honor = "终极飞机大师";
  }else{
      honor = "孤独求败！";
  }
  restart.style.display = "block";
  allReChild[0].children[0].innerHTML = s;
  allReChild[1].children[0].innerHTML = honor;
}
// 重新开始
allReChild[2].addEventListener('click',function(ev){
  cancelAnimationFrame(gameBack.bgTimer);//停止背景滚动
  restart.style.display = "none";
  gameContain.style.display = "block";
  score.innerHTML = 0;
  gameBack.innerHTML = "<div id='BiuAll'></div>"
  biuall = document.getElementById("BiuAll");
  console.log(biuall);
  allBiu = biuall.children;
})


