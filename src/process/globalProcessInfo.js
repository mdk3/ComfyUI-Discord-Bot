const GLOBALQUEUE = [];
const GLOBALIMAGEDATA = [];

function globalDataAdd(prompt, messageid, author, upscaled, type) {
    GLOBALIMAGEDATA.push({ prompt, messageid, author, upscaled, type });
}

function searchData(key, value) {
    return GLOBALIMAGEDATA.filter(item => item[key] === value);
}

function removeByUserId(userId) {
    GLOBALQUEUE = GLOBALQUEUE.filter((item, index) => {
        if (index === 0) {
            return true; // İlk öğe korunsun
        }
        return item.interaction.user.id !== userId;
    });
}

async function getRND() {
    await new Promise(resolve => setTimeout(resolve, 250));

    return Math.floor(Math.random() * 1000000000000)
}

module.exports = {
    globalDataAdd, searchData, getRND, GLOBALQUEUE, removeByUserId
}