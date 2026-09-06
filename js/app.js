const curLevel = document.getElementById('level');
const curXP =  document.getElementById('xp');
const targetLevel = document.getElementById('targetLevel');

const isInCrimCorp = document.getElementById('joinedGroup');
const hasAllowanceGamepass = document.getElementById('allowanceGamepass');
const hasPremium = document.getElementById('hasPremium');

const calculateBtn = document.getElementById('calculate');
const result = document.getElementById('result');

function roundDecimals(val, decimals) {
    return Math.floor(val/decimals)*decimals;
}

const START_XP = 1000;
const GAMEPASS_ALLOWANCE_MULTI = 1.5;
const GROUP_ALLOWANCE_MULTI = 1.1;
const PREMIUM_ALLOWANCE_MULTI = 1.3;
const ALLOWANCE_TIME = 15;

function getLevel(level) {
    level -= 1;
    const sum = (12 * (level ** 2) + (level ** 2) + 500 * level);
    return roundDecimals(sum, 100) + START_XP;
}

function formatMinutes(totalMinutes) {
    if (totalMinutes < 60) {
        return `${totalMinutes} minute(s)`;
    }

    if (totalMinutes < 1440) { // less than 24 hours
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return minutes > 0
            ? `${hours} hour(s) ${minutes} minute(s)`
            : `${hours} hour(s)`;
    }

    // 1440+ minutes = 1+ day
    const days = Math.floor(totalMinutes / 1440);
    const remainingMinutes = totalMinutes % 1440;
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;

    let result = `${days} day(s)`;
    if (hours > 0) result += ` ${hours} hour(s)`;
    if (minutes > 0) result += ` ${minutes} minute(s)`;
    return result;
}

function getATMXP() {
    let resultXP = START_XP;
    if (hasAllowanceGamepass.checked) {
        resultXP *= GAMEPASS_ALLOWANCE_MULTI;
    }
    if (isInCrimCorp.checked) {
        resultXP += ((START_XP * GROUP_ALLOWANCE_MULTI) - START_XP);
    }
    if (hasPremium.checked) {
        resultXP += ((START_XP * PREMIUM_ALLOWANCE_MULTI) - START_XP);
    }
    resultXP = Math.floor(Math.max(0, resultXP));
    return resultXP;
}

calculateBtn.onclick = () => {
    const xpValue = parseFloat(curXP.value) || 0;
    const levelValue = parseInt(curLevel.value) || 0;
    const targetLevelValue = parseFloat(targetLevel.value) || 0;

    let totalXP = -xpValue;
    for (let level = levelValue; level < targetLevelValue; level++) {
        totalXP += getLevel(level);
    }
    const atmXP = getATMXP();
    const atmCount =  Math.ceil(totalXP / atmXP);
    result.textContent = `Result: ${totalXP.toLocaleString()}xp, you need to get allowance ${atmCount} time(s) (Around ${formatMinutes(ALLOWANCE_TIME * atmCount)})`;
};