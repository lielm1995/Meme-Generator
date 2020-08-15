'use strict';

var gFontFamily = 'Impact';
var gFontSize = 50;
var gStrokeColor = 'black';
var gFillColor = 'white';
var gX;
var gY = 50;
var gAlign = 'center';

var gMeme;
var gKeywords = { 'happy': 12, 'funny puk': 1 }
var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: [''] },
    { id: 2, url: 'img/2.jpg', keywords: [''] },
    { id: 3, url: 'img/3.jpg', keywords: [''] },
    { id: 4, url: 'img/4.jpg', keywords: [''] },
    { id: 5, url: 'img/5.jpg', keywords: [''] },
    { id: 6, url: 'img/6.jpg', keywords: [''] },
    { id: 7, url: 'img/7.jpg', keywords: [''] },
    { id: 8, url: 'img/8.jpg', keywords: [''] },
    { id: 9, url: 'img/9.jpg', keywords: [''] },
    { id: 10, url: 'img/10.jpg', keywords: [''] },
    { id: 11, url: 'img/11.jpg', keywords: [''] },
    { id: 12, url: 'img/12.jpg', keywords: [''] },
    { id: 13, url: 'img/13.jpg', keywords: [''] },
    { id: 14, url: 'img/14.jpg', keywords: [''] },
    { id: 15, url: 'img/15.jpg', keywords: [''] },
    { id: 16, url: 'img/16.jpg', keywords: [''] },
    { id: 17, url: 'img/17.jpg', keywords: [''] },
    { id: 18, url: 'img/18.jpg', keywords: [''] }

];

var gFonts = ['Impact', 'Arial', 'cursive', 'monospace'];


function getFonts() {
    return gFonts;
}
function setX(x) {
    gX = x;
}

function setY(y) {
    gY = y;
}

function alignLine(align, xPos) {
    const line = getCurrLine();
    gAlign = align;
    gX = xPos;
    if(!line) return
    line.x = xPos;
    line.align = align;
}

function getImgs() {
    return gImgs;
}
function getImgUrl() {
    return getImgById(gMeme.selectedImgId).url;
}

function getImgById(imgId) {
    return gImgs.find(img => img.id === imgId)
}

function getCurrLine() {
    if (gMeme.lines.length && gMeme.selectedLineIdx !== -1) return gMeme.lines[gMeme.selectedLineIdx];
    return null;
}

function getLines() {
    return gMeme.lines;
}

function changeFontFamily(fontFamily) {
    const line = getCurrLine();
    gFontFamily = fontFamily
    if(!line) return;
    line.fontFamily = fontFamily;
}

function changeFontSize(diff) {
    const line = getCurrLine();
    if(!line) return;
    line.fontSize += diff * 2;
    line.y += diff * 2;
    gFontSize = line.fontSize;
}

function nextLine() {
    if(!getLines().length) return;
    gMeme.selectedLineIdx += 1;
    if(gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = 0;
}

function setMeme(imgId) {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: -1,
        lines: []
    }
}

function setSelectedLineIdx(idx) {
    gMeme.selectedLineIdx = idx;
}

function addLine() {
    gMeme.lines.push(createLine(''))
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function deleteLine() {
    var lineToRemoveIdx = getLines().indexOf(getCurrLine());
    if(lineToRemoveIdx !== -1) getLines().splice(lineToRemoveIdx, 1);
}

function changeFillColor(color) {
    var line = getCurrLine();
    if(line) line.fillColor = color;
    gFillColor = color;
}

function changeStrokeColor(color) {
    var line = getCurrLine();
    if(line) line.strokeColor = color;
    gStrokeColor = color;
}

function createLine(txt, x = gX, y = gY, align = gAlign, fontFamily = gFontFamily, fontSize = gFontSize, strokeColor = gStrokeColor, fillColor = gFillColor) {
    return {
        txt,
        fontFamily,
        fontSize,
        strokeColor,
        fillColor,
        x,
        y,
        align,
    }
}


// function getMeme() {
//     return gMeme;
// }