// browser support: 
// IE11: classList
var lobby = document.querySelector('#lobby');
lobby.style.display = 'none';

'use strict';

// window.onload = init;

var isReady;       // use loadedSamples: loadedSamples <= 24 ?
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
var drumPlayers;
var loopPlayers;
var dialoguePlayers;
var keysPlayers;

var defaultDrums;
var alternateDrums;
var defaultKeys; 
var alternateKeysB;
var alternateKeysC;

var sounds = {
    drums: [
        // arrays of file names
        'kick', 
        'clap', 
        'hat', 
        'hat-open', 
        'tom-1', 
        'tom-2'
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

    // if directory from 'keys'
    if (keys) {
        var keysGroup = [];

        for (var i = 1; i < 10; i++) {
            // create file names
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

    // returns array of buffers
    return buffers;   
}

function changeDrumSound(array, index) {
    if (array === alternateDrums) {
        drumPlayers[index] = alternateDrums[index];
    } else {
        drumPlayers[index] = defaultDrums[index];
    }
}

function changeKeysSound(change, index) {
    if (change && index == 0) keysPlayers = alternateKeysB;
    if (change && index == 1) keysPlayers = alternateKeysC;
    if (!change) keysPlayers = defaultKeys;
}

function initTransport() {
    Tone.Transport.bpm.value = 200;
    Tone.Transport.start();
}

function initSounds() {
    /**
     * copy 'drumsPlayers' and 'keysPlayers' arrays
     * with slice to restore defaults instantly without 
     * having to re-load buffers
     */
    drumPlayers = createBuffers(createPaths('drums'));
    defaultDrums = drumPlayers.slice(0);
    keysPlayers = createBuffers(createPaths('keysA', true));
    defaultKeys = keysPlayers.slice(0);
    loopPlayers = createBuffers(createPaths('loops'), true);
    dialoguePlayers = createBuffers(createPaths('dialogues'));
    
    // store alternate sound buffers
    alternateDrums = createBuffers(createPaths('altDrums'));
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

    if (stepNum > ticks) stepNum = 1;
}

function initSequencer() {
    createGrid();
    createSequence(); 
}

/**
 * Handle Events
 */
function initControls() {
    var liElements = document.getElementsByTagName('li');

    // sequencer clicks
    eachNode(qsa('.beat'), function(node) {
        node.addEventListener('click', handleBeatToggle);
    });

    // menu clicks
    eachNode(liElements, function(node) {
        node.addEventListener('click', handleMenuClicks);
    });

    // keyboard presses
    window.addEventListener('keydown', handleKeyPress);
}

function handleBeatToggle() { 
    this.classList.toggle('on');
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

function handleMenuClicks() {
    var index = getIndexFromEl(this);
    var radios = this.parentNode.getElementsByTagName('span');

    var loopUl = this.parentNode.id == 'loop-ul';
    var drumsUl = this.parentNode.id == 'drums-ul';
    var keysUl = this.parentNode.id == 'keys-ul';

    if (!this.classList.contains('play')) {     
        if (loopUl) {
            // play loop to start at second measure
            loopPlayers[index].start('@2m');
            animateRadioButton(true, index, radios);
        }

        if (drumsUl) {
            // change to 'alternateDrums' sound
            changeDrumSound(alternateDrums, index)
            radios[index].classList.toggle('on');
        }

        if (keysUl) {
            // keysPlayers = alternateKeysB;
            changeKeysSound(true, index);
            radios[index].classList.toggle('on');
        }
    } else {
        if (loopUl) {
            loopPlayers[index].stop();
            animateRadioButton(false, index, radios);
        }

        if (drumsUl) {
            changeDrumSound(defaultDrums, index);
            radios[index].classList.toggle('on');
        }

        if (keysUl) {
            changeKeysSound(false);
            radios[index].classList.toggle('on');
        }
    }

    this.classList.toggle('play');
}

function animateRadioButton(play, index, radios) {
    if (play) {
        // starts queue by blinking
        radios[index].style.animation = 'blink 1s infinite linear';

        // run handleQueue() to stop blinking when sound has started
        handleQueue(index);
    } else {
        radios[index].style.animation = '';
        radios[index].classList.remove('on');
    }

    // calls itself every 100ms until play state returns 'started'
    // then disable blinking and set
    function handleQueue(index) {
        if (loopPlayers[index].state !== 'started') {
            setTimeout(handleQueue.bind(null, index), 100);
        } else {
            radios[index].style.animation = '';
            radios[index].classList.add('on')
        }
    }
}

function handleKeyPress(e) {
    if (e.metaKey || e.ctrlKey) return;         // ready !== true

    switch (e.which) {
        // A - L notes
        case 65: triggerKey(keysPlayers, 0); break;
        case 83: triggerKey(keysPlayers, 1); break;
        case 68: triggerKey(keysPlayers, 2); break;
        case 70: triggerKey(keysPlayers, 3); break;
        case 71: triggerKey(keysPlayers, 4); break;
        case 72: triggerKey(keysPlayers, 5); break;

        // R - U samples
        case 82: triggerKey(dialoguePlayers, 0); break;
        case 84: triggerKey(dialoguePlayers, 1); break;
        case 89: triggerKey(dialoguePlayers, 2); break;
        case 85: triggerKey(dialoguePlayers, 3); break;
        default:
            return;
    }
}

// triggers sound and corresponding animation
function triggerKey(array, index, animation) {
    array[index].start();
    
    if (animation === 'animBaton') {
        animation.restart();
    }

    if (animation === 'animBaton') {
        animation.restart();
    }
}

/**
 * Handle Animations
 */
var animateArray = [];

function createWaves() {
    var waves = qsa('.waves');

    eachNode(waves, function(el, index) {
        animateArray[index] = new Vivus(waves[index].id, {
            type: 'sync', 
            duration: 60, 
            start: 'manual',
            animTimingFunction: function (t) {
                // TODO: check if this script is messing things up
                // easing script from: https://gist.github.com/gre/1650294
                return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; 
            }
        });
    });
}

function resetWaveAnim() {
    animateArray.forEach(function(wave) {
        wave.stop();
        wave.reset();
    });
}

// fadeIn script from http://youmightnotneedjquery.com/
function fadeIn(el) {
    // el.style.opacity = 0;
    var last = +new Date();
    
    function tick() {
        el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
        last = +new Date();

        if (+el.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
    };

    tick();
}

function randomize(arrayLength) {
    return Math.floor (Math.random() * arrayLength);
}

function setOrangeCircle() {
    var circleOrange = qs('#circleOrange');
    
    var circleCoords = [[-20, 530], [340, 60], [295, 220], [-85, 15], [280, 515], [375, 630], [-20, 155], [-145, 575], [160, 100], [160, 580]];
    var index = randomize(circleCoords.length)

    function setPosition(topPosition, leftPosition) {
        circleOrange.style.top = topPosition + 'px';
        circleOrange.style.left = leftPosition + 'px';
    }

    setPosition.apply(null, circleCoords[index]);
}


initSounds();
initTransport();
initSequencer();
initControls();
createWaves();





























