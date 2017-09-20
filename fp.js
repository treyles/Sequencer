// browser support: 
// IE11: classList

'use strict';

// window.onload = init;

var ready;
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
var drumPlayers = [],
	loopPlayers = [],
	dialoguePlayers = [],
	keysPlayers = [];

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

    return buffers;   
}

function initTransport() {
	Tone.Transport.bpm.value = 200;
	Tone.Transport.start();
}

function initSounds() {
    var drums = createPaths('drums');          // TODO: bugs, not explicitly setting false?
    var loops = createPaths('loops');
    var dialogues = createPaths('dialogues');
    var keys = createPaths('keysA', true);			// true, to handle keys directories

    drumPlayers = createBuffers(drums);
    loopPlayers = createBuffers(loops, true);		// true, to enable looping
    dialoguePlayers = createBuffers(dialogues);
    keysPlayers = createBuffers(keys);

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

	// sequencer click
	eachNode(qsa('.beat'), function(node) {
		node.addEventListener('click', handleBeatToggle);
	});

	// loop menu
	qs('.vinyl').addEventListener('click', handleLoopClick);
	qs('.melody').addEventListener('click', handleLoopClick);
	qs('.vinyl').addEventListener('click', handleLoopClick);
	qs('.vinyl').addEventListener('click', handleLoopClick);

	// drums menu
	qs('.vinyl').addEventListener('click', handleLoopClick);
	qs('.vinyl').addEventListener('click', handleLoopClick);
	qs('.vinyl').addEventListener('click', handleLoopClick);
	qs('.vinyl').addEventListener('click', handleLoopClick);

	// keybaord menu
	qs('.vinyl').addEventListener('click', handleLoopClick);
	qs('.vinyl').addEventListener('click', handleLoopClick);
	qs('.vinyl').addEventListener('click', handleLoopClick);
	qs('.vinyl').addEventListener('click', handleLoopClick);

	// keyboard presses
	window.addEventListener('keydown', handleLoopClick);
}

function handleLoopClick() {
	var targetClass = this.classList;
	var parent = this.parentNode.children;

	/**
 	 * find index of 'this' in context of it's parentNode
 	 * index of 'this' correlates to index of sound in loopPlayers array
 	 * use call because 'parent' is a nodelist
 	 */
	var index = Array.prototype.indexOf.call(parent, this);

	if (targetClass.contains('play')) {
		loopPlayers[index].stop();
		// more stuff
	} else {
		// more stuff

		// play loop, and quantize two measures
		loopPlayers[index].start('@2m');
	}

	targetClass.toggle('play');
}

function handleBeatToggle() {          // e.target or this?
	this.classList.toggle('on');
}



initSounds();
initTransport();
initSequencer();
initControls();
























// var index = Array.from(this.parentNode.children).indexOf(this);

