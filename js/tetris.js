var TETRIS_ROWS = 26, //游戏界面的行数
	TETRIS_COLS = 16, //游戏界面的列数
	CELL_SIZE = 26,	  //每个单元格的大小
	isPlaying = true;//游戏开始标志
//采用canvas来绘制游戏界面
var createCanvas = function(rows,cols,cellWidth,cellHeight){
	tetris_canvas = document.createElement("canvas");
	tetris_canvas.width = cols*cellWidth; //设置canvas组件的宽度
	tetris_canvas.height = rows*cellHeight; //设置canvas组件的高度
	tetris_canvas.style.border = "solid 1px black";// 设置canvas对象的边框
	tetris_ctx = tetris_canvas.getContext("2d");//获取绘图环境
	tetris_ctx.beginPath();//开始创建路径
	for(var i=1;i<=TETRIS_ROWS;i++){ //绘制横向网络对应的路径
		tetris_ctx.moveTo(0,i*CELL_SIZE);
		tetris_ctx.lineTo(TETRIS_COLS*CELL_SIZE,i*CELL_SIZE);
	}
	for(var i=1;i<=TETRIS_COLS;i++){ //绘制纵向网络对应的路径
		tetris_ctx.moveTo(i*CELL_SIZE,0);
		tetris_ctx.lineTo(i*CELL_SIZE,TETRIS_ROWS*CELL_SIZE);
	}
	tetris_ctx.closePath();
	tetris_ctx.strokeStyle = "#666";//设置线条颜色
	tetris_ctx.lineWidth = 0.3;//设置线条粗细
	tetris_ctx.stroke();//绘制线条
}
//设计游戏模块
// 定义几种可能出现的方块组合
var blockArr = [
//第一种可能出现的方块组合：Z
[{x:TETRIS_COLS/2-1,y:0,color:0},{x:TETRIS_COLS/2,y:0,color:0},
{x:TETRIS_COLS/2,y:1,color:0},{x:TETRIS_COLS/2+1,y:1,color:0}],
//第二种可能出现的组合：反Z
[{x:TETRIS_COLS/2+1,y:0,color:1},{x:TETRIS_COLS/2,y:0,color:1},
{x:TETRIS_COLS/2,y:1,color:1},{x:TETRIS_COLS/2-1,y:1,color:1}],
//第三种可能出现的组合：田
[{x:TETRIS_COLS/2-1,y:0,color:2},{x:TETRIS_COLS/2,y:0,color:2},
{x:TETRIS_COLS/2-1,y:1,color:2},{x:TETRIS_COLS/2,y:1,color:2}],
//第四种可能出现的组合：L
[{x:TETRIS_COLS/2-1,y:0,color:3},{x:TETRIS_COLS/2-1,y:1,color:3},
{x:TETRIS_COLS/2-1,y:2,color:3},{x:TETRIS_COLS/2,y:2,color:3}],
//第五种可能出现的组合：J
[{x:TETRIS_COLS/2,y:0,color:4},{x:TETRIS_COLS/2,y:1,color:4},
{x:TETRIS_COLS/2,y:2,color:4},{x:TETRIS_COLS/2-1,y:2,color:4}],
//第六种可能出现的组合：条
[{x:TETRIS_COLS/2,y:0,color:5},{x:TETRIS_COLS/2,y:1,color:5},
{x:TETRIS_COLS/2,y:2,color:5},{x:TETRIS_COLS/2,y:3,color:5}],
//第七种可能出现的组合：凸
[{x:TETRIS_COLS/2,y:0,color:6},{x:TETRIS_COLS/2-1,y:1,color:6},
{x:TETRIS_COLS/2,y:1,color:6},{x:TETRIS_COLS/2+1,y:1,color:6}]
];

//定义正在下落方块 正在下落的方块由四个小方块组成
var initBlock = function(){
	var rand = Math.floor(Math.random() * blockArr.length);
	currentFall = [{x:blockArr[rand][0].x,y:blockArr[rand][0].y,color:blockArr[rand][0].color},
	{x:blockArr[rand][1].x,y:blockArr[rand][1].y,color:blockArr[rand][1].color},
	{x:blockArr[rand][2].x,y:blockArr[rand][2].y,color:blockArr[rand][2].color},
	{x:blockArr[rand][3].x,y:blockArr[rand][3].y,color:blockArr[rand][3].color}];
}

//定义一个二维数组记录游戏界面上每个已经固定的方块的值(颜色)
var tetris_status = [];
for(var i=0;i<TETRIS_ROWS;i++){
	tetris_status[i]=[];
	for(var j=0;j<TETRIS_COLS;j++){
		tetris_status[i][j]="NO_BLOCK";
	}
}
// 定义一个颜色数组
var color = ["#f80359","#f8030e","#9903f8","#2bf92b","#6ff92b","#f9782a","#f94c2a"];
//控制方块往下掉
var moveDown = function(){
	var canDown = true; //定义一个标志
	for(var i=0;i<currentFall.length;i++){//遍历每个方块看是否能往下掉
		if(currentFall[i].y>=TETRIS_ROWS-1){//判断方块是否到达最底部
			canDown = false;
			break;
		}
		if(tetris_status[currentFall[i].y+1][currentFall[i].x] != "NO_BLOCK"){//判断该方块下是否还有方块
			canDown = false;
			break;
		}
	}
	if(canDown){
		//先将每个方块的背景色清除
		for(var i=0;i<currentFall.length;i++){
			var cur = currentFall[i];
			tetris_ctx.fillStyle = "white";
			//绘制矩形
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
			//每个小矩形宽高减二是为了预留边框线
		}
		//遍历每个方块让其下落(即每个方块的y坐标+1)
		for(var i=0;i<currentFall.length;i++){
			var cur = currentFall[i];
			cur.y ++;
		}
		//将下移后的方块涂上原来的颜色
		for(var i=0;i<currentFall.length;i++){
			var cur = currentFall[i];
			tetris_ctx.fillStyle = color[cur.color];//设置填充颜色
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}
	}else{//不能往下掉
		//遍历每个方块，将其记录到tetris_status数组中
		for(var i=0;i<currentFall.length;i++){
			var cur = currentFall[i];
			//如果已经有方块在最上面表明已经输了
			if(cur.y<2){
				//清空localStorage中当前的游戏积分，速度，游戏状态
				localStorage.removeItem("curScore");
				localStorage.removeItem("tetris_status");
				localStorage.removeItem("curSpeed");
				if(confirm("您已经输了！是否参数排名？")){
					//读取localStorage中的maxScore记录
				    maxScore = localStorage.getItem('maxScore');
					maxScore = maxScore == null?0:maxScore;
					//如果当前积分大于最高记录
					if(curScore>=maxScore){
						localStorage.setItem("maxScore",curScore);//记录最高分
					}
				}
				// 游戏结束
				isPlaying = false;
				//清除定时器
				clearInterval(curTimer);
				return;
			}
			//记录当前方块
			tetris_status[cur.y][cur.x] = cur.color;
		}
		//判断是否有可消除的行
		lineFull();
		//使用localStorage记录游戏状态
		localStorage.setItem("tetris_status",JSON.stringify(tetris_status));
		//开始一组新的方块
		initBlock();
	}
}
//绘制俄罗斯方块
var drawBlock = function(){
	for(var i=0;i<TETRIS_ROWS;i++){
		for(var j=0;j<TETRIS_COLS;j++){
			//有方块的地方绘制颜色
			if(tetris_status[i][j] != "NO_BLOCK"){
				//设置填充颜色
				tetris_ctx.fillStyle = color[tetris_status[i][j]];
				//绘制矩形
				tetris_ctx.fillRect(j*CELL_SIZE+1,i*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);

			}else{//没有方块的地方设置其颜色为白色
				tetris_ctx.fillStyle = "white";
				tetris_ctx.fillRect(j*CELL_SIZE+1,i*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
			}
		}
	}
}
//判断是否已经有一行已满
var lineFull = function(){
	//依次遍历每一行
	for(var i=0;i<TETRIS_ROWS;i++){
		var flag = true;
		//遍历当前单元格
		for(var j=0;j<TETRIS_COLS;j++){
			if(tetris_status[i][j] == "NO_BLOCK"){
				flag = false;
				break;
			}
		}
		if(flag){
			//将当前积分增加一百
			curScoreEle.innerHTML = curScore += 100;
			//记录当前积分
			localStorage.setItem("curScore",curScore);
			//如果当前积分已达到升级界限
			if(curScore>=curSpeed*curSpeed*500){
				curSpeedEle.innerHTML = curSpeed += 1;
				//使用localStorage记录当前速度
				localStorage.setItem("curSpeed",curSpeed);
				clearInterval(curTimer);
				var curTimer = SpeedsetInterval("moveDown();",500/curSpeed);
			}
			//把当前行所有方块下移一行
			for(var k=i;k>0;k--){
				for(var l=0;l<TETRIS_COLS;l++){
					tetris_canvas[k][l] = tetris_status[k-1][l];
				}
			}
			//消除方块后重新绘制一遍方块
			drawBlock();
		}
	}
}
//为按键绑定监听事件
window.onkeydown = function(e){
	var event = e || window.event; //事件兼容
	switch(event.keyCode){
		//按下了“下”键
		case 40: 
		if(!isPlaying)
			return;
		moveDown();
		break;
		//按下了“左”键
		case 37:
		if(!isPlaying)
			return;
		moveLeft();
		break;
		//按下了“右”键
		case 39:
		if(!isPlaying)
			return;
		moveRight();
		break;
		//按下了“上”键
		case 38:
		if(!isPlaying)
			return;
		rotate();
		break;
		default:confirm("请按正确的键！");
	}
}
// 方块左移函数
var moveLeft = function(){
	//定义是否能够左移的标志
	var canLeft = true;
	//遍历每一个方块看是否能够左移
	for(var i=0;i<currentFall.length;i++){
		//如果已经到达最左边，则不能左移
		if(currentFall[i].x<=0){
			canLeft = false;
			break;
		}
		//如果左边有方块也不能左移
		if(tetris_status[currentFall[i].y][currentFall[i].x-1] != "NO_BLOCK"){
			canLeft = false;
			break;
		}
	}
	//如果能左移
	if(canLeft){
		//清除左移的每个方块的背景颜色
		for(var i=0;i<currentFall.length;i++){
			var cur = currentFall[i];
			//设置填充颜色
			tetris_ctx.fillStyle = "white";
			// 绘制矩形
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}
		//左移正在往下掉的方块
		for(var i=0;i<currentFall.length;i++){
			var cur = currentFall[i];
			cur.x--;
		}
		//将左移后的方块填充原来的颜色
		for(var i=0;i<currentFall.length;i++){
			var cur = currentFall[i];
			//设置填充颜色
			tetris_ctx.fillStyle = color[cur.color];
			//绘制矩形
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}
	}
}
//方块右移函数
var moveRight = function(){
	// 定义能否右移的标志
	var canRight = true;
	//遍历每个正在下落的方块看是否能够右移
	for(var i=0;i<currentFall.length;i++){
		//如果方块已经到达最右边则不能右移
		if(currentFall[i].x>=TETRIS_COLS-1){
			canRight = false;
			break;
		}
		//如果方块的右边还有方块则不能右移
		if(tetris_status[currentFall[i].y][currentFall[i].x+1] != "NO_BLOCK"){
			canRight = false;
			break;
		}
	}
	//如果能右移
	if(canRight){
		//清除每一个右移方块的颜色
		for(var i=0;i<currentFall.length;i++){
			var cur = currentFall[i];
			//设置填充颜色
			tetris_ctx.fillStyle = 'white';
			//绘制矩形
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}
		//右移方块
		for(var i=0;i<currentFall.length;i++){
			var cur = currentFall[i];
			cur.x++;
		}
		//将右移后的方块上色
		for(var i=0;i<currentFall.length;i++){
			var cur = currentFall[i];
			//设置填充颜色
			tetris_ctx.fillStyle = color[cur.color];
			//绘制矩形
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);

		}
	}
}
//处理方块旋转  逆时针旋转
var rotate = function(){
	//定义是否能够旋转的标志
	var canRotate = true;
	for(var i=0;i<currentFall.length;i++){
		//记录旋转之前的坐标
		var preX = currentFall[i].x;
		var preY = currentFall[i].y;
		//始终以第三个方块作为旋转中心（i===2为旋转中心）
		if(i!=2){
			//计算旋转后方块的坐标
			var afterRotateX = currentFall[2].x - currentFall[2].y + preY;
			var afterRotateY = currentFall[2].y + currentFall[2].x - preX;
			//如果旋转后的位置已有方块，表示不能旋转
			if(tetris_status[afterRotateY][afterRotateX] != "NO_BLOCK"){
				canRotate = false;
				break;
			}
			// 如果旋转后的坐标超过了左边界
			if(afterRotateX<0||tetris_status[afterRotateY][afterRotateX-1] != "NO_BLOCK"){
				moveRight();
				afterRotateX = currentFall[2].x - currentFall[2].y + preY;
				afterRotateY = currentFall[2].y + currentFall[2].x + preX;
				break;
			}
			if(afterRotateX<0||tetris_status[afterRotateY][afterRotateX-1] != "NO_BLOCK"){
				moveRight();
				break;
			}
			//如果旋转后的坐标已经超出了最右边界
			if(afterRotateX>=TETRIS_COLS-1||tetris_status[afterRotateY][afterRotateX+1] != 'NO_BLOCK'){
				moveLeft();
				afterRotateX = currentFall[2].x - currentFall[2].y + preY;
				afterRotateY = currentFall[2].y + currentFall[2].x + preX;
				break;
			}
			if(afterRotateX>=TETRIS_COLS-1||tetris_status[afterRotateY][afterRotateX+1] != 'NO_BLOCK'){
				moveLeft();
				break;
			}
		}
	}
	//如果能旋转
	if(canRotate){
		//清除旋转前每个小方块的颜色
		for(var i=0;i<currentFall.length;i++){
			var cur = currentFall[i];
			//设置填充颜色
			tetris_ctx.fillStyle = "white";
			//绘制矩形
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}
		for(var i=0;i<currentFall.length;i++){
		//记录旋转之前的坐标
		var preX = currentFall[i].x;
		var preY = currentFall[i].y;
		//始终以第三个方块作为旋转中心（i===2为旋转中心）
			if(i!=2){
				//计算旋转后方块的坐标
				currentFall[i].x = currentFall[2].x - currentFall[2].y + preY;
				currentFall[i].y = currentFall[2].y + currentFall[2].x - preX;
			}
		}
		//将旋转后每个小正方形的颜色设置为原来的颜色
		for(var i=0;i<currentFall.length;i++){
			var cur = currentFall[i];
			//设置填充颜色
			tetris_ctx.fillStyle = color[cur.color];
			//绘制矩形
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}	
	}
}
//当页面加载完毕后执行里面的代码
window.onload = function(){
	createCanvas(TETRIS_ROWS,TETRIS_COLS,CELL_SIZE,CELL_SIZE);
	document.body.appendChild(tetris_canvas);
	var curScoreEle = document.querySelector(".curScoreEle");
	var curSpeedEle = document.querySelector(".curSpeedEle");
	var maxScoreEle = document.querySelector(".maxScoreEle");
	//读取localStorage中的tetris_status记录
	var tempStatus = localStorage.getItem("tetris_status");
	tetris_status = tempStatus == null ? tetris_status : JSON.parse(tempStatus);
	//绘制方块
	drawBlock();
	// 读取curScore纪录
	curScore = localStorage.getItem("curScore");
	curScore = curScore == null ? 0:parseInt(curScore);
	curScoreEle.innerHTML = curScore;
	//读取curSpeed纪录
    curSpeed = localStorage.getItem("curSpeed");
	curSpeed = curSpeed == null ? 1:parseInt("curSpeed");
	curSpeedEle.innerHTML = curSpeed;
	//读取maxScore纪录
    maxScore = localStorage.getItem("maxScore");
 	if(maxScore){
 		maxScore = parseInt(maxScore);
 	}
	maxScoreEle.innerHTML = maxScore;
	//初始化正在下落的方块
	initBlock();
	// 控制下落的间隔
    curTimer = setInterval("moveDown();",500/curSpeed);
}