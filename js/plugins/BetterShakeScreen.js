/*:
@target MZ
@plugindesc A better shake mechanic.
@author Theo Allen and Jamie Rossiter
*/

const betterShake_gameScreen_initialize_override = Game_Screen.prototype.initialize;
Game_Screen.prototype.initialize = function() {
    betterShake_gameScreen_initialize_override.call(this);
    this.betterShake = {};
};

Game_Screen.prototype.startBetterShake = function(dur, power, diminish){ 
    this.betterShake.dur = dur;
    this.betterShake.maxDur = dur;
    this.betterShake.power = power;
    this.betterShake.diminish = diminish;
}

const betterShake_spritesetBase_updatePosition_override = Spriteset_Base.prototype.updatePosition;
Spriteset_Base.prototype.updatePosition = function(){
    betterShake_spritesetBase_updatePosition_override.call(this);
    if($gameScreen.betterShake.dur > 0){
        let rate = $gameScreen.betterShake.diminish ? $gameScreen.betterShake.dur/$gameScreen.betterShake.maxdur : 1.0;
        this.x += Math.random() * $gameScreen.betterShake.power * rate * (Math.random() >= 0.5 ? 1 : -1);
        this.y += Math.random() * $gameScreen.betterShake.power * rate * (Math.random() >= 0.5 ? 1 : -1);
        $gameScreen.betterShake.dur -= 1
    }
}