var sw = {
    now : 0,
    timerDiv : null,
    timer : 0,
    startButton: null,
    resumeButton: null,
    stopButton: null,
    pauseButton: null,
    resetButton: null,
    init : function(){
        sw.timerDiv = document.getElementById("timerDiv");
        sw.startButton = document.getElementById("startRecordingButton");
        sw.resumeButton = document.getElementById("resumeRecordingButton");
        sw.stopButton = document.getElementById("stopRecordingButton");
        sw.pauseButton = document.getElementById("pauseRecordingButton");
        sw.resetButton = document.getElementById("resetRecordingButton");
    },
    start : function(){
        sw.startButton.style.visibility = "hidden";
        sw.resumeButton.style.visibility = "hidden";
        sw.stopButton.style.visibility = "visible";
        sw.pauseButton.style.visibility = "visible";
        sw.resetButton.style.visibility = "visible";
        if(sw.timer){
            clearInterval(sw.timer);
            sw.timer = 0;
        }
        sw.now = 0;
        sw.timer = setInterval(sw.tick, 1000);
    },
    tick : function(){
        sw.now++;
        var remain = sw.now;
        var hours = Math.floor(remain / 3600);
        remain -= hours * 3600;
        var mins = Math.floor(remain / 60);
        remain -= mins * 60;
        var secs = remain;

        // (B2) UPDATE THE DISPLAY TIMER
        if (hours<10) { hours = "0" + hours; }
        if (mins<10) { mins = "0" + mins; }
        if (secs<10) { secs = "0" + secs; }
        sw.timerDiv.innerHTML =  hours + ":" + mins + ":" + secs;
    },
    pause : function(){
        sw.startButton.style.visibility = "hidden";
        sw.resumeButton.style.visibility = "visible";
        sw.stopButton.style.visibility = "hidden";
        sw.pauseButton.style.visibility = "hidden";
        sw.resetButton.style.visibility = "visible";
        if(sw.timer){
            clearInterval(sw.timer);
            sw.timer = 0;
        }
    },
    stop : function(){
        sw.startButton.style.visibility = "visible";
        sw.resumeButton.style.visibility = "hidden";
        sw.stopButton.style.visibility = "hidden";
        sw.pauseButton.style.visibility = "hidden";
        sw.resetButton.style.visibility = "hidden";
        if(sw.timer){
            clearInterval(sw.timer);
            sw.timer = 0;
        }
        document.open();
        document.write('<!DOCTYPE HTML><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>Results</title></head><body><h1>Results</h1></body></html>');
        document.close();
    },
    resume : function(){
        sw.startButton.style.visibility = "hidden";
        sw.resumeButton.style.visibility = "hidden";
        sw.stopButton.style.visibility = "visible";
        sw.pauseButton.style.visibility = "visible";
        sw.resetButton.style.visibility = "visible";
        if(sw.timer){
            clearInterval(sw.timer);
            sw.timer = 0;
        }
        sw.timer = setInterval(sw.tick, 1000);
    },
    reset : function(){
        sw.startButton.style.visibility = "hidden";
        sw.resumeButton.style.visibility = "hidden";
        sw.stopButton.style.visibility = "visible";
        sw.pauseButton.style.visibility = "visible";
        sw.resetButton.style.visibility = "visible";
        sw.now = 0;
        if(sw.timer){
            clearInterval(sw.timer);
            sw.timer = 0;
        }
        sw.timer = setInterval(sw.tick, 1000);
    }
}

window.onload = function(e){
    sw.init();
    document.getElementById("startRecordingButton").addEventListener('click',sw.start);
    document.getElementById("resumeRecordingButton").addEventListener('click',sw.resume);
    document.getElementById("stopRecordingButton").addEventListener('click',sw.stop);
    document.getElementById("pauseRecordingButton").addEventListener('click',sw.pause);
    document.getElementById("resetRecordingButton").addEventListener('click',sw.reset);

};




