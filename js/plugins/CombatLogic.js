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
}

Game_Combat.prototype.start = function(mapScene){
    this._mapScene = mapScene;
}

Game_Combat.prototype.findEnemies = function(){
    this._enemies = $gameMap.events().filter(ev => {
        return ev.event().note.includes(`<enemy>`);
    })
}

Game_Combat.prototype.createPromptWindows = function(){
    if(!this._mapScene) return;
    this._enemies.forEach((enemy) => {
        if(!enemy.hasPromptWindow()) this._mapScene.addChild(new Window_TypingPrompt("HELLO", enemy));
        enemy.setHasPromptWindow(true);
    })
}

Game_Combat.prototype.spawnEnemies = function(){
    // TODO: Create different enemy configurations!
    Galv.SPAWN.event(3, "regions", [1], "all", false);
    Galv.SPAWN.event(6, "regions", [1], "all", false);
    this.findEnemies();
    this.createPromptWindows();
}

const $gameCombat = new Game_Combat();

// Game_Event overrides
Game_Event.prototype.hasPromptWindow = function(){
    return this._hasPromptWindow;
}

Game_Event.prototype.setHasPromptWindow = function(promptWindow){
    this._hasPromptWindow = promptWindow;
}

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