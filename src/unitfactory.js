
// Functions and consts

const rand = function(n) {
    return Math.floor(Math.random() * n)+1;
  };
  
  const initStats = {
    base : {
      hp:15, atk:3, def:4, mag:3, res:4
    },
    phys : {
      hp:20, atk:6, def:6, mag:3, res:4
    },
    mag : {
      hp:17, atk:4, def:4, mag:6, res:5
    }
  };
  
  const growthRate = {
    none: {
      hp:0, atk:0, def:0, mag:0, res:0
    },
    base : {
      hp:10, atk:7, def:5, mag:7, res:5
    },  
    phys : {
      hp:15, atk:13, def:7, mag:3, res:5
    },
    mag : {
      hp:12, atk:3, def:5, mag:13, res:7
    }
  };
  
  
  
  // Generic Unit factory
  
  const makeUnit = function(name="unit", cls="unit", type="base", growth="none", slvl=1) {
    
    const that = {
      name,cls,lvl:1,
      stats:Object.create(initStats[type]),
      growth:Object.create(growthRate[growth]),
      chp:0
    };
    
    that.lvlUp = function() {
      const statList = Object.keys(growthRate.base);
      for (let stat of statList){
        let growthVal = that.growth[stat];
        while (growthVal > 10) {
          that.stats[stat] += 1;
          growthVal -= 10;
          if (growthVal < 0) {
            growthVal = 0;
            break;
          }
        }
        if (rand(10) > 10-growthVal) {
          // console.log(`${stat} +1`)
          that.stats[stat] += 1;
        }      
      }
      that.lvl++;
      if (that.lvl > slvl){
        console.log(`${that.name} is now level ${that.lvl}!`);
      }
      return that.stats;
    };
    
    while (that.lvl < slvl){
      that.lvlUp();
    }
    
    return that;
  };
  
  // Playable Unit factory
  
  const makeChar = function(name="unit", cls="unit", type="base", growth="base", slvl=1, exp=0) {
    const that = makeUnit(name, cls, type, growth, slvl);
    that.exp = exp;
    
    that.gainExp = function(amount, defeatedLvl) {
      let exp;
      let lvlDif = that.lvl - defeatedLvl;
      if (lvlDif >= 10) {
        exp = 0;
      } else if (lvlDif <= -10) {
        exp = amount*2;
      } else {
        exp = Math.round(amount*(1-(lvlDif/10)));
      }
      that.exp += exp;
      console.log(`${that.name} gained ${exp} EXP!`);
      while (that.exp >= 100){
        that.exp -= 100;
        that.lvlUp();
      }
    };
    return that;
  };
  
  /*
  unit = makeChar("robin", "tactician", "mag", "mag")
  
  */
  
  
  // Check growthRate
  
  const analyze = function(factory, amount=200, verbose=false, ...args) {
    
    // Fill barracks with units
    const barracks = [];
    while (barracks.length < amount){
      barracks.push(factory(...args));
    }
    
    // Aggregate stats and calc averages
    const results = {};
    keyList = Object.keys(barracks[0].stats);
    for (let item of keyList) {
      results[item] = [];
    }
    for (let unit of barracks) {
      for (let stat of keyList) {
        results[stat].push(unit.stats[stat]);
      }
    }
    const averages = {};
    for (let stat of keyList) {
      let total = 0;
      for (let num of results[stat]) {
        total += num;
      }
      averages[stat] = total/results[stat].length;
    }
    if (verbose) {
      for (let item of keyList){
        console.log(`${item}: ${Math.min(...results[item])} `+
                    `to ${Math.max(...results[item])}`);
      }
    }
    return averages;
  };
  
  /*
  analyze(makeChar, 200, 1, 'unit', 'unit', 'base', 'base', 20)
  
  */
  
  
  // Battle system
  
  const battleSys = function(a, b) {
    
    const battle = {
      player:a, npc:b, phase:0, turn:true, state:false, log:[]
    };
    
    battle.reset = function() {
      battle.player.chp = battle.player.stats.hp;
      battle.npc.chp = battle.npc.stats.hp;
      battle.phase = 0;
      battle.turn = true;
      battle.state = true;
      battle.log = []
    };
    
    battle.simulate = function() {
      if (battle.state) {
        if (battle.turn){
          battle.fight(battle.player, battle.npc);
          battle.turn = false;
        } else {
          battle.fight(battle.npc, battle.player);
          battle.turn = true;
        }
        
        if (battle.npc.chp <= 0){
          battle.state = false;
          battle.log.push(`${battle.npc.name} is defeated!`)
        } else if (battle.player.chp <= 0) {
          battle.state = false;
          battle.log.push(`${battle.player.name} is defeated!`)       
        }
      } else {
        console.log("Battle has ended.")
      }
      
    };
    
    battle.fight = function(attack, defend) {
      const pdmg = attack.stats.atk - defend.stats.def;
      const mdmg = attack.stats.mag - defend.stats.res;
      let dmg = pdmg >= mdmg ? pdmg : mdmg;
      if (dmg <= 0){ dmg = 1 };
      defend.chp -= dmg;
      battle.log.push(`${defend.name} takes ${dmg} damage!`)
      if (defend.chp < 0){
        defend.chp = 0;
      }
    };
    
    
    return battle;
  };
  
  /*
  
  
  engine = battleSys(makeChar("player", "tactician", "mag", "mag", 20),makeChar("npc", "ogre", "phys", "phys", 15));
  engine.reset();
  
  
  */
  
  // Testing ? 
  
  
  