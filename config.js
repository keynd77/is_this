const overlayConfig = {
    intervalRange: { min: 2000, max: 5000 },

    overlays: {
        start: [
            { type: 'text', content: 'Is this...', position: 'top-left', duration: 2000 },
            { type: 'text', content: 'Wait, is this...', position: 'top-center', duration: 2000 },
            { type: 'text', content: 'Hold on...', position: 'top-right', duration: 1800 },
            { type: 'text', content: 'Hm...', position: 'top-left', duration: 1500 },
            { type: 'text', content: 'Could it be...', position: 'top-center', duration: 2000 }
        ],

        follow: [
            { type: 'text', content: 'really?', position: 'top-right', duration: 2000 },
            { type: 'text', content: 'what I think...', position: 'top-center', duration: 2000 },
            { type: 'text', content: 'actually...', position: 'middle-right', duration: 2000 },
            { type: 'text', content: 'is this even possible?', position: 'middle-left', duration: 2000 },
            { type: 'text', content: '...for real?', position: 'bottom-center', duration: 2000 }
        ],

        filler: [
            { type: 'text', content: 'No way.', position: 'middle-left', duration: 2000 },
            { type: 'text', content: 'really?', position: 'middle-right', duration: 2000 },
            { type: 'text', content: 'This can’t be.', position: 'bottom-left', duration: 2000 },
            { type: 'text', content: 'Or can it?', position: 'bottom-center', duration: 2000 },
            { type: 'text', content: 'That’s insane.', position: 'bottom-right', duration: 2000 },
            { type: 'text', content: 'Actually...', position: 'middle-right', duration: 2000 },
            { type: 'text', content: 'maybe it is.', position: 'bottom-center', duration: 2200 },
            { type: 'text', content: 'Oh no.', position: 'bottom-left', duration: 1800 },
            { type: 'text', content: 'Oh yes.', position: 'bottom-right', duration: 2000 },
            { type: 'text', content: 'I refuse to believe this.', position: 'middle-left', duration: 2000 },
            { type: 'text', content: 'No seriously, how?', position: 'middle-center', duration: 2000 },
            { type: 'text', content: 'Unbelievable.', position: 'bottom-center', duration: 2000 },
            { type: 'text', content: 'This shouldn’t exist.', position: 'middle-center', duration: 2000 },
            { type: 'text', content: 'Yet it does.', position: 'top-center', duration: 2000 }
        ],

        preEnd: [
            { type: 'text', content: 'Wait a minute...', position: 'middle-left', duration: 1800 },
            { type: 'text', content: 'Hold up.', position: 'middle-right', duration: 1800 },
            { type: 'text', content: 'I get it now.', position: 'middle-center', duration: 2000 },
            { type: 'text', content: 'Oh.', position: 'bottom-left', duration: 1500 },
            { type: 'text', content: 'It all makes sense.', position: 'bottom-center', duration: 2200 },
            { type: 'text', content: 'It’s not what I thought.', position: 'bottom-right', duration: 2200 },
            { type: 'text', content: 'So this is how it is.', position: 'middle-center', duration: 2300 }
        ],

        end: [
            // curious / open-ended
            { type: 'text', content: 'What does this even mean?', position: 'middle-center', duration: 2500 },
            { type: 'text', content: 'Why am I thinking this?', position: 'bottom-center', duration: 2500 },
            { type: 'text', content: 'Maybe I’ll never know.', position: 'middle-right', duration: 2500 },
            { type: 'text', content: 'It’s weird, isn’t it?', position: 'bottom-left', duration: 2500 },
          
            // self reflection / confession
            { type: 'text', content: 'I can’t unsee this now.', position: 'bottom-right', duration: 2500 },
            { type: 'text', content: 'I’m weirdly into this.', position: 'middle-center', duration: 2500 },
            { type: 'text', content: 'Why do I do this to myself?', position: 'bottom-center', duration: 2600 },
            { type: 'text', content: 'I’m lost but entertained.', position: 'middle-left', duration: 2500 },
          
            // everyday observation
            { type: 'text', content: 'This feels oddly satisfying.', position: 'middle-center', duration: 2500 },
            { type: 'text', content: 'This is somehow comforting.', position: 'bottom-center', duration: 2500 },
            { type: 'text', content: 'I needed this today.', position: 'top-center', duration: 2500 },
          
            // philosophical / absurd
            { type: 'text', content: 'Reality is optional.', position: 'middle-center', duration: 2500 },
            { type: 'text', content: 'Maybe that’s life.', position: 'bottom-right', duration: 2500 },
            { type: 'text', content: 'Time is weird.', position: 'middle-left', duration: 2500 },
            { type: 'text', content: 'Weirdness is inevitable.', position: 'bottom-left', duration: 2500 },
          
            // meta / self-aware
            { type: 'text', content: 'Was that too much?', position: 'middle-right', duration: 2500 },
            { type: 'text', content: 'I kind of love this chaos.', position: 'bottom-center', duration: 2500 },
            { type: 'text', content: 'Let’s never speak of this again.', position: 'bottom-right', duration: 2600 },
            { type: 'text', content: 'Good question, next one!', position: 'middle-center', duration: 2500 }
          ]
          
    }
};
