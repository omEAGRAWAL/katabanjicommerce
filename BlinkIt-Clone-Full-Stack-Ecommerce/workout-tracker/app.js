const app = {
    state: {
        currentWeek: 1,
        currentDay: 1, // 1-7
        completedWorkouts: [], // Array of objects: { date: ISOString, dayId: string, week: number }
        completedSets: {} // 'week-day-exIndex-setIndex': { weight, reps, completed: bool }
    },

    init: function () {
        this.loadState();
        this.renderDashboard();
        this.setupNavigation();
        timer.init();
        this.renderProfile();
        this.renderHistory();
    },

    loadState: function () {
        const saved = localStorage.getItem('workoutTrackerState_v2');
        if (saved) {
            this.state = JSON.parse(saved);
        } else {
            // Migration check: check for v1 state
            const oldState = localStorage.getItem('workoutTrackerState');
            if (oldState) {
                const parsedOld = JSON.parse(oldState);
                // Simple migration: Just carry over profile/sets, reset history to array logic
                this.state.completedSets = parsedOld.completedSets || {};
                // Force reset of history logic as old was just { '1-1': true }
                // We could infer checks, but let's start clean for the "History" view
            }

            // Set current day based on real world day
            const today = new Date().getDay(); // 0=Sun
            this.state.currentDay = today === 0 ? 7 : today;
        }
    },

    saveState: function () {
        localStorage.setItem('workoutTrackerState_v2', JSON.stringify(this.state));
    },

    navigate: function (viewId) {
        if (viewId === 'workout' && !this.activeWorkoutDay) {
            // If clicking default workout tab without starting one, go to today's
            this.startWorkout(this.state.currentDay);
            return;
        }

        document.querySelectorAll('.view').forEach(el => el.classList.add('hidden'));
        document.getElementById(`view-${viewId}`).classList.remove('hidden');

        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

        // Map view IDs to nav indexes (manual for now)
        const navIndex = {
            'dashboard': 0,
            'workout': 1,
            'history': 2,
            'profile': 3
        }[viewId];

        if (navIndex !== undefined) {
            document.querySelectorAll('.nav-item')[navIndex].classList.add('active');
        }

        if (viewId === 'dashboard') this.renderDashboard();
        if (viewId === 'history') this.renderHistory();
    },

    getWorkoutForDay: function (dayNum) {
        return WORKOUT_DATA.weekly_split.find(d => d.day === dayNum);
    },

    isWorkoutDoneToday: function (dayNum) {
        const todayStr = new Date().toDateString();
        return this.state.completedWorkouts.some(
            w => w.week === this.state.currentWeek &&
                w.day === dayNum &&
                new Date(w.date).toDateString() === todayStr
        );
    },

    renderDashboard: function () {
        // Today's Card
        const todayWorkout = this.getWorkoutForDay(this.state.currentDay);
        const todayContent = document.getElementById('todays-workout-card');
        const isTodayDone = this.isWorkoutDoneToday(this.state.currentDay);

        if (todayWorkout) {
            todayContent.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h3 style="margin:0; color: var(--primary-color)">${todayWorkout.focus}</h3>
                        <p>Week ${this.state.currentWeek} • ${WORKOUT_DATA.session_duration_minutes} min</p>
                    </div>
                    ${isTodayDone ?
                    '<span style="color:var(--success-color); font-weight:bold; font-size:1.5rem;">✓</span>' : ''}
                </div>
                <div style="margin-top: 16px;">
                    ${isTodayDone ?
                    '<button class="btn btn-secondary" onclick="app.startWorkout(' + this.state.currentDay + ')">Do it again?</button>' :
                    '<button class="btn" onclick="app.startWorkout(' + this.state.currentDay + ')">Start Workout</button>'
                }
                </div>
            `;
        } else {
            todayContent.innerHTML = `
                <h3>Rest Day 😴</h3>
                <p>Focus on recovery. Do your knee stretches!</p>
            `;
        }

        // Weekly Schedule
        const scheduleList = document.getElementById('weekly-schedule');
        scheduleList.innerHTML = '';
        WORKOUT_DATA.weekly_split.forEach(day => {
            const isToday = day.day === this.state.currentDay;
            // Check if done ANY time this week (simplified logic for visual check)
            // Real logic: checks if there is a log for this week/day
            const hasLogThisWeek = this.state.completedWorkouts.some(
                w => w.week === this.state.currentWeek && w.day === day.day
            );

            const li = document.createElement('li');
            li.className = `workout-item ${isToday ? 'active' : ''}`;

            li.innerHTML = `
                <div style="flex: 1;">
                    <div style="display:flex; justify-content:space-between;">
                        <strong>Day ${day.day}</strong>
                        ${hasLogThisWeek ? '<span style="color: var(--success-color);">✓</span>' : ''}
                    </div>
                    <div style="font-size: 0.85rem; color: #888; margin-top:4px;">${day.focus}</div>
                </div>
            `;
            li.onclick = () => app.startWorkout(day.day);
            scheduleList.appendChild(li);
        });
    },

    renderHistory: function () {
        const list = document.getElementById('history-list');
        const countEl = document.getElementById('total-workouts');

        countEl.innerText = this.state.completedWorkouts.length;

        if (this.state.completedWorkouts.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: #555; padding: 20px;">No workouts logged yet. Go lift!</p>';
            return;
        }

        // Sort new to old
        const sorted = [...this.state.completedWorkouts].sort((a, b) => new Date(b.date) - new Date(a.date));

        list.innerHTML = '';
        sorted.forEach(log => {
            const split = WORKOUT_DATA.weekly_split.find(d => d.id === log.dayId) || { focus: 'Unknown Workout' };
            const dateObj = new Date(log.date);
            const dateStr = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

            const li = document.createElement('li');
            li.className = 'workout-item history-item';
            li.innerHTML = `
                <div>
                    <strong>${split.focus}</strong>
                    <div class="history-date">${dateStr} • Week ${log.week}</div>
                </div>
                <div style="color: var(--success-color); font-weight:bold;">Completed</div>
            `;
            list.appendChild(li);
        });
    },

    renderProfile: function () {
        document.getElementById('profile-goal').innerText = WORKOUT_DATA.goal;
        document.getElementById('profile-height').innerText = WORKOUT_DATA.user_profile.height;
        document.getElementById('profile-pushups').innerText = WORKOUT_DATA.user_profile.pushups_max;

        const protocolList = document.getElementById('knee-protocol-list');
        protocolList.innerHTML = '';
        WORKOUT_DATA.knee_health_protocol.daily.forEach(item => {
            const li = document.createElement('li');
            li.innerText = `${item.exercise} (${item.duration_seconds ? item.duration_seconds + 's' : item.reps + ' reps'})`;
            protocolList.appendChild(li);
        });
    },

    startWorkout: function (dayNum) {
        this.activeWorkoutDay = dayNum; // Track active day
        const split = this.getWorkoutForDay(dayNum);
        if (!split) return;

        document.getElementById('workout-title').innerText = split.focus;
        document.getElementById('workout-subtitle').innerText = `Week ${this.state.currentWeek} • Day ${dayNum}`;

        const container = document.getElementById('workout-content');
        container.innerHTML = '';

        const dayKey = split.id;
        const workoutRoutine = WORKOUT_DATA.workouts[dayKey];

        if (!workoutRoutine) {
            container.innerHTML = '<p style="padding:20px;">Rest Day / Active Recovery</p>';
        } else {
            const sections = ['warmup', 'main', 'core', 'arms', 'conditioning', 'finisher'];
            sections.forEach(sec => {
                if (workoutRoutine[sec]) {
                    this.renderExerciseSection(container, sec, workoutRoutine[sec], dayNum);
                }
            });
        }

        this.navigate('workout');
    },

    renderExerciseSection: function (container, title, exercises, dayNum) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'exercise-group';
        sectionDiv.innerHTML = `<h3 style="text-transform: capitalize;">${title}</h3>`;

        exercises.forEach((ex, exIndex) => {
            if (ex.superset) {
                // Render Superset
                const card = document.createElement('div');
                card.className = 'exercise-card';
                card.innerHTML = `<div class="exercise-header" style="background:#2a2a2a;"><strong>⚡ Superset (${ex.sets} sets)</strong></div>`;

                const descDiv = document.createElement('div');
                descDiv.style.padding = '12px';
                descDiv.style.background = '#222';
                ex.superset.forEach(sub => {
                    descDiv.innerHTML += `<div style="margin-bottom:4px;">• ${sub.exercise} (${sub.reps})</div>`;
                });
                card.appendChild(descDiv);

                for (let i = 1; i <= ex.sets; i++) {
                    const setKey = `w${this.state.currentWeek}-d${dayNum}-s${title}-${exIndex}-set${i}`;
                    this.renderSetRow(card, i, 'Superset', setKey);
                }
                sectionDiv.appendChild(card);
                return;
            }

            const card = document.createElement('div');
            card.className = 'exercise-card';

            const header = document.createElement('div');
            header.className = 'exercise-header';
            header.innerHTML = `<strong>${ex.exercise}</strong>`;
            card.appendChild(header);

            const numSets = ex.sets || 1;
            let targetText = ex.reps ? `${ex.reps} reps` : '';
            if (ex.duration_seconds) targetText = `${ex.duration_seconds}s hold`;
            if (ex.duration_minutes) targetText = `${ex.duration_minutes}m duration`;

            for (let i = 1; i <= numSets; i++) {
                const setKey = `w${this.state.currentWeek}-d${dayNum}-ex${ex.exercise.replace(/\s/g, '')}-set${i}`;
                this.renderSetRow(card, i, targetText, setKey);
            }
            sectionDiv.appendChild(card);
        });

        container.appendChild(sectionDiv);
    },

    renderSetRow: function (container, setNum, label, key) {
        const savedData = this.state.completedSets[key];
        const row = document.createElement('div');
        row.className = 'set-row';

        row.innerHTML = `
            <div style="flex:1;">
                <span style="color:var(--text-muted); font-size:0.8rem;">Set ${setNum}</span><br>
                <span style="font-size:0.85rem;">${label}</span>
            </div>
            <div class="set-inputs">
                <input type="text" placeholder="kg" inputmode="decimal" 
                    data-key="${key}-weight" 
                    value="${savedData ? (savedData.weight || '') : ''}"
                    onchange="app.saveInput('${key}', 'weight', this.value)">
                <input type="text" placeholder="reps" inputmode="numeric"
                    data-key="${key}-reps" 
                    value="${savedData ? (savedData.reps || '') : ''}"
                    onchange="app.saveInput('${key}', 'reps', this.value)">
            </div>
            <div style="margin-left: 12px;">
                 <button class="check-btn ${savedData && savedData.completed ? 'completed' : ''}" 
                   onclick="app.toggleSet(this, '${key}')"></button>
            </div>
        `;
        container.appendChild(row);
    },

    toggleSet: function (btn, key) {
        const isComplete = btn.classList.toggle('completed');
        if (!this.state.completedSets[key]) this.state.completedSets[key] = {};

        this.state.completedSets[key].completed = isComplete;

        if (isComplete) {
            // Default rest: 60s
            timer.startRest(WORKOUT_DATA.training_rules.rest_between_sets_seconds);
        }

        this.saveState();
    },

    saveInput: function (baseKey, type, value) {
        if (!this.state.completedSets[baseKey]) this.state.completedSets[baseKey] = {};
        this.state.completedSets[baseKey][type] = value;
        this.saveState();
    },

    finishWorkout: function () {
        if (confirm("Great job! Finish and save to history?")) {
            const split = this.getWorkoutForDay(this.activeWorkoutDay);

            // Push to history
            this.state.completedWorkouts.push({
                date: new Date().toISOString(),
                day: this.activeWorkoutDay,
                week: this.state.currentWeek,
                dayId: split ? split.id : 'unknown'
            });

            // CLEAR sets data for this specific workout day so it opens empty next time
            // Keys format: w{week}-d{day}-...
            const prefix = `w${this.state.currentWeek}-d${this.activeWorkoutDay}-`;
            Object.keys(this.state.completedSets).forEach(key => {
                if (key.startsWith(prefix)) {
                    delete this.state.completedSets[key];
                }
            });

            this.saveState();

            // Play success sound logic here (optional)
            this.navigate('history');
        }
    },

    resetData: function () {
        if (confirm("Warning: This will delete ALL history and logs. Continue?")) {
            localStorage.removeItem('workoutTrackerState_v2');
            location.reload();
        }
    },

    clearCurrentWorkout: function () {
        if (confirm("Are you sure? This will remove all checks and numbers for this specific session.")) {
            const prefix = `w${this.state.currentWeek}-d${this.activeWorkoutDay}-`;
            Object.keys(this.state.completedSets).forEach(key => {
                if (key.startsWith(prefix)) {
                    delete this.state.completedSets[key];
                }
            });
            this.saveState();
            // Re-render to show empty state
            this.startWorkout(this.activeWorkoutDay);
        }
    },

    setupNavigation: function () { /* Handled in navigate() */ }
};

const timer = {
    time: 0,
    totalTime: 0,
    interval: null,

    init: function () {
        this.overlay = document.getElementById('timer-overlay');
        this.display = document.getElementById('timer-display');
        this.bar = document.getElementById('timer-progress');
    },

    toggle: function () {
        this.overlay.classList.toggle('active');
    },

    addTime: function (seconds) {
        this.time += seconds;
        this.totalTime += seconds; // Extend bar base
        this.updateDisplay();
        if (!this.interval) this.start();
    },

    startRest: function (seconds) {
        this.reset();
        this.time = seconds;
        this.totalTime = seconds; // For progress bar
        this.updateDisplay();
        this.overlay.classList.add('active');
        this.start();
    },

    start: function () {
        if (this.interval) clearInterval(this.interval);

        this.interval = setInterval(() => {
            this.time--;
            this.updateDisplay();

            if (this.time <= 0) {
                this.stop();
                // Vibration/Sound
                if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
                alert("Rest finished! Get back to it!");
                this.overlay.classList.remove('active');
            }
        }, 1000);
    },

    stop: function () {
        clearInterval(this.interval);
        this.interval = null;
    },

    reset: function () {
        this.stop();
        this.time = 0;
        this.totalTime = 0;
        this.updateDisplay();
        this.overlay.classList.remove('active');
    },

    updateDisplay: function () {
        const m = Math.floor(this.time / 60).toString().padStart(2, '0');
        const s = (this.time % 60).toString().padStart(2, '0');
        this.display.innerText = `${m}:${s}`;

        // Update bar
        if (this.totalTime > 0) {
            const pct = (this.time / this.totalTime) * 100;
            this.bar.style.width = `${pct}%`;
        } else {
            this.bar.style.width = '0%';
        }
    }
};

window.addEventListener('DOMContentLoaded', () => {
    app.init();
});
