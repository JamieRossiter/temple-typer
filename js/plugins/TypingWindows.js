/*:
* @target MZ
* @plugindesc Handles prompt windows for combat and bonuses.
* @author Jamie Rossiter
*/

// Create windows underneath enemies for field combat
function Window_TypingCombat(prompt, enemyNameId){
    this.initialize.apply(this);
    this._initPrompt = prompt;
    this._enemyNameId = enemyNameId;
}

Window_TypingCombat.prototype = Object.create(Window_Base.prototype);
Window_TypingCombat.prototype.constructor = Window_TypingCombat;

Window_TypingCombat.prototype.initialize = function(){
    Window_Base.prototype.initialize.call(this, new Rectangle(0, 0, 1000, 60));
    this._associatedEnemy = undefined;
}

Window_TypingCombat.prototype.update = function(){
    this.contents.clear();
    if(!this._associatedEnemy) this._associatedEnemy = this.getEnemyByNameId(this._enemyNameId);

    // Draw text
    this.drawTextEx(
        `${
            this.initPromptIsBeingTyped() ? 
            (this.formattedTyped() + this.formattedUntyped()) : 
            this.formattedInitPrompt()
        }`, 
        0, 0
    );

    // Follow enemy based on name ID
    this.width = this.textWidth(this._initPrompt) + 25;
    this.x = (this._associatedEnemy.screenX() - this.width) + (this.width / 2);
    this.y = this._associatedEnemy.screenY() + 10;

}

Window_TypingCombat.prototype.initPromptIsBeingTyped = function(){
    return $gameTyping.prompt() === this._initPrompt;
}

Window_TypingCombat.prototype.formattedUntyped = function(){
    const typed = $gameTyping.typed();
    return `\\c[7]${typed.length > 0 ? this._initPrompt.split(typed)[1] : this._initPrompt}\\c[0]`;
}

Window_TypingCombat.prototype.formattedTyped = function(){
    return `\\c[0]${$gameTyping.typed()}\\c[0]`;
}

Window_TypingCombat.prototype.formattedInitPrompt = function(){
    return `\\c[7]${this._initPrompt}\\c[0]`;
}

Window_TypingCombat.prototype.getEnemyByNameId = function(id){
    const enemy = $gameMap.events().find(ev => {
        return ev.event().name.includes(`enemy_${id}`);
    })
    if(!enemy) return;
    if(!enemy.event()) return;
    if(!enemy.event().name) return;
    return enemy;
}

// Scene Map for testing
const typing_sceneMap_start_alias = Scene_Map.prototype.start;
Scene_Map.prototype.start = function(){
    typing_sceneMap_start_alias.call(this);
    this.addChild(new Window_TypingCombat("hello", 1));
}