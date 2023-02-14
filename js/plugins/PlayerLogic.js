/*:
* @target MZ
* @plugindesc Extends the player class.
* @author Jamie Rossiter
*/

const playerLogic_gamePlayer_initialize_override = Game_Player.prototype.initialize;
Game_Player.prototype.initialize = function() {
    playerLogic_gamePlayer_initialize_override.call(this);
    this._lives = 3;
    this._maxLives = 3;
};

Game_Player.prototype.lives = function(){
    return this._lives;
}

Game_Player.prototype.maxLives = function(){
    return this._maxLives;
}

Game_Player.prototype.increaseMaxLives = function(num){
    this._maxLives += num;
}

Game_Player.prototype.decreaseMaxLives = function(num){
    if((this._maxLives - num) < 1){
        this._maxLives = 1;
        return;
    }
    this._maxLives -= num; 
}

Game_Player.prototype.addLives = function(lives){
    if((this._lives + lives) > this._maxLives) this._lives = this._maxLives;
    this._lives += lives;
}

Game_Player.prototype.removeLives = function(lives){
    if((this._lives - lives) < 0){
        this._lives = 0;
        return;
    }
    this._lives -= lives;
}