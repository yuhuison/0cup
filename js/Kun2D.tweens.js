let _tweens = new Array();
let _Kun2D_EasingFunctions = { linear: function (t) { return t }, easeInQuad: function (t) { return t*t }, easeOutQuad: function (t) { return t*(2-t) }, easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t }, easeInCubic: function (t) { return t*t*t }, easeOutCubic: function (t) { return (--t)*t*t+1 }, easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 }, easeInQuart: function (t) { return t*t*t*t }, easeOutQuart: function (t) { return 1-(--t)*t*t*t }, easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t }, easeInQuint: function (t) { return t*t*t*t*t }, easeOutQuint: function (t) { return 1+(--t)*t*t*t*t }, easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t } }
let gapTime=(1000/60);
PIXI.Ticker.shared.add(HandleTimes);
export class tween{
    kun(val){
        this.kun=val;
    }
    constructor(){
    this.live=true;
        
    }
    finnish(f){
        this.finnishfun=f;
    }
    _finnish(){
        if(this.finnishfun!=undefined){
            this.finnishfun(this);
        }
        this.live=false;
    }
}

function HandleTimes(){
    var count = 0;
    //console.log(_tweens);
        for(var i of _tweens){
            if(i.live){
            i.loop();
            }else{
                _tweens.splice(count,1);
                count--;
                //console.log(_tweens);
            }
            count++;
        }
}
function Safe(){
    
}
export class movingRandom extends tween{
    constructor(){
        super();
    }
    setup(){
        _tweens.push(this);
    }
    loop(){
        this.kun.position.x=this.kun.position.x+(2.5-Math.random()*5);
        this.kun.position.y=this.kun.position.y+(2.5-Math.random()*5);
    }
}

export class universalTween extends tween{
    constructor(intime,easingFun,name,variation,onFinash = null,obj=null){
        super();
        if(_Kun2D_EasingFunctions[easingFun]==undefined || easingFun==''){
            easingFun='linear';
        }
        this.fun=_Kun2D_EasingFunctions[easingFun];
        this.kunname=name;
        this.v=variation;
        this.nt=intime;
        this.i=0;
        this.n=Math.ceil(intime/gapTime);
        this.o=obj;
        if(onFinash!=null){
            this.f=onFinash;
        }
    }
    reStart(){
        this.i=0;
    }
    set variation(val){
        this.v=val;
    }
    get variation(){
        return this.v;
    }
    setVariation(val){
        this.v=val;
    }
    setup(){
        
        if(this.o!=null){
            this.kun=this.o;
            console.log(this.kun);
        }
        _tweens.push(this);
    }
    loop(){
        if(this.i<this.n){
        this.i++;
       //console.log((this.v*(this.fun(this.i/this.n)-this.fun((this.i-1)/this.n))));
       this.kun[this.kunname]= this.kun[this.kunname]+(this.v*(this.fun(this.i/this.n)-this.fun((this.i-1)/this.n)));;
        }else{
            if(this.i==this.n){
                this.kun[this.kunname]=this.kun[this.kunname]+(this.v-this.v*this.fun(this.i-1,this.n));
                if(this.f!=undefined){
                    this.live=false;
                    this.f(this);
                    
                }
            }

        }
    }
}
export class Spraking extends tween{
  constructor(rate){
      super();
        this.rate=rate;
        this.i=0;
    }
    setup(){
        _tweens.push(this);
    }
    loop(){
        this.i++;
        if(this.i==this.rate){
            this.i=0;
            this.kun.pixi.visible=!(this.kun.pixi.visible);
        }
        
    }
}

export class TextShowing extends tween{
    constructor(text,speed){
        super();
        this.text=text;
        this.speed=speed;
        this.length=text.length;
        this.i=0;
        this.p=0;
    }
    setup(){
        _tweens.push(this);
    }
    loop(){
        this.p=this.p+this.speed;
        if(this.i>=this.length){
            this._finnish();
        }
        if(this.p>=1){
            this.kun.text=this.kun.text+this.text.substring(this.i,this.i+Math.ceil(this.p));
            this.i=this.i+Math.ceil(this.p);
            this.p=this.p-Math.ceil(this.p);
        }
    }
}

export class AlphaShowing extends tween{
    constructor(variation,speed){
        super();
        this.variation=variation;
        if(variation<0){
            this.speed=-speed;
        }else{
            this.speed=speed;
        }
        this.v=0;
    }
    setup(){
        _tweens.push(this);
    }
    loop(){
        if(this.v<Math.abs(this.variation)){
            this.v=this.v+Math.abs(this.speed);
            this.kun.alpha=this.kun.alpha+this.speed;
            
        }else{
            this._finnish();
        }
    }
}
export class MovingTo extends tween{
    constructor(intime,toX,toY,fun='linear'){
        super();
        this.n=Math.ceil(intime/gapTime);
        this.i=0;
        this.toX=toX;
        this.toY=toY;
        this.autoCircle=autoCircle;
        if(_Kun2D_EasingFunctions[fun]!=undefined){
            this.fun=_Kun2D_EasingFunctions[fun];
        }
    }
    setup(){
        this.vx=this.toX-this.kun.position.x;
        this.vy=this.toY-this.kun.position.y;
        _tweens.push(this);
    }
    loop(){
        if(this.i<this.n){
            this.i++;
            //console.log(this);
            this.kun.moveTo(this.kun.position.x+this.vx*(this.fun(this.i/this.n)-this.fun((this.i-1)/this.n)),this.kun.position.y+this.vy*(this.fun(this.i/this.n)-this.fun((this.i-1)/this.n)));

        }else{
            this.kun.moveTo(this.toX,this.toY);
            this._finnish();
            this.live=false;
        }
    }
}

export class MovingBy extends tween{
    constructor(intime,vx,vy,fun='linear',autoCircle=false){
        super();
        this.n=Math.ceil(intime/gapTime);
        this.i=0;
        this.vx=vx;
        this.vy=vy;
        this.autoCircle=autoCircle;
        if(_Kun2D_EasingFunctions[fun]!=undefined){
            this.fun=_Kun2D_EasingFunctions[fun];
        }
    }
    setup(){
        _tweens.push(this);
    }
    loop(){
        if(this.i<this.n){
            this.i++;
            //console.log(this);
            this.kun.moveBy(this.vx*(this.fun(this.i/this.n)-this.fun((this.i-1)/this.n)),this.vy*(this.fun(this.i/this.n)-this.fun((this.i-1)/this.n)));

        }else{

            if(this.autoCircle){
                this.i=0;
            }else{
                this.live=false;
                this._finnish();
            }
        }
    }
}

export class ScalingTo extends tween{
    constructor(intime,vx,vy,fun='linear',autoCircle=false){
        super();
        this.n=Math.ceil(intime/gapTime);
        this.i=0;
        this.vx=vx;
        this.vy=vy;

        this.autoCircle=autoCircle;
        if(_Kun2D_EasingFunctions[fun]!=undefined){
            this.fun=_Kun2D_EasingFunctions[fun];
        }
    }
    setup(){
        this.vx=this.vx-this.kun.pixi.width;
        this.vy=this.vy-this.kun.pixi.height;
        this.rx=this.kun.width;
        this.ry=this.kun.height;
        _tweens.push(this);
        
    }
    loop(){
        if(this.i<this.n){
            this.i++;
            this.kun.scaleTo(this.rx+this.vx*(this.fun(this.i/this.n)-this.fun((this.i-1)/this.n)),this.ry+this.vy*(this.fun(this.i/this.n)-this.fun((this.i-1)/this.n)));
            this.rx=this.rx+this.vx*(this.fun(this.i/this.n)-this.fun((this.i-1)/this.n));
            this.ry=this.ry+this.vy*(this.fun(this.i/this.n)-this.fun((this.i-1)/this.n));
        }else{

            if(this.autoCircle){
                this.i=0;
            }else{
                this.live=false;
                this._finnish();
            }
        }
    }
}
export class ScalingBy extends tween{
    constructor(intime,vx,vy,fun='linear',autoCircle=false){
        super();
        this.n=Math.ceil(intime/gapTime);
        this.i=0;
        this.vx=vx;
        this.vy=vy;

        this.autoCircle=autoCircle;
        if(_Kun2D_EasingFunctions[fun]!=undefined){
            this.fun=_Kun2D_EasingFunctions[fun];
        }
    }
    setup(){
        this.vx=this.vx*this.kun.pixi.width-this.kun.pixi.width;
        this.vy=this.vy*this.kun.pixi.height-this.kun.pixi.height;
        this.rx=this.kun.width;
        this.ry=this.kun.height;
        _tweens.push(this);
        
    }
    loop(){
        if(this.i<this.n){
            this.i++;
            this.kun.scaleTo(this.rx+this.vx*(this.fun(this.i/this.n)-this.fun((this.i-1)/this.n)),this.ry+this.vy*(this.fun(this.i/this.n)-this.fun((this.i-1)/this.n)));
            this.rx=this.rx+this.vx*(this.fun(this.i/this.n)-this.fun((this.i-1)/this.n));
            this.ry=this.ry+this.vy*(this.fun(this.i/this.n)-this.fun((this.i-1)/this.n));
        }else{

            if(this.autoCircle){
                this.i=0;
            }else{
                this.live=false;
            }
        }
    }
}