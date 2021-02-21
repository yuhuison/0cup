import * as Kun2D from './Kun2D.core.js';
let app_width=document.body.clientWidth;
let app_height= window.innerHeight - 50 ;
let limit=0;

//test();

Kun2D.init(document.body,app_width,app_height);
let VideoScene = new Kun2D.Scene();
let rm = new Kun2D.resourceManager();
let gameScene= new Kun2D.Scene();
let scaleRate=app_width/1280;
let playMusic=false;
let lastPageX=0;
let lastPageY=0;
rm.addFromJsonURL('data/indexFiles.json').onFinish(load);
let black2;
let black3;
let black5;
let bgblack;
let bgcolor;
let swk;
let transName="";
function load(){
    Kun2D.gameDirector.goScene(VideoScene);
    console.log(rm.resources);
    let bg = new Kun2D.kunImage(rm.resources['videobg'],0,0);
    let bgMask = new Kun2D.kunImage(rm.resources['black1'],'50%','50%');
    bgMask.anchor=[0.5,0.5];
    bgMask.join();
    document.body.onclick=()=>{
        if(!playMusic){
            playMusic=true;
            console.log(bg.pixi.texture);
            bg.pixi.texture.baseTexture.resource.source.muted=false;
            
        }
    };
    Kun2D.PIXI_app.loader.add('vbg','assets/bg.mp4').add('swk',"assets/swk.mp4").load((loader, resources)=>{
        swk=resources.swk.data;
        resources.vbg.data.muted=true;
        bg.pixi.texture=PIXI.Texture.from(resources.vbg.data);
    });
    //bg.scaleTo(scaleRate,scaleRate);
    bg.pixi.mask=bgMask.pixi;
    bgMask.tween(new Kun2D.tweens.ScalingBy(2000,8,8));
    bg.join();
    bg.scaleBy(scaleRate,scaleRate);
    document.body.onmousemove=(f)=>{
        limit=limit+1;

        if(limit>=20){
            limit=0;
            let s = new Kun2D.kunImage(rm.resources['flower'],f.pageX,f.pageY);
            s.anchor=[0.5,0.5];
            s.scaleBy(0.5,0.5);
            s.moveTo(f.pageX+5,f.pageY-45)
            s.alpha=0;
            let t =new Kun2D.tweens.AlphaShowing(0.8,0.008);
            t.finnish((tween)=>{
                tween.kun.tween(new Kun2D.tweens.AlphaShowing(-0.8,0.008));
            })
            s.tween(t);
            t=new Kun2D.tweens.MovingBy(4000,(f.pageX-lastPageX)*4,(f.pageY-lastPageY)*4);
            s.tween(t);
            s.pixi.rotation = Math.random();
            //let t=new Kun2D.tweens.ScalingBy(4000,5,5,'easeInOutQuad');
           t.finnish((tween)=>{
                VideoScene.removeKun(tween.kun);
            })
            //s.tween(t);
            
            s.join();
            lastPageX=f.pageX;
            lastPageY=f.pageY;
        }
        document.getElementById("jian").onclick=transTo;
        document.getElementById("juan").onclick=transTo;
        document.getElementById("gun").onclick=transTo;
    };

    function transTo(params) {
        transName=this.id;
        if(transName=="jian"){
            bgblack=new Kun2D.kunImage(rm.resources['bg1b']);
            bgblack.scaleBy(app_width/bgblack.width,app_width/bgblack.width);
            bgblack.join();
            bgblack.alpha=0;
            bgcolor=new Kun2D.kunImage(rm.resources['bg1c']);
            bgcolor.scaleBy(app_width/bgcolor.width,app_width/bgcolor.width);
            bgcolor.join();
            bgcolor.alpha=0;
        }else if(transName=="juan"){
            bgblack=new Kun2D.kunImage(rm.resources['bg3b']);
            bgblack.scaleBy(app_width/bgblack.width,app_width/bgblack.width);
            bgblack.join();
            bgblack.alpha=0;
            bgcolor=new Kun2D.kunImage(rm.resources['bg3c']);
            bgcolor.scaleBy(app_width/bgcolor.width,app_width/bgcolor.width);
            bgcolor.join();
            bgcolor.alpha=0;
        }else if(transName=="gun"){
            bgblack=new Kun2D.kunImage(rm.resources['bg3b']);
            swk.loop=true;
            bgblack.pixi.texture=PIXI.Texture.from(swk);
            bgblack.scaleBy(app_width/bgblack.width,app_width/bgblack.width);
            bgblack.join();
            
            bgblack.alpha=0;
            bgcolor=new Kun2D.kunImage(rm.resources['bg2c']);
            bgcolor.scaleBy(app_width/bgcolor.width,app_width/bgcolor.width);
            bgcolor.join();
            bgcolor.alpha=0;
        }
        
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
        bgblack.alpha=1;
        black2.tween(new Kun2D.tweens.ScalingBy(2000,0.001,0.001));
        black3.tween(new Kun2D.tweens.ScalingBy(2000,0.001,0.001));
        black5.tween(new Kun2D.tweens.ScalingBy(2000,0.001,0.001));

        black2.tween(new Kun2D.tweens.AlphaShowing(-1,0.01));
        black3.tween(new Kun2D.tweens.AlphaShowing(-1,0.01));
        black5.tween(new Kun2D.tweens.AlphaShowing(-1,0.01));

        setTimeout(()=>{
            if(transName=="jian"){
                toJian()
            }else if(transName=="juan"){
                toJuan();
            }else if(transName=="gun"){
                toGun();
            }
        },2000);
    }

    function toJuan(params) {
        let content=document.getElementById("viewContent_HuiJuan");
        content.style.display="block";
        
        setTimeout(
            ()=>{
                content.style.opacity=1;
            },100
        );
        content.onclick=()=>{
            content.style.opacity=0;
            bgcolor.alpha=1;
            let bgblackmask= new Kun2D.kunImage(rm.resources['black1'],500,500);
            bgblackmask.anchor=[0.5,0.5];
            bgblackmask.join();
            bgcolor.pixi.mask=bgblackmask.pixi;
            bgblackmask.tween(new Kun2D.tweens.ScalingBy(4000,22,22));
            bgcolor.alpha=1;
            setTimeout(()=>{
                window.location="jiangnan.html";
            },5000);
        }
        content.style.left=(app_width/6).toString()+"px";
        content.style.top=(app_height/3).toString()+"px";
    }
    function toJian(params) {
        let content=document.getElementById("viewContent_WuXia");
        content.style.display="block";
        
        setTimeout(
            ()=>{
                content.style.opacity=1;
            },100
        );
        content.onclick=()=>{
            content.style.opacity=0;
            bgcolor.alpha=1;
            let bgblackmask= new Kun2D.kunImage(rm.resources['black6'],app_width-100,0);
            bgblackmask.anchor=[1,0];
            bgblackmask.join();
            bgcolor.pixi.mask=bgblackmask.pixi;
            bgblackmask.tween(new Kun2D.tweens.ScalingBy(4000,22,22));
            bgcolor.alpha=1;
            setTimeout(()=>{
                window.location="wuxia.html";
            },5000);
        }
        content.style.left=(app_width/8).toString()+"px";
        content.style.top=(app_height/2).toString()+"px";
    }

    function toGun(params) {
        let content=document.getElementById("viewContent_XiYou");
        content.style.display="block";
        
        setTimeout(
            ()=>{
                content.style.opacity=1;
            },100
        );
        content.onclick=()=>{
            content.style.opacity=0;
            bgcolor.alpha=1;
            let bgblackmask= new Kun2D.kunImage(rm.resources['black1'],0,0);
            bgblackmask.anchor=[0.5,0.5];
            bgblackmask.join();
            bgcolor.pixi.mask=bgblackmask.pixi;
            bgblackmask.tween(new Kun2D.tweens.ScalingBy(4000,22,22));
            bgcolor.alpha=1;
            setTimeout(()=>{
                window.location="xiyou.html";
            },5000);
        }
        content.style.left=(app_width/2).toString()+"px";
        content.style.top=(app_height/4).toString()+"px";
    }
    /*
    Kun2D.PIXI_app.loader.add('vbg','assets/bg.mp4').load((loader, resources)=>{
        resources.vbg.data.muted=true;
        bg.pixi.texture=PIXI.Texture.from(resources.vbg.data);
    });
    */
    
   // pp.tween(new Kun2D.tweens.movingRandom());
    
}

