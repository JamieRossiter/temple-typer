/*:
* @target MZ
* @plugindesc Handles combat and enemy logic.
* @author Jamie Rossiter
*/

function Game_Combat(){
    this.initialize.apply(this, arguments);
}

Game_Combat.prototype.initialize = function(){
    this._mapScene = undefined;
    this._promptList = [];
    this._enemies = [];
    this._promptWindows = [];
    this._enemySpawnIds = {
        "warrior_normal": 1,
        "archer_normal": 2,
        "shaman_normal": 3,
        "teleporter_normal": 4,
        "warrior_elite": 5,
        "archer_elite": 6,
        "shaman_elite": 7,
        "teleporter_elite": 8
    }
    this.loadPrompts();
}

Game_Combat.prototype.start = function(mapScene){
    this._mapScene = mapScene;
    mapScene.addChild(new Window_TypingError());
}

Game_Combat.prototype.findEnemies = function(){
    this._enemies = $gameMap.events().filter(ev => {
        return ev.event().note.includes(`<enemy>`);
    })
}

Game_Combat.prototype.createPromptWindows = function(){
    if(!this._mapScene) return;
    this._enemies.forEach((enemy) => {
        if(!enemy.hasPromptWindow()){
            const randomPrompt = this.getRandomPrompt();
            enemy.setCurrentPrompt(randomPrompt);
            this._mapScene.addChild(new Window_TypingPrompt(randomPrompt, enemy));
        }
        enemy.setHasPromptWindow(true);
    })
}

Game_Combat.prototype.spawnEnemies = function(){
    // TODO: Create different enemy configurations!
    Galv.SPAWN.event(1, "regions", [1], "terrain", false);
    this.findEnemies();
    this.createPromptWindows();
}

Game_Combat.prototype.loadPrompts = function(){
    fetch("./data/words.txt")
    .then(res => res.text())
    .then(data => {
        const capitalized = data.toUpperCase();
        const words = capitalized.split("\n");
        this._promptList = words;
    });
}

Game_Combat.prototype.getRandomPrompt = function(){
    const currentEnemyPrompts = this.getCurrentEnemyPrompts();
    let isUnique = false;
    let prompt = "";
    while(!isUnique){
        prompt = this._promptList[Math.floor(Math.random() * this._promptList.length)];
        const promptInitialLetters = currentEnemyPrompts.map(enemyPrompt => enemyPrompt[0]);
        if(prompt && !currentEnemyPrompts.includes(prompt) && !promptInitialLetters.includes(prompt[0])){
            isUnique = true;
        }
    }
    return prompt;
}

Game_Combat.prototype.getCurrentEnemyPrompts = function(){
    return this._enemies.map(enemy => {
        return enemy.currentPrompt();
    })
}

Game_Combat.prototype.getCurrentEnemy = function(){
    return this._enemies.find(enemy => {
        return enemy.currentPrompt() === $gameTyping.prompt();
    })
}

Game_Combat.prototype.playPlayerShootAnimation = function(){
    const playerAnimShootSwitch = 21;
    $gameSwitches.setValue(playerAnimShootSwitch, true);
}

Game_Combat.prototype.playEnemyHitAnimation = function(){
    const enemyHitAnimSelfSwitch = "A";
    $gameSelfSwitches.setValue([$gameMap.mapId(), this.getCurrentEnemy().eventId(), enemyHitAnimSelfSwitch], true);
}

const $gameCombat = new Game_Combat();

// Game_Event overrides
Game_Event.prototype.hasPromptWindow = function(){
    return this._hasPromptWindow;
}

Game_Event.prototype.setHasPromptWindow = function(promptWindow){
    this._hasPromptWindow = promptWindow;
}

Game_Event.prototype.currentPrompt = function(){
    return this._currentPrompt;
}

Game_Event.prototype.setCurrentPrompt = function(prompt){
    this._currentPrompt = prompt;
}

// Game_CharacterBase Overrides
Game_CharacterBase.prototype.setIsEnemyBeingDamaged = function(damaged){
    this._isEnemyBeingDamaged = damaged;
}

Game_CharacterBase.prototype.updatePattern = function() {
    if(this._isEnemyBeingDamaged) return;
    if (!this.hasStepAnime() && this._stopCount > 0) {
        this.resetPattern();
    } else {
        this._pattern = (this._pattern + 1) % this.maxPattern();
    }
};

// Scene Map Overrides
const combat_sceneMap_start_alias = Scene_Map.prototype.start;
Scene_Map.prototype.start = function(){
    combat_sceneMap_start_alias.call(this);
    $gameCombat.start(this);
}

const combat_sceneMap_update_alias = Scene_Map.prototype.update;
Scene_Map.prototype.update = function(){
    combat_sceneMap_update_alias.call(this);
}