import * as Kun2D from './Kun2D.core.js';
let app_width=document.body.clientWidth;
let app_height= window.innerHeight - 50 ;
let limit=0;

//test();

Kun2D.init(document.body,app_width,app_height);
let LoadScene = new Kun2D.Scene();
let rm = new Kun2D.resourceManager();
let gameScene= new Kun2D.Scene();
let scaleRate=app_width/1280;
let playMusic=false;
let lastPageX=0;
let lastPageY=0;
rm.addImage("image/black2.png","black2");
rm.addImage("image/black3.png","black3");
rm.addImage("image/black5.png","black5");
rm.addImage("image/gamebg.png","gamebg");
rm.addImage("image/g1.png","g1");
rm.addImage("image/g2.png","g2");
rm.addImage("image/g3.png","g3");
rm.addImage("image/man.png","man").addImage("image/bgblack.png","hill").addImage("image/black1.png","black").onFinish(load);
let black2;
let black3;
let black5;
let bgblack;
var audio= new Audio("assets/xy.mp3");
let gamebg;
let gameTick=0;
var stone=0;
var stoneArray=new Array();
var positionList=[527,657,803];
var musicStones="66361635663616356636163566361635664516456645164566451645664516450361663616366636163666361636664626126--3--03616--3--03616--3--03612--6--0461";
		musicStones+="66--46--26--12----66--46--26--12---3--------2---6---1---2----4---1---2---4----3--------";
		var gameScore=0;
		var scoreText=new PIXI.Text("得分：0");



function load(){
  Kun2D.gameDirector.goScene(LoadScene);
    let man = new Kun2D.kunImage(rm.resources['man']);
    
    
    let hill = new Kun2D.kunImage(rm.resources['hill']);
    hill.scaleBy(app_width/1772,app_width/1772);
    hill.moveTo(0,0);
    man.scaleBy(0.5 * app_width / 1440,0.5 * app_width / 1440);
    man.anchor=[1,1];
    man.moveTo(app_width,app_height);
    hill.join();
    man.join();
    let manmask=new Kun2D.kunImage(rm.resources['black'],app_width,app_height-man.height);
    manmask.anchor=[0.5,0.5];
    let bgmask=new Kun2D.kunImage(rm.resources['black'],70,100);
    bgmask.anchor=[0.5,0.5];
    bgmask.join();
    hill.pixi.mask=bgmask.pixi;
    bgmask.tween(new Kun2D.tweens.ScalingBy(4000,40,40));
    manmask.join();
    man.pixi.mask=manmask.pixi;
    manmask.tween(new Kun2D.tweens.ScalingBy(4000,10,10));
    man.rx=man.position.x;
    hill.rx=hill.position.x;
    document.body.onmousemove=(f)=>{
        man.moveTo(man.rx+f.pageX*0.01,man.position.y);
        hill.moveTo(hill.rx-f.pageX*0.01,hill.position.y);
    };
    document.getElementById("startGame").onclick=()=>{
        document.getElementById("view").style.opacity=0;
        document.getElementById("viewContent").style.display="block";
        setTimeout(()=>{
            document.getElementById("viewContent").style.opacity=1;
        },1000);
        document.getElementById("music1").onclick=()=>{
            document.getElementById("viewContent").style.opacity=0;
            transTo();
        };
        
    };
    function transTo(params) {
      gamebg=new Kun2D.kunImage(rm.resources['gamebg']);
      gamebg.scaleBy(app_width/gamebg.width,app_width/gamebg.width);
      gamebg.join();
      gamebg.alpha=0;
        document.getElementById("view").style.display="none";
        black2= new Kun2D.kunImage(rm.resources['black2']);
        black3= new Kun2D.kunImage(rm.resources['black3']);
        black5= new Kun2D.kunImage(rm.resources['black5']);
        black2.anchor=[0.5,0];
        black3.anchor=[1,0];
        black5.anchor=[1,1];
        black2.moveTo(app_width/3,app_height/4);
        black3.moveTo(app_width,0);
        black5.moveTo(app_width+40,app_height+100);
        black2.alpha=0.7;
        black5.alpha=0.7;
        black3.alpha=0.7;
        black2.join();
        black3.join();
        black5.join();
        black2.tween(new Kun2D.tweens.ScalingBy(2000,40,40));
        black3.tween(new Kun2D.tweens.ScalingBy(2000,40,40));
        black5.tween(new Kun2D.tweens.ScalingBy(2000,40,40));
        black2.tween(new Kun2D.tweens.AlphaShowing(0.3,0.01));
        black3.tween(new Kun2D.tweens.AlphaShowing(0.3,0.01));
        black5.tween(new Kun2D.tweens.AlphaShowing(0.3,0.01));
        setTimeout(transOut,3000);
    }
    function transOut(params) {
      document.getElementById("viewContent").style.display="none";
      LoadScene.removeKun(man);
      LoadScene.removeKun(manmask);
      LoadScene.removeKun(hill);
      LoadScene.removeKun(bgmask);
      gamebg.alpha=1;
        black2.tween(new Kun2D.tweens.ScalingBy(2000,0.001,0.001));
        black3.tween(new Kun2D.tweens.ScalingBy(2000,0.001,0.001));
        black5.tween(new Kun2D.tweens.ScalingBy(2000,0.001,0.001));

        black2.tween(new Kun2D.tweens.AlphaShowing(-1,0.01));
        black3.tween(new Kun2D.tweens.AlphaShowing(-1,0.01));
        black5.tween(new Kun2D.tweens.AlphaShowing(-1,0.01));

        setTimeout(gameStart,2000);
    }
    
    
    function gameStart(params) {
      audio.play();
      var gameText=new Kun2D.kunText("得分:",0,0);
      var gameScore=0;
      var kb = new Kun2D.keyboard();
      kb.onKeyDown("Q",()=>{
        for(var i of stoneArray){
          if(i.position.x==positionList[0]){
            console.log(i.position.y,460+i.height);
            if(i.position.y>=440){
             
              if(i.position.y<=(440+i.height)){
                i.tween(new Kun2D.tweens.AlphaShowing(-1,0.1));
                gameScore+=500;
              }
            }
          }
        }
      });
      kb.onKeyDown("W",()=>{
        for(var i of stoneArray){
          if(i.position.x==positionList[1]){
            console.log(i.position.y,460+i.height);
            if(i.position.y>=440){
             
              if(i.position.y<=(440+i.height)){
                i.tween(new Kun2D.tweens.AlphaShowing(-1,0.1));
                gameScore+=500;
              }
            }
          }
        }
      });
      kb.onKeyDown("E",()=>{
        for(var i of stoneArray){
          if(i.position.x==positionList[2]){
            console.log(i.position.y,460+i.height);
            if(i.position.y>=440){
             
              if(i.position.y<=(440+i.height)){
                i.tween(new Kun2D.tweens.AlphaShowing(-1,0.1));
                gameScore+=500;
              }
            }
          }
        }
      });
      Kun2D.PIXI_app.ticker.add(()=>{
        gameText.text="得分："+gameScore.toString();
        gameText.join();
        gameTick+=1;
        
				if(gameTick==30){
					gameTick=0;
					var s=musicStones[stone];
					if(s!="-"){
						var j=Math.random();
						var p;
						if(j<=0.33){
							p= new Kun2D.kunImage(rm.resources.g1);
							p.type=1;
						}else if(j>=0.66){
							p= new Kun2D.kunImage(rm.resources.g2);
							p.type=2;
						}else{
							p= new Kun2D.kunImage(rm.resources.g3);
							p.type=3;
						}
            p.live=true;
            p.moveTo(positionList[Math.ceil(Math.random()*3)-1],50);
            p.tween(new Kun2D.tweens.MovingBy(6000,0,1000));
						p.stoneID=stone;
            p.join();
            stoneArray.push(p);
					}
					stone+=1;
					if(stone==musicStones.length){
						gameStart=2;
					
					}
				}
      });
    }

    
}

