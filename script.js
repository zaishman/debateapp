/*
pre-set: 5:00
when click "play", timer 
when click "increase" -> math.floor (minutes + 1) 
minutes = ""/60
seconds = 60
*/
const fiveStart = 300;
let currentSeconds = fiveStart;
let timerInterval = null;

function countdown(timeSeconds) {
    clearInterval(timerInterval);
    let timeLeft = timeSeconds;

    timerInterval = setInterval(() => {
        const display = document.getElementById('timer');
        let minutes = Math.floor(timeLeft/60);
        let seconds = timeLeft % 60;

        const formattedMinutes = minutes < 10 ? "0" + minutes : String(minutes);
        const formattedSeconds = seconds < 10 ? "0" + seconds : String(seconds);

        display.textContent = `${formattedMinutes}:${formattedSeconds}`

        currentSeconds = timeLeft; 

        if (--timeLeft < 0) {
            clearInterval(timerInterval);
            display.textContent = "00:00"
        }
    }, 1000);
}

const upTime = document.getElementById('increaseTime');
const downTime = document.getElementById('decreaseTime');


    upTime.addEventListener('click', function() {
        const wasRunning = timerInterval !== null;
        clearInterval(timerInterval);
        timerInterval = null;
        currentSeconds += 60;
        if (wasRunning) countdown(currentSeconds);
        else updateDisplay(currentSeconds);
    });

    downTime.addEventListener('click', function () {
        const wasRunning = timerInterval !== null;
        clearInterval(timerInterval);
        timerInterval = null;
        currentSeconds = Math.max(0, currentSeconds - 60);
        if (wasRunning) countdown(currentSeconds);
        else updateDisplay(currentSeconds);
    });

    let clickCount = 0;
    const coolButton = document.getElementById('playButton');

    coolButton.addEventListener('click', () => {
    clickCount++;
    const display1 = coolButton

    if (clickCount % 2 === 1) {
        display1.textContent = "pause";
        if (!timerInterval && currentSeconds > 0) {
            countdown(currentSeconds);
        }
    } else {
        display1.textContent = "play";
        if (timerInterval !== null) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }
    });

//DEBATE STUFF

const sides = ["Affirmative", "Negative"];
let currentSources = [];

document.getElementById('shuffleButton').addEventListener('click', async function() {
    const promptArea = document.getElementById('promptArea');
    const sourceList = document.getElementById('sourceList');
    try {
    const response = await fetch('/topic');
    console.log("Status:", response.status);

    const text = await response.text();
    console.log("response:", text);

    const data = JSON.parse(text);
    console.log("Full data:", data); 
    console.log("Sources:", data.sources);

    promptArea.textContent = data.topic;

    currentSources = data.sources;

    document.getElementById('standingArea').textContent = sides[Math.floor(Math.random() * sides.length)];
   
    } catch (error) {
        console.log("Error:", error);
        promptArea.textContent = "error:" + error.message;
    }
});


let sourcesOpen =false;

document.getElementById('toggleSources').addEventListener('click', function() {
    const sourceContainer = document.getElementById('sourceList');
    sourcesOpen = !sourcesOpen;

    if(sourcesOpen) {
    sourceContainer.innerHTML = "";

    currentSources.forEach((source) => {
        const li = document.createElement('li');
        li.textContent = source;
        sourceContainer.appendChild(li);
    })} else {
        sourceContainer.innerHTML = "";
    }
});


//NOTE STUFF

const savedNotes = new Array ();
//arrays: remember the data given in a sequential order
const stored = localStorage.getItem('notes');
//defines stored
if(stored) {
    //take local stored notes
    const loaded = JSON.parse(stored);
    //parse stored items
    loaded.forEach((noteObj, index) => {
        //for each stored item that's now back to readbale format for JSOn,
        savedNotes.push(noteObj);
        const option = document.createElement('option');
        //create an option
        option.textContent = "Note " + (index + 1) + ": " + noteObj.label;
        //save the label as note + index number + 1, plus the label
        option.dataset.content = noteObj.content;
        //display content
        option.dataset.label = noteObj.label;
        //display label
        document.getElementById('savedNotes').appendChild(option);
        //apend the option towards the array
    });
}



const saveButton = document.getElementById("saveNote");
saveButton.addEventListener('click', () => {
    const labelData = document.getElementById('labelNotes').value;
    const noteData = document.getElementById('writeNotes').value;
    savedNotes.push({ content: noteData, label: labelData });
    localStorage.setItem('notes', JSON.stringify(savedNotes));
    //gets the value (typed stuff in the textbox), and then saves it to the array with .push (so array.push(what you're appending))

    const note = document.createElement('option');
    //creates an option no.
    note.textContent = "Note " + savedNotes.length + ":" + labelData;
    //labels it with a number
    document.getElementById('savedNotes').appendChild(note)
    //appends it and saves
    document.getElementById('writeNotes').value = '';
    //clears the text box after saved
    document.getElementById('labelNotes').value = '';

    note.dataset.content = noteData;
    note.dataset.label = labelData;
    //takes the notes data, and says it's the same as noteData, which is js the text value
});

    document.getElementById('savedNotes').addEventListener('change', function() {
        const selectedIndex= this.selectedIndex - 1;
        const selected = this.options[this.selectedIndex];

        document.getElementById('content').textContent= selected.dataset.content;
        document.getElementById('label').textContent = "Note " + this.selectedIndex + ": " + selected.dataset.label; 
        //creates and option with the data, and makes it the text of said content. 

        const label= document.getElementById('label');
        const labelData = document.getElementById('labelNotes').value;

    document.getElementById('deleteNote').onclick = function() {
            savedNotes.splice(selectedIndex, 1);
            localStorage.setItem('notes', JSON.stringify(savedNotes));
            document.getElementById('savedNotes').remove(selectedIndex + 1);
            document.getElementById('content').textContent=' ';
            document.getElementById('label').textContent=' ';
        
            if(viewAllOpen) {
                viewAllOpen=false;
                document.getElementById('viewAll').click();
                //cute lil trick that simulates the click function without an actual click
            }
        };
    }); 

let viewAllOpen=false;

document.getElementById('viewAll').addEventListener('click', function() {
    const container = document.getElementById('allNotes');
    viewAllOpen = !viewAllOpen;

    if(viewAllOpen) {
    container.innerHTML = "";
    savedNotes.forEach((noteObj, index) => {
        const card= document.createElement("p");
        card.textContent = "Note " + (index + 1) + ": " + noteObj.label + " — " + noteObj.content;
        //save the label as note + index number + 1, plus the label
        card.dataset.content = noteObj.content;
        //display content
        card.dataset.label = noteObj.label;
        //display label
        container.appendChild(card);

        const deleteButton= document.createElement('button');
        deleteButton.textContent="X";
        deleteButton.addEventListener('click', function() {
            savedNotes.splice(index, 1);
            localStorage.setItem('notes', JSON.stringify(savedNotes));
            container.innerHTML = " ";
            viewAllOpen= false;
            document.getElementById('viewAll').click();
        });
        card.appendChild(deleteButton);
    })
    } else {
        container.innerHTML = " ";
    }
})