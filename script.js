// browser support:
// IE9: classList.contains doesnt work?

'use strict';

window.onload = init;

/**
 * Helpers
 */
    
// get element(s) by CSS selector
function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}

// because forEach doesn't work with 
// nodeLists in certain browsers
function eachNode(nodeList, callback, scope) {
    for (var i = 0; i < nodeList.length; i++) {
        callback.call(scope, i, nodeList[i]);
    }
}

// randomizer for animations:
function randomize(arrayLength) {
    return Math.floor (Math.random() * arrayLength);
}

// classList.contains()


var ready;
var ticks = 16;
var stepNum = 1;

var loadedSamples = 0;

Tone.Transport.bpm.value = 200;
Tone.Transport.start();
var soundOutput = new Tone.Gain().toMaster()



function init() {
    setTimeout(function() {
        qs('#lobby').style.display = 'none';
        fadeIn(document.body);
        ready = true;
    }, 3000);
}


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


function checkoutSounds(group, toArray) {
    var currentGroup = sounds[group];
    var path = 'sounds/' + group + '/';
    
    // if passing in any directories,
    // from keys property
    if (group.indexOf('keys') !== -1) {
        var keysGroup = []

        for (var i = 1; i < 10; i++) {
            
            // create filenames
            keysGroup.push(group + i) 
        }

        currentGroup = keysGroup;
    }

    // set new player class for each sound file
    for (var i = 0; i < currentGroup.length; i++) {
        var completePath = path + currentGroup[i] + '.wav';

        toArray[i] = new Tone.Player(completePath, function() {
            loadedSamples++
        });

        toArray[i].connect(soundOutput);

        // enable looping when setting classes for loops
        if (group.indexOf('loops') !== -1) {
            toArray[i].loop = true;
        }
    }
};


// store buffers
var storeDrumsA = [];
var storeDrumsB = [];
var storeKeyA = [];
var storeKeyB = [];
var storeKeyC = [];


// to play
var drumPlayer = [];
var keyPlayer = [];
var bassPlayer = [];
var samplePlayer = [];
var loopPlayer = [];



checkoutSounds('drums', storeDrumsA);
checkoutSounds('drums', drumPlayer);
checkoutSounds('altDrums', storeDrumsB);

checkoutSounds('keysA', storeKeyA);
checkoutSounds('keysA', keyPlayer);
checkoutSounds('keysB', storeKeyB);
checkoutSounds('keysC', storeKeyC);

checkoutSounds('dialogues', samplePlayer);
checkoutSounds('loops', loopPlayer);




// drum volume, delete later
for (var i = 0; i < drumPlayer.length; i++) {
    drumPlayer[i].volume.value = -10;
}






/**
 * Make Grid
 */

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

        btn.addEventListener('click', function(){
            this.classList.toggle('on');
        });
    }
}

/**
 * Sequencer
 */

var beat = qsa('.beat');

var sequence = new Tone.Sequence(function(time) {

    // animate steps
    eachNode(beat, function(i) {
        var currentBeat = beat[i].classList; 

        currentBeat.remove('step');
        if (currentBeat.contains(stepNum)) {
            currentBeat.add('step');
        }
    });

    // play sounds
    for (var i = 0; i < sounds.drums.length; i++) {    
        eachNode(beat, function(j) {
            // TODO: get multiple class names with .split

            // OR, just (.name.on.alt)..
            // how do sounds play simultaneously?
            var hasSoundName = beat[j].classList.contains(sounds.drums[i]);
            var hasStep = beat[j].classList.contains(stepNum);
            var hasOn = beat[j].classList.contains('on');
            // var hasAlt = beat[j].classList.contains('alt'); 
            
            // TODO: add mute button?
            if (hasSoundName && hasStep && hasOn) {
                // drumPlayer[i].triggerAttack(0, time, 1);
                drumPlayer[i].start(time);
            }
        });
    }

    // reset stepNum at end of sequence to repeat
    stepNum++

    if (stepNum > ticks) {
        stepNum = 1;

        // animate gray circle on first step
        animCircleGray.restart();
    }
}, sounds.drums, '8n').start();


// clear button
qs('.clear').onclick = function() {
    eachNode(beat, function(i) {
        beat[i].classList.remove('on');
    });
}



var radio = document.querySelectorAll('.radio');

// loop menu
var loopUl = document.querySelector('#loop');
loopUl.addEventListener('click', function(e) {
    var eTarget = e.target.classList;
    var targetVinyl = eTarget.contains('vinyl');
    var targetMelody = eTarget.contains('melody');
    var targetBass = eTarget.contains('bass-line');
    var targetSomething = eTarget.contains('something');
    var hasPlay = eTarget.contains('play')
    var togglePlay = eTarget.toggle('play');

    // var tri = document.querySelectorAll('.triangle')
    var animSettings = 'blink 1s infinite linear';

    function queueAnim(prop, index) {
        if (prop.state !== 'started') {
            setTimeout(queueAnim.bind(null, prop, index), 100);
        } else {
            radio[index].style.animation = '';
            radio[index].classList.add('on')
        }
    }


    if (targetVinyl) {
        if (hasPlay) {
            loopPlayer[0].stop();
            radio[0].style.animation = '';
            radio[0].classList.remove('on')
        } else {
            loopPlayer[0].start('@1m');
            radio[0].style.animation = animSettings;
            queueAnim(loopPlayer[0], 0);
        }
    }
    if (targetMelody) {
        if (hasPlay) {
            loopPlayer[1].stop();
            radio[1].style.animation = '';
            radio[1].classList.remove('on')
        } else {
            loopPlayer[1].start('@1m');
            radio[1].style.animation = animSettings;
            queueAnim(loopPlayer[1], 1);
        }
    }
    if (targetBass) {
        if (hasPlay) {
            loopPlayer[3].stop();
            radio[2].style.animation = '';
            radio[2].classList.remove('on')
        } else {
            loopPlayer[3].start('@2m');
            radio[2].style.animation = animSettings;
            queueAnim(loopPlayer[3], 2);
        }
    }
    if (targetSomething) {
        if (hasPlay) {
            // loopPlayer[2].stop();
            radio[4].style.animation = '';
            radio[4].classList.remove('on')
        } else {
            // loopPlayer[3].start('@1m');
            radio[4].style.animation = animSettings;
            queueAnim(loopPlayer[4], 4);
        }
    }

    togglePlay;
});


// drum menu
var drumsUl = document.querySelector('#drums');
drumsUl.addEventListener('click', function(e) {

    var eTarget = e.target.classList;
    var targetKick = eTarget.contains('kick-alt');
    var targetSnare = eTarget.contains('snare-alt');
    var targetHat = eTarget.contains('hat-alt');
    var targetSwing = eTarget.contains('swing');
    
    var hasPlay = eTarget.contains('play')
    var togglePlay = eTarget.toggle('play');

    // var radio = document.querySelectorAll('.radio');

    if (targetKick) {
        if (hasPlay) {
            drumPlayer.splice(0, 1, storeDrumsA[0]);
            radio[4].classList.remove('on');
        } else {
            drumPlayer.splice(0, 1, storeDrumsB[0]);
            this.classList.add('play')
            radio[4].classList.add('on');
        }
    }
    if (targetSnare) {
        if (hasPlay) {
            drumPlayer.splice(1, 1, storeDrumsA[1]);
            radio[5].classList.remove('on');
        } else {
            drumPlayer.splice(1, 1, storeDrumsB[1]);
            this.classList.add('play')
            radio[5].classList.add('on');
        }
    }
    if (targetHat) {
        if (hasPlay) {
            drumPlayer.splice(2, 1, storeDrumsA[2]);
            radio[6].classList.remove('on');
        } else {
            drumPlayer.splice(2, 1, storeDrumsB[2]);
            this.classList.add('play')
            radio[6].classList.add('on');
        }
    }
    if (targetSwing) {
        if (hasPlay) {
            Tone.Transport.swing = 0;
            radio[7].classList.remove('on');
        } else {
            Tone.Transport.swing = 0.6;
            this.classList.add('play')
            radio[7].classList.add('on');
        }
    }
    togglePlay;
});

// keyboard menu
var keyUl = document.querySelector('#keyboard');
keyUl.addEventListener('click', function(e) {

    var eTarget = e.target.classList;
    var targetKeyA = eTarget.contains('keyA');
    var targetKeyB = eTarget.contains('keyB');
    var targetKeyC = eTarget.contains('keyC');
    var targetKeyD = eTarget.contains('keyD');

    var hasPlay = eTarget.contains('play')
    var togglePlay = eTarget.toggle('play');

    if (targetKeyA) {
        if (hasPlay) {
            keyPlayer = storeKeyA
            radio[8].classList.remove('on')
        } else {
            keyPlayer = storeKeyB
            this.classList.add('play')
            radio[8].classList.add('on')
        }
    }
    if (targetKeyB) {
        if (hasPlay) {
            keyPlayer = storeKeyA
            radio[9].classList.remove('on')
        } else {
            keyPlayer = storeKeyC
            this.classList.add('play')
            radio[9].classList.add('on')
        }
    }
    if (targetKeyC) {
        if (hasPlay) {
            keyPlayer = storeKeyA
            radio[10].classList.remove('on')
        } else {
            keyPlayer = storeKeyB
            this.classList.add('play')
            radio[10].classList.add('on')
        }
    }
    if (targetKeyD) {
        if (hasPlay) {
            keyPlayer = storeKeyA
            radio[11].classList.remove('on')
        } else {
            keyPlayer = storeKeyB
            this.classList.add('play')
            radio[11].classList.add('on')
        }
    }
    togglePlay;
});




// Animations

var animateArray = [];

(function wavesInit() {
    var waves = document.querySelectorAll('.waves');

    for (var i = 0; i < waves.length; i++) {
        animateArray[i] = new Vivus(waves[i].id, {
            type: 'sync', 
            duration: 60, 
            start: 'manual',
            animTimingFunction: function (t) {
                // easing script from: https://gist.github.com/gre/1650294
                return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; 
            }
        });
    }
}());

function resetWaveAnim() {
    for (var i = 0; i < animateArray.length; i++) {
        animateArray[i].stop();
        animateArray[i].reset();
    }
}




var animCircleGray = anime({
    targets: '#circleGray',
    scale: 1.2,
    direction: 'alternate',
    duration: 200,
    easing: 'easeInOutCirc',
    autoplay: false,
});

var animBaton = anime({
    targets: '#baton',
    rotate: '1turn',
    // duration: 750,
    duration: 1200,
    autoplay: false
});




function animateWave() {
    var index = randomize(animateArray.length)

    resetWaveAnim();

    // only play when circleGray has appeared
    if (circleGray.style.opacity > 0) {
        animateArray[index].play();
    }
}

// function hitPlay(type, index) {
//     type == 'key' ? keyPlayer[index].start() : samplePlayer[index].start()
// }


window.addEventListener("keydown", function(e) {
    
    if (e.metaKey || e.ctrlKey || ready !== true) {
        return;
    }


    // combine in one function 
    function playKeys(keyIndex) {
        keyPlayer[keyIndex].start();
    };

    function playSamples(keyIndex) {
        samplePlayer[keyIndex].start();
    };

    switch (e.which) {
        
        // A - H synthesizer
        case 65:
            playKeys(0)
            animateWave();
            break;
        case 83:
            playKeys(1)
            animateWave();
            break;
        case 68:
            playKeys(2)
            animateWave();
            break; 
        case 70:
            playKeys(3)
            animateWave();
            break;
        case 71:
            playKeys(4)
            animateWave();
            break;
        case 72:
            playKeys(5)
            animateWave();
            break;
        case 82:
            playSamples(0)
            animBaton.restart();
            break; 
        case 84:
            playSamples(1)
            animBaton.restart();
            break; 
        case 89:
            playSamples(2)
            animBaton.restart();
            break; 
        case 85:
            playSamples(3)
            animBaton.restart();
            break;    
        default:
            return;
    }
  
});








// fadeIn script from: http://youmightnotneedjquery.com/
function fadeIn(el) {
  // el.style.opacity = 0;

  var last = +new Date();
  var tick = function() {
    el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
    last = +new Date();

    if (+el.style.opacity < 1) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
    }
  };

  tick();
}


function randomizeCirclePos() {
    var circleCoords = [
        [-20, 530],
        [340, 60],
        [295, 220],
        [-85, 15],
        [280, 515],
        [375, 630],
        [-20, 155],
        [-145, 575],
        [160, 100],
        [160, 580]
    ];

    // TODO: stay dry, repeated 2x
    var circleOrange = document.querySelector('#circleOrange');

    var index = randomize(circleCoords.length)

    function setPos(topPos, leftPos) {
        circleOrange.style.top = topPos + 'px';
        circleOrange.style.left = leftPos + 'px';
    }

    setPos.apply(null, circleCoords[index]);
}


(function inactivity() {
    var main;
    var delay;
    var modal;
    var countClicks = 0;
    var cirPosChanges = 0;

    var animScreen = document.querySelector('#animations');
    // var beat = document.querySelectorAll('.beat')
    var circleGray = document.querySelector('#circleGray');
    var circleOrange = document.querySelector('#circleOrange');
    var baton = document.querySelector('#baton');
  
    // window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onclick = function () {
        if (countClicks < 5) {
            countClicks++
        }
    }
    document.onkeypress = function () {
        keyPress = true;
    }

    function goAnimation() {

        resetWaveAnim();

        animScreen.style.visibility = 'visible';
        qs('.clear').style.visibility = 'hidden'

        // randomize orange circle after first appearance
        cirPosChanges++
        if (cirPosChanges > 1) {
            randomizeCirclePos();
        }


        /**
         * wait 500ms after setting visibility before animating 
         * to avoid weird glitch
        */ 

        // TODO: CSS transition delay, instead of setTimeout?
        delay = setTimeout(function() {
            
            resetWaveAnim();

            fadeIn(circleGray);
            fadeIn(circleOrange);
            fadeIn(baton);

            // vivus, play wave on init
            // TODO: delay for glitch
            animateArray[0].play();

            // // tone, start animate loop
            // circleGrayLoop.start('@4m');

        }, 600);


        // modal box
        modal = setTimeout(function() {
            if (keyPress !== true) {
                overlay.style.display = 'block';
            }
        }, 6000);

        
        for (var i = 0; i < beat.length; i++) {
            if (!beat[i].classList.contains('on')) {
                beat[i].style.visibility = 'hidden';
            }
        }
    }

    function resetTimer() {
        animScreen.style.visibility = 'hidden';
        qs('.clear').style.visibility = 'visible'

        circleGray.style.opacity = 0;
        circleOrange.style.opacity = 0;
        baton.style.opacity = 0;

        // // tone, stop animate loop
        // circleGrayLoop.stop();

        for (var i = 0; i < beat.length; i++) {
            if (!beat[i].classList.contains('on')) {
                beat[i].style.visibility = 'visible';
            }
        }

        clearTimeout(main);
        clearTimeout(delay);
        clearTimeout(modal);

        if (countClicks >= 5) {
            main = setTimeout(goAnimation, 2000)
        }
    } 
}());

var keyPress = false;
var overlay = document.querySelector('.overlay');
var gotIt = document.querySelector('.got-it');
gotIt.onclick = function () {
    overlay.style.display = 'none';
    keyPress = true;
}











