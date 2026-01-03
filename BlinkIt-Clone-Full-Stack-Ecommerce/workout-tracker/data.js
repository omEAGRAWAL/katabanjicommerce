const WORKOUT_DATA = {
    "program_name": "Phase-2 Body Recomposition",
    "duration_weeks": 6,
    "training_days_per_week": 5,
    "session_duration_minutes": 60,
    "goal": "Body recomposition (fat loss + muscle gain)",
    "user_profile": {
        "height": "5ft 6in",
        "experience_level": "beginner-intermediate",
        "pushups_max": 15,
        "dumbbell_max_per_hand_kg": 15,
        "sleep_hours": 7,
        "knee_pain": {
            "present": true,
            "severity": "3/10",
            "pattern": "random, post-workout or sitting-to-standing"
        }
    },
    "training_rules": {
        "tempo": "3-1-1",
        "reps_in_reserve": "1-2",
        "progression": "Increase reps first, then load or difficulty",
        "deload_week": 5,
        "rest_between_sets_seconds": 60
    },
    "weekly_split": [
        {
            "day": 1,
            "focus": "Upper Push (Chest, Shoulders, Triceps)",
            "id": "day_1_upper_push"
        },
        {
            "day": 2,
            "focus": "Lower Body Knee-Safe + Core",
            "id": "day_2_lower_body_knee_safe"
        },
        {
            "day": 3,
            "focus": "Upper Pull (Back, Biceps)",
            "id": "day_3_upper_pull"
        },
        {
            "day": 4,
            "focus": "Conditioning + Arms + Core",
            "id": "day_4_conditioning_arms_core"
        },
        {
            "day": 5,
            "focus": "Upper Hypertrophy (Chest + Back)",
            "id": "day_5_upper_hypertrophy"
        }
    ],
    "workouts": {
        "day_1_upper_push": {
            "warmup": [
                { "exercise": "Arm circles", "reps": 20 },
                { "exercise": "Scapular push-ups", "reps": 12 },
                { "exercise": "Chest openers", "reps": 15 }
            ],
            "main": [
                { "exercise": "Push-ups", "sets": 4, "reps": "10-15" },
                { "exercise": "Dumbbell floor press", "sets": 4, "reps": "10-12" },
                { "exercise": "Seated dumbbell shoulder press", "sets": 3, "reps": 10 },
                { "exercise": "Lateral raises", "sets": 3, "reps": 15 },
                { "exercise": "Overhead dumbbell triceps extension", "sets": 3, "reps": 12 },
                { "exercise": "Close-grip push-ups", "sets": 2, "reps": "AMRAP" }
            ]
        },
        "day_2_lower_body_knee_safe": {
            "warmup": [
                { "exercise": "Glute bridges", "reps": 20 },
                { "exercise": "Bodyweight squats (slow)", "reps": 12 },
                { "exercise": "Hip circles", "reps": "10/side" }
            ],
            "main": [
                { "exercise": "Dumbbell Romanian deadlift", "sets": 4, "reps": 10 },
                { "exercise": "Goblet squat (controlled)", "sets": 3, "reps": 10 },
                { "exercise": "Reverse lunges (short step)", "sets": 3, "reps": "8/leg" },
                { "exercise": "Standing calf raises", "sets": 3, "reps": 20 }
            ],
            "core": [
                { "exercise": "Plank", "sets": 3, "duration_seconds": "45-60" },
                { "exercise": "Dead bugs", "sets": 3, "reps": "10/side" }
            ]
        },
        "day_3_upper_pull": {
            "warmup": [
                { "exercise": "Shoulder rolls", "reps": 20 },
                { "exercise": "Band pull-aparts", "reps": 15 }
            ],
            "main": [
                { "exercise": "One-arm dumbbell rows", "sets": 4, "reps": "10/side" },
                { "exercise": "Bent-over dumbbell rows", "sets": 3, "reps": 12 },
                { "exercise": "Resistance band lat pulldown", "sets": 3, "reps": 15 },
                { "exercise": "Dumbbell bicep curls", "sets": 3, "reps": 12 },
                { "exercise": "Hammer curls", "sets": 2, "reps": 12 }
            ],
            "finisher": [
                { "exercise": "Farmer carry", "sets": 3, "duration_seconds": 40 }
            ]
        },
        "day_4_conditioning_arms_core": {
            "conditioning": [
                { "exercise": "Brisk walking or step-ups", "duration_minutes": 10 }
            ],
            "arms": [
                {
                    "superset": [
                        { "exercise": "Dumbbell curl", "reps": 12 },
                        { "exercise": "Dumbbell triceps kickback", "reps": 12 }
                    ],
                    "sets": 3
                },
                { "exercise": "Lateral raises", "sets": 3, "reps": 15 }
            ],
            "core": [
                { "exercise": "Mountain climbers (slow)", "reps": 20 },
                { "exercise": "Russian twists", "reps": 20 },
                { "exercise": "Hollow hold", "duration_seconds": 30 }
            ]
        },
        "day_5_upper_hypertrophy": {
            "main": [
                { "exercise": "Incline push-ups (feet elevated)", "sets": 4, "reps": 10 },
                { "exercise": "Paused dumbbell floor press", "sets": 3, "reps": 10 },
                { "exercise": "Slow dumbbell rows", "sets": 3, "reps": 12 },
                { "exercise": "Dumbbell floor chest fly", "sets": 3, "reps": 12 },
                { "exercise": "Rear delt raises", "sets": 3, "reps": 15 }
            ],
            "finisher": [
                { "exercise": "Bottom-position push-up hold", "sets": 3, "duration_seconds": 20 }
            ]
        }
    },
    "knee_health_protocol": {
        "daily": [
            { "exercise": "Quad stretch", "duration_seconds": 30 },
            { "exercise": "Hamstring stretch", "duration_seconds": 30 },
            { "exercise": "Glute bridge hold", "duration_seconds": 30, "sets": 2 },
            { "exercise": "Slow sit-to-stand", "reps": 10 }
        ]
    },
    "six_week_progression": [
        { "week": 1, "focus": "Technique and baseline" },
        { "week": 2, "focus": "Volume increase" },
        { "week": 3, "focus": "Intensity increase" },
        { "week": 4, "focus": "Overload" },
        { "week": 5, "focus": "Deload and recovery" },
        { "week": 6, "focus": "Performance testing" }
    ]
};
