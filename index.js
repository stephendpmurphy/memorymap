const memoryMap = {
    "regions":[
        {
            "label":"RAM",
            "start":"0x0090",
            "end":"0x0100"
        },
        {
            "label":"EEPROM",
            "start":"0x0100",
            "end":"0x01B0"
        },
        {
            "label":"ROM",
            "start":"0x0000",
            "end":"0x0050"
        }
    ]
 }

console.log("memory map");

const mapWidth = 150;

// Make the canvas fill the page
var canvas = document.getElementById("memorymapCanvas");
canvas.width = window.outerWidth;
canvas.height = window.outerHeight;

var ctx = canvas.getContext("2d");
ctx.beginPath();
ctx.fillStyle = 'gray';

// Re-order the list of regions based on the start address
memoryMap.regions.forEach(element => {
    memoryMap.regions.forEach((element, i) => {
        var tmpObj = {};
        if( (i != memoryMap.regions.length - 1) && (memoryMap.regions[i + 1].start < element.start)) {
            // The next element is smaller than our current. Flip them.
            tmpObj = element;
            memoryMap.regions[i] = memoryMap.regions[i + 1];
            memoryMap.regions[i + 1] = tmpObj;
        }
     })
});

// Figure out the map size.. We use the start address of the first element.
// and the end address of the last element
var mapStart = parseInt(memoryMap.regions[0].start.replace(/^#/, ''), 16);
var mapEnd = parseInt(memoryMap.regions[memoryMap.regions.length - 1].end.replace(/^#/, ''), 16);
var mapLength = mapEnd - mapStart;

// Determine what the scaling factor is to the canvas height
var canvasFactor = canvas.height / mapLength;
console.log("Canvas factor: ", canvasFactor);
console.log(`Memory map is ${mapLength} bytes long. Start: ${mapStart}. End: ${mapEnd}.`);

// Draw the memory map
memoryMap.regions.forEach((element, i) => {
    // Draw the rectangle
    var rectStart = parseInt(element.start);
    var rectHeight = parseInt(element.end) - parseInt(element.start);
    ctx.rect(0, rectStart, mapWidth, rectHeight);

    // Insert region label
    var regionLabelPosX = (mapWidth / 2) - 10;
    var regionLabelPosY = rectStart + (rectHeight / 2) - 15;
    canvas.insertAdjacentHTML("afterend", `<p style="position: absolute; left: ${regionLabelPosX}px; top: ${regionLabelPosY}px">${element.label}</p>`);

    // Insert start address tag
    var startLabelPosX = mapWidth + 15;
    var startLabelPosY = rectStart - 15;
    canvas.insertAdjacentHTML("afterend", `<p style="position: absolute; left: ${startLabelPosX}px; top: ${startLabelPosY}px">${element.start}</p>`);

    // Insert the end address tag only if it's different from the next regions start address
    // We also want to draw another box with "UNUSED" in it to indicate a gap in the memory map given
    if( (memoryMap.regions[i + 1] == undefined ) || (memoryMap.regions[i + 1].start !== element.end) ) {
        // Insert the end address tag
        var endLabelPosX = mapWidth + 15;
        var endLabelPosY = parseInt(element.end) - 15;
        canvas.insertAdjacentHTML("afterend", `<p style="position: absolute; left: ${endLabelPosX}px; top: ${endLabelPosY}px">${element.end}</p>`);

        if(memoryMap.regions[i + 1] != undefined ) {
            // Draw our unused rectangle
            var unusedRectStart = parseInt(element.end);
            var unusedRectHeight = parseInt(memoryMap.regions[i + 1].start) - parseInt(element.end);
            ctx.fillRect(0, unusedRectStart, mapWidth, unusedRectHeight);
            // Insert a label to indicate unsuded
            canvas.insertAdjacentHTML("afterend", `<p style="position: absolute; left: ${regionLabelPosX}px; top: ${unusedRectStart + (unusedRectHeight / 2) - 15}px">unused</p>`);
        }
    }

    ctx.stroke();
});