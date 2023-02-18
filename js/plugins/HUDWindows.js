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
    Window_Base.prototype.initialize.call(this, new Rectangle((Graphics.boxWidth - 200), 30, 500, 115));
    this._lifeX = 0;
    this._maxLifeX = 0; 
}

Window_PlayerLives.prototype.update = function(){
    this.contents.clear();
    // Draw label
    this.drawTextEx("\\}LIVES\\{", 7, 0);
    // Draw lives
    for(let i = 0; i < $gamePlayer.lives(); i++){
        if(!i){
            this._lifeX = 25;
        } else {
            this._lifeX += 45;
        }
        this.drawCharacter("player/pirate_heads", 0, this._lifeX, 130);
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
    Window_Base.prototype.initialize.call(this, new Rectangle(50, 30, 140, 500));
}

Window_Ammunition.prototype.update = function(){
    this.contents.clear();
    // Draw label
    this.drawTextEx("\\}BULLETS\\{", 7, 0);
    
    // Draw Bullets
    const rows = $gamePlayer.maxBullets() / 5;
    for(let r = 1; r < (rows + 1); r++){
        for(let i = 0; i < $gamePlayer.bullets(); i++){
            this.drawIcon(975, 20 * i, 25 * r);
        }
    }

    // Determine window height
    switch(rows){
        case 1:
            this.height = 80;
            break;
        case 2:
            this.height = 100;
            break;
        case 3: 
            this.height = 130;
            break;
        case 4: 
            this.height = 150;
            break;
    }
}

const playerLivesWindow_sceneMap_start_override = Scene_Map.prototype.start;
Scene_Map.prototype.start = function(){
    playerLivesWindow_sceneMap_start_override.call(this);
    this.addChild(new Window_PlayerLives());
    this.addChild(new Window_Ammunition());
}