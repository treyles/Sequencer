(function() {
	'use strict';


	var sounds = {

		loadedSamples: 0,

		drumPlayer: [],
	    loopPlayer: [],
	    dialoguePlayer: [],
	    keyPlayer: [],
		
		source: {
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
		},

		createPath: function(group, name) {
			var currentGroup = group;
		    var path = 'sounds/' + name + '/';

		    if (name.indexOf('keys') !== -1) {
		        var keysGroup = []

		        for (var i = 1; i < 10; i++) {
		            
		            // create filenames
		            keysGroup.push(name + i ) 
		        }

		        currentGroup = keysGroup;
		    }

		    return currentGroup.map(function(el) {
		        return path + el + '.wav';
		    });
		},

		createBuffers: function(array, loop) {
			var buffers = array.map(function(el) {               
		        var currentBuffer = new Tone.Player(el, function() {
		            sounds.loadedSamples++
		        });

		        if (loop) {
		            currentBuffer.loop = true;
		        }

		        currentBuffer.toMaster();      // toMaster to delete var soundOutput? do others use?

		        return currentBuffer;
	    	});
    
    		return buffers;
		},

		initToneTransport: function() {
			Tone.Transport.bpm.value = 200;
		    Tone.Transport.start();
		},

		changeSounds: function(group, loop, toChange) {
			var current = createPath(group);             // current, really?
		    return createBuffers(current, loop);
		},

		init: function() {
		    var drums = this.createPath(this.source.drums, 'drums');    // pathS plural
		    var loops = this.createPath(this.source.loops, 'loops');
		    var dialogues = this.createPath(this.source.dialogues, 'dialogues');
		    var keys = this.createPath(this.source.dialogues, 'keysA');

		    this.drumPlayer = this.createBuffers(drums, false)
		    this.loopPlayer = this.createBuffers(loops, true)  // set enable looping to true
		    this.dialoguePlayer = this.createBuffers(dialogues, false)
		    this.keysPlayer = this.createBuffers(keys, false)

		    this.initToneTransport();
		}
	};

	var sequencer = {

		createGrid: function() {
			console.log(sounds.drumPlayer)
		}
	};
// return sounds;
sounds.init();
window.sounds = sounds;

})();































// source: {
// 	// arrays of filenames
//     drums: ['kick', 'clap', 'hat', 'hat-open', 'kick', 'clap'],
// 	altDrums: ['lofikick','lofisnare','lofihat'],
// 	loops: ['crackle', 'alicepad1', 'alicepad2', 'bass-line1', 'bass-line2'],
// 	dialogues: ['dream', 'high', 'horizon', 'lights'],

// 	// array of directories
//     keys: ['keysA', 'keysB', 'keysC']
// },






// var drumPlayer = new Array(),
//     loopPlayer = new Array(),
//     dialoguePlayer = new Array(),
//     keyPlayer = new Array();


// function createPath(group) {
//     var currentGroup = sounds[group];
//     var path = 'sounds/' + group + '/';

//     if (group.indexOf('keys') !== -1) {
//         var keysGroup = []

//         for (var i = 1; i < 10; i++) {
            
//             // create filenames
//             keysGroup.push(group + i ) 
//         }

//         currentGroup = keysGroup;
//     }

//     return currentGroup.map(function(el) {
//         return path + el + '.wav';
//     });
// }

// function createBuffers(array, loop) {
    

//     var buffers = array.map(function(el, index) {               //  index not needed? 
//         var currentBuffer = new Tone.Player(el, function() {
//             loadedSamples++
//         });

//         if (loop) {
//             currentBuffer.loop = true;
//         }

//         currentBuffer.connect(soundOutput);      // toMaster to delete var soundOutput? do others use?

//         return currentBuffer;
        
//     });
    

//     return buffers;
    
// }

// function initSounds() {
//     var drums = createPath('drums');    // pathS plural
//     var loops = createPath('loops');
//     var dialogues = createPath('dialogues');
//     var keys = createPath('keysA');

//     drumPlayer = createBuffers(drums, false)
//     loopPlayer = createBuffers(loops, true)  // set enable looping to true
//     dialoguePlayer = createBuffers(dialogues, false)
//     keysPlayer = createBuffers(keys, false)

//     // Tone.Transport.bpm.value = 200;
//     // Tone.Transport.start();
// }

// function singleBuffer(group, loop) {
//     var current = createPath(group);             // current, really?
//     return createBuffers(current, loop);
// }


// drumPlayer = singleBuffer('altDrums', false);
//              loadBuffers
//              checkoutSounds


// drumPlayer = sounds.singleBuffer(sound.source.drums, false);
