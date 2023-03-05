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
    this._noBombs = false;
    document.addEventListener("keydown", this.listenToKeyEvent.bind(this));
}

Game_Typing.prototype.listenToKeyEvent = function(keyEvent){

    // Initial conditions to be met for listening to key event
    if(!this.isReady()) return;
    if($gameCombat.isPlayerReloading()) return;
    if($gameCombat.isPlayerBeingAttacked()) return;
    if($gamePlayer.isDead()) return;


    const key = keyEvent.key.toUpperCase();
    this._currentKey = key;

    // Handle prompt selection
    if(this._typed.length <= 0 && this.isNormalKeyPressed() && this.promptExistsBasedOnInitialKey()){
        this.selectPromptBasedOnInitialKey();

        if(!this._prompt){
            this._currentIncorrectKey = key;
            return;
        }
        this.addKeyToTyped();
        this._currentIncorrectKey = "";

        $gameCombat.playPlayerReadyAnimation();

        this._noBombs = false;
        this.playKeyboardSe();
        return;
    }

    // Handle incorrect key press
    if(!this.isCorrectKeyPressed() && this.isNormalKeyPressed()){
        this._currentIncorrectKey = key;
        this._noBombs = false;
        return;
    }

    // Handle normal key press
    if(this.isNormalKeyPressed()){
        this.addKeyToTyped();
        this._currentIncorrectKey = "";
        this._noBombs = false;
        this.playKeyboardSe();
    }

    // Handle backspace key press
    if(this.isBackspacePressed()){
        this.removeKeyFromTyped();
        this._currentIncorrectKey = "";
        this._noBombs = false;
    }

    // Handle tab key press
    if(this.isTabPressed()){
        $gameCombat.performReload();
        this._noBombs = false;
        this._currentIncorrectKey = "";
    }

    // Handle space bar press
    if(this.isSpacePressed()){
        
        // Handle empty bombs
        if($gamePlayer.bombs() <= 0){
            this._noBombs = true;
            this._currentIncorrectKey = "";
            return;
        }   

        // Throw bomb
        this._noBombs = false;
        this.clearPrompt();
        this.clearTyped();
        $gameCombat.playPlayerBombAnimation();
    }

    // Check if prompt typed (TODO: Move all functions within if statement to combat logic)
    if(this.isTyped()){
        $gamePlayer.removeBullets(1);
        $gameCombat.playPlayerShootAnimation();
        $gameScreen.startBetterShake(10, 7, false);
        $gameScreen.startFlash([255, 255, 255, 255], 5);
        $gameCombat.playEnemyHitAnimation($gameCombat.getCurrentEnemy());
        $gameCombat.destroyPromptWindow(this._prompt);
        $gameCombat.getCurrentEnemy().setIsAlive(false);
        this.clearPrompt();
        this.clearTyped();
        this._noBombs = false;
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
    return (this._prompt[this._typed.length] === this._currentKey) && (this._prompt.length > 0);
}

Game_Typing.prototype.isBackspacePressed = function(){
    return this._currentKey.toLowerCase() === "backspace";
}

Game_Typing.prototype.isSpacePressed = function(){
    return this._currentKey.toLowerCase() === " ";
}

Game_Typing.prototype.isTabPressed = function(){
    return this._currentKey.toLowerCase() === "tab";
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
    if(!word){
        this._prompt = "";
        return;
    }
    this._prompt = word.prompt;
}

Game_Typing.prototype.clearTyped = function(){
    this._typed = "";
}

Game_Typing.prototype.clearPrompt = function(){
    this._prompt = "";
}

Game_Typing.prototype.reset = function(){
    this.clearTyped();
    this.clearPrompt();
}

Game_Typing.prototype.noBombs = function(){
    return this._noBombs;
}

Game_Typing.prototype.playKeyboardSe = function(){
    AudioManager.playSe({
        name: "keyboard_stroke",
        pan: 0,
        pitch: Math.floor(Math.random() * (110 - 80) + 80),
        volume: 50
    })
}

const $gameTyping = new Game_Typing();

