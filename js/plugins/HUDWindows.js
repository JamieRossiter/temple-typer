/*:
@target MZ
@plugindesc Creates various HUD windows.
@author Jamie Rossiter
*/

// Player Lives Window

function Window_PlayerLives(){
    this.initialize.apply(this, arguments);
}

Window_PlayerLives.prototype = Object.create(Window_Base.prototype);
Window_PlayerLives.prototype.constructor = Window_PlayerLives;

Window_PlayerLives.prototype.initialize = function(){
    Window_Base.prototype.initialize.call(this, new Rectangle(30, 40, 500, 115));
    this._lifeX = 0;
    this._maxLifeX = 0; 
    this.setBackgroundType(2);
}

Window_PlayerLives.prototype.update = function(){
    this.contents.clear();
    // Draw label
    // this.drawTextEx("\\}LIVES\\{", 7, 0);
    // Draw lives
    for(let i = 0; i < $gamePlayer.lives(); i++){
        if(!i){
            this._lifeX = 25;
        } else {
            this._lifeX += 45;
        }
        this.drawCharacter("player/pirate_heads_glow", 0, this._lifeX, 130);
    }
    // Draw max lives
    for(let i = 0; i < $gamePlayer.maxLives(); i++){
        if(!i){
            this._maxLifeX = 25;
        } else {
            this._maxLifeX += 45;
        }
        this.drawCharacter("player/pirate_heads_transparent", 0, this._maxLifeX, 130);
    }
    this.width = this._maxLifeX + 50;
}

// Ammunition Window

function Window_Ammunition(){
    this.initialize.apply(this, arguments);
}

Window_Ammunition.prototype = Object.create(Window_Base.prototype);
Window_Ammunition.prototype.constructor = Window_Ammunition;

Window_Ammunition.prototype.initialize = function(){
    Window_Base.prototype.initialize.call(this, new Rectangle(0, $gameCombat.findCombatPlayer().screenY() - 30, 300, 100));
    this.drawReloadGauge(0, 22);
    this.setBackgroundType(2);
    this._reloadGauge = null;
    this._reloading = true;
}

Window_Ammunition.prototype.update = function(){
    this.contents.clear();

    // Draw max bullets
    const startingPos = 25;
    const distance = 20;
    for(let i = startingPos; i < startingPos * 5; i += distance){
        this.drawIcon(974, i, 25);
    }
    
    // Handle reloading
    if(this._reloading){

        this.drawTextEx(`\\}Reloading...\\{`, 40, 40);
        this._reloadTime++;

        return;
    } 
    
    // Draw label
    this.drawTextEx(`\\}${$gamePlayer.bullets()}\\{`, 17, 24);
    
    // Draw bullets
    for(let i = startingPos; i < startingPos * $gamePlayer.bullets(); i += distance){
        this.drawIcon(975, i, 25);
    }
    if($gamePlayer.bullets() === 1) this.drawIcon(975, startingPos, 25);

}

Window_Ammunition.prototype.drawReloadGauge = function(x, y){
    this._reloadGauge = new Sprite_ReloadGauge();
    this._reloadGauge.setup($gameActors.actor(1), "hp"); // Second argument can be ignored
    this._reloadGauge.move(x, y);
    this._reloadGauge.show();
    this.addInnerChild(this._reloadGauge);
}

/* Ammunition Reload Sprite */

function Sprite_ReloadGauge(){
    this.initialize.apply(this, arguments);
}

Sprite_ReloadGauge.prototype = Object.create(Sprite_Gauge.prototype);
Sprite_ReloadGauge.prototype.constructor = Sprite_ReloadGauge;

Sprite_ReloadGauge.prototype.initialize = function(){
    Sprite_Gauge.prototype.initialize.call(this);
}

Sprite_ReloadGauge.prototype.drawValue = function() {
    return;
};

Sprite_ReloadGauge.prototype.gaugeHeight = function() {
    return 10;
};

Sprite_ReloadGauge.prototype.drawGauge = function() {
    const gaugeX = this.gaugeX();
    const gaugeY = this.textHeight() - this.gaugeHeight();
    const gaugewidth = (this.bitmapWidth() - gaugeX);
    const gaugeHeight = this.gaugeHeight();
    this.drawGaugeRect(gaugeX, gaugeY, gaugewidth, gaugeHeight);
};

Sprite_ReloadGauge.prototype.gaugeColor1 = function() {
    return this.determineGaugeColor();
};

Sprite_ReloadGauge.prototype.gaugeColor2 = function() {
    return this.determineGaugeColor();
};

Sprite_ReloadGauge.prototype.determineGaugeColor = function(){
    return "red";
}

Sprite_ReloadGauge.prototype.currentValue = function() {
    return 10;
};

Sprite_ReloadGauge.prototype.currentMaxValue = function() {
    return 30;
};

const playerLivesWindow_sceneMap_start_override = Scene_Map.prototype.start;
Scene_Map.prototype.start = function(){
    playerLivesWindow_sceneMap_start_override.call(this);
    this.addChild(new Window_PlayerLives());
    this.addChild(new Window_Ammunition());
}