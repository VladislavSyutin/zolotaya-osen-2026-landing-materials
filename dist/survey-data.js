window.SURVEY_QUESTIONS = [
  {
    id: 1,
    type: 'single',
    title: 'Знаете ли вы страховую компанию «РСХБ-Страхование»?',
    options: [
      { value: 'know', label: 'да, знаю' },
      { value: 'heard', label: 'слышал(а) название, но не знаком(а) с услугами' },
      { value: 'do-not-know', label: 'нет, не знаю' }
    ]
  },
  {
    id: 2,
    type: 'multiple',
    title: 'С какими из следующих ассоциаций у вас связан бренд «РСХБ-Страхование»? (Можно выбрать несколько вариантов)',
    options: [
      { value: 'reliability', label: 'надежность, устойчивость' },
      { value: 'agro-expertise', label: 'экспертиза в агропромышленном комплексе' },
      { value: 'state-support', label: 'государственная поддержка, связь с Россельхозбанком' },
      { value: 'wide-range', label: 'широкий спектр страховых услуг' },
      { value: 'high-prices', label: 'высокие цены' },
      { value: 'complex-process', label: 'сложность в оформлении' },
      { value: 'other', label: 'другое (что именно?)' }
    ]
  },
  {
    id: 3,
    type: 'single',
    title: 'Как вы оцениваете уровень известности бренда «РСХБ-Страхование» в аграрном секторе?',
    options: [
      { value: 'market-leader', label: 'это абсолютный лидер' },
      { value: 'key-player', label: 'один из ключевых игроков на рынке' },
      { value: 'regular-player', label: 'рядовой участник рынка' },
      { value: 'new-player', label: 'новый или малозаметный игрок' },
      { value: 'unsure', label: 'затрудняюсь ответить' }
    ]
  },
  {
    id: 4,
    type: 'single',
    title: 'Насколько, по вашему мнению, современно и профессионально выглядит логотип компании?',
    options: [
      { value: '5', label: '5 — очень современно и профессионально' },
      { value: '4', label: '4 — скорее современно' },
      { value: '3', label: '3 — нейтрально' },
      { value: '2', label: '2 — выглядит устаревшим' },
      { value: '1', label: '1 — совсем непрофессионально' },
      { value: 'unsure', label: 'затрудняюсь ответить' }
    ]
  },
  {
    id: 5,
    type: 'text',
    title: 'Что, на ваш взгляд, символизирует логотип и цвета компании?',
    fieldLabel: 'Ваш ответ'
  },
  {
    id: 6,
    type: 'single',
    title: 'Насколько вам понятна основная идея бренда «РСХБ-Страхование», глядя на его рекламные материалы (стенд, буклеты)?',
    options: [
      { value: 'fully-clear', label: 'полностью понятна' },
      { value: 'mostly-clear', label: 'в основном понятна' },
      { value: 'mostly-unclear', label: 'не совсем понятна' },
      { value: 'not-clear', label: 'совершенно непонятна' }
    ]
  },
  {
    id: 7,
    type: 'multiple',
    title: 'Какие услуги, по вашему мнению, являются основными для «РСХБ-Страхование»? (Можно выбрать несколько вариантов)',
    options: [
      { value: 'crop', label: 'страхование урожая сельхозкультур' },
      { value: 'equipment', label: 'страхование сельхозтехники и оборудования' },
      { value: 'livestock', label: 'страхование животных (КРС, свиней и т.д.)' },
      { value: 'property', label: 'имущественное страхование (элеваторы, склады)' },
      { value: 'subsidized', label: 'страхование с господдержкой' },
      { value: 'individuals', label: 'страхование физических лиц' },
      { value: 'all-services', label: 'все вышеперечисленное' },
      { value: 'unsure', label: 'не знаю' }
    ]
  },
  {
    id: 8,
    type: 'single',
    title: 'Пользовались ли вы или ваше предприятие услугами «РСХБ-Страхование» за последние 2-3 года?',
    options: [
      { value: 'regular-client', label: 'да, являемся постоянными клиентами' },
      { value: 'used-before', label: 'да, пользовались один или несколько раз' },
      { value: 'considering', label: 'нет, но рассматриваем такую возможность' },
      { value: 'no-plans', label: 'нет, и не планируем' }
    ]
  },
  {
    id: 9,
    type: 'matrix',
    title: 'Оцените, пожалуйста, ваше взаимодействие с менеджерами компании по следующим параметрам (по 5-балльной шкале)',
    scale: [
      { value: '5', label: 'Отлично' },
      { value: '4', label: 'Хорошо' },
      { value: '3', label: 'Удовлетворительно' },
      { value: '2', label: 'Плохо' },
      { value: '1', label: 'Очень плохо' }
    ],
    criteria: [
      { value: 'competence', label: 'компетентность и знание продуктов' },
      { value: 'response-speed', label: 'скорость реакции и обработки запросов' },
      { value: 'attention', label: 'внимательность к вашим потребностям' },
      { value: 'communication', label: 'общая вежливость и коммуникабельность' }
    ]
  },
  {
    id: 10,
    type: 'single',
    title: 'Были ли у вас страховые случаи? Если да, то как вы оцениваете урегулирование убытков?',
    options: [
      { value: 'fast-and-fair', label: 'да, все было урегулировано быстро и справедливо' },
      { value: 'resolved', label: 'да, процесс занял время, но в итоге все решили' },
      { value: 'difficulties', label: 'да, были сложности и разногласия' },
      { value: 'no-claims', label: 'нет, страховых случаев не было' },
      { value: 'unsure', label: 'затрудняюсь ответить' }
    ]
  },
  {
    id: 11,
    type: 'single',
    title: 'Как бы вы в целом оценили свое отношение к бренду «РСХБ-Страхование»?',
    options: [
      { value: 'very-positive', label: 'очень положительное' },
      { value: 'rather-positive', label: 'скорее положительное' },
      { value: 'neutral', label: 'нейтральное' },
      { value: 'rather-negative', label: 'скорее отрицательное' },
      { value: 'very-negative', label: 'очень отрицательное' },
      { value: 'not-familiar', label: 'не знаком с компанией' }
    ]
  },
  {
    id: 12,
    type: 'single',
    title: 'Порекомендовали бы вы «РСХБ-Страхование» своим коллегам или партнерам?',
    options: [
      { value: 'definitely-yes', label: 'определенно да' },
      { value: 'probably-yes', label: 'вероятно, да' },
      { value: 'unsure', label: 'не уверен(а)' },
      { value: 'probably-no', label: 'вероятно, нет' },
      { value: 'definitely-no', label: 'определенно нет' }
    ]
  },
  {
    id: 13,
    type: 'single',
    title: 'Кем вы являетесь в сфере АПК?',
    options: [
      { value: 'business-owner', label: 'руководитель/владелец сельхозпредприятия' },
      { value: 'specialist', label: 'специалист (агроном, зоотехник, экономист и т.д.)' },
      { value: 'farmer', label: 'фермер, ИП' },
      { value: 'cooperative', label: 'представитель кооператива/ассоциации' },
      { value: 'agroholding', label: 'представитель крупного агрохолдинга' },
      { value: 'other', label: 'другое' }
    ]
  },
  {
    id: 14,
    type: 'text',
    title: 'Регион, в котором вы ведете основную деятельность:',
    fieldLabel: 'Регион'
  }
];
