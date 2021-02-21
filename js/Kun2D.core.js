// You can use any model there
import * as Kun2Dtweens from './Kun2D.tweens.js';
import * as Kun2Dphysics from './Kun2D.physics.js';
export let tweens = Kun2Dtweens;
export let Animates = new Array();
export let physics = Kun2Dphysics;
//end
let Kun2D_Animates=new Array();
export let PIXI_app;
let NullFunction = function(){};
let nowScene=null;
var _Kun2D_view_width;
var _Kun2D_view_height;
var KunIDC=0;
function _Kun2D_StringToObject(KStyle){
    var srr=KStyle.split(";");
    var o = new Object();
    for(var c of srr){
        var srr2=c.split("=");
        if(srr2.length==2){
            srr2[0]=srr2[0].replace(/\s+/g,""); 
            srr2[1]=srr2[1].replace(/\s+/g,""); 
            o[srr2[0]]=srr2[1];
        }
    }
    return o;
}
export let Defaults=new Object();
export let filters=PIXI.filters;
export function init(renderView,width = 1200,height = 600){
    PIXI_app = new PIXI.Application({ width: width, height: height });
    _Kun2D_view_height=height;
    _Kun2D_view_width=width;
    PIXI_app.renderer.backgroundColor = 0xFFFFFF;
    renderView.appendChild(PIXI_app.view);
    _kun2d_drawNullTexture();
    Defaults.Camera._init();
    PIXI.Ticker.shared.add(_Kun2D_Animate_loop);
}
export let NullTexture;
export function _kun2d_drawNullTexture(){
    var canvas = document.createElement("canvas");
    canvas.width=50;
    canvas.height=50;
    var ctx =canvas.getContext("2d");
    ctx.fillStyle="#F08080";
    ctx.rect(0,0,50,50);
    ctx.stroke();
    ctx.fillStyle="#FF0000";
    ctx.fillText('Null',10,10);
    ctx.fillText('Texture',10,20);
    Defaults.NullTexture=new PIXI.Texture.from(canvas.toDataURL());
    NullTexture=Defaults.NullTexture;
}
class resource{
    constructor(from){
        this.type=30000;
        this.val=from;
    }

}
export class resourceTexture extends resource {
    constructor(from){
        super(from);
        this.type=30001;
    }
}
class _gameDirector{
    constructor(){
        this.type=20003;
    }
    goScene(s){
        if(nowScene!=null){
            nowScene.onLeft();
            PIXI_app.stage.removeChild(nowScene.pixi);
            PIXI_app.stage.addChild(s.pixi);
        }else{
            PIXI_app.stage.addChild(s.pixi);
        }
        if(s.first){
            s.onFirstEnter();
            s.first=false;
        }else{
            s.onEnter();
        }
        nowScene=s;
    }
}
export let gameDirector=new _gameDirector();
function _kun2d_resM_fileread(base64,p){
    
    if(p.type==1){
        p.p.resources[p.anotherName]=new PIXI.Texture(PIXI.BaseTexture.from(base64));
    }
    if(p.type==2){
        p.p.resources[p.anotherName]='url('+base64+')';
    }
    if(p.type==3){
        if(p.autoParse){
            _Kun2D_parseFont(base64,p.fontFamily);
        }
    }
    if(p.p.function_onProcess!=undefined){
        p.p.function_onProcess();
    }
    p.p.finishCount++;
    //console.log(p.p.totalCount,p.p.finishCount,p.p.function_onFinish);
    if(p.p.totalCount==p.p.finishCount&&p.p.function_onFinish!=null){
        var j=p.p.function_onFinish;
        p.p.function_onFinish=null;
        j();
    }
}
function _kun2d_resM_loadingfinish(t){

    _Kun2D_blobToDataURL(t.response,t.p);
}
class _kun2d_resM_task{
    constructor(pRESM,loadingurl,type){
        this.p=pRESM;
        this.url=loadingurl;
        this.type=type;
        var xhr = new XMLHttpRequest();
        xhr.open('GET',loadingurl);

        xhr.responseType='blob';
        if(this.type>30000){
            xhr.responseType="text";
        }
        xhr.p=this;
        xhr.onload=function(){
            if(this.status==200){
                if(this.p.type<30000){
                    _kun2d_resM_loadingfinish(this); 
                }else{
                    this.p.p.resources[this.p.url]=this.responseText;
                    if(this.p.type==30001){
                        var m = JSON.parse(this.responseText);
                        for(let key in m){
                            if(m[key]==""){
                                m[key]="!";
                            }
                            this.p.p.addImage(m[key],key);
                        }
                        
                    }
                    this.p.p.finishCount++;
                }
            }
        }
        xhr.send();
    }
}
export class resourceManager{
    constructor(){
        this.totalCount=0;
        this.finishCount=0;
        this.resources=new Object();
    }
    addFromJsonURL(jsonUrl){
        var o = new _kun2d_resM_task(this,jsonUrl,30001);
        this.totalCount++;
        return this;
    }
    addJSON(jsonUrl){
        var o = new _kun2d_resM_task(this,jsonUrl,30002);
        this.totalCount++;
        return this;
    }
    addImageArray(urls){
        var i=0;
        while(i<urls.length){
            this.addImage(urls[i]);
            i++;
        }
        return this;
    }
    addImage(imgUrl,anotherName="!"){
        if(anotherName=='!'){
            anotherName=imgUrl;
        }
        this.totalCount++;
        var o = new _kun2d_resM_task(this,imgUrl,1);
        o.anotherName=anotherName;
        return this;
    }
    addMusic(musicUrl,anotherName){
        if(anotherName=='!'){
            anotherName=musicUrl;
        }
        this.totalCount++;
        var o = new _kun2d_resM_task(this,musicUrl,2);
        return this;
    }
    addVideo(videoUrl,anotherName){
        if(anotherName=='!'){
            anotherName=videoUrl;
        }
        this.totalCount++;
        var o = new _kun2d_resM_task(this,videoUrl,9);
        return this;
    }
    addFont(fontUrl,fontFamily='font',autoParse = true){
        this.totalCount++;
        var o = new _kun2d_resM_task(this,fontUrl,3);
        o.fontFamily=fontFamily;
        o.autoParse=autoParse;
        return this;
    }
    onFinish(callback){
        this.function_onFinish=callback;
        return this;
    }
    onProcess(callback){
        this.function_onProcess=callback;
        return this;
    }

}
export let imageLoaderShared=new resourceManager();
Defaults.Loader=new resourceManager();
Defaults.TextStyle={fontSize:16};
function _kun2d_fun_100tovalue(val,basev){
    if(typeof val == "string"){
        if(val.indexOf('%')>0){
            val=basev*parseFloat(val.replace('%',''))/100;
        }else{
            val=basev*(val);
        }

    }
    return val;
}


export class position{
    constructor(x,y,p){
        this.type=20001;
        this.p=p;
        this._x=x;
        this._y=y;
        this.renderX=x;
        this.renderY=y;
    }
    set x(val){
        val=_kun2d_fun_100tovalue(val,_Kun2D_view_width);
        this._x=val;
        this.renderX=Math.round(val);
        if(this.p.pixi!=null){
            this.p.pixi.x=this.renderX;
        }
    }
    set y(val){
        val=_kun2d_fun_100tovalue(val,_Kun2D_view_height);
        this._y=val;
        this.renderY=Math.round(val);
        if(this.p.pixi!=null){
            this.p.pixi.y=this.renderY;
        }
    }
    get x(){
        return this._x;
    }
    get y(){
        return this._y;
    }
}
export class kun{
    constructor(){
        KunIDC=KunIDC+1;
        this.id=KunIDC;
        this.pixi=null;
        this.position=new position(0,0,this);
        this.type=10000;
    }
    on(eventName,eventFunticon){
        if(!(this.pixi.buttonMode&&this.pixi.interactive)){
            this.pixi.buttonMode=true;
            this.pixi.interactive=true;
        }
        this.pixi.on(eventName,eventFunticon);
    }
    tween(t){
        t.kun(this);
        t.setup();
        return t;
    }
    set width(val){
        val=_kun2d_fun_100tovalue(val,_Kun2D_view_width);
        this.pixi.width=val;
    }
    get width(){
        return this.pixi.width;
    }
    set height(val){
        val=_kun2d_fun_100tovalue(val,_Kun2D_view_height);
        this.pixi.height=val;
    }
    get height(){
        return this.pixi.height;
    }
    set alpha(val){
        this.pixi.alpha=val;
    }
    get alpha(){
        return this.pixi.alpha;
    }
    join(scene){
        //console.log(this.pixi);
        if(scene==null){
            if(nowScene!=null){
                nowScene.addKun(this);
            }else{
                PIXI_app.stage.addChild(this.pixi);
            }
        }else{
            scene.addKun(this);
        }
        return this;
    }
    moveTo(x,y){
        this.position.x=x;
        this.position.y=y;
        return this;
    }
    moveBy(vx,vy){
        this.position.x+=vx;
        this.position.y+=vy;
        return this;
    }
    set filters(val){
        this.pixi.filters=val;
    }
    get filters(){
        return this.pixi.filters;
    }

    destory(){
        if(this.p!=undefined){
            
        }

    }
    addFilter(val){
        if(this.pixi.filters==null){
            this.pixi.filters=new Array();
        }
        this.pixi.filters.push(val);
        return this;
    }
}
export class kunImage extends kun{
    set image(val){
        //console.log(val);
        if(val!=null){
            if(typeof val == "string"){
                this.resource = imageLoaderShared[val];
            }else{
                this.resource=val;
            }
        }else{
            this.resource=NullTexture;
        }
        if(this.pixi!=null){
            this.pixi.texture=this.resource;
        }
        
    }
    set anchor(val){
        if(this._anchor==undefined){
            this._anchor=val;
        }
        if(val.length==1){
            this.pixi.anchor.set(val[0]);
        }
        if(val.length==2){
            this.pixi.anchor.set(val[0],val[1]);
        }
    }
    get anchor(){
        return this._anchor;
    }
    get image(){
        return this.resource;
    }
    animate(a){
        a.setup(this);
    }
    scaleTo(width,height){
        this.pixi.width=width;
        this.pixi.height=height;

    }
    scaleBy(wRate,hRate){
        this.pixi.width=this.rWidth*wRate;
        this.pixi.height=this.rHeight*hRate;
    }
    constructor(res,x=0,y=0){
        super();
        this.type = 10001;
        this.image=res;
        this.pixi=new PIXI.Sprite(this.resource);
        this.rWidth=this.pixi.width;
        this.rHeight=this.pixi.height;
        this.moveTo(x,y);
    }
}
export class kunImageActived extends kunImage{

}
export class kunContainer extends kun{
    constructor(){
        super();
        this.type=10002;
        this.pixi=new PIXI.Container();
    }
    addKun(kun){
        this.pixi.addChild(kun.pixi);
        kun.p=this;
    }
    removeKun(kun){
        this.pixi.removeChild(kun.pixi);
    }
}
export class Scene extends kunContainer{
    constructor(){
        super();
        this.type=10003;
        this.first=true;
        this.onFirstEnter = NullFunction;
        this.onEnter=NullFunction;
        this.onLeft = NullFunction;
        this.pixi.pivot={x:_Kun2D_view_width/2,y:_Kun2D_view_height/2};
        this.pixi.x=_Kun2D_view_width/2;
        this.pixi.y=_Kun2D_view_height/2;
    }
}
export class kunText extends kun{
    set text(val){
        this.pixi.text=val;
    }
    get text(){
        return this.pixi.text;
    }
    set style(val){
        if(typeof val =='string'){
            this.pixi.style=_Kun2D_StringToObject(val);
        }else{
            this.pixi.style=val;
        }
    }
    get style(){
        return this.pixi.style;
    }
    constructor(text = '',x =0,y=0,style = null){
        super();
        this.type=10003;
        this.pixi=new PIXI.Text(text);
        this.moveTo(x,y);
        if(style!=null){
            this.style=style;
        }else{
            this.style=Defaults.TextStyle;
        }
    }
}

export class kunGraphics extends kun{
    constructor(x=0,y=0){
        super();
        this.type=10004;
        this.pixi=new PIXI.Graphics();
        this.moveTo(x,y);
        this.fillcolor=0x000000;
    }
    clear(){
        this.pixi.clear();
        return this;
    }
    fill(color){
        this.pixi.beginFill(color);
        return this;
    }
    drawRect(x,y,w,h){
        this.pixi.drawRect(x,y,w,h);
        return this;
    }
    drawRoundedRect(x,y,w,h,r){
        this.pixi.drawRoundedRect(x,y,w,h,r);
        return this;
    }
    drawPolygon(){
        var m = new Array();
        for(var i of arguments){
            var p =new PIXI.Point(i.x,i.y);
            m.push(p);
        }
        this.pixi.drawPolygon(m);
        
        return this;
    }

    lineStyle(width,color,alpha){
        this.pixi.lineStyle(width,color,alpha);
        return this;
    }
    endFill(){
        this.pixi.endFill();
    }
}

export class kunTextEX extends kun{
    constructor(){
        super();

    }
}

export class kTextStyle{
    constructor(){
        this.align='left';
        this.dropShadow=false;
        this.dropShadowAlhpa=1;
        this.dropShadowAngle=Math.PI/6;
        this.dropShadowBlur=0;
        this.dropShadowColor='black';
        this.dropShadowDistance=5;
        this.fill='black';
        this.fontFamily='Arial';
        this.fontSize='26';
        this.fontWeight='normal';
    }
}

export function _Kun2D_parseFont(source,name) {
    let fontFamily = name;
  let newStyle = document.createElement("style"); 
   let fontFace    = "@font-face {font-family: '" 
   + fontFamily + "'; src: url('" + source + "');}"; 
    newStyle.appendChild(document.createTextNode(fontFace)); 
     document.head.appendChild(newStyle);
    }

function _Kun2D_blobToDataURL(blob,p) {
        let a = new FileReader();  
        a.p=p;
        a.onload=function (e) {
             _kun2d_resM_fileread(e.target.result,this.p);
            }
        a.readAsDataURL(blob);
}

export class Camera {
    constructor(){
        this.focus=new Object();
        this.focus.x=_Kun2D_view_width/2;
        this.focus.y=_Kun2D_view_height/2;
    }
    _init(){
        this.focus=new Object();
        this.focus.x=_Kun2D_view_width/2;
        this.focus.y=_Kun2D_view_height/2;
    }
    update(){
        PIXI_app.stage.x=_Kun2D_view_width/2-this.focus.x;
        PIXI_app.stage.y=_Kun2D_view_height/2-this.focus.y;
    }
    moveTo(x,y){
            this.focus.x=x;
            this.focus.y=y;
            this.update();
    }
    moveBy(x,y){
        this.focus.x=this.focus.x+x;
        this.focus.y=this.focus.y+y;
        this.update();

    }
    tween(t){
        t.kun(this);
        t.setup();
        return t;
    }
}
Defaults.Camera=new Camera();
export class kunMusic{
    constructor(music='!'){
        this.pixi = document.createElement("AUDIO");
        this.pixi.autoplay=false;
        if(music!='!'){
            this.pixi.src=music;
            this.pixi.paused=true;
        } 
    }
    setMusic(music){
        this.pixi.src=music;
        this.pixi.paused=true;
        return this;
    }
    play(url='!'){
        if(url=='!'){
            if(this.url!=undefined){
                this.pixi.paused=false;
            }
        }else{
            
        }
        return this;
    }
}
export class animate{
    constructor(resourceManager,jsonObject,autoCircle=false){
        if(typeof jsonObject=="string"){
            jsonObject=JSON.parse(jsonObject);
        }
        if(jsonObject.fps==undefined||jsonObject.fps>60){
            jsonObject.fps=30;
        }
        this.autoCircle=autoCircle;
        this.gaptime=1000/jsonObject.fps;
        this.i=0;
        this.m=-1;
        this.live=true;
        if(jsonObject.frameCount!=undefined&&jsonObject.frameCount>=1){
            this.textureArray=new Array();
            this.ic=0;
            for(var i=1;i<jsonObject.frameCount+1;i++){
                if(jsonObject['frame'+i]!=undefined){
                    if(resourceManager.resources[jsonObject['frame'+i]]!=undefined){
                        this.textureArray.push(resourceManager.resources[jsonObject['frame'+i]]);
                    }else{
                        this.textureArray.push(NullTexture);
                    }
                }else{
                    if(jsonObject['frame*']!=undefined){
                        if(resourceManager.resources[jsonObject['frame*'].replace('*',i.toString())]!=undefined){
                            this.textureArray.push(resourceManager.resources[jsonObject['frame*'].replace('*',i.toString())]);
                        }else{
                            this.textureArray.push(NullTexture);
                        }
                    }else{
                        this.textureArray.push(NullTexture);
                    }
                }
            }
        }
    }
    loop(){
        this.i=this.i+(1000/60);
        if(this.i>this.gaptime){
            this.m++;
            if(this.m<this.textureArray.length){
                this.kun.pixi.texture=this.textureArray[this.m];
            }else{
             if(this.autoCircle){
                 this.m=-1;
             }else{
                 this.live=false;
             }   
            }
            this.i=this.i-this.gaptime;
        }
    }
    setup(kun){
        this.kun=kun;
        Kun2D_Animates.push(this);
    }
}
function _Kun2D_Animate_loop(){
    var count = 0;
    //console.log(_tweens);
        for(var i of Kun2D_Animates){
            if(i.live){
            i.loop();
            }else{
                Kun2D_Animates.splice(count,1);
                count--;
                //console.log(_tweens);
            }
            count++;
        }
}

export class keyboard{
    constructor(){
        this.keydown=new Object();
        this.keyup=new Object();
        document.onkeydown=(event)=>{
            var keycode=event.keyCode;
            if(this.keydown[keycode.toString()]!=undefined){
                if(this.keydown[keycode.toString()].isDown==false){
                var c=this.keydown[keycode.toString()].funs;
                this.keydown[keycode.toString()].isDown=true;
                for(var i of c){
                    i();
                }
            }
            }
        };
        document.onkeyup=(event)=>{
            var keycode=event.keyCode;
            if(this.keydown[keycode.toString()]!=undefined){
                this.keydown[keycode.toString()].isDown=false;
            }
            if(this.keyup[keycode.toString()]!=undefined){
                var c=this.keyup[keycode.toString()].funs;

                for(var i of c){
                    i();
                }
            }
        };
        
    }
    onKeyDown(key,fun){
        if(typeof key == 'string'){
            if(_kun2d_keyboard_keyCode[key]!=undefined){
                key=parseInt(_kun2d_keyboard_keyCode[key]);
            }else{
                key=-1;
            }
        }
        if(_kun2d_keyboard_codeKey[key.toString()]!=undefined){
            key=key.toString();
            if(this.keydown[key]==undefined){
                this.keydown[key]=new Object();
                this.keydown[key].funs=new Array();
                this.keydown[key].funs.push(fun);
                this.keydown[key].isDown=false;
            }else{
                this.keydown[key].funs.push(fun);
            }
        }
    }
    onKeyUp(key,fun){
        if(typeof key == 'string'){
            if(_kun2d_keyboard_keyCode[key]!=undefined){
                key=parseInt(_kun2d_keyboard_keyCode[key]);
            }else{
                key=-1;
            }
        }
        if(_kun2d_keyboard_codeKey[key.toString()]!=undefined){
            key=key.toString();
            if(this.keyup[key]==undefined){
                this.keyup[key]=new Object();
                this.keyup[key].funs=new Array();
                this.keyup[key].funs.push(fun);
                this.keyup[key].isDown=false;
            }else{
                this.keyup[key].funs.push(fun);
            }
        }
    }
    
}
let _kun2d_keyboard_codeKey=new Object();
let _kun2d_keyboard_keyCode=new Object();
_kun2d_keyboard_codeKey['106']='NUM*';
_kun2d_keyboard_codeKey['107']='NUM+';
_kun2d_keyboard_codeKey['108']='NUMENTER';
_kun2d_keyboard_codeKey['109']='NUM-';
_kun2d_keyboard_codeKey['110']='NUM.';
_kun2d_keyboard_codeKey['111']='NUM/';
_keyINit();
_codeINit();
function _codeINit(){
    for(var key in _kun2d_keyboard_codeKey){
        _kun2d_keyboard_keyCode[_kun2d_keyboard_codeKey[key]]=key;
    }
}
function _keyINit(){
    var i;
    for(i=65;i<=90;i++){
        _Kun2D_keyboard_keycodeInit(i);
    }
    for(i=48;i<=57;i++){
        _Kun2D_keyboard_keycodeInit(i);
    }
    for(i=96;i<=105;i++){
        _Kun2D_keyboard_keycodeInit(i);
    }
    for(i=112;i<=123;i++){
        _Kun2D_keyboard_keycodeInit(i);
    }
}


function _Kun2D_keyboard_keycodeInit(keycode){
    if(keycode<=90&&keycode>=65){
        _kun2d_keyboard_codeKey[keycode.toString()]=String.fromCharCode(keycode);
    }
    if(keycode>=48&&keycode<=57){
        _kun2d_keyboard_codeKey[keycode.toString()]= String.fromCharCode(keycode);
    }
    if(keycode>=96&&keycode<=105){
        _kun2d_keyboard_codeKey[keycode.toString()]= 'NUM'+String.fromCharCode(keycode-48);
    }
    if(keycode>=112&&keycode<=123){
        _kun2d_keyboard_codeKey[keycode.toString()]= 'F'+((keycode-111).toString());
    }
}
//YuSang
console.log(
    "始终相信"+
    "技术能够创造"+
    "爱"
    //Always believe Tech can create love
);