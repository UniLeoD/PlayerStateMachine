//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield: egret.TextField;
    private bmp:egret.Bitmap;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene(): void {
        //////////////Please don't copy all of my codes completely--ScarletRain77///////////////


        var sky: egret.Bitmap = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        var stageW: number = this.stage.stageWidth;
        var stageH: number = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        var player = new Player();
        this.addChild(player);
        sky.touchEnabled = true;
        //player.idle();
        //监听，移动
        sky.addEventListener(egret.TouchEvent.TOUCH_END, (e) => {
            player.move(e.stageX , e.stageY );
            //console.log("X:" + e.stageX + "Y:" + e.stageY);
        }, this);

        
       
      
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json
    }


    

   

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        var result = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}



class MAN extends egret.DisplayObjectContainer {
    private bmpArr1:egret.Bitmap[];
    private bmpArr2:egret.Bitmap[];
    private timeOnEnterFrame:number = 0;
    private frameNumber = 0;

    private isMove = false;
    private isIdle = false;
    private isPlayFirst = true;
        var M_01:egret.Bitmap = this.createBitmapByName("M_01_png");
        this.addChild(M_01);
        var M_02:egret.Bitmap = this.createBitmapByName("M_02_png");
        this.addChild(M_02);
        var M_03:egret.Bitmap = this.createBitmapByName("M_03_png");
        this.addChild(M_03);
        var M_04:egret.Bitmap = this.createBitmapByName("M_04_png");
        this.addChild(M_04);
        var M_05:egret.Bitmap = this.createBitmapByName("M_05_png");
        this.addChild(M_05);
        var M_06:egret.Bitmap = this.createBitmapByName("M_06_png");
        this.addChild(M_06);
        var M_07:egret.Bitmap = this.createBitmapByName("M_07_png");
        this.addChild(M_07);
        var M_08:egret.Bitmap = this.createBitmapByName("M_08_png");
        this.addChild(M_08);
        var M_09:egret.Bitmap = this.createBitmapByName("M_09_png");
        this.addChild(M_09);
        var M_10:egret.Bitmap = this.createBitmapByName("M_10_png");
        this.addChild(M_10);   
        var M_11:egret.Bitmap = this.createBitmapByName("M_11_png");
        this.addChild(M_11);
        var M_12:egret.Bitmap = this.createBitmapByName("M_12_png");
        this.addChild(M_12);
        var M_13:egret.Bitmap = this.createBitmapByName("M_13_png");
        this.addChild(M_13);
        
        bmpArr1 = [M_01,M_02,M_03,M_04,M_05,M_06,M_07,M_08,M_09,M_10,M_11,M_12,M_13];
        
        this.addEventListener(egret.Event.ENTER_FRAME,onEnterFrame,this);
       
        function onEnterFrame(event:egret.Event) {
             this.addChild(M_01);
             
        }
}
class Player extends egret.DisplayObjectContainer {
    _label: egret.TextField;
    _body: egret.Shape;
    _stateMachine: StateMachine;
    private 
    

    constructor() {
        super();
        this._label = new egret.TextField();
        this._stateMachine = new StateMachine();
        this._label.y = 30;
        this._label.text = "Player";
        this._body = new egret.Shape();
        this._body.graphics.beginFill(0x000000 , 0.5);
        this._body.graphics.drawCircle(50, 50, 50);
        this._body.graphics.endFill();

        this.addChild(this._body);
        this.addChild(this._label);

    }
//move方法，切换
    move(targetX: number, targetY: number) {
        this._stateMachine.setState(new PlayerMoveState(this, targetX, targetY));
    }

    idle() {
        this._stateMachine.setState(new PlayerIdleState(this));
    }
}

/**
 * 状态机。currentState现在的状态，setState设置状态。先结束前一个状态，再把现在的状态赋值进来
 */
class StateMachine {
    _currentState: State;
    setState(s: State) {
        if (this._currentState) {
            this._currentState.onExit();
        }
        //s.stateMachine = this; 传出去
        this._currentState = s;
        this._currentState.onEnter();
    }
}

/**
 * 状态接口，有两个方法。
 */
interface State {
    //stateMachine:StateMachine;
    onEnter();
    onExit();
}

/**
 * 实现状态。_player为目前的人物，
 */
class PlayerState implements State {
    //stateMachine:StateMachine;
    _player: Player;
    constructor(player: Player) {
        this._player = player;
    }

    onEnter() {}
    onExit() {}
}

class PlayerMoveState extends PlayerState {
    _targetX: number;
    _targetY: number;
    constructor(player: Player, targetX: number, targetY: number) {
        super(player);
        this._targetX = targetX;
        this._targetY = targetY;
    }
    onEnter() {
        this._player._label.text = "move";
        var tw = egret.Tween.get(this._player._body);
        tw.to({ x: this._targetX, y: this._targetY }, 500).call(this._player.idle, this._player);
    }
}

class PlayerIdleState extends PlayerState {

    onEnter() {
        this._player._label.text = "idle";
    }
}