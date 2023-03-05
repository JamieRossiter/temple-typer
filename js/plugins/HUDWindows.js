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
    Window_Base.prototype.initialize.call(this, new Rectangle(30, 70, 500, 115));
    this._lifeX = 0;
    this._maxLifeX = 0; 
    this.setBackgroundType(2);
}

Window_PlayerLives.prototype.update = function(){
    this.contents.clear();

    // Draw lives
    for(let i = 0; i < $gamePlayer.lives(); i++){
        if(!i){
            this._lifeX = 25;
        } else {
            this._lifeX += 45;
        }
        this.drawCharacter("player/pirate_heads_glow", 0, this._lifeX, 100);
    }
    // Draw max lives
    for(let i = 0; i < $gamePlayer.maxLives(); i++){
        if(!i){
            this._maxLifeX = 25;
        } else {
            this._maxLifeX += 45;
        }
        this.drawCharacter("player/pirate_heads_transparent", 0, this._maxLifeX, 100);
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
    this.setBackgroundType(2);
    this._reloadGauge = null;
    this._reloadTime = 0;
    this._maxReloadTime = 120;
    this.drawReloadGauge(0, 22);
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
    if($gameCombat.isPlayerReloading()){

        this.drawTextEx(`\\}Reloading...\\{`, 40, 40);
        this._reloadGauge.show();
        this._reloadGauge.update();
        this._reloadTime++;
        this._reloadGauge.setValue(this._reloadTime);

        // Once reloading is finished
        if(this._reloadTime > this._maxReloadTime){
            this._reloadTime = 0;
            $gameCombat.setIsPlayerReloading(false);
        }

        return;
    } 

    this._reloadGauge.hide();
    
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
    this._value = 0;
}

Sprite_ReloadGauge.prototype.setValue = function(value){
    this._value = value;
}

Sprite_ReloadGauge.prototype.drawValue = function() {
    return;
};

Sprite_ReloadGauge.prototype.drawLabel = function() {
    return;
}

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
    return "#dfc50b";
}

Sprite_ReloadGauge.prototype.currentValue = function() {
    return this._value;
};

Sprite_ReloadGauge.prototype.currentMaxValue = function() {
    return 120;
};

// Bomb window

function Window_Bombs(){
    this.initialize.apply(this, arguments);
}

Window_Bombs.prototype = Object.create(Window_Base.prototype);
Window_Bombs.prototype.constructor = Window_Bombs;

Window_Bombs.prototype.initialize = function(){
    Window_Base.prototype.initialize.call(this, new Rectangle(30, 10, 500, 150));
    this._bombX = 0;
    this._maxBombX = 0; 
    this.setBackgroundType(2);
}

Window_Bombs.prototype.update = function(){
    this.contents.clear();

    // Draw bombs
    for(let i = 0; i < $gamePlayer.bombs(); i++){
        if(!i){
            this._bombX = 25;
        } else {
            this._bombX += 45;
        }
        this.drawCharacter("misc/$bomb_glow", 0, this._bombX, 70);
    }
    // Draw max lives
    for(let i = 0; i < $gamePlayer.maxBombs(); i++){
        if(!i){
            this._maxBombX = 25;
        } else {
            this._maxBombX += 45;
        }
        this.drawCharacter("misc/$bomb_transparent", 0, this._maxBombX, 70);
    }
    this.width = this._maxBombX + 50;
    
}

const playerLivesWindow_sceneMap_start_override = Scene_Map.prototype.start;
Scene_Map.prototype.start = function(){
    playerLivesWindow_sceneMap_start_override.call(this);
    this.addChild(new Window_PlayerLives());
    this.addChild(new Window_Ammunition());
    this.addChild(new Window_Bombs());
}