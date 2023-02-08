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
    this._arrows = [];
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

Game_Combat.prototype.findArrows = function(){
    this._arrows = $gameMap.events().filter(ev => {
        return ev.event().note.includes(`<arrow>`);
    })
    this._arrows.forEach(ev => {
        ev.setIsArrow(true);
    })
    this.findEnemies();
}

Game_Combat.prototype.hasArrowCollidedWithEvent = function(eventId){
    const arrowEvs = this._arrows;
    const currentEv = $gameMap.event(eventId);
    return arrowEvs.some(arrow => arrow.x === currentEv.x && arrow.y === currentEv.y);
}

Game_Combat.prototype.createPromptWindows = function(){
    if(!this._mapScene) return;
    this._enemies.forEach((enemy) => {
        if(!enemy.hasPromptWindow()){
            const randomPrompt = this.getRandomPrompt(enemy);
            enemy.setCurrentPrompt(randomPrompt);
            const newPromptWindow = new Window_TypingPrompt(randomPrompt, enemy);
            this._promptWindows.push(newPromptWindow);
            enemy.setPromptWindow(newPromptWindow);
            this._mapScene.addChild(newPromptWindow);
        }
        enemy.setHasPromptWindow(true);
    })
}

Game_Combat.prototype.destroyPromptWindow = function(prompt){
    const targetPromptWindow = this._promptWindows.find(window => {
        return prompt === window.initPrompt();
    })
    if(!targetPromptWindow) return;
    this._mapScene.removeChild(targetPromptWindow);
}

Game_Combat.prototype.spawnEnemies = function(){
    // TODO: Create different enemy configurations!
    Galv.SPAWN.event(4, "regions", [4], "terrain", false);
    // Galv.SPAWN.event(3, "regions", [3], "terrain", false);
    // Galv.SPAWN.event(1, "regions", [3, 2, 1], "terrain", false);
    this.findEnemies();
    this.createPromptWindows();
}

Game_Combat.prototype.spawnArrow = function(enemyEventId){
    const eventX = $gameMap.event(enemyEventId).x - 1;
    const eventY = $gameMap.event(enemyEventId).y;
    Galv.SPAWN.event(9, "xy", [eventX, eventY], "all", false);
    this.findArrows();
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
        const promptInitialLetters = currentEnemyPrompts.map(enemyPromptObj => {
            if(enemyPromptObj && enemyPromptObj.isAlive) return enemyPromptObj.prompt[0];
        });
        const currentRawPrompts = currentEnemyPrompts.map(promptObj => promptObj.prompt);
        if(prompt && !currentRawPrompts.includes(prompt) && !promptInitialLetters.includes(prompt[0])){
            isUnique = true;
        }
    }
    return prompt;
}

Game_Combat.prototype.getCurrentEnemyPrompts = function(){
    return this._enemies.map(enemy => {
        return { prompt: enemy.currentPrompt(), isAlive: enemy.isAlive() };
    })
}

Game_Combat.prototype.getCurrentEnemy = function(){
    return this._enemies.find(enemy => {
        return enemy.currentPrompt() === $gameTyping.prompt();
    })
}

Game_Combat.prototype.getEnemyBasedOnPrompt = function(prompt){
    return this._enemies.find(enemy => {
        return enemy.currentPrompt() === prompt;
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

Game_Combat.prototype.teleportToRegion = function(eventId, region){
    let spawnLocs = [];
    const width = $gameMap.width();
    const height = $gameMap.height();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if ($gameMap.regionId(x,y) === region) spawnLocs.push([x,y]);
        };
    };
    const randomLocs = spawnLocs[Math.floor(Math.random() * spawnLocs.length)];
    const randomX = randomLocs[0];
    const randomY = randomLocs[1];
    $gameMap.event(eventId).setPosition(randomX, randomY);
}

const $gameCombat = new Game_Combat();

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