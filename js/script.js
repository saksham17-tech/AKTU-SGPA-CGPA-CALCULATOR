/* ============================================================
   AKTU SGPA / YGPA / CGPA Calculator
   Basic–intermediate JavaScript (easy to read and explain)
   ============================================================ */

/* ---------- 1. Get elements from the page ---------- */
var sgpaForm = document.getElementById('sgpa-form');
var ygpaForm = document.getElementById('ygpa-form');
var cgpaForm = document.getElementById('cgpa-form');
var subjectsBody = document.getElementById('subjects-body');
var addSubjectButton = document.getElementById('add-subject-btn');
var semesterSelect = document.getElementById('semester-select');
var sgpaValue = document.getElementById('sgpa-value');
var ygpaValue = document.getElementById('ygpa-value');
var cgpaValue = document.getElementById('cgpa-value');
var subjectLimitMessage = document.getElementById('subject-limit-message');
var calculateSgpaButton = document.getElementById('calculate-sgpa-btn');
var calculateYgpaButton = document.getElementById('calculate-ygpa-btn');
var calculateCgpaButton = document.getElementById('calculate-cgpa-btn');

/* ---------- 2. Constants ---------- */
var STORAGE_KEY = 'aktu-grade-ledger-state-v2';
var LEGACY_STORAGE_KEY = 'aktu-grade-ledger-state';
var STORAGE_VERSION = 2;
var MAX_SUBJECT_CREDITS = 15;
var MAX_SUBJECTS = 15;

/* CGPA input field ids (semester 1 to 8) */
var CGPA_FIELD_IDS = [
    'cgpa-s1-sgpa', 'cgpa-s1-credits',
    'cgpa-s2-sgpa', 'cgpa-s2-credits',
    'cgpa-s3-sgpa', 'cgpa-s3-credits',
    'cgpa-s4-sgpa', 'cgpa-s4-credits',
    'cgpa-s5-sgpa', 'cgpa-s5-credits',
    'cgpa-s6-sgpa', 'cgpa-s6-credits',
    'cgpa-s7-sgpa', 'cgpa-s7-credits',
    'cgpa-s8-sgpa', 'cgpa-s8-credits'
];

/* Which semester is currently shown in the SGPA form */
var activeSemesterId = semesterSelect.value;

/* ---------- 3. Curriculum templates (subject lists per semester) ---------- */
var SEMESTER_SUBJECTS = {
    '1': [
        { name: 'Engineering Physics', type: 'theory', credits: 4 },
        { name: 'Engineering Mathematics-I', type: 'theory', credits: 4 },
        { name: 'Fundamentals of Electrical Engineering', type: 'theory', credits: 3 },
        { name: 'Programming for Problem Solving', type: 'theory', credits: 3 },
        { name: 'Environment and Ecology', type: 'theory', credits: 3 },
        { name: 'Physics Lab', type: 'practical', credits: 1 },
        { name: 'BEE Lab', type: 'practical', credits: 1 },
        { name: 'PPS Lab', type: 'practical', credits: 1 },
        { name: 'Graphics Lab', type: 'practical', credits: 2 }
    ],
    '2': [
        { name: 'Engineering Chemistry', type: 'theory', credits: 4 },
        { name: 'Engineering Mathematics-II', type: 'theory', credits: 4 },
        { name: 'Fundamentals of Electronics Engineering', type: 'theory', credits: 3 },
        { name: 'Fundamentals of Mechanical Engineering', type: 'theory', credits: 3 },
        { name: 'Soft Skills', type: 'theory', credits: 3 },
        { name: 'Chemistry Lab', type: 'practical', credits: 1 },
        { name: 'BEC Lab', type: 'practical', credits: 1 },
        { name: 'English Language Lab', type: 'practical', credits: 1 },
        { name: 'Workshop', type: 'practical', credits: 2 }
    ],
    '3': [
        { name: 'Digital Electronics/Elective', type: 'theory', credits: 4 },
        { name: 'Technical Communication', type: 'theory', credits: 3 },
        { name: 'Data Structures', type: 'theory', credits: 4 },
        { name: 'Discrete Structure and Theory of Logics', type: 'theory', credits: 3 },
        { name: 'Computer Organization and Architecture', type: 'theory', credits: 4 },
        { name: 'Python Programming', type: 'theory', credits: 2 },
        { name: 'WD LAB', type: 'practical', credits: 1 },
        { name: 'COA Lab', type: 'practical', credits: 1 },
        { name: 'DS Lab', type: 'practical', credits: 1 },
        { name: 'Mini Project', type: 'practical', credits: 2 }
    ],
    '4': [
        { name: 'Engineering Mathematics-IV', type: 'theory', credits: 4 },
        { name: 'UHVPE', type: 'theory', credits: 3 },
        { name: 'OS', type: 'theory', credits: 4 },
        { name: 'TAFL', type: 'theory', credits: 4 },
        { name: 'OOPS with JAVA', type: 'theory', credits: 3 },
        { name: 'Cyber Security', type: 'theory', credits: 2 },
        { name: 'OS Lab', type: 'practical', credits: 1 },
        { name: 'OOPS Lab', type: 'practical', credits: 1 },
        { name: 'Cyber Security Workshop', type: 'practical', credits: 1 }
    ],
    '5': [
        { name: 'DBMS', type: 'theory', credits: 4 },
        { name: 'WT', type: 'theory', credits: 4 },
        { name: 'DAA', type: 'theory', credits: 4 },
        { name: 'Elective-I', type: 'theory', credits: 3 },
        { name: 'Elective-II', type: 'theory', credits: 3 },
        { name: 'DBMS Lab', type: 'practical', credits: 1 },
        { name: 'WT Lab', type: 'practical', credits: 1 },
        { name: 'DAA Lab', type: 'practical', credits: 1 },
        { name: 'Mini Project/Internship Assessment', type: 'practical', credits: 2 }
    ],
    '6': [
        { name: 'Software Engineering', type: 'theory', credits: 4 },
        { name: 'Compiler Design', type: 'theory', credits: 4 },
        { name: 'Computer Networks', type: 'theory', credits: 4 },
        { name: 'Dept. Elective-III', type: 'theory', credits: 3 },
        { name: 'Open Elective-I', type: 'theory', credits: 3 },
        { name: 'Software Engineering Lab', type: 'practical', credits: 1 },
        { name: 'Compiler Design Lab', type: 'practical', credits: 1 },
        { name: 'Computer Networks Lab', type: 'practical', credits: 1 }
    ],
    '7': [
        { name: 'Artificial Intelligence', type: 'theory', credits: 3 },
        { name: 'Departmental Elective-IV', type: 'theory', credits: 3 },
        { name: 'Open Elective-II', type: 'theory', credits: 3 },
        { name: 'AI Lab', type: 'practical', credits: 1 },
        { name: 'Mini Project/Internship Assessment', type: 'practical', credits: 2 },
        { name: 'Project-I', type: 'practical', credits: 5 },
        { name: 'Startup and Entrepreneurial Activity Assessment', type: 'practical', credits: 2 }
    ],
    '8': [
        { name: 'Open Elective-III', type: 'theory', credits: 3 },
        { name: 'Open Elective-IV', type: 'theory', credits: 3 },
        { name: 'Project-II', type: 'practical', credits: 10 }
    ]
};

/* Copy the template for one semester so we never change the original */
function getDefaultRowsForSemester(semesterId) {
    var template = SEMESTER_SUBJECTS[semesterId];
    if (!template) {
        return null;
    }

    var copy = [];
    for (var i = 0; i < template.length; i++) {
        copy.push({
            name: template[i].name,
            type: template[i].type,
            credits: template[i].credits
        });
    }
    return copy;
}

/* ---------- 4. Subject type (Theory / Practical) ---------- */
/* Theory: Internal max 30, External max 70
   Practical: Internal max 50, External max 50 */
function getTypeConfig(type) {
    if (type === 'practical' || type === 'lab') {
        return { internalMax: 50, externalMax: 50 };
    }
    return { internalMax: 30, externalMax: 70 };
}

function resolveSubjectType(rawType) {
    if (rawType === 'practical' || rawType === 'lab') {
        return 'practical';
    }
    return 'theory';
}

/* ---------- 5. Validation helpers ---------- */
function validateMarksField(rawValue, max, fieldLabel) {
    var text = String(rawValue || '').trim();

    if (text === '') {
        return { valid: false, value: null, message: 'Enter ' + fieldLabel + ' marks (0–' + max + ').' };
    }

    var number = Number(text);

    if (isNaN(number)) {
        return { valid: false, value: null, message: fieldLabel + ' marks must be a number.' };
    }
    if (number < 0) {
        return { valid: false, value: null, message: fieldLabel + ' marks cannot be negative.' };
    }
    if (number > max) {
        return { valid: false, value: null, message: fieldLabel + ' marks cannot exceed ' + max + '.' };
    }

    return { valid: true, value: number, message: '' };
}

function validateCredits(rawValue) {
    var text = String(rawValue || '').trim();

    if (text === '') {
        return { valid: false, value: null, message: 'Enter the credit value.' };
    }

    var number = Number(text);

    if (isNaN(number)) {
        return { valid: false, value: null, message: 'Credits must be a number.' };
    }
    if (number !== Math.floor(number)) {
        return { valid: false, value: null, message: 'Credits must be a whole number.' };
    }
    if (number <= 0) {
        return { valid: false, value: null, message: 'Credits must be greater than 0.' };
    }
    if (number > MAX_SUBJECT_CREDITS) {
        return { valid: false, value: null, message: 'Credits cannot exceed ' + MAX_SUBJECT_CREDITS + '.' };
    }

    return { valid: true, value: number, message: '' };
}

/* ---------- 6. Grade point from percentage (official scale) ---------- */
function marksToGradePoint(percentage) {
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        return null;
    }
    if (percentage >= 90) return 10; // A+
    if (percentage >= 80) return 9;  // A
    if (percentage >= 70) return 8;  // B+
    if (percentage >= 60) return 7;  // B
    if (percentage >= 50) return 6;  // C
    if (percentage >= 45) return 5;  // D
    if (percentage >= 40) return 4;  // E
    return 0;                        // F
}

/* ---------- 7. Calculation functions ---------- */
function calculateSGPA(subjects) {
    var totalCredits = 0;
    var weightedPoints = 0;

    for (var i = 0; i < subjects.length; i++) {
        var subject = subjects[i];
        var config = getTypeConfig(subject.type);
        var totalMax = config.internalMax + config.externalMax;
        var percentage = ((subject.internal + subject.external) / totalMax) * 100;
        var gradePoint = marksToGradePoint(percentage);

        if (gradePoint === null) {
            continue;
        }

        weightedPoints = weightedPoints + (gradePoint * subject.credits);
        totalCredits = totalCredits + subject.credits;
    }

    if (totalCredits === 0) {
        return 0;
    }
    return weightedPoints / totalCredits;
}

function calculateYGPA(sgpa1, credits1, sgpa2, credits2) {
    var totalCredits = credits1 + credits2;
    if (totalCredits <= 0) {
        return 0;
    }
    return ((sgpa1 * credits1) + (sgpa2 * credits2)) / totalCredits;
}

function calculateCGPA(semesters) {
    var weighted = 0;
    var totalCredits = 0;

    for (var i = 0; i < semesters.length; i++) {
        weighted = weighted + (semesters[i].sgpa * semesters[i].credits);
        totalCredits = totalCredits + semesters[i].credits;
    }

    if (totalCredits <= 0) {
        return 0;
    }
    return weighted / totalCredits;
}

/* ---------- 8. Small UI helpers ---------- */
function showError(message, elementId) {
    var element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
    }
}

function clearError(elementId) {
    var element = document.getElementById(elementId);
    if (element) {
        element.textContent = '';
    }
}

function formatResult(number) {
    return Number(number).toFixed(2);
}

/* Escape special characters so user text is safe inside HTML */
function escapeHtml(value) {
    var text = String(value);
    text = text.replace(/&/g, '&amp;');
    text = text.replace(/</g, '&lt;');
    text = text.replace(/>/g, '&gt;');
    text = text.replace(/"/g, '&quot;');
    text = text.replace(/'/g, '&#39;');
    return text;
}

/* ---------- 9. Subject table: add / remove / renumber rows ---------- */
function addSubjectRow(subject) {
    if (!subject) {
        subject = {};
    }

    /* Limit number of subjects */
    if (subjectsBody.children.length >= MAX_SUBJECTS) {
        if (subjectLimitMessage) {
            subjectLimitMessage.textContent = 'You can add at most ' + MAX_SUBJECTS + ' subjects.';
        }
        return;
    }
    if (subjectLimitMessage) {
        subjectLimitMessage.textContent = '';
    }

    var rowNumber = subjectsBody.children.length + 1;
    var rowId = String(Date.now()) + '-' + rowNumber;
    var type = resolveSubjectType(subject.type);
    var config = getTypeConfig(type);

    var nameValue = subject.name ? escapeHtml(subject.name) : '';
    var internalValue = (subject.internal !== undefined && subject.internal !== null && subject.internal !== '')
        ? escapeHtml(subject.internal)
        : '';
    var externalValue = (subject.external !== undefined && subject.external !== null && subject.external !== '')
        ? escapeHtml(subject.external)
        : '';
    var creditsValue = (subject.credits !== undefined && subject.credits !== null && subject.credits !== '')
        ? escapeHtml(subject.credits)
        : '';

    var theorySelected = (type === 'theory') ? ' selected' : '';
    var practicalSelected = (type === 'practical') ? ' selected' : '';

    var row = document.createElement('tr');
    row.setAttribute('data-row-id', rowId);

    row.innerHTML =
        '<td>' + rowNumber + '</td>' +
        '<td>' +
            '<label for="subject-' + rowId + '" class="sr-only">Subject ' + rowNumber + ' name</label>' +
            '<input class="subject-name" type="text" id="subject-' + rowId + '" name="subject-' + rowId + '" placeholder="e.g. Mathematics III" value="' + nameValue + '">' +
        '</td>' +
        '<td>' +
            '<label for="type-' + rowId + '" class="sr-only">Subject ' + rowNumber + ' type</label>' +
            '<select class="subject-type" id="type-' + rowId + '" name="type-' + rowId + '">' +
                '<option value="theory"' + theorySelected + '>Theory</option>' +
                '<option value="practical"' + practicalSelected + '>Practical</option>' +
            '</select>' +
        '</td>' +
        '<td>' +
            '<label for="internal-marks-' + rowId + '" class="sr-only">Subject ' + rowNumber + ' internal marks</label>' +
            '<input class="marks-input" type="number" id="internal-marks-' + rowId + '" name="internal-marks-' + rowId + '" min="0" max="' + config.internalMax + '" placeholder="Max ' + config.internalMax + '" value="' + internalValue + '">' +
            '<span class="field-error" id="internal-error-' + rowId + '"></span>' +
        '</td>' +
        '<td>' +
            '<label for="external-marks-' + rowId + '" class="sr-only">Subject ' + rowNumber + ' external marks</label>' +
            '<input class="marks-input" type="number" id="external-marks-' + rowId + '" name="external-marks-' + rowId + '" min="0" max="' + config.externalMax + '" placeholder="Max ' + config.externalMax + '" value="' + externalValue + '">' +
            '<span class="field-error" id="external-error-' + rowId + '"></span>' +
        '</td>' +
        '<td>' +
            '<label for="credit-' + rowId + '" class="sr-only">Subject ' + rowNumber + ' credits</label>' +
            '<input class="credit-input" type="number" id="credit-' + rowId + '" name="credit-' + rowId + '" min="1" max="' + MAX_SUBJECT_CREDITS + '" step="1" placeholder="e.g. 4" value="' + creditsValue + '">' +
            '<span class="field-error" id="credit-error-' + rowId + '"></span>' +
        '</td>' +
        '<td>' +
            '<button type="button" class="remove-row-btn" data-row-id="' + rowId + '">Remove</button>' +
        '</td>';

    subjectsBody.appendChild(row);
    updateSubjectType(row, false);
    updateRemoveButtons();
}

/* When type changes, update max marks for Internal / External */
function updateSubjectType(row, clearExceeded) {
    if (!row) {
        return;
    }
    if (clearExceeded === undefined) {
        clearExceeded = true;
    }

    var typeField = row.querySelector('.subject-type');
    var config = getTypeConfig(typeField.value);
    var marksFields = row.querySelectorAll('.marks-input');
    var rowId = row.getAttribute('data-row-id');

    marksFields[0].max = config.internalMax;
    marksFields[0].placeholder = 'Max ' + config.internalMax;
    marksFields[1].max = config.externalMax;
    marksFields[1].placeholder = 'Max ' + config.externalMax;

    if (clearExceeded) {
        var labels = ['internal', 'external'];
        var maxima = [config.internalMax, config.externalMax];

        for (var i = 0; i < marksFields.length; i++) {
            var current = Number(marksFields[i].value);
            if (marksFields[i].value !== '' && !isNaN(current) && current > maxima[i]) {
                marksFields[i].value = '';
                marksFields[i].classList.add('invalid');
                showError('Re-enter a value from 0–' + maxima[i] + '.', labels[i] + '-error-' + rowId);
            }
        }
    }
}

function removeSubjectRow(rowId) {
    var row = subjectsBody.querySelector('[data-row-id="' + rowId + '"]');
    if (row) {
        row.parentNode.removeChild(row);
    }
    renumberRows();
    updateRemoveButtons();
    saveToLocalStorage();
}

function renumberRows() {
    var rows = subjectsBody.querySelectorAll('tr');
    for (var i = 0; i < rows.length; i++) {
        rows[i].cells[0].textContent = String(i + 1);
    }
}

function updateRemoveButtons() {
    var buttons = subjectsBody.querySelectorAll('.remove-row-btn');
    var onlyOneRow = (buttons.length <= 1);

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = onlyOneRow;
    }
}

/* Prepare the 3 starter rows that are already in the HTML */
function prepareExistingRows() {
    var rows = subjectsBody.querySelectorAll('tr');
    for (var i = 0; i < rows.length; i++) {
        rows[i].setAttribute('data-row-id', String(i + 1));
        var removeButton = rows[i].querySelector('.remove-row-btn');
        if (removeButton) {
            removeButton.setAttribute('data-row-id', String(i + 1));
        }
        updateSubjectType(rows[i], false);
    }
    updateRemoveButtons();
}

/* ---------- 10. Validate whole SGPA form ---------- */
function validateForm() {
    var valid = true;
    var subjects = [];
    var rows = subjectsBody.querySelectorAll('tr');

    clearError('sgpa-error');

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var rowId = row.getAttribute('data-row-id');

        var nameField = row.querySelector('.subject-name');
        if (!nameField) {
            nameField = row.querySelector('input[type="text"]');
        }
        var typeField = row.querySelector('.subject-type');
        var markFields = row.querySelectorAll('.marks-input');
        var internalField = markFields[0];
        var externalField = markFields[1];
        var creditField = row.querySelector('.credit-input');

        /* Clear old errors on this row */
        internalField.classList.remove('invalid');
        externalField.classList.remove('invalid');
        creditField.classList.remove('invalid');
        clearError('internal-error-' + rowId);
        clearError('external-error-' + rowId);
        clearError('credit-error-' + rowId);

        var type = resolveSubjectType(typeField.value);
        var config = getTypeConfig(type);

        var internalResult = validateMarksField(internalField.value, config.internalMax, 'Internal');
        var externalResult = validateMarksField(externalField.value, config.externalMax, 'External');
        var creditResult = validateCredits(creditField.value);

        if (!internalResult.valid) {
            internalField.classList.add('invalid');
            showError(internalResult.message, 'internal-error-' + rowId);
            valid = false;
        }
        if (!externalResult.valid) {
            externalField.classList.add('invalid');
            showError(externalResult.message, 'external-error-' + rowId);
            valid = false;
        }
        if (!creditResult.valid) {
            creditField.classList.add('invalid');
            showError(creditResult.message, 'credit-error-' + rowId);
            valid = false;
        }

        if (internalResult.valid && externalResult.valid && creditResult.valid) {
            subjects.push({
                name: nameField ? nameField.value : '',
                type: type,
                internal: internalResult.value,
                external: externalResult.value,
                credits: creditResult.value
            });
        }
    }

    if (!valid) {
        showError('Please fix the highlighted fields.', 'sgpa-error');
        return null;
    }
    if (subjects.length === 0) {
        showError('Add at least one subject.', 'sgpa-error');
        return null;
    }

    return subjects;
}

/* ---------- 11. YGPA field validation ---------- */
function validateYgpaField(fieldId, message) {
    var field = document.getElementById(fieldId);
    field.classList.remove('invalid');

    var text = String(field.value || '').trim();
    var number = Number(text);

    if (text === '' || isNaN(number)) {
        field.classList.add('invalid');
        return false;
    }

    if (fieldId.indexOf('sgpa') !== -1) {
        if (number < 0 || number > 10) {
            field.classList.add('invalid');
            return false;
        }
    } else {
        if (number <= 0) {
            field.classList.add('invalid');
            return false;
        }
    }

    return true;
}

/* ---------- 12. Calculate buttons ---------- */
function calculateSgpaResult() {
    var subjects = validateForm();
    if (!subjects) {
        return;
    }
    sgpaValue.textContent = formatResult(calculateSGPA(subjects));
    saveToLocalStorage();
}

function calculateYgpaResult() {
    clearError('ygpa-error');

    var ok1 = validateYgpaField('sem1-sgpa', 'Enter an SGPA from 0 to 10.');
    var ok2 = validateYgpaField('sem1-credits', 'Credits must be greater than 0.');
    var ok3 = validateYgpaField('sem2-sgpa', 'Enter an SGPA from 0 to 10.');
    var ok4 = validateYgpaField('sem2-credits', 'Credits must be greater than 0.');

    if (!ok1 || !ok2 || !ok3 || !ok4) {
        showError('Check the highlighted semester details.', 'ygpa-error');
        return;
    }

    var sgpa1 = Number(document.getElementById('sem1-sgpa').value);
    var credits1 = Number(document.getElementById('sem1-credits').value);
    var sgpa2 = Number(document.getElementById('sem2-sgpa').value);
    var credits2 = Number(document.getElementById('sem2-credits').value);

    ygpaValue.textContent = formatResult(calculateYGPA(sgpa1, credits1, sgpa2, credits2));
    saveToLocalStorage();
}

function calculateCgpaResult() {
    clearError('cgpa-error');

    /* Clear previous red borders */
    for (var i = 0; i < CGPA_FIELD_IDS.length; i++) {
        var el = document.getElementById(CGPA_FIELD_IDS[i]);
        if (el) {
            el.classList.remove('invalid');
        }
    }

    var semesters = [];
    var hasAny = false;
    var hasError = false;

    for (var s = 1; s <= 8; s++) {
        var sgpaEl = document.getElementById('cgpa-s' + s + '-sgpa');
        var creditsEl = document.getElementById('cgpa-s' + s + '-credits');
        var sgpaRaw = String(sgpaEl.value || '').trim();
        var creditsRaw = String(creditsEl.value || '').trim();

        /* Both empty → skip this semester */
        if (sgpaRaw === '' && creditsRaw === '') {
            continue;
        }

        hasAny = true;

        /* One filled but not the other → error */
        if (sgpaRaw === '' || creditsRaw === '') {
            if (sgpaRaw === '') {
                sgpaEl.classList.add('invalid');
            }
            if (creditsRaw === '') {
                creditsEl.classList.add('invalid');
            }
            hasError = true;
            continue;
        }

        var sgpa = Number(sgpaRaw);
        var credits = Number(creditsRaw);

        if (isNaN(sgpa) || sgpa < 0 || sgpa > 10) {
            sgpaEl.classList.add('invalid');
            hasError = true;
        }
        if (isNaN(credits) || credits <= 0) {
            creditsEl.classList.add('invalid');
            hasError = true;
        }

        if (!hasError) {
            semesters.push({ sgpa: sgpa, credits: credits });
        }
    }

    if (!hasAny) {
        showError('Enter SGPA and credits for at least one completed semester.', 'cgpa-error');
        return;
    }
    if (hasError) {
        showError('Check the highlighted fields. SGPA must be 0–10 and credits must be greater than 0.', 'cgpa-error');
        return;
    }

    cgpaValue.textContent = formatResult(calculateCGPA(semesters));
    saveToLocalStorage();
}

/* ---------- 13. Local storage (auto-save) ---------- */
function getEmptyState() {
    var cgpaDefaults = {};
    for (var i = 0; i < CGPA_FIELD_IDS.length; i++) {
        cgpaDefaults[CGPA_FIELD_IDS[i]] = '';
    }

    return {
        version: STORAGE_VERSION,
        activeSemester: semesterSelect.value,
        semesters: {},
        ygpa: {
            'sem1-sgpa': '',
            'sem1-credits': '',
            'sem2-sgpa': '',
            'sem2-credits': ''
        },
        cgpa: cgpaDefaults
    };
}

function readRawState(key) {
    try {
        var raw = localStorage.getItem(key);
        if (raw) {
            return JSON.parse(raw);
        }
        return null;
    } catch (error) {
        return null;
    }
}

function migrateLegacyState() {
    var legacy = readRawState(LEGACY_STORAGE_KEY);
    if (!legacy) {
        return null;
    }

    var migrated = getEmptyState();
    var legacySemester = legacy.semester || semesterSelect.value;
    migrated.activeSemester = legacySemester;
    migrated.semesters[legacySemester] = {
        subjects: legacy.subjects || [],
        sgpaDisplay: '--'
    };
    if (legacy.ygpa) {
        migrated.ygpa = legacy.ygpa;
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch (error) {
        /* Storage may be unavailable in private browsing */
    }

    return migrated;
}

function getStorageState() {
    var current = readRawState(STORAGE_KEY);
    if (current && current.version === STORAGE_VERSION) {
        return current;
    }

    var migrated = migrateLegacyState();
    if (migrated) {
        return migrated;
    }
    return getEmptyState();
}

function persistState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        /* Storage may be unavailable */
    }
}

/* Read current subject rows from the table */
function captureCurrentSnapshot() {
    var subjects = [];
    var rows = subjectsBody.querySelectorAll('tr');

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var nameField = row.querySelector('.subject-name');
        if (!nameField) {
            nameField = row.querySelector('input[type="text"]');
        }
        var typeField = row.querySelector('.subject-type');
        var markFields = row.querySelectorAll('.marks-input');
        var creditField = row.querySelector('.credit-input');

        subjects.push({
            name: nameField ? nameField.value : '',
            type: resolveSubjectType(typeField ? typeField.value : 'theory'),
            credits: creditField ? creditField.value : '',
            internal: markFields[0] ? markFields[0].value : '',
            external: markFields[1] ? markFields[1].value : ''
        });
    }

    return {
        subjects: subjects,
        sgpaDisplay: sgpaValue.textContent
    };
}

/* Fill the table from saved data or from curriculum template */
function applySnapshot(snapshot, semesterId) {
    subjectsBody.innerHTML = '';

    var rowsToRender = null;
    if (snapshot && snapshot.subjects && snapshot.subjects.length > 0) {
        rowsToRender = snapshot.subjects;
    } else {
        rowsToRender = getDefaultRowsForSemester(semesterId);
    }

    if (rowsToRender && rowsToRender.length > 0) {
        for (var i = 0; i < rowsToRender.length; i++) {
            addSubjectRow(rowsToRender[i]);
        }
    } else {
        for (var j = 0; j < 3; j++) {
            addSubjectRow();
        }
    }

    if (snapshot && snapshot.sgpaDisplay) {
        sgpaValue.textContent = snapshot.sgpaDisplay;
    } else {
        sgpaValue.textContent = '--';
    }

    clearError('sgpa-error');
    updateRemoveButtons();
}

function initializeSemesterStorage() {
    var state = getStorageState();
    activeSemesterId = state.activeSemester || semesterSelect.value;
    semesterSelect.value = activeSemesterId;

    applySnapshot(state.semesters[activeSemesterId], activeSemesterId);

    /* Restore YGPA fields */
    if (state.ygpa) {
        var ygpaIds = ['sem1-sgpa', 'sem1-credits', 'sem2-sgpa', 'sem2-credits'];
        for (var i = 0; i < ygpaIds.length; i++) {
            var field = document.getElementById(ygpaIds[i]);
            if (field && state.ygpa[ygpaIds[i]] !== undefined) {
                field.value = state.ygpa[ygpaIds[i]];
            }
        }
    }

    /* Restore CGPA fields */
    if (state.cgpa) {
        for (var j = 0; j < CGPA_FIELD_IDS.length; j++) {
            var cgpaField = document.getElementById(CGPA_FIELD_IDS[j]);
            if (cgpaField && state.cgpa[CGPA_FIELD_IDS[j]] !== undefined) {
                cgpaField.value = state.cgpa[CGPA_FIELD_IDS[j]];
            }
        }
    }
}

function handleSemesterChange() {
    var state = getStorageState();

    /* Save the semester we are leaving */
    state.semesters[activeSemesterId] = captureCurrentSnapshot();
    persistState(state);

    /* Load the new semester */
    activeSemesterId = semesterSelect.value;
    state.activeSemester = activeSemesterId;
    applySnapshot(state.semesters[activeSemesterId], activeSemesterId);
    persistState(state);
}

function saveToLocalStorage() {
    var state = getStorageState();
    state.activeSemester = activeSemesterId;
    state.semesters[activeSemesterId] = captureCurrentSnapshot();

    /* Save YGPA */
    state.ygpa = {
        'sem1-sgpa': document.getElementById('sem1-sgpa').value,
        'sem1-credits': document.getElementById('sem1-credits').value,
        'sem2-sgpa': document.getElementById('sem2-sgpa').value,
        'sem2-credits': document.getElementById('sem2-credits').value
    };

    /* Save CGPA */
    state.cgpa = {};
    for (var i = 0; i < CGPA_FIELD_IDS.length; i++) {
        var el = document.getElementById(CGPA_FIELD_IDS[i]);
        state.cgpa[CGPA_FIELD_IDS[i]] = el ? el.value : '';
    }

    persistState(state);
}

/* ---------- 14. Reset forms ---------- */
function resetForm(formId) {
    window.setTimeout(function () {
        if (formId === 'sgpa-form') {
            subjectsBody.innerHTML = '';
            var defaults = getDefaultRowsForSemester(activeSemesterId);
            if (defaults && defaults.length > 0) {
                for (var i = 0; i < defaults.length; i++) {
                    addSubjectRow(defaults[i]);
                }
            } else {
                for (var j = 0; j < 3; j++) {
                    addSubjectRow();
                }
            }
            updateRemoveButtons();
            sgpaValue.textContent = '--';
            clearError('sgpa-error');
        } else if (formId === 'ygpa-form') {
            ygpaValue.textContent = '--';
            clearError('ygpa-error');
            var ygpaIds = ['sem1-sgpa', 'sem1-credits', 'sem2-sgpa', 'sem2-credits'];
            for (var k = 0; k < ygpaIds.length; k++) {
                var field = document.getElementById(ygpaIds[k]);
                if (field) {
                    field.classList.remove('invalid');
                }
            }
        } else if (formId === 'cgpa-form') {
            cgpaValue.textContent = '--';
            clearError('cgpa-error');
            for (var m = 0; m < CGPA_FIELD_IDS.length; m++) {
                var cgpaField = document.getElementById(CGPA_FIELD_IDS[m]);
                if (cgpaField) {
                    cgpaField.value = '';
                    cgpaField.classList.remove('invalid');
                }
            }
        }
        saveToLocalStorage();
    }, 0);
}

/* ---------- 15. Event listeners ---------- */
prepareExistingRows();
initializeSemesterStorage();

addSubjectButton.addEventListener('click', function () {
    addSubjectRow();
});

calculateSgpaButton.addEventListener('click', calculateSgpaResult);
calculateYgpaButton.addEventListener('click', calculateYgpaResult);
calculateCgpaButton.addEventListener('click', calculateCgpaResult);

semesterSelect.addEventListener('change', handleSemesterChange);

subjectsBody.addEventListener('change', function (event) {
    if (event.target.classList.contains('subject-type')) {
        updateSubjectType(event.target.closest('tr'));
    }
});

subjectsBody.addEventListener('click', function (event) {
    if (event.target.classList.contains('remove-row-btn')) {
        var id = event.target.getAttribute('data-row-id');
        removeSubjectRow(id);
    }
});

sgpaForm.addEventListener('submit', function (event) {
    event.preventDefault();
    calculateSgpaResult();
});

ygpaForm.addEventListener('submit', function (event) {
    event.preventDefault();
    calculateYgpaResult();
});

cgpaForm.addEventListener('submit', function (event) {
    event.preventDefault();
    calculateCgpaResult();
});

sgpaForm.addEventListener('input', saveToLocalStorage);
sgpaForm.addEventListener('change', saveToLocalStorage);
ygpaForm.addEventListener('input', saveToLocalStorage);
ygpaForm.addEventListener('change', saveToLocalStorage);
cgpaForm.addEventListener('input', saveToLocalStorage);
cgpaForm.addEventListener('change', saveToLocalStorage);

sgpaForm.addEventListener('reset', function () {
    resetForm('sgpa-form');
});
ygpaForm.addEventListener('reset', function () {
    resetForm('ygpa-form');
});
cgpaForm.addEventListener('reset', function () {
    resetForm('cgpa-form');
});