/*:
* @target MZ
* @plugindesc Handles user typing logic.
* @author Jamie Rossiter
*/

function Game_Typing(){
    this.initialize.apply(this, arguments);
}

Game_Typing.prototype.initialize = function(){
    this._isReady = false;
    this._normalKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    this._prompt = "";
    this._typed = "";
    this._TESTwords = ["hello", "world", "cool"];
    document.addEventListener("keydown", this.listenToKeyEvent.bind(this));
}

Game_Typing.prototype.listenToKeyEvent = function(keyEvent){

    if(!this.isReady()) return;

    const key = keyEvent.key;

    // Handle prompt selection
    if(this._typed.length <= 0 && this.isNormalKeyPressed(key) && this.promptExistsBasedOnInitialKey(key)){
        this.selectPromptBasedOnInitialKey(key);
        this.addKeyToTyped(key);
        return;
    }

    // Handle incorrect key press
    if(!this.isCorrectKeyPressed(key) && this.isNormalKeyPressed(key)){
        window.alert("Wrong key!");
        return;
    }

    // Handle normal key press
    if(this.isNormalKeyPressed(key)){
        this.addKeyToTyped(key);
    }

    // Handle backspace key press
    if(this.isBackspacePressed(key)){
        this.removeKeyFromTyped();
    }

    // Check if prompt typed
    if(this.isTyped()){
        window.alert("Prompt typed!");
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

Game_Typing.prototype.isNormalKeyPressed = function(key){
    return this._normalKeys.split("").includes(key);
}

Game_Typing.prototype.isCorrectKeyPressed = function(key){
    return this.untyped()[0] === key;
}

Game_Typing.prototype.isBackspacePressed = function(key){
    return key.toLowerCase() === "backspace";
}

Game_Typing.prototype.addKeyToTyped = function(key){
    this._typed += key;
}

Game_Typing.prototype.removeKeyFromTyped = function(){
    this._typed = this._typed.slice(0, -1);
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

Game_Typing.prototype.untyped = function(){
    if(this._typed.length > 0) return this._prompt.split(this._typed)[1];
    else return this._prompt;
}

Game_Typing.prototype.promptExistsBasedOnInitialKey = function(key){
    return this._TESTwords.find(word => {
        return word[0] === key;
    })
}

Game_Typing.prototype.selectPromptBasedOnInitialKey = function(key){
    const word = this._TESTwords.find(word => {
        return word[0] === key;
    })
    this._prompt = word;
}

Game_Typing.prototype.clearTyped = function(){
    this._typed = "";
}

Game_Typing.prototype.clearPrompt = function(){
    this._prompt = "";
}

const $gameTyping = new Game_Typing();

