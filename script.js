const sounds = {
    smootherSounds: [
        ["Chord_1", "./Samples/Chord_1.mp3"],
        ["Chord_2", "./Samples/Chord_2.mp3"],
        ["Chord_3", "./Samples/Chord_3.mp3"],
        ["Shaker", "./Samples/Give_us_a_light.mp3"],
        ["Open_HH", "./Samples/Dry_Ohh.mp3"],
        ["Closed_HH", "./Samples/Bld_H1.mp3"],
        ["Punchy_Kick", "./Samples/punchy_kick_1.mp3"],
        ["Side_Stick", "./Samples/side_stick_1.mp3"],
        ["Snare", "./Samples/Brk_Snr.mp3"]
    ],
    harderSounds: [
        ["Heater_1", "./Samples/Heater-1.mp3"],
        ["Heater_2", "./Samples/Heater-2.mp3"],
        ["Heater_3", "./Samples/Heater-3.mp3"],
        ["Heater_4", "./Samples/Heater-4.mp3"],
        ["Clap", "./Samples/clap.mp3"],
        ["Open_Hi-Hat", "./Samples/open_hh.mp3"],
        ["Kick-n-Hat", "./Samples/Kick_n_Hat.mp3"],
        ["Kick", "./Samples/kick.mp3"],
        ["Closed_Hi-Hat", "./Samples/closed_hh.mp3"]
    ]
}
const q = document.querySelector("#Heater_1");
const w = document.querySelector("#Heater_2");
const e = document.querySelector("#Heater_3");
const a = document.querySelector("#Heater_4");
const s = document.querySelector("#Clap");
const d = document.querySelector("#Open_Hi-Hat");
const z = document.querySelector("#Kick-n-Hat");
const x = document.querySelector("#Kick");
const c = document.querySelector("#Closed_Hi-Hat");
const padArr = [q, w, e, a, s, d, z, x, c];

//mouse support
const padsWithEventListeners = padArr.map(item => {
    item.addEventListener("click", () => {
        const padId = item.innerText;
        document.getElementById(padId).currentTime = 0;
        document.getElementById(padId).play();
        document.querySelector("#instrument").innerText = item.id.replace("_", " ");
        item.classList.add("pad-pressed");
    })
});

//keyboard support
window.addEventListener("keydown", (event) => {
    const kCode = event.key.toUpperCase();
    const audioObj = document.getElementById(kCode.toString());
    if (audioObj) {
        audioObj.currentTime = 0;
        document.getElementById(kCode).play();
        document.querySelector("#instrument").innerText = audioObj.parentElement.id.replace("_", " ");
        audioObj.parentElement.classList.add("pad-pressed");
    }
});

//midi support
try {
    navigator.requestMIDIAccess()
        .then(success => {
            const inputs = success.inputs;
            inputs.forEach(input => {
                input.addEventListener("midimessage", midiInput => {
                    const noteToPadObj = {
                        36: "Q",
                        37: "W",
                        38: "E",
                        39: "A",
                        40: "S",
                        41: "D",
                        42: "Z",
                        43: "X",
                        60: "C"
                    }

                    const command = midiInput.data[0];
                    const note = midiInput.data[1];
                    const vel = midiInput.data[2];

                    if (noteToPadObj[note] && vel > 0) {
                        const audioClip = document.getElementById(noteToPadObj[note]);
                        audioClip.currentTime = 0;
                        const playPromise = audioClip.play();
                        playPromise.catch((e) => {
                            console.log(e);
                        });

                        document.querySelector("#instrument").innerText = audioClip.parentElement.id.replace("_", " ");
                        audioClip.parentElement.classList.add("pad-pressed");
                    }
                });
            });
        }
        );
} catch (e) {
    if (e instanceof TypeError) {
        console.log("Sorry, your browser doesn't support midi.");
    }
};

//soundbank support
const justSwitch = document.querySelector("#just-switch");
const switchElement = document.querySelector("#switch-pocket");
switchElement.addEventListener("click", () => {
    const harder = document.querySelector("#harder");
    const smoother = document.querySelector("#smoother");

    const switchingModes = (source, destination) => {
        source.classList.remove("switch-mode");
        destination.classList.add("switch-mode");
        padArr.map((soundEl, index) => {
            const destArrName = `${destination.id + "Sounds"}`;
            soundEl.id = sounds[destArrName][index][0];
            soundEl.querySelector("audio").src = sounds[destArrName][index][1];
        })
    };

    if (justSwitch.style.float == "right") {
        justSwitch.style.float = "left";
        switchingModes(smoother, harder);
    } else {
        justSwitch.style.float = "right";
        switchingModes(harder, smoother);
    }
});

//removing class added when pad pressed
const padsArr = document.querySelectorAll(".drum-pad");
padsArr.forEach((item) => {
    item.addEventListener("transitionend", removeTransition);
    function removeTransition(event) {
        if (event.propertyName !== "transform") { return; }
        this.classList.remove("pad-pressed");
    }
})