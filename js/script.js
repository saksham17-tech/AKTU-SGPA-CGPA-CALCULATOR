/* ================= DOM SELECTION & EVENT LISTENERS ================= */
const sgpaForm = document.getElementById('sgpa-form');
const ygpaForm = document.getElementById('ygpa-form');
const subjectsBody = document.getElementById('subjects-body');
const addSubjectButton = document.getElementById('add-subject-btn');
const semesterSelect = document.getElementById('semester-select');
const sgpaValue = document.getElementById('sgpa-value');
const ygpaValue = document.getElementById('ygpa-value');
const subjectLimitMessage = document.getElementById('subject-limit-message');
const calculateSgpaButton = document.getElementById('calculate-sgpa-btn');
const calculateYgpaButton = document.getElementById('calculate-ygpa-btn');

const STORAGE_KEY = 'aktu-grade-ledger-state-v2';
const LEGACY_STORAGE_KEY = 'aktu-grade-ledger-state';
const STORAGE_VERSION = 2;

// Tracks which semester's data is currently loaded into the form.
let activeSemesterId = semesterSelect.value;

/* ================= CURRICULUM TEMPLATES ================= */
const SEMESTER_SUBJECTS = {
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
/**
 * Returns a fresh, independent copy of the curriculum template for a
 * semester, or null if no template exists for it (e.g. Semester 3).
 * Always deep-copies so editing one semester's rows never mutates the
 * shared template object.
 */
function getDefaultRowsForSemester(semesterId) {
    const template = SEMESTER_SUBJECTS[semesterId];
    if (!template) return null;
    return template.map((subject) => ({ ...subject }));
}

/* ================= SUBJECT TYPE CONFIG & VALIDATION ================= */

const SUBJECT_TYPES = {
    theory: { key: 'theory', label: 'Theory', internalMax: 30, externalMax: 70 },
    practical: { key: 'practical', label: 'Practical', internalMax: 50, externalMax: 50 }
};

// Backward compatibility: earlier versions used "lab" as the key for the
// 70/70 config. Old saved data or old HTML markup using value="lab"
// still resolves correctly to "practical".
const TYPE_ALIASES = { lab: 'practical' };

function resolveSubjectType(rawType) {
    const normalized = TYPE_ALIASES[rawType] || rawType;
    return SUBJECT_TYPES[normalized] ? normalized : 'theory';
}

function getTypeConfig(rawType) {
    return SUBJECT_TYPES[resolveSubjectType(rawType)];
}

class MarksValidator {
    constructor(subjectTypes) {
        this.subjectTypes = subjectTypes;
    }

    getConfig(rawType) {
        return getTypeConfig(rawType);
    }

    validateField(rawValue, max, fieldLabel) {
        const trimmed = String(rawValue ?? '').trim();

        if (trimmed === '') {
            return { valid: false, value: null, message: `Enter ${fieldLabel} marks (0–${max}).` };
        }

        const numeric = Number(trimmed);

        if (!Number.isFinite(numeric)) {
            return { valid: false, value: null, message: `${fieldLabel} marks must be a number.` };
        }

        if (numeric < 0) {
            return { valid: false, value: null, message: `${fieldLabel} marks cannot be negative.` };
        }

        if (numeric > max) {
            return { valid: false, value: null, message: `${fieldLabel} marks cannot exceed ${max}.` };
        }

        return { valid: true, value: numeric, message: '' };
    }

    validateSubjectMarks({ type, internal, external }) {
        const config = this.getConfig(type);
        const internalResult = this.validateField(internal, config.internalMax, 'Internal');
        const externalResult = this.validateField(external, config.externalMax, 'External');

        return {
            valid: internalResult.valid && externalResult.valid,
            config,
            internal: internalResult,
            external: externalResult
        };
    }
}

const marksValidator = new MarksValidator(SUBJECT_TYPES);

// Sensible ceiling for a single subject's credits. The highest value in
// the actual curriculum is 10 (Project-II, Semester 8); 15 leaves room
// without allowing obviously wrong entries like "400".
const MAX_SUBJECT_CREDITS = 15;

/**
 * Validates a subject's credit value. Handles: missing input,
 * non-numeric input, non-integer input, zero/negative values, and
 * unreasonably large values.
 */
function validateCredits(rawValue) {
    const trimmed = String(rawValue ?? '').trim();

    if (trimmed === '') {
        return { valid: false, value: null, message: 'Enter the credit value.' };
    }

    const numeric = Number(trimmed);

    if (!Number.isFinite(numeric)) {
        return { valid: false, value: null, message: 'Credits must be a number.' };
    }

    if (!Number.isInteger(numeric)) {
        return { valid: false, value: null, message: 'Credits must be a whole number.' };
    }

    if (numeric <= 0) {
        return { valid: false, value: null, message: 'Credits must be greater than 0.' };
    }

    if (numeric > MAX_SUBJECT_CREDITS) {
        return { valid: false, value: null, message: `Credits cannot exceed ${MAX_SUBJECT_CREDITS}.` };
    }

    return { valid: true, value: numeric, message: '' };
}

// Give starter rows the same data shape as rows added later. These are
// immediately superseded by initializeSemesterStorage() below, which
// rebuilds subjectsBody from the saved snapshot or the curriculum
// template — this just avoids errors if JS runs before that.
function prepareExistingRows() {
    Array.from(subjectsBody.querySelectorAll('tr')).forEach((row, index) => {
        row.dataset.rowId = String(index + 1);
        const removeButton = row.querySelector('.remove-row-btn');
        if (removeButton) removeButton.dataset.rowId = String(index + 1);
        updateSubjectType(row, false);
    });
    updateRemoveButtons();
}

prepareExistingRows();
initializeSemesterStorage();

addSubjectButton.addEventListener('click', () => addSubjectRow());
calculateSgpaButton.addEventListener('click', calculateSgpaResult);
calculateYgpaButton.addEventListener('click', calculateYgpaResult);
semesterSelect.addEventListener('change', handleSemesterChange);
subjectsBody.addEventListener('change', (event) => {
    if (event.target.matches('.subject-type')) updateSubjectType(event.target.closest('tr'));
});
subjectsBody.addEventListener('click', (event) => {
    if (event.target.matches('.remove-row-btn')) removeSubjectRow(event.target.dataset.rowId);
});
sgpaForm.addEventListener('submit', (event) => {
    event.preventDefault();
    calculateSgpaResult();
});
ygpaForm.addEventListener('submit', (event) => {
    event.preventDefault();
    calculateYgpaResult();
});
sgpaForm.addEventListener('input', saveToLocalStorage);
sgpaForm.addEventListener('change', saveToLocalStorage);
ygpaForm.addEventListener('input', saveToLocalStorage);
ygpaForm.addEventListener('change', saveToLocalStorage);
sgpaForm.addEventListener('reset', () => resetForm('sgpa-form'));
ygpaForm.addEventListener('reset', () => resetForm('ygpa-form'));

/* ================= CORE CALCULATION LOGIC ================= */
function calculateSGPA(subjects) {
    const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
    if (totalCredits === 0) return 0;

    const weightedPoints = subjects.reduce((sum, subject) => {
        const config = getTypeConfig(subject.type);
        const totalMax = config.internalMax + config.externalMax;
        const percentage = ((subject.internal + subject.external) / totalMax) * 100;
        return sum + (marksToGradePoint(percentage) * subject.credits);
    }, 0);

    return weightedPoints / totalCredits;
}

/**
 * Converts a percentage to a grade point using the official examination
 * ordinance scale for BTECH/B.PHARM/BHMCT/BFAD/BFA/MB/MBA (Integrated),
 * MCA/MCA (Integrated):
 *
 *   Score %      Letter Grade   Grade Point
 *   ≥90          A+             10
 *   80–89        A              9
 *   70–79        B+             8
 *   60–69        B              7
 *   50–59        C              6
 *   45–49        D              5
 *   40–44        E              4
 *   0–39         F              0
 */
function marksToGradePoint(percentage) {
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) return null;
    if (percentage >= 90) return 10; // A+
    if (percentage >= 80) return 9;  // A
    if (percentage >= 70) return 8;  // B+
    if (percentage >= 60) return 7;  // B
    if (percentage >= 50) return 6;  // C
    if (percentage >= 45) return 5;  // D
    if (percentage >= 40) return 4;  // E
    return 0;                        // F
}

function calculateYGPA(sgpa1, credits1, sgpa2, credits2) {
    const totalCredits = credits1 + credits2;
    if (totalCredits <= 0) return 0;
    return ((sgpa1 * credits1) + (sgpa2 * credits2)) / totalCredits;
}

/* ================= HELPER FUNCTIONS ================= */

/**
 * Builds and appends one subject row. `subject` may carry any subset of
 * { name, type, internal, external, credits } — all fields default to
 * blank/theory if omitted, and every rendered field remains a normal
 * editable input regardless of whether it was pre-filled from a
 * curriculum template, a saved snapshot, or left blank for manual entry.
 */
function addSubjectRow(subject = {}) {
    const rowNumber = subjectsBody.children.length + 1;
    const rowId = `${Date.now()}-${rowNumber}`;
    const type = resolveSubjectType(subject.type);
    const config = getTypeConfig(type);
    const row = document.createElement('tr');
    row.dataset.rowId = rowId;
    row.innerHTML = `
        <td>${rowNumber}</td>
        <td><label for="subject-${rowId}" class="sr-only">Subject ${rowNumber} name</label><input class="subject-name" type="text" id="subject-${rowId}" name="subject-${rowId}" placeholder="e.g. Mathematics III" value="${escapeHtml(subject.name || '')}"></td>
        <td><label for="type-${rowId}" class="sr-only">Subject ${rowNumber} type</label><select class="subject-type" id="type-${rowId}" name="type-${rowId}"><option value="theory"${type === 'theory' ? ' selected' : ''}>Theory</option><option value="practical"${type === 'practical' ? ' selected' : ''}>Practical</option></select></td>
        <td><label for="internal-marks-${rowId}" class="sr-only">Subject ${rowNumber} internal marks</label><input class="marks-input" type="number" id="internal-marks-${rowId}" name="internal-marks-${rowId}" min="0" max="${config.internalMax}" placeholder="Max ${config.internalMax}" value="${escapeHtml(subject.internal ?? '')}"><span class="field-error" id="internal-error-${rowId}"></span></td>
        <td><label for="external-marks-${rowId}" class="sr-only">Subject ${rowNumber} external marks</label><input class="marks-input" type="number" id="external-marks-${rowId}" name="external-marks-${rowId}" min="0" max="${config.externalMax}" placeholder="Max ${config.externalMax}" value="${escapeHtml(subject.external ?? '')}"><span class="field-error" id="external-error-${rowId}"></span></td>
        <td><label for="credit-${rowId}" class="sr-only">Subject ${rowNumber} credits</label><input class="credit-input" type="number" id="credit-${rowId}" name="credit-${rowId}" min="1" max="${MAX_SUBJECT_CREDITS}" step="1" placeholder="e.g. 4" value="${escapeHtml(subject.credits ?? '')}"><span class="field-error" id="credit-error-${rowId}"></span></td>
        <td><button type="button" class="remove-row-btn" data-row-id="${rowId}">Remove</button></td>`;
    subjectsBody.appendChild(row);
    updateSubjectType(row, false);
    updateRemoveButtons();
}

function updateSubjectType(row, clearExceeded = true) {
    if (!row) return;
    const typeField = row.querySelector('.subject-type');
    const config = getTypeConfig(typeField.value);
    const marksFields = row.querySelectorAll('.marks-input');

    marksFields[0].max = config.internalMax;
    marksFields[0].placeholder = `Max ${config.internalMax}`;
    marksFields[1].max = config.externalMax;
    marksFields[1].placeholder = `Max ${config.externalMax}`;

    if (clearExceeded) {
        const fieldLabels = ['internal', 'external'];
        const maxima = [config.internalMax, config.externalMax];

        marksFields.forEach((field, index) => {
            if (field.value === '') return;
            const result = marksValidator.validateField(field.value, maxima[index], fieldLabels[index]);
            if (!result.valid) {
                field.value = '';
                field.classList.add('invalid');
                showError(`Re-enter a value from 0–${maxima[index]}.`, `${fieldLabels[index]}-error-${row.dataset.rowId}`);
            }
        });
    }
}

function removeSubjectRow(id) {
    if (subjectsBody.children.length <= 1) return;
    const row = subjectsBody.querySelector(`[data-row-id="${id}"]`);
    if (row) row.remove();
    renumberRows();
    updateRemoveButtons();
    saveToLocalStorage();
}

function renumberRows() {
    Array.from(subjectsBody.children).forEach((row, index) => {
        row.children[0].textContent = index + 1;
        const input = row.querySelector('input');
        if (input) input.setAttribute('aria-label', `Subject ${index + 1} name`);
    });
}

function updateRemoveButtons() {
    const rows = subjectsBody.querySelectorAll('.remove-row-btn');
    rows.forEach((button) => { button.disabled = rows.length === 1; });
    addSubjectButton.disabled = false;
    if (subjectLimitMessage) {
        subjectLimitMessage.textContent = rows.length > 10 ? 'You have more than 10 subjects. Please review the list before calculating.' : '';
    }
}

function validateForm() {
    let valid = true;
    clearError('sgpa-error');
    subjectsBody.querySelectorAll('input, select').forEach((field) => field.classList.remove('invalid'));
    const subjects = [];
    const rows = Array.from(subjectsBody.querySelectorAll('tr'));

    rows.forEach((row) => {
        const nameField = row.querySelector('.subject-name') || row.querySelector('input[type="text"]');
        const markFields = row.querySelectorAll('.marks-input');
        const internalField = markFields[0];
        const externalField = markFields[1];
        const typeField = row.querySelector('.subject-type');
        const creditField = row.querySelector('.credit-input');
        const rowId = row.dataset.rowId;

        clearError(`internal-error-${rowId}`);
        clearError(`external-error-${rowId}`);
        clearError(`credit-error-${rowId}`);

        const name = nameField.value.trim();
        if (!name) { nameField.classList.add('invalid'); valid = false; }

        const type = resolveSubjectType(typeField.value);

        const creditResult = validateCredits(creditField.value);
        if (!creditResult.valid) {
            creditField.classList.add('invalid');
            showError(creditResult.message, `credit-error-${rowId}`);
            valid = false;
        }

        const marksResult = marksValidator.validateSubjectMarks({
            type,
            internal: internalField.value,
            external: externalField.value
        });

        if (!marksResult.internal.valid) {
            internalField.classList.add('invalid');
            showError(marksResult.internal.message, `internal-error-${rowId}`);
            valid = false;
        }

        if (!marksResult.external.valid) {
            externalField.classList.add('invalid');
            showError(marksResult.external.message, `external-error-${rowId}`);
            valid = false;
        }

        subjects.push({
            name,
            type,
            internal: marksResult.internal.valid ? marksResult.internal.value : 0,
            external: marksResult.external.valid ? marksResult.external.value : 0,
            credits: creditResult.valid ? creditResult.value : 0
        });
    });

    if (!valid) showError('Complete each subject name, credit value, and marks before calculating.', 'sgpa-error');
    return valid ? subjects : null;
}

function validateYgpaField(id, message) {
    const field = document.getElementById(id);
    const value = Number(field.value);
    clearError(`${id}-error`);
    field.classList.remove('invalid');
    if (!field.value || !Number.isFinite(value) || (id.includes('sgpa') && (value < 0 || value > 10)) || (id.includes('credits') && value <= 0)) {
        field.classList.add('invalid');
        showError(message, `${id}-error`);
        return false;
    }
    return true;
}

function calculateSgpaResult() {
    const subjects = validateForm();
    if (!subjects) return;
    sgpaValue.textContent = formatResult(calculateSGPA(subjects));
    saveToLocalStorage();
}

function calculateYgpaResult() {
    clearError('ygpa-error');
    const valid = validateYgpaField('sem1-sgpa', 'Enter an SGPA from 0 to 10.') && validateYgpaField('sem1-credits', 'Credits must be greater than 0.') && validateYgpaField('sem2-sgpa', 'Enter an SGPA from 0 to 10.') && validateYgpaField('sem2-credits', 'Credits must be greater than 0.');
    if (!valid) { showError('Check the highlighted semester details.', 'ygpa-error'); return; }
    ygpaValue.textContent = formatResult(calculateYGPA(Number(document.getElementById('sem1-sgpa').value), Number(document.getElementById('sem1-credits').value), Number(document.getElementById('sem2-sgpa').value), Number(document.getElementById('sem2-credits').value)));
    saveToLocalStorage();
}

function showError(message, elementId) { const element = document.getElementById(elementId); if (element) element.textContent = message; }
function clearError(elementId) { const element = document.getElementById(elementId); if (element) element.textContent = ''; }
function formatResult(number) { return Number(number).toFixed(2); }

/* ================= SEMESTER-AWARE STORAGE ================= */
// {
//   version: 2,
//   activeSemester: "3",
//   semesters: {
//     "1": { subjects: [...], sgpaDisplay: "8.42" },
//     "4": { subjects: [...], sgpaDisplay: "--" }
//   },
//   ygpa: { "sem1-sgpa": "8.00", "sem1-credits": "22", ... }
// }
// localStorage has no expiry — this data survives closing the browser,
// restarting the device, and long gaps of a year or more, as long as
// the same browser profile on the same device is used and site data
// isn't manually cleared.

function getEmptyState() {
    return {
        version: STORAGE_VERSION,
        activeSemester: semesterSelect.value,
        semesters: {},
        ygpa: { 'sem1-sgpa': '', 'sem1-credits': '', 'sem2-sgpa': '', 'sem2-credits': '' }
    };
}

function readRawState(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        return null;
    }
}

function migrateLegacyState() {
    const legacy = readRawState(LEGACY_STORAGE_KEY);
    if (!legacy) return null;

    const migrated = getEmptyState();
    const legacySemester = legacy.semester || semesterSelect.value;
    migrated.activeSemester = legacySemester;
    migrated.semesters[legacySemester] = {
        subjects: legacy.subjects || [],
        sgpaDisplay: '--'
    };
    if (legacy.ygpa) migrated.ygpa = legacy.ygpa;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch (error) { /* Storage may be unavailable in private browsing. */ }

    return migrated;
}

function getStorageState() {
    const current = readRawState(STORAGE_KEY);
    if (current && current.version === STORAGE_VERSION) return current;

    const migrated = migrateLegacyState();
    return migrated || getEmptyState();
}

function persistState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) { /* Storage may be unavailable in private browsing (e.g. quota exceeded). */ }
}

function captureCurrentSnapshot() {
    return {
        subjects: Array.from(subjectsBody.querySelectorAll('tr')).map((row) => ({
            name: row.querySelector('.subject-name, input[type="text"]').value,
            type: resolveSubjectType(row.querySelector('.subject-type')?.value),
            credits: row.querySelector('.credit-input').value,
            internal: row.querySelectorAll('.marks-input')[0].value,
            external: row.querySelectorAll('.marks-input')[1].value
        })),
        sgpaDisplay: sgpaValue.textContent
    };
}

/**
 * Rebuilds the subject rows and result display for a given semester.
 * Priority order: (1) a saved snapshot for this semester, so nothing a
 * student already entered is ever overwritten; (2) the curriculum
 * template for this semester, if one exists; (3) three blank editable
 * rows, for semesters with no template (currently Semester 3) or no
 * curriculum data at all.
 */
function applySnapshot(snapshot, semesterId) {
    subjectsBody.innerHTML = '';

    const hasSavedSubjects = snapshot && snapshot.subjects && snapshot.subjects.length;
    const rowsToRender = hasSavedSubjects ? snapshot.subjects : getDefaultRowsForSemester(semesterId);

    if (rowsToRender && rowsToRender.length) {
        rowsToRender.forEach((subject) => addSubjectRow(subject));
    } else {
        for (let index = 0; index < 3; index += 1) addSubjectRow();
    }

    sgpaValue.textContent = (snapshot && snapshot.sgpaDisplay) || '--';
    clearError('sgpa-error');
    updateRemoveButtons();
}

function initializeSemesterStorage() {
    const state = getStorageState();
    activeSemesterId = state.activeSemester || semesterSelect.value;
    semesterSelect.value = activeSemesterId;

    applySnapshot(state.semesters[activeSemesterId], activeSemesterId);

    if (state.ygpa) {
        Object.entries(state.ygpa).forEach(([id, value]) => {
            const field = document.getElementById(id);
            if (field) field.value = value;
        });
    }
}

function handleSemesterChange() {
    const state = getStorageState();
    state.semesters[activeSemesterId] = captureCurrentSnapshot();
    persistState(state);

    activeSemesterId = semesterSelect.value;
    state.activeSemester = activeSemesterId;
    applySnapshot(state.semesters[activeSemesterId], activeSemesterId);
    persistState(state);
}

function saveToLocalStorage() {
    const state = getStorageState();
    state.activeSemester = activeSemesterId;
    state.semesters[activeSemesterId] = captureCurrentSnapshot();
    state.ygpa = Object.fromEntries(
        ['sem1-sgpa', 'sem1-credits', 'sem2-sgpa', 'sem2-credits'].map((id) => [id, document.getElementById(id).value])
    );
    persistState(state);
}

/**
 * Reset now restores the current semester's official subject list
 * (name, type, credits pre-filled, still editable) instead of three
 * blank rows — "reset" means "back to the curriculum defaults", not
 * "erase everything with no starting point". Semesters without a
 * template (Semester 3) still reset to three blank rows.
 */
function resetForm(formId) {
    window.setTimeout(() => {
        if (formId === 'sgpa-form') {
            subjectsBody.innerHTML = '';
            const defaults = getDefaultRowsForSemester(activeSemesterId);
            if (defaults && defaults.length) {
                defaults.forEach((subject) => addSubjectRow(subject));
            } else {
                for (let index = 0; index < 3; index += 1) addSubjectRow();
            }
            updateRemoveButtons();
            sgpaValue.textContent = '--';
            clearError('sgpa-error');
        } else {
            ygpaValue.textContent = '--';
            clearError('ygpa-error');
            ['sem1-sgpa', 'sem1-credits', 'sem2-sgpa', 'sem2-credits'].forEach((id) => document.getElementById(id).classList.remove('invalid'));
        }
        saveToLocalStorage();
    }, 0);
}

function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]); }