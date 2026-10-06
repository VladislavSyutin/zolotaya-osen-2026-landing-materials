(() => {
  const questions = window.SURVEY_QUESTIONS;
  const surveyApp = document.getElementById('survey-app');
  const form = document.getElementById('survey-form');
  const fallback = document.getElementById('survey-fallback');
  const stepContainer = document.getElementById('survey-step');
  const progress = document.getElementById('survey-progress');
  const progressLabel = document.getElementById('survey-progress-label');
  const progressFill = document.getElementById('survey-progress-fill');
  const progressBlock = document.querySelector('.survey-progress-block');
  const backButton = document.getElementById('survey-back');
  const nextButton = document.getElementById('survey-next');
  const submitButton = document.getElementById('survey-submit');
  const errorMessage = document.getElementById('survey-error');
  const successPanel = document.getElementById('survey-success');

  if (
    !Array.isArray(questions)
    || questions.length !== 14
    || typeof window.createSurveyView !== 'function'
    || !surveyApp
    || !form
    || !fallback
    || !stepContainer
    || !progress
    || !progressLabel
    || !progressFill
    || !progressBlock
    || !backButton
    || !nextButton
    || !submitButton
    || !errorMessage
    || !successPanel
  ) {
    if (fallback) fallback.hidden = false;
    return;
  }

  const view = window.createSurveyView({
    stepContainer,
    progress,
    progressLabel,
    progressFill,
    backButton,
    nextButton,
    submitButton,
    errorMessage
  });
  const answers = {};
  const history = [0];
  let currentIndex = 0;
  let isSubmitting = false;

  function answerKey(questionId) {
    return 'q' + questionId;
  }

  function currentQuestion() {
    return questions[currentIndex];
  }

  function renderCurrentQuestion(moveFocus = false) {
    view.renderQuestion(currentQuestion(), questions, answers, history.length, moveFocus);
  }

  function getNextIndex(question) {
    if (question.id === 8 && answers.q8 === 'no-plans') {
      return questions.findIndex(item => item.id === 11);
    }
    return currentIndex + 1;
  }

  function syncCurrentQuestionAnswer(question) {
    const key = answerKey(question.id);

    if (question.type === 'single') {
      const previousAnswer = answers[key];
      const selected = stepContainer.querySelector('input[name="' + key + '"]:checked');
      if (selected) {
        answers[key] = selected.value;
      } else {
        delete answers[key];
      }

      if (question.id === 8 && (previousAnswer === 'no-plans') !== (answers.q8 === 'no-plans')) {
        delete answers.q9;
        delete answers.q10;
      }
      if (question.id === 13 && previousAnswer === 'other' && answers.q13 !== 'other') {
        delete answers.q13Other;
      }
    } else if (question.type === 'multiple') {
      answers[key] = Array.from(
        stepContainer.querySelectorAll('input[name="' + key + '"]:checked'),
        input => input.value
      );
      const otherInput = stepContainer.querySelector('[data-other-text-for="' + question.id + '"]');
      if (answers[key].includes('other') && otherInput) {
        answers[key + 'Other'] = otherInput.value;
      } else {
        delete answers[key + 'Other'];
      }
    } else if (question.type === 'matrix') {
      const matrixAnswers = {};
      question.criteria.forEach(criterion => {
        const selected = stepContainer.querySelector(
          'input[data-matrix-criterion="' + criterion.value + '"]:checked'
        );
        if (selected) matrixAnswers[criterion.value] = selected.value;
      });
      answers[key] = matrixAnswers;
    } else if (question.type === 'text') {
      const input = stepContainer.querySelector('[data-question-id="' + question.id + '"]');
      if (input) answers[key] = input.value;
    }

    if (question.id === 13 && answers.q13 === 'other') {
      const otherInput = stepContainer.querySelector('[data-other-text-for="13"]');
      if (otherInput) answers.q13Other = otherInput.value;
    }
  }

  function hasValidAnswer(question) {
    syncCurrentQuestionAnswer(question);
    const missingControl = view.getFirstMissingControl(question, answers);
    if (!missingControl) return true;
    view.showValidationError(missingControl);
    return false;
  }

  function handleStepChange(event) {
    const control = event.target;
    if (!(control instanceof HTMLInputElement)) return;

    const questionId = Number(control.dataset.questionId || currentQuestion().id);
    const key = answerKey(questionId);

    if (control.type === 'checkbox') {
      answers[key] = Array.from(
        stepContainer.querySelectorAll('input[name="' + key + '"]:checked'),
        input => input.value
      );
      view.syncOtherAnswerVisibility(questionId, answers, questions);
    } else if (control.dataset.matrixCriterion) {
      answers[key] = answers[key] || {};
      answers[key][control.dataset.matrixCriterion] = control.value;
    } else if (control.type === 'radio') {
      const previousAnswer = answers[key];
      answers[key] = control.value;
      if (questionId === 8 && (previousAnswer === 'no-plans') !== (control.value === 'no-plans')) {
        delete answers.q9;
        delete answers.q10;
      }
      if (questionId === 13 && previousAnswer === 'other' && control.value !== 'other') {
        delete answers.q13Other;
      }
      if (questionId === 13) view.syncOtherAnswerVisibility(questionId, answers, questions);
    }

    if (!errorMessage.hidden && !view.getFirstMissingControl(currentQuestion(), answers)) {
      view.clearValidation();
    }
  }

  function handleStepInput(event) {
    const control = event.target;
    if (!(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement)) return;

    const questionId = Number(control.dataset.otherTextFor || control.dataset.questionId);
    if (!questionId) return;
    const key = control.dataset.otherTextFor
      ? 'q' + questionId + 'Other'
      : answerKey(questionId);
    answers[key] = control.value;

    if (!errorMessage.hidden && !view.getFirstMissingControl(currentQuestion(), answers)) {
      view.clearValidation();
    }
  }

  function goToNextQuestion() {
    const question = currentQuestion();
    if (!hasValidAnswer(question)) return;

    const nextIndex = getNextIndex(question);
    if (nextIndex < 0 || nextIndex >= questions.length) return;

    currentIndex = nextIndex;
    history.push(nextIndex);
    renderCurrentQuestion(true);
  }

  function goToPreviousQuestion() {
    if (history.length <= 1) return;
    history.pop();
    currentIndex = history[history.length - 1];
    renderCurrentQuestion(true);
  }

  function buildPayload() {
    const submittedAnswers = {};

    questions.forEach(question => {
      const key = answerKey(question.id);
      const value = answers[key];
      if (value === undefined) return;

      if (question.type === 'single') {
        const option = question.options.find(item => item.value === value);
        submittedAnswers[key] = option ? option.label : '';
      } else if (question.type === 'multiple') {
        submittedAnswers[key] = question.options
          .filter(option => value.includes(option.value))
          .map(option => option.label);
      } else if (question.type === 'matrix') {
        submittedAnswers[key] = {};
        question.criteria.forEach(criterion => {
          submittedAnswers[key][criterion.value] = Number(value[criterion.value]);
        });
      } else {
        submittedAnswers[key] = value.trim();
      }
    });

    if (answers.q2Other) submittedAnswers.q2Other = answers.q2Other.trim();
    if (answers.q13Other) submittedAnswers.q13Other = answers.q13Other.trim();

    // Provisional JSON contract: q1–q14 keys, option labels, multi-select arrays,
    // numeric ratings for question 9, and q2Other/q13Other for conditional text.
    return {
      surveyId: 'zolotaya-osen-2026',
      answers: submittedAnswers
    };
  }

  function getEndpoint() {
    const configuredEndpoint = form.dataset.endpoint.trim();
    if (!configuredEndpoint) return null;

    const endpoint = new URL(configuredEndpoint, window.location.href);
    const isLocalHttpEndpoint = endpoint.protocol === 'http:'
      && ['localhost', '127.0.0.1', '[::1]'].includes(endpoint.hostname);
    if (endpoint.protocol !== 'https:' && !isLocalHttpEndpoint) {
      throw new Error('Survey endpoint must use HTTPS');
    }
    return endpoint.href;
  }

  function showSubmissionError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
  }

  function showSuccess() {
    form.hidden = true;
    progressBlock.hidden = true;
    successPanel.hidden = false;
    successPanel.focus();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting || !hasValidAnswer(currentQuestion())) return;

    let endpoint;
    try {
      endpoint = getEndpoint();
    } catch {
      showSubmissionError('Не удалось отправить анкету. Проверьте адрес формы и попробуйте ещё раз.');
      return;
    }
    if (!endpoint) {
      showSuccess();
      return;
    }

    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Отправляем…';
    form.setAttribute('aria-busy', 'true');
    errorMessage.textContent = '';
    errorMessage.hidden = true;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
        credentials: 'omit',
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Survey submission failed: ' + response.status);
      showSuccess();
    } catch {
      showSubmissionError('Не удалось отправить анкету. Ответы остались в форме — попробуйте ещё раз.');
      submitButton.disabled = false;
      submitButton.textContent = 'Отправить ответы';
    } finally {
      window.clearTimeout(timeoutId);
      isSubmitting = false;
      form.removeAttribute('aria-busy');
    }
  }

  stepContainer.addEventListener('change', handleStepChange);
  stepContainer.addEventListener('input', handleStepInput);
  nextButton.addEventListener('click', goToNextQuestion);
  backButton.addEventListener('click', goToPreviousQuestion);
  form.addEventListener('submit', handleSubmit);

  fallback.hidden = true;
  surveyApp.hidden = false;
  renderCurrentQuestion();
})();
