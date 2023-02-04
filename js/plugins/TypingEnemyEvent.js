/*:
@target MZ
@plugindesc Creates the Game_Event subclass for typing enemies.
@author Jamie Rossiter
*/

function Game_TypingEnemyEvent(){
    this.initialize.apply(this, arguments);
}

Game_TypingEnemyEvent.prototype = Object.create(Game_Event.prototype);
Game_TypingEnemyEvent.prototype.constructor = Game_TypingEnemyEvent;

Game_TypingEnemyEvent.prototype.initialize = function(mapId, eventId){
    Game_Event.prototype.initialize.call(this, mapId, eventId);
    this._hasPromptWindow = false; 
    this._currentPrompt = "";
    this._isAlive = true;
    this._isEnemyBeingDamaged = false;
}

Game_TypingEnemyEvent.prototype.hasPromptWindow = function(){
    return this._hasPromptWindow;
}

Game_TypingEnemyEvent.prototype.setHasPromptWindow = function(promptWindow){
    this._hasPromptWindow = promptWindow;
}

Game_TypingEnemyEvent.prototype.currentPrompt = function(){
    return this._currentPrompt;
}

Game_TypingEnemyEvent.prototype.setCurrentPrompt = function(prompt){
    this._currentPrompt = prompt;
}

Game_TypingEnemyEvent.prototype.isAlive = function(){
    return this._isAlive;
}

Game_TypingEnemyEvent.prototype.setIsAlive = function(alive){
    this._isAlive = alive;
}

Game_TypingEnemyEvent.prototype.setIsEnemyBeingDamaged = function(damaged){
    this._isEnemyBeingDamaged = damaged;
}

Game_TypingEnemyEvent.prototype.updatePattern = function() {
    if(this._isEnemyBeingDamaged) return;
    if (!this.hasStepAnime() && this._stopCount > 0) {
        this.resetPattern();
    } else {
        this._pattern = (this._pattern + 1) % this.maxPattern();
    }
};