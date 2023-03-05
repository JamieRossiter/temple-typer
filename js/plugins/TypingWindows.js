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
    Window_Base.prototype.initialize.call(this, new Rectangle(-1000, -1000, 1000, 60));
    this._fadeType = undefined;
    this.setBackgroundType(2);
}

Window_TypingPrompt.prototype.update = function(){
    this.contents.clear();

    // Handle prompt fade out/fade in for shaman enemies
    if(this._fadeType === "fadeOut") this.fadeOut();
    if(this._fadeType === "fadeIn") this.fadeIn();

    // Draw text
    this.drawTextEx(this.formattedInitPrompt(), 0, 0);
    if(this.initPromptIsBeingTyped()) this.drawTextEx(this.getFormattedTyped(), 0, 0);

    // Follow enemy based on name ID
    this.width = this.textWidth(this._initPrompt) + 25;
    this.x = (this._associatedEnemy.screenX() - this.width) + (this.width / 2);
    this.y = this._associatedEnemy.isArrow() ? this._associatedEnemy.screenY() - 40 : this._associatedEnemy.screenY() - 10;

}

Window_TypingPrompt.prototype.initPromptIsBeingTyped = function(){
    return $gameTyping.prompt() === this._initPrompt;
}

Window_TypingPrompt.prototype.getFormattedTyped = function(){
    return `\\c[29]${$gameTyping.typed()}\\c[0]`;
}

Window_TypingPrompt.prototype.formattedInitPrompt = function(){
    return `\\c[0]${this._initPrompt}\\c[0]`;
}

Window_TypingPrompt.prototype.initPrompt = function(){
    return this._initPrompt;
}

Window_TypingPrompt.prototype.fadeOut = function(){
    if(this.contentsOpacity > 0) this.contentsOpacity -= 5;
}

Window_TypingPrompt.prototype.fadeIn = function(){
    if(this.contentsOpacity < 255) this.contentsOpacity += 5;
}

// Create typing error window
function Window_TypingError(){
    this.initialize.apply(this, arguments);
}

Window_TypingError.prototype = Object.create(Window_Base.prototype);
Window_TypingError.prototype.constructor = Window_TypingError;

Window_TypingError.prototype.initialize = function(){
    Window_Base.prototype.initialize.call(this, new Rectangle(800, 50, 500, 60));
    this.setBackgroundType(0);
}

Window_TypingError.prototype.update = function(){
    this.contents.clear();
    this.hide();
    let errorText = "";
    let textWidth = 0;

    if($gameTyping.currentIncorrectKey()){

        this.show();
        errorText = `\\c[2]'${$gameTyping.currentIncorrectKey()}'\\c[0] doesn't match any prompts!`;
        textWidth = this.textWidth(errorText);
        this.width = textWidth - 65;
        
    } else if ($gameTyping.noBombs()){

        this.show();
        errorText = "You don't have any bombs!";
        textWidth = this.textWidth(errorText);
        this.width = textWidth + 65;

    }

    this.drawIcon(239, 0, 2); // Draw red 'X' icon
    this.drawTextEx(errorText, 40, 0);
    this.x = (Graphics.boxWidth / 2) - (this.width / 3);
}