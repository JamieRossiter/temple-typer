/*:
* @target MZ
* @plugindesc Handles user typing logic.
* @author Jamie Rossiter
*/

function Game_Typing(){
    this.initialize.apply(this, arguments);
}

Game_Typing.prototype.initialize = function(){
    this._isReady = true;
    this._normalKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    this._currentKey = "";
    this._currentIncorrectKey = "";
    this._prompt = "";
    this._typed = "";
    document.addEventListener("keydown", this.listenToKeyEvent.bind(this));
}

Game_Typing.prototype.listenToKeyEvent = function(keyEvent){

    if(!this.isReady()) return;

    const key = keyEvent.key.toUpperCase();
    this._currentKey = key;

    // Handle prompt selection
    if(this._typed.length <= 0 && this.isNormalKeyPressed() && this.promptExistsBasedOnInitialKey()){
        this.selectPromptBasedOnInitialKey();
        this.addKeyToTyped();
        this._currentIncorrectKey = "";
        return;
    }

    // Handle incorrect key press
    if(!this.isCorrectKeyPressed() && this.isNormalKeyPressed()){
        this._currentIncorrectKey = key;
        return;
    }

    // Handle normal key press
    if(this.isNormalKeyPressed()){
        this.addKeyToTyped();
        this._currentIncorrectKey = "";
    }

    // Handle backspace key press
    if(this.isBackspacePressed()){
        this.removeKeyFromTyped();
        this._currentIncorrectKey = "";
    }

    // Check if prompt typed
    if(this.isTyped()){
        $gameCombat.playPlayerShootAnimation();
        $gameCombat.getCurrentEnemy().setIsEnemyBeingDamaged(true);
        $gameScreen.startBetterShake(10, 7, false);
        $gameScreen.startFlash([255, 255, 255, 255], 5);
        $gameCombat.playEnemyHitAnimation();
        $gameCombat.destroyPromptWindow(this._prompt);
        $gameCombat.getCurrentEnemy().setIsAlive(false);
        this.clearPrompt();
        this.clearTyped();
    }

}

Game_Typing.prototype.isReady = function(){
    return this._isReady;
}

Game_Typing.prototype.setIsReady = function(ready){
    return this._isReady = ready;
}

Game_Typing.prototype.isNormalKeyPressed = function(){
    return this._normalKeys.split("").includes(this._currentKey);
}

Game_Typing.prototype.isCorrectKeyPressed = function(){
    return this._prompt[this._typed.length] === this._currentKey;
}

Game_Typing.prototype.isBackspacePressed = function(){
    return this._currentKey.toLowerCase() === "backspace";
}

Game_Typing.prototype.addKeyToTyped = function(){
    this._typed += this._currentKey;
}

Game_Typing.prototype.removeKeyFromTyped = function(){
    this._typed = this._typed.slice(0, -1);
}

Game_Typing.prototype.currentKey = function(){
    return this._currentKey;
}

Game_Typing.prototype.currentIncorrectKey = function(){
    return this._currentIncorrectKey;
}

Game_Typing.prototype.isTyped = function(){
    return (this._prompt === this._typed) && (this._typed.length != 0);
}

Game_Typing.prototype.typed = function(){
    return this._typed;
}

Game_Typing.prototype.prompt = function(){
    return this._prompt;
}

Game_Typing.prototype.promptExistsBasedOnInitialKey = function(){
    return $gameCombat.getCurrentEnemyPrompts().find(promptObj => {
        if(promptObj) return promptObj.prompt[0] === this._currentKey;
    })
}

Game_Typing.prototype.selectPromptBasedOnInitialKey = function(){
    const word = $gameCombat.getCurrentEnemyPrompts().find(promptObj => {
        if(promptObj && promptObj.isAlive) return promptObj.prompt[0] === this._currentKey;
    })
    this._prompt = word.prompt;
}

Game_Typing.prototype.clearTyped = function(){
    this._typed = "";
}

Game_Typing.prototype.clearPrompt = function(){
    this._prompt = "";
}

const $gameTyping = new Game_Typing();

