document.addEventListener('DOMContentLoaded', () => {
    const dayTitle = document.getElementById('day-title');
    const addExerciseBtn = document.getElementById('add-exercise-btn');
    const saveDayBtn = document.getElementById('save-day-btn');
    const exerciseList = document.getElementById('exercise-list');
    let exercises = [];

    const urlParams = new URLSearchParams(window.location.search);
    const day = urlParams.get('day');

    if (day) {
        dayTitle.textContent = `Day ${day}`;
        loadExercises();
    }

    addExerciseBtn.addEventListener('click', () => {
        const exerciseName = document.getElementById('exercise-name').value;
        const sets = document.getElementById('sets').value;
        const reps = document.getElementById('reps').value;
        const weight = document.getElementById('weight').value;

        if (exerciseName && sets && reps) {
            const exercise = {
                name: exerciseName,
                sets: sets,
                reps: reps,
                weight: weight
            };
            exercises.push(exercise);
            renderExercises();
            clearInputs();
        } else {
            alert('Please fill in all required fields.');
        }
    });

    saveDayBtn.addEventListener('click', () => {
        localStorage.setItem(`day-${day}`, JSON.stringify(exercises));
        alert('Day saved successfully!');
    });

    function renderExercises() {
        exerciseList.innerHTML = '';
        exercises.forEach(exercise => {
            const exerciseElement = document.createElement('div');
            exerciseElement.classList.add('exercise');
            exerciseElement.innerHTML = `
                <h4>${exercise.name}</h4>
                <p>Sets: ${exercise.sets}</p>
                <p>Reps: ${exercise.reps}</p>
                ${exercise.weight ? `<p>Weight: ${exercise.weight}kg</p>` : ''}
            `;
            exerciseList.appendChild(exerciseElement);
        });
    }

    function loadExercises() {
        const savedExercises = localStorage.getItem(`day-${day}`);
        if (savedExercises) {
            exercises = JSON.parse(savedExercises);
            renderExercises();
        }
    }

    function clearInputs() {
        document.getElementById('exercise-name').value = '';
        document.getElementById('sets').value = '';
        document.getElementById('reps').value = '';
        document.getElementById('weight').value = '';
    }
});