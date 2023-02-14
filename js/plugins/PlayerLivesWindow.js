/*:
@target MZ
@plugindesc Creates a window showing the number of lives the player has.
@author Jamie Rossiter
*/

function Window_PlayerLives(){
    this.initialize.apply(this, arguments);
}

Window_PlayerLives.prototype = Object.create(Window_Base.prototype);
Window_PlayerLives.prototype.constructor = Window_PlayerLives;

Window_PlayerLives.prototype.initialize = function(){
    Window_Base.prototype.initialize.call(this, new Rectangle(50, 50, 500, 80));
    this._lifeX = 0;
    this._maxLifeX = 0;
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
        this.drawCharacter("player/pirate_heads", 0, this._lifeX, 95);
    }
    // Draw max lives
    for(let i = 0; i < $gamePlayer.maxLives(); i++){
        if(!i){
            this._maxLifeX = 25;
        } else {
            this._maxLifeX += 45;
        }
        this.drawCharacter("player/pirate_heads", 0, this._maxLifeX, 95);
    }
    this.width = this._maxLifeX + 50;
}

const playerLivesWindow_sceneMap_start_override = Scene_Map.prototype.start;
Scene_Map.prototype.start = function(){
    playerLivesWindow_sceneMap_start_override.call(this);
    this.addChild(new Window_PlayerLives());
}