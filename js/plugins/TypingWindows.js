/*:
* @target MZ
* @plugindesc Handles prompt windows for combat and bonuses.
* @author Jamie Rossiter
*/

// Create windows underneath enemies for field combat
function Window_TypingPrompt(prompt, enemy){
    this.initialize.apply(this);
    this._initPrompt = prompt;
    this._associatedEnemy = enemy;
}

Window_TypingPrompt.prototype = Object.create(Window_Base.prototype);
Window_TypingPrompt.prototype.constructor = Window_TypingPrompt;

Window_TypingPrompt.prototype.initialize = function(){
    Window_Base.prototype.initialize.call(this, new Rectangle(0, 0, 1000, 60));
    this.setBackgroundType(0);
}

Window_TypingPrompt.prototype.update = function(){
    this.contents.clear();

    // Draw text
    this.drawTextEx(`\\c[7]${this._initPrompt}\\c[0]`, 0, 0);
    if(this.initPromptIsBeingTyped()) this.drawTextEx(`\\c[0]${$gameTyping.typed()}\\c[0]`, 0, 0);

    // Follow enemy based on name ID
    this.width = this.textWidth(this._initPrompt) + 25;
    this.x = (this._associatedEnemy.screenX() - this.width) + (this.width / 2);
    this.y = this._associatedEnemy.screenY();

}

Window_TypingPrompt.prototype.initPromptIsBeingTyped = function(){
    return $gameTyping.prompt() === this._initPrompt;
}

Window_TypingPrompt.prototype.getFormattedTyped = function(){
    return `\\c[0]${$gameTyping.typed()}\\c[0]`;
}

Window_TypingPrompt.prototype.formattedInitPrompt = function(){
    return `\\c[7]${this._initPrompt}\\c[0]`;
}

Window_TypingPrompt.prototype.initPrompt = function(){
    return this._initPrompt;
}

// Create typing error window
function Window_TypingError(){
    this.initialize.apply(this, arguments);
}

Window_TypingError.prototype = Object.create(Window_Base.prototype);
Window_TypingError.prototype.constructor = Window_TypingError;

Window_TypingError.prototype.initialize = function(){
    Window_Base.prototype.initialize.call(this, new Rectangle(500, 500, 500, 60));
}

Window_TypingError.prototype.update = function(){
    this.contents.clear();
    this.hide();
    if($gameTyping.currentIncorrectKey()){
        this.show();
        const errorText = `\\c[2]'${$gameTyping.currentIncorrectKey()}'\\c[0] doesn't match any prompts!`;
        const textWidth = this.textWidth(errorText);
        this.width = textWidth - 105;
        this.drawTextEx(errorText, 0, 0);
    }
    this.x = (Graphics.boxWidth / 2) - (this.width / 2);
}