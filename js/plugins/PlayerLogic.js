/*:
* @target MZ
* @plugindesc Extends the player class.
* @author Jamie Rossiter
*/

const playerLogic_gamePlayer_initialize_override = Game_Player.prototype.initialize;
Game_Player.prototype.initialize = function() {
    playerLogic_gamePlayer_initialize_override.call(this);
    this._isPlayerPerformingAnim = false;
    this._lives = 3;
    this._maxLives = 3;
    this._bullets = 5;
    this._maxBullets = 5;
    this._bombs = 3;
    this._maxBombs = 3;
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

Game_Player.prototype.bullets = function(){
    return this._bullets;
}

Game_Player.prototype.maxBullets = function(){
    return this._maxBullets;
}

Game_Player.prototype.reloadBullets = function(){
    this._bullets = this._maxBullets;
}

Game_Player.prototype.increaseMaxBullets = function(num){
    this._maxBullets += num;
}

Game_Player.prototype.decreaseMaxBullets = function(num){
    this._maxBullets -= num;
}

Game_Player.prototype.removeBullets = function(bullets){
    if((this._bullets - bullets) <= 0){
        this._bullets = 0;
        return;
    }
    this._bullets -= bullets;
}

Game_Player.prototype.bombs = function(){
    return this._bombs;
}

Game_Player.prototype.maxBombs = function(){
    return this._maxBombs;
}

Game_Player.prototype.increaseMaxBombs = function(num){
    this._maxBombs += num;
}

Game_Player.prototype.decreaseMaxBombs = function(num){
    if((this._maxBombs - num) < 1){
        this._maxBombs = 1;
        return;
    }
    this._maxBombs -= num; 
}

Game_Player.prototype.addBombs = function(bombs){
    if((this._bombs + bombs) > this._maxBombs) this._bombs = this._maxBombs;
    this._bombs += bombs;
}

Game_Player.prototype.removeBombs = function(bombs){
    if((this._bombs - bombs) < 0){
        this._bombs = 0;
        return;
    }
    this._bombs -= bombs;
}


Game_Player.prototype.isPlayerPerformingAnim = function(){
    return this._isPlayerPerformingAnim;
}

Game_Player.prototype.setIsPlayerPerformingAnim = function(performing){
    this._isPlayerPerformingAnim = performing;
}

Game_Player.prototype.updatePattern = function() {
    if(this._isPlayerPerformingAnim) return;
    if (!this.hasStepAnime() && this._stopCount > 0) {
        this.resetPattern();
    } else {
        this._pattern = (this._pattern + 1) % this.maxPattern();
    }
};

Game_Player.prototype.isDead = function(){
    return this._lives <= 0;
}