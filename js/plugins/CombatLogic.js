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
    this._configurationList = [];
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
    this.loadConfigurations();
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

Game_Combat.prototype.spawnEnemies = function(difficulty){
    // const enemyDict = { 
    //     "warrior": { evId: 1, regions: [1, 2, 3] }, 
    //     "archer": { evId: 2, regions: [3] }, 
    //     "shaman": { evId: 3, regions: [3] }, 
    //     "teleporter": { evId: 4, regions: [4] }
    // };
    // const configuration = this.selectConfiguration(difficulty);
    // // Spawn enemies
    // for (const [enemy, amount] of Object.entries(configuration)) {
    //     const enemyData = enemyDict[enemy];
    //     for(let i = 0; i < amount; i++) Galv.SPAWN.event(enemyData.evId, "regions", enemyData.regions, "terrain", false);
    // }
    Galv.SPAWN.event(1, "regions", [3], "terrain", false);
    this.findEnemies();
    this.createPromptWindows();
}

Game_Combat.prototype.selectConfiguration = function(difficulty){
    if(!Object.keys(this._configurationList).includes(difficulty)) return;
    const configsBasedOnDifficulty = this._configurationList[difficulty];
    return configsBasedOnDifficulty[Math.floor(Math.random() * configsBasedOnDifficulty.length)];
}

Game_Combat.prototype.spawnArrow = function(enemyEventId){
    const eventX = $gameMap.event(enemyEventId).x - 1;
    const eventY = $gameMap.event(enemyEventId).y;
    Galv.SPAWN.event(9, "xy", [eventX, eventY], "all", false);
    this.findArrows();
    this.createPromptWindows();
}

Game_Combat.prototype.spawnBomb = function(){
    const playerX = this.findCombatPlayer().x;
    const playerY = this.findCombatPlayer().y;
    Galv.SPAWN.event(10, "xy", [playerX, playerY], "all", false);
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

Game_Combat.prototype.loadConfigurations = function(){
    fetch("./data/EnemySpawnConfigurations.json")
    .then(res => res.json())
    .then(data => {
        if(!data) return;
        this._configurationList = data.configurations;
    })
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

Game_Combat.prototype.playPlayerBombAnimation = function(){
    const playerAnimBombSwitch = 26;
    $gameSwitches.setValue(playerAnimBombSwitch, true);
}

Game_Combat.prototype.playEnemyHitAnimation = function(enemy){
    const enemyHitAnimSelfSwitch = "A";
    const otherSelfSwitches = ["B", "C", "D"];
    // Turn off all other self switches
    otherSelfSwitches.forEach(selfSwitch => {
        $gameSelfSwitches.setValue([$gameMap.mapId(), enemy.eventId(), selfSwitch], false);
    })
    // Turn on hit anim self switch
    $gameSelfSwitches.setValue([$gameMap.mapId(), enemy.eventId(), enemyHitAnimSelfSwitch], true);
}

Game_Combat.prototype.playEnemyAttackAnimations = function(){
    const enemyAttackAnimSelfSwitch = "D";
    const allEnemiesAttackSwitch = 24;
    this.enemiesInAttackZone().forEach(enemy => {
        enemy.setHasAttackAnimPlayed(true);
        $gameSwitches.setValue(allEnemiesAttackSwitch, true);
        $gameSelfSwitches.setValue([$gameMap.mapId(), enemy.eventId(), enemyAttackAnimSelfSwitch], true);
    })
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

Game_Combat.prototype.findCombatPlayer = function(){
    return $gameMap.events().find(ev => ev.event().note.includes("<player>"));
}

Game_Combat.prototype.enemiesInAttackZone = function(){
    const combatPlayer = this.findCombatPlayer();
    const enemies = this._enemies;
    return enemies.filter(enemy => {
        if(enemy.hasAttackAnimPlayed()) return;
        return enemy.x === combatPlayer.x;
    });
}

Game_Combat.prototype.killAllEnemies = function(){
    this._enemies.forEach(enemy => {
        this.playEnemyHitAnimation(enemy);
        this.destroyPromptWindow(enemy.currentPrompt());
    })
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
    if($gameCombat.enemiesInAttackZone().length > 0) $gameCombat.playEnemyAttackAnimations();
}