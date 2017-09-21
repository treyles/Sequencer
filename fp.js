// browser support: 
// IE11: classList
var lobby = document.querySelector('#lobby');
lobby.style.display = 'none';

'use strict';

// window.onload = init;

var ready;       // use loadedSamples: loadedSamples <= 24 ?
var ticks = 16;
var stepNum = 1;
var loadedSamples = 0;

/**
 * Helper functions
 */
// because forEach doesn't work with nodelists in certain browsers
function eachNode(nodeList, callback, scope) {
	for (var i = 0; i < nodeList.length; i++) {
        callback.call(scope, nodeList[i], i);
    }
}

// get elements(s) by CSS selector
function qs(select) {
    return document.querySelector(select);
}

function qsa(select) {
    return document.querySelectorAll(select);
}

/**
 * Handle Sounds
 */
var drumPlayers,
	loopPlayers,
	dialoguePlayers,
	keysPlayers;

var defaultDrums,
    alternateDrums,
    defaultKeys,
    alternateKeysB,
    alternateKeysC;

var sounds = {
    drums: [
        // arrays of file names
        'kick', 
        'clap', 
        'hat', 
        'hat-open', 
        'kick', 
        'clap'
    ],

    altDrums: [
        'lofikick',
        'lofisnare',
        'lofihat'
    ],

    loops: [
        'crackle', 
        'alicepad1', 
        'alicepad2', 
        'bass-line1', 
        'bass-line2'
    ],

    dialogues: [
        'dream',
        'high',
        'horizon',
        'lights'
    ],

    keys: [
        // array of directories
        'keysA',
        'keysB',
        'keysC'
    ]
};

function createPaths(group, keys) {
    var currentGroup = sounds[group];
    var path = 'sounds/' + group + '/';

    // create file names before making paths
    if (keys) {
        var keysGroup = [];

        for (var i = 1; i < 10; i++) {
            keysGroup.push(group + i ) 
        }

        currentGroup = keysGroup;
    }

    // returns array of complete paths
    return currentGroup.map(function(el) {
        return path + el + '.wav';
    });
}

function createBuffers(array, loop) {
    var buffers = array.map(function(el) {
        var currentBuffer = new Tone.Player(el, function() {
            loadedSamples++
        });

        if (loop) {
            currentBuffer.loop = true;
        }

        currentBuffer.toMaster();
        return currentBuffer;  
    });

    // returns new array of buffers
    return buffers;   
}

function changeDrumSound(array, index) {
    if (array === alternateDrums) {
        drumPlayers[index] = alternateDrums[index];
    } else {
        drumPlayers[index] = defaultDrums[index];
    }
}

function initTransport() {
	Tone.Transport.bpm.value = 200;
	Tone.Transport.start();
}

function initSounds() {
    drumPlayers = createBuffers(createPaths('drums'));
    loopPlayers = createBuffers(createPaths('loops'), true);
    dialoguePlayers = createBuffers(createPaths('dialogues'));
    keysPlayers = createBuffers(createPaths('keysA', true));

    defaultDrums = createBuffers(createPaths('drums'));
    alternateDrums = createBuffers(createPaths('altDrums'));
    defaultKeys = createBuffers(createPaths('keysA', true));
    alternateKeysB = createBuffers(createPaths('keysB', true));
    alternateKeysC = createBuffers(createPaths('keysC', true));

    initTransport();
}

/**
 * Handle Sequencer
 */
function createGrid() {
	var grid = qs('#grid');

	// make div for each sound
	for (var i = 0; i < sounds.drums.length; i++) {
	    var soundDiv = document.createElement('div');

	    soundDiv.setAttribute('id', sounds.drums[i]);
	    grid.appendChild(soundDiv);
	}

	// make ticks.length row of beats for each sound
	for (var i = 0; i < grid.children.length; i++) {
	    for (var j = 1; j < ticks + 1; j++) {
	        var btn = document.createElement('div');

	        btn.classList.add('beat', sounds.drums[i], j);
	        grid.children[i].appendChild(btn);
	    }
	}
}

function createSequence() {
	var sequence = new Tone.Sequence(sequenceEvent, sounds.drums, '8n');
	sequence.start();
}

function sequenceEvent(time) {
	var beat = qsa('.beat');

	// animate steps
	for (var i = 0; i < beat.length; i++) {
        var currentBeat = beat[i].classList; 

        currentBeat.remove('step');
        if (currentBeat.contains(stepNum)) {               // TODO: should be handled with controller
            currentBeat.add('step');
        }
    }

    // play sounds
    for (var i = 0; i < sounds.drums.length; i++) {    
        for (var j = 0; j < beat.length; j++) {
            
            var hasSoundName = beat[j].classList.contains(sounds.drums[i]);
            var hasStep = beat[j].classList.contains(stepNum);
            var hasOn = beat[j].classList.contains('on');
            
            if (hasSoundName && hasStep && hasOn) {
                drumPlayers[i].start(time);
            }
        }
    }

    // reset stepNum at end of sequence to repeat
    stepNum++

    if (stepNum > ticks) {
        stepNum = 1;
    }
}

function initSequencer() {
	createGrid();
	createSequence(); 
}

/**
 * Handle Events
 */
function initControls() {

	// sequencer clicks
	eachNode(qsa('.beat'), function(node) {
		node.addEventListener('click', handleBeatToggle);
	});

	// loop menu
	qs('.vinyl').addEventListener('click', handleLoopClick);
	qs('.melody').addEventListener('click', handleLoopClick);
	qs('.bass-line').addEventListener('click', handleLoopClick);
	qs('.vinyl').addEventListener('click', handleLoopClick);

	// drums menu
	qs('.kick-alt').addEventListener('click', handleDrumsClick);
	qs('.snare-alt').addEventListener('click', handleDrumsClick);
	qs('.hat-alt').addEventListener('click', handleDrumsClick);
	qs('.swing').addEventListener('click', handleDrumsClick);

	// keybaord menu
	// qs('.vinyl').addEventListener('click', handleLoopClick);
	// qs('.vinyl').addEventListener('click', handleLoopClick);
	// qs('.vinyl').addEventListener('click', handleLoopClick);
	// qs('.vinyl').addEventListener('click', handleLoopClick);

	// keyboard presses
	// window.addEventListener('keydown', handleLoopClick);
}

/**
 * returns index of element in context of it's parentNode
 * index of element corresponds to index of sound in player arrays
 * we need to use call because 'children' is a nodelist
 */
function getIndexFromEl(el) {
	var children = el.parentNode.children;
	return Array.prototype.indexOf.call(children, el);
}

function handleLoopClick() {
    var index = getIndexFromEl(this);

    if (!this.classList.contains('play')) {
        // play loop, and quantize two measures
        loopPlayers[index].start('@2m');
        animateLoopButton(true, index)
    } else {
        loopPlayers[index].stop();
        animateLoopButton(false, index)
    }

    this.classList.toggle('play');
}

function handleDrumsClick() {
    var radio = qsa('.radio');
    var index = getIndexFromEl(this);
    var radioIndex = index + 4;

    if (!this.classList.contains('play')) {
        radio[radioIndex].classList.toggle('on');

        // replace drum sound
        changeDrumSound(alternateDrums, index)
    } else {
        radio[radioIndex].classList.toggle('on');

        // swap drum sound to default
        changeDrumSound(defaultDrums, index)
    }

    this.classList.toggle('play');
}



function handleBeatToggle() {          // e.target or this?
	this.classList.toggle('on');
}



initSounds();
initTransport();
initSequencer();
initControls();





/**
 * Handle Animations
 */
function animateLoopButton(play, index) {
    var radio = qsa('.radio');
    var animSettings = 'blink 1s infinite linear';

    if (play) {
        // starts queue by blinking
        radio[index].style.animation = animSettings;

        // run handleQueue() to stop blinking when sound has started
        handleQueue(index);
    } else {
        radio[index].style.animation = '';
        radio[index].classList.remove('on');
    }

    // calls itself every 100ms until play state returns 'started'
    // then disable blinking and set
    function handleQueue(index) {
        if (loopPlayers[index].state !== 'started') {
            setTimeout(handleQueue.bind(null, index), 100);
        } else {
            radio[index].style.animation = '';
            radio[index].classList.add('on')
        }
    }
}










// function detectPlay(el, callback) {
//     if (el.state !== 'started') {
//         setTimeout(detectPlay.bind(null, el), 100);
//     } else {
//         callback();
//     }
// }


















// var index = Array.from(this.parentNode.children).indexOf(this);

