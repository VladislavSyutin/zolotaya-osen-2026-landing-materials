window.createSurveyView = function createSurveyView(elements) {
  const {
    stepContainer,
    progress,
    progressLabel,
    progressFill,
    backButton,
    nextButton,
    submitButton,
    errorMessage
  } = elements;

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function answerKey(questionId) {
    return 'q' + questionId;
  }

  function createOptionLabel(question, option, inputType, answers) {
    const label = createElement('label', 'survey-option');
    const input = document.createElement('input');
    input.type = inputType;
    input.name = answerKey(question.id);
    input.value = option.value;
    input.id = answerKey(question.id) + '-' + option.value;
    input.dataset.questionId = String(question.id);
    input.required = inputType === 'radio';

    if (inputType === 'checkbox') {
      input.setAttribute('aria-describedby', 'survey-q' + question.id + '-hint');
    }

    const currentAnswer = answers[answerKey(question.id)];
    input.checked = inputType === 'checkbox'
      ? Array.isArray(currentAnswer) && currentAnswer.includes(option.value)
      : currentAnswer === option.value;

    label.append(input, createElement('span', 'survey-option-text', option.label));
    return label;
  }

  function createOtherAnswer(question, prompt, answers) {
    const wrapper = createElement('div', 'survey-other-answer');
    const label = createElement('label', 'survey-other-label');
    const input = document.createElement('input');
    const key = 'q' + question.id + 'Other';
    const selectedAnswer = answers[answerKey(question.id)];
    const isSelected = question.type === 'multiple'
      ? Array.isArray(selectedAnswer) && selectedAnswer.includes('other')
      : selectedAnswer === 'other';

    input.type = 'text';
    input.id = key + '-text';
    input.name = key;
    input.value = answers[key] || '';
    input.placeholder = prompt;
    input.autocomplete = 'off';
    input.dataset.otherTextFor = String(question.id);
    input.hidden = !isSelected;
    input.required = isSelected;

    label.append(createElement('span', 'visually-hidden', prompt), input);
    wrapper.append(label);
    wrapper.hidden = !isSelected;
    return wrapper;
  }

  function createMatrixQuestion(question, fieldset, answers) {
    const scaleDescription = question.scale
      .map(item => item.value + ' — ' + item.label)
      .join(' · ');
    fieldset.append(createElement('p', 'survey-question-hint survey-scale-description', scaleDescription));

    const matrixAnswers = answers[answerKey(question.id)] || {};
    const matrix = createElement('div', 'survey-matrix');

    question.criteria.forEach(criterion => {
      const row = createElement('fieldset', 'survey-matrix-row');
      const legend = createElement('legend', 'survey-matrix-label', criterion.label);
      const choices = createElement('div', 'survey-rating-options');
      const selectedValue = matrixAnswers[criterion.value];

      question.scale.forEach(item => {
        const label = createElement('label', 'survey-rating-option');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = answerKey(question.id) + '-' + criterion.value;
        input.value = item.value;
        input.required = true;
        input.checked = selectedValue === item.value;
        input.dataset.questionId = String(question.id);
        input.dataset.matrixCriterion = criterion.value;
        input.setAttribute('aria-label', item.value + ' — ' + item.label);
        input.setAttribute('aria-describedby', 'survey-error');

        label.append(input, createElement('span', 'survey-rating-number', item.value));
        choices.append(label);
      });

      row.append(legend, choices);
      matrix.append(row);
    });

    fieldset.append(matrix);
  }

  function renderQuestion(question, questions, answers, historyLength, moveFocus = false) {
    const fieldset = createElement('fieldset', 'survey-question');
    fieldset.tabIndex = -1;
    fieldset.append(createElement('legend', 'survey-question-title', question.title));

    if (question.type === 'multiple') {
      const hint = createElement('p', 'survey-question-hint', 'Выберите один или несколько вариантов.');
      hint.id = 'survey-q' + question.id + '-hint';
      fieldset.append(hint);
      question.options.forEach(option => {
        fieldset.append(createOptionLabel(question, option, 'checkbox', answers));
        if (option.value === 'other' && question.id === 2) {
          fieldset.append(createOtherAnswer(question, 'Опишите ассоциацию', answers));
        }
      });
    } else if (question.type === 'single') {
      question.options.forEach(option => {
        fieldset.append(createOptionLabel(question, option, 'radio', answers));
        if (option.value === 'other' && question.id === 13) {
          fieldset.append(createOtherAnswer(question, 'Укажите вашу роль', answers));
        }
      });
    } else if (question.type === 'text') {
      const label = createElement('label', 'survey-field-label');
      const control = question.id === 5
        ? document.createElement('textarea')
        : document.createElement('input');

      label.append(createElement('span', '', question.fieldLabel));
      if (question.id !== 5) control.type = 'text';
      control.id = answerKey(question.id);
      control.name = answerKey(question.id);
      control.value = answers[answerKey(question.id)] || '';
      control.required = true;
      control.dataset.questionId = String(question.id);
      control.autocomplete = 'off';
      label.append(control);
      fieldset.append(label);
    } else if (question.type === 'matrix') {
      createMatrixQuestion(question, fieldset, answers);
    }

    stepContainer.replaceChildren(fieldset);
    progressLabel.textContent = 'Вопрос ' + question.id + ' из ' + questions.length;
    progress.setAttribute('aria-valuenow', String(question.id));
    progress.setAttribute('aria-valuetext', 'Вопрос ' + question.id + ' из ' + questions.length);
    progressFill.style.width = (question.id / questions.length) * 100 + '%';
    backButton.hidden = historyLength <= 1;

    const isLastQuestion = question.id === questions[questions.length - 1].id;
    nextButton.hidden = isLastQuestion;
    submitButton.hidden = !isLastQuestion;
    clearValidation();

    if (moveFocus) fieldset.focus({ preventScroll: true });
  }

  function getFirstMissingControl(question, answers) {
    const key = answerKey(question.id);

    if (question.type === 'single' && !answers[key]) {
      return stepContainer.querySelector('input[type="radio"]');
    }

    if (question.type === 'multiple') {
      const selections = answers[key] || [];
      if (selections.length === 0) return stepContainer.querySelector('input[type="checkbox"]');
      if (selections.includes('other') && !(answers[key + 'Other'] || '').trim()) {
        return stepContainer.querySelector('[data-other-text-for="' + question.id + '"]');
      }
    }

    if (question.type === 'text' && !(answers[key] || '').trim()) {
      return stepContainer.querySelector('[data-question-id="' + question.id + '"]');
    }

    if (question.id === 13 && answers.q13 === 'other' && !(answers.q13Other || '').trim()) {
      return stepContainer.querySelector('[data-other-text-for="13"]');
    }

    if (question.type === 'matrix') {
      const incompleteCriterion = question.criteria.find(item => (
        !stepContainer.querySelector(
          'input[data-matrix-criterion="' + item.value + '"]:checked'
        )
      ));
      if (incompleteCriterion) {
        return stepContainer.querySelector('input[data-matrix-criterion="' + incompleteCriterion.value + '"]');
      }
    }

    return null;
  }

  function clearValidation() {
    stepContainer.querySelectorAll('[aria-invalid="true"]').forEach(control => {
      control.removeAttribute('aria-invalid');
      const describedBy = (control.getAttribute('aria-describedby') || '')
        .split(/\s+/)
        .filter(id => id && id !== errorMessage.id);
      if (describedBy.length) {
        control.setAttribute('aria-describedby', describedBy.join(' '));
      } else {
        control.removeAttribute('aria-describedby');
      }
    });
    errorMessage.textContent = '';
    errorMessage.hidden = true;
  }

  function showValidationError(control) {
    clearValidation();
    errorMessage.textContent = 'Ответьте на вопрос, чтобы продолжить.';
    errorMessage.hidden = false;

    if (control) {
      control.setAttribute('aria-invalid', 'true');
      const describedBy = (control.getAttribute('aria-describedby') || '')
        .split(/\s+/)
        .filter(Boolean);
      if (!describedBy.includes(errorMessage.id)) describedBy.push(errorMessage.id);
      control.setAttribute('aria-describedby', describedBy.join(' '));
      control.focus();
    }
  }

  function syncOtherAnswerVisibility(questionId, answers, questions) {
    const question = questions.find(item => item.id === questionId);
    if (!question) return;
    const currentAnswer = answers[answerKey(questionId)];
    const isSelected = question.type === 'multiple'
      ? Array.isArray(currentAnswer) && currentAnswer.includes('other')
      : currentAnswer === 'other';
    const otherInput = stepContainer.querySelector('[data-other-text-for="' + questionId + '"]');
    if (!otherInput) return;

    const wrapper = otherInput.closest('.survey-other-answer');
    otherInput.hidden = !isSelected;
    otherInput.required = isSelected;
    if (wrapper) wrapper.hidden = !isSelected;
    if (!isSelected) {
      delete answers['q' + questionId + 'Other'];
      otherInput.value = '';
    }
  }

  return {
    renderQuestion,
    getFirstMissingControl,
    clearValidation,
    showValidationError,
    syncOtherAnswerVisibility
  };
};
