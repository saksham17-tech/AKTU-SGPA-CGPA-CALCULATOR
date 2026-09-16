/* ================= DOM SELECTION & EVENT LISTENERS ================= */
const sgpaForm = document.getElementById('sgpa-form');
const ygpaForm = document.getElementById('ygpa-form');
const subjectsBody = document.getElementById('subjects-body');
const addSubjectButton = document.getElementById('add-subject-btn');
const sgpaValue = document.getElementById('sgpa-value');
const ygpaValue = document.getElementById('ygpa-value');
const sgpaError = document.getElementById('sgpa-error');
const ygpaError = document.getElementById('ygpa-error');
const subjectLimitMessage = document.getElementById('subject-limit-message');
const calculateSgpaButton = document.getElementById('calculate-sgpa-btn');
const calculateYgpaButton = document.getElementById('calculate-ygpa-btn');
const storageKey = 'aktu-grade-ledger-state';
const typeConfig = {
    theory: { internalMax: 30, externalMax: 70, totalMax: 100 },
    lab: { internalMax: 70, externalMax: 70, totalMax: 140 }
};

// Give starter rows the same data shape as rows added later.
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
loadFromLocalStorage();

addSubjectButton.addEventListener('click', () => addSubjectRow());
calculateSgpaButton.addEventListener('click', calculateSgpaResult);
calculateYgpaButton.addEventListener('click', calculateYgpaResult);
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
        const config = typeConfig[subject.type] || typeConfig.theory;
        const percentage = ((subject.internal + subject.external) / config.totalMax) * 100;
        return sum + (marksToGradePoint(percentage) * subject.credits);
    }, 0);
    return weightedPoints / totalCredits;
}

function marksToGradePoint(percentage) {
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) return null;
    if (percentage >= 91) return 10;
    if (percentage >= 81) return 9;
    if (percentage >= 71) return 8;
    if (percentage >= 61) return 7;
    if (percentage >= 51) return 6;
    if (percentage >= 41) return 5;
    if (percentage >= 35) return 4;
    return 0;
}

function calculateYGPA(sgpa1, credits1, sgpa2, credits2) {
    const totalCredits = credits1 + credits2;
    if (totalCredits <= 0) return 0;
    return ((sgpa1 * credits1) + (sgpa2 * credits2)) / totalCredits;
}

/* ================= HELPER FUNCTIONS ================= */
function addSubjectRow(subject = {}) {
    const rowNumber = subjectsBody.children.length + 1;
    const rowId = `${Date.now()}-${rowNumber}`;
    const type = typeConfig[subject.type] ? subject.type : 'theory';
    const config = typeConfig[type];
    const row = document.createElement('tr');
    row.dataset.rowId = rowId;
    row.innerHTML = `
        <td>${rowNumber}</td>
        <td><label for="subject-${rowId}" class="sr-only">Subject ${rowNumber} name</label><input class="subject-name" type="text" id="subject-${rowId}" name="subject-${rowId}" placeholder="e.g. Mathematics III" value="${escapeHtml(subject.name || '')}"></td>
        <td><label for="type-${rowId}" class="sr-only">Subject ${rowNumber} type</label><select class="subject-type" id="type-${rowId}" name="type-${rowId}"><option value="theory"${type === 'theory' ? ' selected' : ''}>Theory</option><option value="lab"${type === 'lab' ? ' selected' : ''}>Lab</option></select></td>
        <td><label for="internal-marks-${rowId}" class="sr-only">Subject ${rowNumber} internal marks</label><input class="marks-input" type="number" id="internal-marks-${rowId}" name="internal-marks-${rowId}" min="0" max="${config.internalMax}" placeholder="Max ${config.internalMax}" value="${escapeHtml(subject.internal ?? '')}"><span class="field-error" id="internal-error-${rowId}"></span></td>
        <td><label for="external-marks-${rowId}" class="sr-only">Subject ${rowNumber} external marks</label><input class="marks-input" type="number" id="external-marks-${rowId}" name="external-marks-${rowId}" min="0" max="${config.externalMax}" placeholder="Max ${config.externalMax}" value="${escapeHtml(subject.external ?? '')}"><span class="field-error" id="external-error-${rowId}"></span></td>
        <td><label for="credit-${rowId}" class="sr-only">Subject ${rowNumber} credits</label><select id="credit-${rowId}" name="credit-${rowId}"><option value="">Select</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></td>
        <td><button type="button" class="remove-row-btn" data-row-id="${rowId}">Remove</button></td>`;
    subjectsBody.appendChild(row);
    if (subject.credits) row.querySelector(`#credit-${rowId}`).value = subject.credits;
    updateSubjectType(row, false);
    updateRemoveButtons();
    saveToLocalStorage();
}

function updateSubjectType(row, clearExceeded = true) {
    if (!row) return;
    const typeField = row.querySelector('.subject-type');
    const config = typeConfig[typeField.value] || typeConfig.theory;
    const marksFields = row.querySelectorAll('.marks-input');
    marksFields[0].max = config.internalMax;
    marksFields[0].placeholder = `Max ${config.internalMax}`;
    marksFields[1].max = config.externalMax;
    marksFields[1].placeholder = `Max ${config.externalMax}`;
    if (clearExceeded) {
        marksFields.forEach((field, index) => {
            const maximum = index === 0 ? config.internalMax : config.externalMax;
            const errorId = index === 0 ? 'internal' : 'external';
            if (field.value !== '' && Number(field.value) > maximum) {
                field.value = '';
                showError(`Re-enter a value from 0–${maximum}.`, `${errorId}-error-${row.dataset.rowId}`);
                field.classList.add('invalid');
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
        const creditField = row.querySelector('select:not(.subject-type)');
        const config = typeConfig[typeField.value] || typeConfig.theory;
        const name = nameField.value.trim();
        const credits = Number(creditField.value);
        const internal = Number(internalField.value);
        const external = Number(externalField.value);
        const rowId = row.dataset.rowId;
        clearError(`internal-error-${rowId}`);
        clearError(`external-error-${rowId}`);
        if (!name) { nameField.classList.add('invalid'); valid = false; }
        if (!['1', '2', '3', '4'].includes(creditField.value)) { creditField.classList.add('invalid'); valid = false; }
        if (!internalField.value || !Number.isFinite(internal) || internal < 0 || internal > config.internalMax) {
            internalField.classList.add('invalid');
            showError(`Enter 0–${config.internalMax}.`, `internal-error-${rowId}`);
            valid = false;
        }
        if (!externalField.value || !Number.isFinite(external) || external < 0 || external > config.externalMax) {
            externalField.classList.add('invalid');
            showError(`Enter 0–${config.externalMax}.`, `external-error-${rowId}`);
            valid = false;
        }
        subjects.push({ name, type: typeField.value || 'theory', internal, external, credits });
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

function saveToLocalStorage() {
    const state = {
        subjects: Array.from(subjectsBody.querySelectorAll('tr')).map((row) => ({ name: row.querySelector('.subject-name, input[type="text"]').value, type: row.querySelector('.subject-type')?.value || 'theory', credits: row.querySelector('select:not(.subject-type)').value, internal: row.querySelectorAll('.marks-input')[0].value, external: row.querySelectorAll('.marks-input')[1].value })),
        semester: document.getElementById('semester-select').value,
        ygpa: Object.fromEntries(['sem1-sgpa', 'sem1-credits', 'sem2-sgpa', 'sem2-credits'].map((id) => [id, document.getElementById(id).value]))
    };
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (error) { /* Storage may be unavailable in private browsing. */ }
}

function loadFromLocalStorage() {
    let state;
    try { state = JSON.parse(localStorage.getItem(storageKey)); } catch (error) { state = null; }
    if (!state) return;
    if (state.subjects && state.subjects.length) {
        subjectsBody.innerHTML = '';
        state.subjects.forEach((subject) => addSubjectRow(subject));
    }
    if (state.semester) document.getElementById('semester-select').value = state.semester;
    if (state.ygpa) Object.entries(state.ygpa).forEach(([id, value]) => { const field = document.getElementById(id); if (field) field.value = value; });
    updateRemoveButtons();
}

function resetForm(formId) {
    window.setTimeout(() => {
        if (formId === 'sgpa-form') {
            subjectsBody.innerHTML = '';
            for (let index = 0; index < 3; index += 1) addSubjectRow();
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
