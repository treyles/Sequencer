'use strict';

var ready;
var ticks = 16;
var stepNum = 1;

Tone.Transport.bpm.value = 200;
Tone.Transport.start();
var soundOutput = new Tone.Gain().toMaster()

var loadedSamples = 0;

window.onload = function() {
    var lobby = document.querySelector('#lobby');
    
    function load() {
        lobby.style.display = 'none';
        fadeIn(document.body);
        ready = true;
    }

    setTimeout(load, 2000);
}

// TODO: IIFE here to run init

// var drumSounds = [
//     'sounds/drums/kick.mp3', 
//     'sounds/drums/clap.mp3', 
//     'sounds/drums/hat.mp3', 
//     'sounds/drums/hat-open.mp3',
//     'sounds/drums/kick.mp3', 
//     'sounds/drums/clap.mp3'
// ];

// var loopSounds = [
//     'sounds/loops/crackle.wav',
//     'sounds/loops/alicepad1.wav',
//     'sounds/loops/alicepad2.wav',
//     'sounds/loops/bass-line1.wav',
//     'sounds/loops/bass-line2.wav'
// ];

// var altDrumSounds = [
//     'sounds/alt-drums/lofikick.wav',
//     'sounds/alt-drums/lofisnare.wav',
//     'sounds/alt-drums/lofihat.wav'
// ];

// var keySounds = [
//     [   'sounds/keys/keyA1.wav',
//         'sounds/keys/keyA2.wav',
//         'sounds/keys/keyA3.wav',
//         'sounds/keys/keyA4.wav',
//         'sounds/keys/keyA5.wav',
//         'sounds/keys/keyA6.wav'
//     ],
//     [   'sounds/keys/keyB1.wav',
//         'sounds/keys/keyB2.wav',
//         'sounds/keys/keyB3.wav',
//         'sounds/keys/keyB4.wav',
//         'sounds/keys/keyB5.wav',
//         'sounds/keys/keyB6.wav'
//     ],
//     [   'sounds/keys/keyC1.wav',
//         'sounds/keys/keyC2.wav',
//         'sounds/keys/keyC3.wav',
//         'sounds/keys/keyC4.wav',
//         'sounds/keys/keyC5.wav',
//         'sounds/keys/keyC6.wav'
//     ],
//     [   'sounds/dialogues/dream.wav',
//         'sounds/dialogues/high.wav',
//         'sounds/dialogues/horizon.wav',
//         'sounds/dialogues/lights.wav'
//     ]
// ];

    // keys: [
    //     'keysA',
    //     'keysB',
    //     'keysC'
    // ],

// var drumNames = ['bass', 'snare', 'low', 'mid', 'bass', 'snare'];

// var sounds = {

//     drums: ['kick', 'clap', 'hat', 'hat-open', 'kick', 'clap'],
//     altDrums: ['lofikick', 'lofisnare', 'lofihat'],
//     loops: ['crackle', 'alicepad1', 'alicepad2', 'bass-line1', 'bass-line2'],
//     dialogues: ['dream', 'high', 'horizon', 'lights'],

//     keysA: ['A1', 'A2', 'A3' 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'],
//     keysB: ['B1', 'B2', 'B3' 'B4', 'B5', 'B6', 'B7', 'B8', 'B9'],
//     keysC: ['C1', 'C2', 'C3' 'C4', 'C5', 'C6', 'C7', 'C8', 'C9']
    
// };



var drumNames = [
    'bass', 
    'snare', 
    'low', 
    'mid', 
    'bass', 
    'snare'
];

var sounds = {
    drums: [
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

    keys: [
        'keysA',
        'keysB',
        'keysC'
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
    ]
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




// TODO: change from sampler to player:
// for buffer count (preloader, loadedSamples++) *edit: sampler can do
// for choke
// and can trigger queue with player.state
// should set retrigger = true for drum sounds

// function checkoutSoundGroup (group, toArray) {
//     for (var i = 0; i < group.length; i++) {
//         toArray[i] = new Tone.Sampler(group[i]);
//         toArray[i].connect(soundOutput);
//     }
// };

// 'sounds/drums/kick.mp3'

// 'sounds/keys/keysA/keyA1.wav'

function checkoutSounds(group, toArray) {
    var currentGroup = sounds[group];
    var path = 'sounds/' + group + '/';
    
    // checks if argument contains string
    if (group.indexOf('keys') !== -1) {
        var keysGroup = []

        for (var i = 1; i < 10; i++) {
            keysGroup.push(group + i) 
        }

        currentGroup = keysGroup;
    }

    for (var i = 0; i < currentGroup.length; i++) {
        var completePath = path + currentGroup[i] + '.wav';

        toArray[i] = new Tone.Player(completePath, function() {
            loadedSamples++
        });

        toArray[i].connect(soundOutput);
    }
};



// // drums
// checkoutSoundGroup(drumSounds, storeDrumsA);
// checkoutSoundGroup(drumSounds, drumPlayer);
// checkoutSoundGroup(altDrumSounds, storeDrumsB);

checkoutSounds('drums', storeDrumsA);
checkoutSounds('drums', drumPlayer);
checkoutSounds('altDrums', storeDrumsB);



// // keys
// checkoutSoundGroup(keySounds[0], storeKeyA);
// checkoutSoundGroup(keySounds[0], keyPlayer);
// checkoutSoundGroup(keySounds[1], storeKeyB);
// checkoutSoundGroup(keySounds[2], storeKeyC);

checkoutSounds('keysA', storeKeyA);
checkoutSounds('keysA', keyPlayer);
checkoutSounds('keysB', storeKeyB);
checkoutSounds('keysC', storeKeyC);

// // samples
// checkoutSoundGroup(keySounds[3], samplePlayer);

checkoutSounds('dialogues', samplePlayer);





// drum volume, delete later
for (var i = 0; i < drumPlayer.length; i++) {
    drumPlayer[i].volume.value = -10;
}








// Animations

var animateArray = [];

(function animateWaves() {
    var waves = document.querySelectorAll('.waves');

    for (var i = 0; i < waves.length; i++) {
        animateArray[i] = new Vivus(waves[i].id, {
            type: 'sync', 
            duration: 60, 
            start: 'manual',
            animTimingFunction: function (t) { 
                return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; 
            }
        });
    }
}());

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

var playQueue1 = anime({
    targets: '.vinyl .triangle',
    direction: 'alternate',
    duration: 200,
    delay: 200,
    opacity: 0,
    easing: 'easeInOutCubic',
    autoplay: false,
    loop: true
});

var clearAnim = anime({
    targets: '.clear',
    rotate: '1turn',
    // duration: 750,
    duration: 500,
    autoplay: false
});






/**
 * Make Grid
 */

var grid = document.getElementById('grid');

// make div for each sound
for (var i = 0; i < sounds.drums.length; i++) {
    var soundDiv = document.createElement('div');

    soundDiv.setAttribute('id', drumNames[i]);
    grid.appendChild(soundDiv);
}

// make ticks.length row of beats for each sound
for (var i = 0; i < grid.children.length; i++) {
    for (var j = 1; j < ticks + 1; j++) {
        var btn = document.createElement('div');

        btn.classList.add('beat', drumNames[i], j);
        grid.children[i].appendChild(btn);

        btn.addEventListener('click', function(){
            this.classList.toggle('on');
        });
    }
}

/**
 * Sequencer
 */


// loop sequence

var sequence = new Tone.Sequence(function(time) {
    var beat = document.querySelectorAll('.beat'); // declare at top
    
    // animate steps
    // loop through nodeList
    for (var i = 0; i < beat.length; i++) {
        var currentBeat = beat[i].classList; 

        currentBeat.remove('step');
        if (currentBeat.contains(stepNum)) {
            currentBeat.add('step');
        }
    }

    // play sounds
    for (var i = 0; i < sounds.drums.length; i++) {
        // loop through nodeList
        for (var j = 0; j < beat.length; j++) {
            // TODO: get multiple class names with .split

            // OR, just (.name.on.alt)..
            // how do sounds play simultaneously?
            var hasSoundName = beat[j].classList.contains(drumNames[i]);
            var hasStep = beat[j].classList.contains(stepNum);
            var hasOn = beat[j].classList.contains('on');
            var hasAlt = beat[j].classList.contains('alt'); 
            
            // TODO: add mute button?
            if (hasSoundName && hasStep && hasOn) {
                // drumPlayer[i].triggerAttack(0, time, 1);
                drumPlayer[i].start(time);
            }
        }       
    }

    // reset stepNum at end of sequence to repeat
    stepNum++

    if (stepNum > ticks) {
        stepNum = 1;
    }
}, sounds.drums, '8n').start();


/**
 * Loop
*/

var loopSounds = [
    'sounds/loops/crackle.wav',
    'sounds/loops/alicepad1.wav',
    'sounds/loops/alicepad2.wav',
    'sounds/loops/bass-line1.wav',
    'sounds/loops/bass-line2.wav'
];

// TODO: combine with multiPlayer and put in object?

// loop sound library
var loopPlayer = new Tone.MultiPlayer(loopSounds, function() {
    loopPlayer.start();
}).connect(soundOutput);

// vinyl loop
var vinyl = new Tone.Loop(function(time) {
    loopPlayer.start(0, time, 0);
}, '2m');

// melody loop
var melody = new Tone.Loop(function(time) {
    loopPlayer.start(1, time, 0);
}, '1m');

// bass loop, loops through two bass parts
// TODO: use 'step' instead of 'bassPart'
var bassPart = 0;
var bassLine = new Tone.Sequence(function(time) {
    if (bassPart < 1) {
        loopPlayer.start(3, time, 0);
        bassPart++;
    } else {
        loopPlayer.start(4, time, 0);
        bassPart = 0;
    } 
}, [1, 2], '8m');


var circleGrayLoop = new Tone.Loop(function(time) {
    // animCircleGray.restart();
}, '2m');

// var melody = document.querySelector('.melody')
// melody.firstChild.classList.contains('triangle')

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
    var animateQueue = 'blink 1s infinite linear';

    function wait(prop, index) {
        if (prop.state !== 'started') {
            setTimeout(wait.bind(null, prop, index), 100);
        } else {
            radio[index].style.animation = '';
            radio[index].classList.add('on')
        }
    }


    if (targetVinyl) {
        if (hasPlay) {
            vinyl.stop();
            radio[0].style.animation = '';
            radio[0].classList.remove('on')
        } else {
            vinyl.start('@1m');
            radio[0].style.animation = animateQueue;
            wait(vinyl, 0);
        }
    }
    if (targetMelody) {
        if (hasPlay) {
            melody.stop();
            radio[1].style.animation = '';
            radio[1].classList.remove('on')
        } else {
            melody.start('@1m');
            radio[1].style.animation = animateQueue;
            wait(melody, 1);
        }
    }
    if (targetBass) {
        if (hasPlay) {
            bassLine.stop();
            bassPart = 0;
            radio[2].style.animation = '';
            radio[2].classList.remove('on')
        } else {
            bassLine.start('@2m')
            radio[2].style.animation = animateQueue;
            wait(bassLine, 2);
        }
    }
    if (targetSomething) {
        if (hasPlay) {
            // melody.stop();
            radio[3].style.animation = '';
            radio[3].classList.remove('on')
        } else {
            // melody.start('@1m');
            radio[3].style.animation = animateQueue;
            wait(something, 3);
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



window.addEventListener("keydown", function(e) {
    
    if (e.metaKey || e.ctrlKey || ready !== true) {
        return;
    }

    // TODO: stay dry, repeated 2x
    // all functions outside of eventListener?
    function animateWave() {
        var randomize = Math.floor (
            Math.random() * animateArray.length
        );

        // TODO: stay dry, this is repeated 3x
        for (var i = 0; i < animateArray.length; i++) {
            animateArray[i].stop();
            animateArray[i].reset();
        }

        // only play when circleGray has animated
        if (circleGray.style.opacity > 0) {
            animateArray[randomize].play();
        }
    }

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

var clear = document.querySelector('.clear');
var beat = document.querySelectorAll('.beat');


clear.onclick = function() {
    for (var i = 0; i < beat.length; i++) {
        beat[i].classList.remove('on');
    }
    // clearAnim.restart();
}



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

    // TODO: stay dry, reapeated 2x
    var randomPos = Math.floor (
            Math.random() * circleCoords.length
        );

    function setPos(topPos, leftPos) {
        circleOrange.style.top = topPos + 'px';
        circleOrange.style.left = leftPos + 'px';
    }

    setPos.apply(null, circleCoords[randomPos]);
}


(function inactivity() {
    var main;
    var delay;
    var modal;
    var countClicks = 0;
    var cirPosChanges = 0;

    var animScreen = document.querySelector('#animations');
    var beat = document.querySelectorAll('.beat')
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

        // TODO: stay dry, make function
        for (var i = 0; i < animateArray.length; i++) {
            animateArray[i].stop();
            animateArray[i].reset();
        }

        animScreen.style.visibility = 'visible';
        clear.style.visibility = 'hidden'

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
            
            //TODO: stay dry, make function
            for (var i = 0; i < animateArray.length; i++) {
                animateArray[i].stop();
                animateArray[i].reset();
            }

            fadeIn(circleGray);
            fadeIn(circleOrange);
            fadeIn(baton);

            // vivus, play wave on init
            // TODO: delay for glitch
            animateArray[0].play();

            // tone, start animate loop
            circleGrayLoop.start('@4m');

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
        clear.style.visibility = 'visible'

        circleGray.style.opacity = 0;
        circleOrange.style.opacity = 0;
        baton.style.opacity = 0;

        // tone, stop animate loop
        circleGrayLoop.stop();

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











