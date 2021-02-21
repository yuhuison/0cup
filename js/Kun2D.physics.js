let gapTime=(1000/60);
let kuns = new Array();
PIXI.Ticker.shared.add(HandleTimes);
export class physicsMod{
    constructor(){
        this.vx=0;
        this.vy=0;
        this.ax=0;
        this.ay=0;
        this.scms=false;
        this.maxvx=-1;
        this.maxvy=-1;
    }
}

export function  addKun(kun){
        kun.physics=new physicsMod();
        kuns.push(kun);
    }
function HandleTimes(){

    //console.log(_tweens);
        for(var i of kuns){
            //console.log(i);
            var vvx = i.physics.vx;
            var vvy = i.physics.vy;
            vvx = i.physics.vx+i.physics.ax;
            vvy = i.physics.vy+i.physics.ay;
            if(i.physics.maxvx!=-1){
                
                if(Math.abs(vvx)>i.physics.maxvx){
                    vvx=(vvx/Math.abs(vvx))*i.physics.maxvx;
                }
            }
            if(i.physics.maxvy!=-1){
  
                if(Math.abs(vvy)>i.physics.maxvy){
                    vvy=(vvy/Math.abs(vvy))*i.physics.maxvy;
                }
            }

            if(i.physics.scms){
                console.log(i.physics.vx,vvx);
                if((i.physics.vx*vvx)<=0&&i.physics.vx!=0){
                    vvx=0;
                    i.physics.ax=0;
                }
                if((i.physics.vy*vvy)<=0&&i.physics.vy!=0){
                    vvy=0;
                    i.physics.ay=0;
                }
            }
            i.moveBy(vvx,vvy);
            i.physics.vx=vvx;
            i.physics.vy=vvy;

        }
}
