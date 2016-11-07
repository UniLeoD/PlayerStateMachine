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
//阿阿啊啊啊啊啊啊啊啊啊啊啊啊啊阿啊啊啊啊啊啊啊啊
//目前用的是MoiveClip这种方法，因为我还是没完全搞明白帧事件的方法阿阿也不想囫囵照别人的打，也不是自己真的懂 阿阿啊啊啊啊啊啊啊啊啊啊阿啊啊啊啊啊 TAT
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

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene(): void {
        var sky: egret.Bitmap = this.createBitmapByName("Banboo_jpg");
        this.addChild(sky);
        var stageW: number = this.stage.stageWidth;
        var stageH: number = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        var player = new Player();
        this.addChild(player);
        sky.touchEnabled = true;
        sky.addEventListener(egret.TouchEvent.TOUCH_END, (e) => {
            player.move(e.stageX, e.stageY);
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


class Player extends egret.DisplayObjectContainer {
    _body:egret.MovieClip;
    _PlayerStateMachine: StateMachine;
    
    

    constructor() {
        super();
        var _mcData = RES.getRes("man_json");
        var _mcTexture = RES.getRes("man_png");
     //   _mcTexture.x = -500;
    //    _mcTexture.y = -500;
        var _mcDataFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(_mcData, _mcTexture);
        
        this._body = new egret.MovieClip( _mcDataFactory.generateMovieClipData( "man" ) );
        this._body.x = -50;
        this._body.y = -50;
        this._PlayerStateMachine = new StateMachine();
 

        this.addChild(this._body);


        this._body.gotoAndPlay("idle",100);
    }

    move(targetX: number, targetY: number) {
        this._PlayerStateMachine.setState(new PlayerMoveState(this, targetX, targetY));
    }

    idle() {
        this._PlayerStateMachine.setState(new PlayerIdleState(this));
    }
}


class StateMachine {
    _currentState: State;
    setState(s: State) {
        if (this._currentState) {
            this._currentState.onExit();
        }

        this._currentState = s;
        this._currentState.onEnter();
    }
}


interface State {
    onEnter();
    onExit();
}


class PlayerState implements State {

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
        this._targetX = targetX - 130;
        this._targetY = targetY - 120;
    }
    onEnter() {
        this._player._body.gotoAndPlay("run");
        var tw = egret.Tween.get(this._player._body);
        tw.to({ x: this._targetX, y: this._targetY }, 500).call(this._player.idle, this._player);
 
    }
}

class PlayerIdleState extends PlayerState {

    onEnter() {
        this._player._body.gotoAndPlay("idle");
    }
}

/*
http://developer.egret.com/cn/example/page/index#100-anim-flash
http://developer.egret.com/cn/github/egret-docs/Engine2D/timeControl/enterFrame/index.html
http://bbs.egret.com/thread-256-1-1.html
http://zccst.iteye.com/blog/2107175
http://blog.csdn.net/laixiao_hero/article/details/52053721
*/
