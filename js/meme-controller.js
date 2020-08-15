'use strict';


var gCanvas;
var gCtx;
var gIsDrag;
var gTotalLine;

var gStartX;
var gStartY;

function onInit() {
    gCanvas = document.querySelector('canvas');
    gCtx = gCanvas.getContext('2d');
    gTotalLine = 0;
    document.querySelector('.edit-meme').style.display = 'none';
    renderGallery();
    renderFonts();
    if (window.innerWidth <= 690) {
        gCanvas.width = 350;
        gCanvas.height = 350;
    }
    setX(gCanvas.width / 2);
}

function renderFonts() {
    var strHTMLs = getFonts().map(font => {
        return `<option value="${font}">${font}</option>`;
    })
    document.querySelector('.font-family').innerHTML = strHTMLs.join('');
}

function renderGallery() {
    const imgs = getImgs();
    const strHTMLs = imgs.map(img => {
        return `<img onclick="onMakeMeme(this)" data-id="${img.id}" src="img/${img.id}.jpg" alt="" />\n`
    })
    document.querySelector('.gallery').innerHTML = strHTMLs.join('');
}


function renderMeme(isDownload = false, elLink) {
    const img = new Image();
    img.src = getImgUrl();
    const lines = getLines();
    img.onload = () => {

        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        lines.forEach(line => {
            gCtx.beginPath();
            drawText(line.txt, line.x, line.y, line.strokeColor, line.fillColor, line.fontSize, line.fontFamily, line.align);
        })
        let line = getCurrLine();
        if (line && line.txt) {
            let txtWidth = gCtx.measureText(line.txt).width;
            drawRect(getTopRightX(line, txtWidth), line.y - 0.9 * line.fontSize, txtWidth, line.fontSize);
            document.querySelector('.line').value = line.txt;
        }
    }
}

function onDownload(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent;
}

function cleanMark() {
    setSelectedLineIdx(-1);
    onAddLine();
    renderMeme();
}

function getTopRightX(line, txtWidth) {
    switch (line.align) {
        case 'left':
            return line.x;
        case 'center':
            return line.x - txtWidth / 2;
        case 'right':
            return line.x - txtWidth;
    }
}

function drawText(text, x, y, strokeStyle, fillStyle, fontSize, fontFamily, textAlign) {
    gCtx.lineWidth = '3';
    gCtx.lineHight = '2';
    gCtx.strokeStyle = strokeStyle;
    gCtx.fillStyle = fillStyle;
    gCtx.font = `${fontSize}px ${fontFamily}`;
    gCtx.textAlign = textAlign;
    gCtx.fillText(text, x, y);
    gCtx.strokeText(text, x, y);
}

function onCenterLine() {
    alignLine('center', gCanvas.width / 2)
    renderMeme();
}

function onRightLine() {
    alignLine('right', gCanvas.width)
    renderMeme();
}

function onLeftLine() {
    alignLine('left', 0)
    renderMeme();
}


function onMakeMeme(elImg) {
    setMeme(+elImg.dataset.id);
    document.querySelector('.gallery').style.display = 'none';
    document.querySelector('.edit-meme').style.display = 'flex';
    document.querySelector('.active').classList.remove('active');
    renderMeme();
}

function onBackToGallery(elA) {
    document.querySelector('.gallery').style.display = 'grid';
    document.querySelector('.edit-meme').style.display = 'none';
    document.querySelector('.line').value = '';
    elA.classList.add('active');
}

function onChangeFont(elSelect) {
    changeFontFamily(elSelect.value)
    renderMeme();
}

function onChangeFontSize(diff) {
    changeFontSize(diff);
    renderMeme();
}

function onMove(ev) {

    var { offsetX, offsetY } = ev;
    var elCanvas = document.querySelector('canvas');
    if (isOnText(offsetX, offsetY)) {
        elCanvas.classList.add('text');
    } else {
        elCanvas.classList.remove('text');
    }
    if (gIsDrag && elCanvas.classList.contains('text')) {
        let line = findLineByPosition(offsetX, offsetY);
        var BB = gCanvas.getBoundingClientRect();
        var a = BB.left;
        var b = BB.top;


        var mouseX = parseInt(ev.clientX - a);
        var mouseY = parseInt(ev.clientY - b);

        // Put your mousemove stuff here
        var dx = mouseX - gStartX;
        var dy = mouseY - gStartY;
        gStartX = mouseX;
        gStartY = mouseY;

        line.x += dx;
        line.y += dy;
        renderMeme();
    }
}

function isOnText(CurrX, CurrY) {
    return findLineByPosition(CurrX, CurrY);
}

function findLineByPosition(CurrX, CurrY) {
    var lines = getLines();
    var line = lines.find(line => {
        let txtWidth = gCtx.measureText(line.txt).width;
        switch (line.align) {
            case 'left':
                return CurrX > line.x && CurrX < line.x + txtWidth
                    && CurrY < line.y && CurrY > line.y - line.fontSize;
            case 'center':
                return CurrX > line.x - txtWidth / 2 && CurrX < line.x + txtWidth / 2
                    && CurrY < line.y && CurrY > line.y - line.fontSize;
            case 'right':
                return CurrX < line.x && CurrX > line.x - txtWidth
                    && CurrY < line.y && CurrY > line.y - line.fontSize;
        }
    })
    return line;
}


function toggleDrag(falg) {
    gIsDrag = falg;
}

function handleMouseDown(ev) {
    gIsDrag = true;
    var BB = gCanvas.getBoundingClientRect();
    var a = BB.left;
    var b = BB.top;
    gStartX = parseInt(ev.clientX - a);
    gStartY = parseInt(ev.clientY - b);
}

function handleClick(ev) {

    var elCanvas = document.querySelector('canvas');
    if (!elCanvas.classList.contains('text')) {
        onAddLine();
        return;
    }
    const { offsetX, offsetY } = ev;
    var line = findLineByPosition(offsetX, offsetY);

    // console.log('clicked at:', offsetX, offsetY);
    // console.log('line position', line.x, line.y);

    var idx = getLines().indexOf(line);
    setSelectedLineIdx(idx);
    document.querySelector('.line').value = line.txt;

    // let txtWidth = gCtx.measureText(line.txt).width;
    // drawRect(line.x - txtWidth / 2, line.y - 0.9 * line.fontSize, txtWidth, line.fontSize);
    renderMeme();
    // console.log(getCurrLine());
}

function onSetLine(elInput) {
    var line = getCurrLine();
    if (!line) {
        addLine();
        gTotalLine++;
        line = getCurrLine();
    }
    line.txt = elInput.value;
    renderMeme();
}

function onAddLine() {
    document.querySelector('.line').value = '';
    if (gTotalLine === 1) setY(gCanvas.height - 10);
    else if (gTotalLine > 1) setY(gCanvas.height / 2);

    setSelectedLineIdx(-1);
    renderMeme();
}

function onDeleteLine() {
    document.querySelector('.line').value = '';
    deleteLine();
    renderMeme();
}

function onChangeFontColor(elColor) {
    changeFillColor(elColor.value);
    renderMeme();
}

function onChangeStrokeColor(elColor) {
    changeStrokeColor(elColor.value);
    renderMeme();
}

function drawRect(x, y, width, height) {
    gCtx.beginPath();
    gCtx.rect(x, y, width, height); /// x, y, width, height
    gCtx.setLineDash([10]);
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
    gCtx.setLineDash([0]);
}

function onSwitchLine() {
    nextLine();
    renderMeme();
}

function toggleMenu() {
    var mainMenu = document.querySelector('.main-menu');
    mainMenu.classList.toggle('open');
}