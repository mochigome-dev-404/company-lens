const companies = [
  { ticker: '7203', name: 'Toyota Motor', jp: 'トヨタ自動車', sector: 'Automobiles', score: 91, grade: 'A+', description: '強固な財務基盤と世界規模の製造力を持つ、日本を代表する成熟企業。', metrics: { profitability: 86, safety: 96, growth: 72, valuation: 68, shareholder: 82 }, insight: '財務安全性は非常に高く、収益性も安定しています。一方で巨大企業ゆえに成長性は中程度。長期で企業品質を評価する銘柄です。' },
  { ticker: '6758', name: 'Sony Group', jp: 'ソニーグループ', sector: 'Entertainment / Electronics', score: 88, grade: 'A', description: 'ゲーム・音楽・映画・半導体を横断する複合的なブランド企業。', metrics: { profitability: 84, safety: 78, growth: 82, valuation: 62, shareholder: 70 }, insight: '事業ポートフォリオの分散が魅力です。成長性とブランド力が高い一方、事業ごとの景気感応度には注意が必要です。' },
  { ticker: '6861', name: 'Keyence', jp: 'キーエンス', sector: 'Factory Automation', score: 96, grade: 'S', description: '高収益・高効率経営の代表格。企業品質スコアでは最上位クラス。', metrics: { profitability: 98, safety: 95, growth: 88, valuation: 40, shareholder: 76 }, insight: '収益性・安全性・成長性のバランスが極めて高い企業です。ただし市場からの評価も高く、割安度は低めに出ています。' },
  { ticker: '7974', name: 'Nintendo', jp: '任天堂', sector: 'Gaming', score: 89, grade: 'A', description: '強いIPと高い財務安全性を持つ、世界的なゲーム企業。', metrics: { profitability: 88, safety: 94, growth: 70, valuation: 58, shareholder: 84 }, insight: 'IP資産と財務余力が大きな強みです。ハードサイクルによる業績変動はありますが、長期的なブランド価値は高く評価できます。' },
  { ticker: '9984', name: 'SoftBank Group', jp: 'ソフトバンクグループ', sector: 'Investment Holding', score: 74, grade: 'B', description: '投資会社としての性格が強く、評価にはボラティリティを織り込む必要がある。', metrics: { profitability: 62, safety: 52, growth: 80, valuation: 70, shareholder: 60 }, insight: '成長期待は大きいものの、財務安全性と利益の安定性には注意が必要です。通常の事業会社とは別軸で見るべき企業です。' },
  { ticker: '9432', name: 'NTT', jp: '日本電信電話', sector: 'Telecom', score: 84, grade: 'A-', description: '安定した通信インフラ収益を持つディフェンシブ企業。', metrics: { profitability: 78, safety: 86, growth: 58, valuation: 76, shareholder: 88 }, insight: '成長性は控えめですが、安定収益と株主還元が魅力です。守りの企業として評価しやすい銘柄です。' }
];

let selected = companies[0];
let sortDesc = true;

const listEl = document.querySelector('#companyList');
const searchInput = document.querySelector('#searchInput');
const sortButton = document.querySelector('#sortButton');
const ring = document.querySelector('#ringProgress');
const circumference = 2 * Math.PI * 52;
ring.style.strokeDasharray = circumference;

function gradeClass(grade) {
  if (grade === 'S') return 'grade-s';
  if (grade.includes('A')) return 'grade-a';
  if (grade.includes('B')) return 'grade-b';
  return 'grade-c';
}

function renderList() {
  const q = searchInput.value.trim().toLowerCase();
  let filtered = companies.filter(c =>
    c.ticker.includes(q) || c.name.toLowerCase().includes(q) || c.jp.includes(q) || c.sector.toLowerCase().includes(q)
  );
  filtered.sort((a,b) => sortDesc ? b.score - a.score : a.score - b.score);
  listEl.innerHTML = filtered.map(c => `
    <button class="company-row ${selected.ticker === c.ticker ? 'selected' : ''}" data-ticker="${c.ticker}">
      <span class="row-grade ${gradeClass(c.grade)}">${c.grade}</span>
      <span class="row-main"><strong>${c.name}</strong><small>${c.ticker} · ${c.jp}</small></span>
      <span class="row-score">${c.score}</span>
    </button>
  `).join('');
}

function renderDetail(c) {
  selected = c;
  document.querySelector('#heroTicker').textContent = c.ticker;
  document.querySelector('#heroName').textContent = c.name;
  document.querySelector('#heroDesc').textContent = c.description;
  document.querySelector('#heroGrade').textContent = c.grade;
  document.querySelector('#heroScore').textContent = c.score;

  document.querySelector('#detailTicker').textContent = c.ticker;
  document.querySelector('#detailName').textContent = `${c.name} / ${c.jp}`;
  document.querySelector('#detailSector').textContent = c.sector;
  document.querySelector('#detailScore').textContent = c.score;
  document.querySelector('#detailGrade').textContent = c.grade;
  document.querySelector('#analysisText').textContent = c.insight;
  ring.style.strokeDashoffset = circumference * (1 - c.score / 100);

  const metricNames = {
    profitability: 'Profitability',
    safety: 'Financial Health',
    growth: 'Growth',
    valuation: 'Valuation',
    shareholder: 'Shareholder Return'
  };
  document.querySelector('#metrics').innerHTML = Object.entries(c.metrics).map(([key, value]) => `
    <div class="metric">
      <div class="metric-top"><span>${metricNames[key]}</span><b>${value}</b></div>
      <div class="metric-bar"><span style="width:${value}%"></span></div>
    </div>
  `).join('');

  renderList();
}

listEl.addEventListener('click', (e) => {
  const row = e.target.closest('.company-row');
  if (!row) return;
  const company = companies.find(c => c.ticker === row.dataset.ticker);
  renderDetail(company);
});

searchInput.addEventListener('input', renderList);
sortButton.addEventListener('click', () => {
  sortDesc = !sortDesc;
  sortButton.textContent = sortDesc ? 'Score順' : '低スコア順';
  renderList();
});

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

renderDetail(selected);


/* ---- Company Lens: Companies view ---- */
(() => {
  const topbarEl = document.querySelector('.topbar');
  const heroGridEl = document.querySelector('.hero-grid');
  const contentGridEl = document.querySelector('.content-grid');
  const navButtons = document.querySelectorAll('.nav-item');
  const companyView = document.createElement('section');

  companyView.id = 'companiesView';
  companyView.style.display = 'none';
  topbarEl.insertAdjacentElement('afterend', companyView);

  const pageStyle = document.createElement('style');
  pageStyle.textContent = `
    #companiesView {
      display: grid;
      gap: 18px;
    }

    .company-directory {
      border: 1px solid var(--line);
      border-radius: 28px;
      padding: 22px;
      background: linear-gradient(
        145deg,
        rgba(255,255,255,.085),
        rgba(255,255,255,.035)
      );
      box-shadow: var(--shadow);
    }

    .directory-head {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: center;
      margin-bottom: 18px;
    }

    .directory-head h2 {
      font-size: 28px;
    }

    .directory-list {
      display: grid;
      gap: 12px;
    }

    .directory-card {
      border: 1px solid var(--line);
      border-radius: 22px;
      padding: 18px;
      background: rgba(255,255,255,.035);
    }

    .directory-top {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: flex-start;
    }

    .directory-card h3 {
      margin: 7px 0 4px;
    }

    .directory-meta {
      margin: 0;
      color: var(--muted);
      font-size: 14px;
    }

    .directory-copy {
      color: var(--soft);
      line-height: 1.75;
      margin: 14px 0 16px;
    }

    .open-company {
      border: 1px solid var(--gold);
      background: var(--gold);
      color: #17140d;
      border-radius: 12px;
      padding: 10px 14px;
      font-weight: 800;
    }

    .empty-results {
      padding: 42px 12px;
      text-align: center;
      color: var(--muted);
    }

    @media (max-width: 620px) {
      .directory-head,
      .directory-top {
        align-items: flex-start;
      }

      .directory-head {
        display: grid;
      }
    }
  `;

  document.head.appendChild(pageStyle);

  function setTitle(eyebrow, title) {
    document.querySelector('.eyebrow').textContent = eyebrow;
    document.querySelector('.topbar h1').textContent = title;
  }

  function renderCompaniesDirectory() {
    const query = searchInput.value.trim().toLowerCase();

    const filtered = companies
      .filter(company =>
        company.ticker.includes(query) ||
        company.name.toLowerCase().includes(query) ||
        company.jp.includes(query) ||
        company.sector.toLowerCase().includes(query)
      )
      .sort((a, b) => b.score - a.score);

    companyView.innerHTML = `
      <article class="company-directory">
        <div class="directory-head">
          <div>
            <p class="section-label">Company Directory</p>
            <h2>評価対象企業</h2>
          </div>
          <p class="muted">${filtered.length} companies</p>
        </div>

        <div class="directory-list">
          ${
            filtered.length
              ? filtered.map(company => `
                <article class="directory-card">
                  <div class="directory-top">
                    <div>
                      <p class="section-label">
                        ${company.ticker} · ${company.sector}
                      </p>
                      <h3>${company.name}</h3>
                      <p class="directory-meta">${company.jp}</p>
                    </div>

                    <div class="grade-block">
                      <span class="grade ${gradeClass(company.grade)}">
                        ${company.grade}
                      </span>
                      <strong>${company.score}</strong><small>/100</small>
                    </div>
                  </div>

                  <p class="directory-copy">${company.description}</p>

                  <button
                    class="open-company"
                    data-ticker="${company.ticker}"
                  >
                    詳細を見る
                  </button>
                </article>
              `).join('')
              : '<p class="empty-results">該当する企業は見つかりませんでした。</p>'
          }
        </div>
      </article>
    `;
  }

  function showDashboard() {
    heroGridEl.style.display = '';
    contentGridEl.style.display = '';
    companyView.style.display = 'none';

    setTitle(
      'Japanese Equities Intelligence',
      '企業を、鑑賞する。'
    );
  }

  function showCompanies() {
    heroGridEl.style.display = 'none';
    contentGridEl.style.display = 'none';
    companyView.style.display = 'grid';

    setTitle(
      'Company Directory',
      '企業一覧'
    );

    renderCompaniesDirectory();
  }

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.section === 'companies') {
        showCompanies();
      }

      if (button.dataset.section === 'dashboard') {
        showDashboard();
      }
    });
  });

  searchInput.addEventListener('input', () => {
    if (companyView.style.display !== 'none') {
      renderCompaniesDirectory();
    }
  });

  companyView.addEventListener('click', event => {
    const button = event.target.closest('.open-company');

    if (!button) return;

    const company = companies.find(
      item => item.ticker === button.dataset.ticker
    );

    renderDetail(company);

    document
      .querySelector('[data-section="dashboard"]')
      .click();
  });

  document.addEventListener('keydown', event => {
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === 'k'
    ) {
      event.preventDefault();
      searchInput.focus();
    }
  });
})();


/* ---- Company Lens: Rankings view ---- */
(() => {
  const topbarEl = document.querySelector('.topbar');
  const heroGridEl = document.querySelector('.hero-grid');
  const contentGridEl = document.querySelector('.content-grid');
  const companyView = document.querySelector('#companiesView');
  const navButtons = document.querySelectorAll('.nav-item');
  const searchInputEl = document.querySelector('#searchInput');

  const rankingView = document.createElement('section');
  rankingView.id = 'rankingsView';
  rankingView.style.display = 'none';

  (companyView || topbarEl).insertAdjacentElement('afterend', rankingView);

  const rankingStyle = document.createElement('style');

  rankingStyle.textContent = `
    #rankingsView {
      display: grid;
      gap: 18px;
    }

    .rankings-shell {
      border: 1px solid var(--line);
      border-radius: 28px;
      padding: 24px;
      background:
        radial-gradient(circle at 92% 8%, rgba(221, 186, 97, 0.12), transparent 27%),
        linear-gradient(145deg, rgba(255,255,255,.08), rgba(255,255,255,.025));
      box-shadow: var(--shadow);
    }

    .ranking-head {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      align-items: flex-end;
      margin-bottom: 22px;
    }

    .ranking-head h2 {
      margin: 4px 0 0;
      font-size: clamp(32px, 4vw, 52px);
      letter-spacing: -0.06em;
    }

    .ranking-head p {
      max-width: 460px;
      margin: 0;
      color: var(--muted);
      line-height: 1.8;
    }

    .ranking-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 18px 0;
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
    }

    .ranking-tab {
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 10px 14px;
      background: rgba(255,255,255,.03);
      color: var(--muted);
      font: inherit;
      font-weight: 800;
      cursor: pointer;
    }

    .ranking-tab:hover,
    .ranking-tab.active {
      border-color: var(--gold);
      background: var(--gold);
      color: #1a160e;
    }

    .ranking-summary {
      display: grid;
      grid-template-columns: minmax(0, 1.35fr) minmax(190px, .65fr);
      gap: 14px;
      margin: 20px 0;
    }

    .ranking-leader,
    .ranking-average {
      border: 1px solid var(--line);
      border-radius: 22px;
      padding: 20px;
      background: rgba(0,0,0,.13);
    }

    .ranking-leader-top {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: flex-start;
    }

    .ranking-leader h3 {
      margin: 7px 0 4px;
      font-size: 28px;
    }

    .ranking-leader p {
      margin: 0;
      color: var(--muted);
    }

    .leader-score {
      text-align: right;
      white-space: nowrap;
    }

    .leader-score .grade {
      display: inline-block;
      margin-right: 8px;
      font-size: 22px;
    }

    .leader-score strong,
    .ranking-average strong {
      font-size: 42px;
      letter-spacing: -0.06em;
    }

    .leader-score small,
    .ranking-average small {
      color: var(--muted);
      font-weight: 800;
    }

    .leader-copy {
      margin-top: 18px !important;
      color: var(--soft) !important;
      line-height: 1.8;
    }

    .ranking-average {
      display: grid;
      align-content: center;
      text-align: center;
    }

    .ranking-average p {
      margin: 0 0 8px;
      color: var(--gold);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .13em;
    }

    .ranking-average span {
      margin-top: 8px;
      color: var(--muted);
      font-size: 13px;
    }

    .ranking-list {
      display: grid;
    }

    .ranking-row {
      width: 100%;
      display: grid;
      grid-template-columns: 54px minmax(190px, 1fr) minmax(130px, .8fr) 126px;
      gap: 16px;
      align-items: center;
      border: 0;
      border-bottom: 1px solid var(--line);
      padding: 18px 8px;
      background: transparent;
      color: inherit;
      text-align: left;
      font: inherit;
      cursor: pointer;
      transition: background .18s ease, transform .18s ease;
    }

    .ranking-row:first-child {
      border-top: 1px solid var(--line);
    }

    .ranking-row:hover {
      background: rgba(255,255,255,.045);
      transform: translateX(4px);
    }

    .rank-position {
      color: var(--gold);
      font-size: 17px;
      font-weight: 900;
      letter-spacing: -.04em;
    }

    .rank-company {
      display: grid;
      gap: 5px;
    }

    .rank-company strong {
      font-size: 18px;
    }

    .rank-company small {
      color: var(--muted);
      font-size: 13px;
    }

    .rank-meter {
      display: block;
      height: 7px;
      overflow: hidden;
      border-radius: 999px;
      background: rgba(255,255,255,.08);
    }

    .rank-meter span {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, var(--gold), #f3d67f);
    }

    .rank-score {
      text-align: right;
      white-space: nowrap;
    }

    .rank-score .grade {
      margin-right: 6px;
      font-size: 18px;
    }

    .rank-score strong {
      font-size: 28px;
      letter-spacing: -.06em;
    }

    .rank-score small {
      color: var(--muted);
      font-weight: 800;
    }

    .ranking-empty {
      padding: 50px 14px;
      color: var(--muted);
      text-align: center;
    }

    @media (max-width: 820px) {
      .ranking-head,
      .ranking-leader-top {
        align-items: flex-start;
        flex-direction: column;
      }

      .leader-score {
        text-align: left;
      }

      .ranking-summary {
        grid-template-columns: 1fr;
      }

      .ranking-row {
        grid-template-columns: 38px minmax(0, 1fr) 86px;
      }

      .rank-meter {
        display: none;
      }
    }
  `;

  document.head.appendChild(rankingStyle);

  const metrics = [
    {
      key: 'score',
      label: '総合評価',
      english: 'Overall Quality',
      description: '収益性・安全性・成長性・割安度・株主還元を統合した、Company Lensの総合企業品質スコアです。'
    },
    {
      key: 'profitability',
      label: '収益性',
      english: 'Profitability',
      description: '利益率や資本効率を中心に、企業がどれだけ強く利益を生み出せているかを評価します。'
    },
    {
      key: 'safety',
      label: '安全性',
      english: 'Financial Health',
      description: '財務基盤・負債水準・資金余力など、長期的に事業を維持できる強さを評価します。'
    },
    {
      key: 'growth',
      label: '成長性',
      english: 'Growth',
      description: '売上・利益・事業機会の伸びをもとに、今後の拡大余地を評価します。'
    },
    {
      key: 'valuation',
      label: '割安度',
      english: 'Valuation',
      description: '企業の質に対して、現在の評価がどれほど魅力的かを示す参考スコアです。'
    },
    {
      key: 'shareholder',
      label: '株主還元',
      english: 'Shareholder Return',
      description: '配当・自社株買い・資本政策など、株主への還元姿勢を評価します。'
    }
  ];

  let activeMetric = 'score';

  function scoreOf(company, metricKey) {
    return metricKey === 'score'
      ? company.score
      : company.metrics[metricKey];
  }

  function gradeFromScore(score) {
    if (score >= 95) return 'S';
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    return 'C';
  }

  function gradeStyle(grade) {
    if (grade === 'S') return 'grade-s';
    if (grade.includes('A')) return 'grade-a';
    if (grade.includes('B')) return 'grade-b';
    return 'grade-c';
  }

  function matchesSearch(company, query) {
    return (
      company.ticker.includes(query) ||
      company.name.toLowerCase().includes(query) ||
      company.jp.includes(query) ||
      company.sector.toLowerCase().includes(query)
    );
  }

  function setPageTitle(eyebrow, title) {
    document.querySelector('.eyebrow').textContent = eyebrow;
    document.querySelector('.topbar h1').textContent = title;
  }

  function renderRankings() {
    const currentMetric = metrics.find(item => item.key === activeMetric);
    const query = searchInputEl.value.trim().toLowerCase();

    const rankedCompanies = companies
      .filter(company => matchesSearch(company, query))
      .sort((a, b) => scoreOf(b, activeMetric) - scoreOf(a, activeMetric));

    const leader = rankedCompanies[0];

    const average = rankedCompanies.length
      ? Math.round(
          rankedCompanies.reduce(
            (sum, company) => sum + scoreOf(company, activeMetric),
            0
          ) / rankedCompanies.length
        )
      : 0;

    rankingView.innerHTML = `
      <article class="rankings-shell">
        <div class="ranking-head">
          <div>
            <p class="section-label">${currentMetric.english}</p>
            <h2>企業品質ランキング</h2>
          </div>

          <p>${currentMetric.description}</p>
        </div>

        <div class="ranking-tabs">
          ${metrics.map(metric => `
            <button
              class="ranking-tab ${metric.key === activeMetric ? 'active' : ''}"
              type="button"
              data-metric="${metric.key}"
            >
              ${metric.label}
            </button>
          `).join('')}
        </div>

        ${
          leader
            ? `
              <div class="ranking-summary">
                <article class="ranking-leader">
                  <div class="ranking-leader-top">
                    <div>
                      <p class="section-label">NO. 01 · ${leader.ticker}</p>
                      <h3>${leader.name}</h3>
                      <p>${leader.jp} · ${leader.sector}</p>
                    </div>

                    <div class="leader-score">
                      <span class="grade ${gradeStyle(gradeFromScore(scoreOf(leader, activeMetric)))}">
                        ${gradeFromScore(scoreOf(leader, activeMetric))}
                      </span>
                      <strong>${scoreOf(leader, activeMetric)}</strong>
                      <small>/100</small>
                    </div>
                  </div>

                  <p class="leader-copy">${leader.description}</p>
                </article>

                <article class="ranking-average">
                  <p>MARKET AVERAGE</p>
                  <div>
                    <strong>${average}</strong>
                    <small>/100</small>
                  </div>
                  <span>${rankedCompanies.length} companies evaluated</span>
                </article>
              </div>

              <div class="ranking-list">
                ${rankedCompanies.map((company, index) => {
                  const score = scoreOf(company, activeMetric);
                  const grade = gradeFromScore(score);

                  return `
                    <button
                      class="ranking-row"
                      type="button"
                      data-ticker="${company.ticker}"
                    >
                      <span class="rank-position">
                        ${String(index + 1).padStart(2, '0')}
                      </span>

                      <span class="rank-company">
                        <strong>${company.name}</strong>
                        <small>${company.ticker} · ${company.jp} · ${company.sector}</small>
                      </span>

                      <span class="rank-meter">
                        <span style="width: ${score}%"></span>
                      </span>

                      <span class="rank-score">
                        <span class="grade ${gradeStyle(grade)}">${grade}</span>
                        <strong>${score}</strong>
                        <small>/100</small>
                      </span>
                    </button>
                  `;
                }).join('')}
              </div>
            `
            : `
              <p class="ranking-empty">
                該当する企業は見つかりませんでした。
              </p>
            `
        }
      </article>
    `;
  }

  function showRankings() {
    heroGridEl.style.display = 'none';
    contentGridEl.style.display = 'none';

    if (companyView) {
      companyView.style.display = 'none';
    }

    rankingView.style.display = 'grid';

    setPageTitle(
      'Market Quality Index',
      '企業品質ランキング'
    );

    renderRankings();
  }

  function showDashboard(company) {
    rankingView.style.display = 'none';

    if (companyView) {
      companyView.style.display = 'none';
    }

    heroGridEl.style.display = '';
    contentGridEl.style.display = '';

    setPageTitle(
      'Japanese Equities Intelligence',
      '企業を、鑑賞する。'
    );

    navButtons.forEach(button => {
      button.classList.toggle(
        'active',
        button.dataset.section === 'dashboard'
      );
    });

    renderDetail(company);
  }

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.section === 'rankings') {
        showRankings();
      }
    });
  });

  searchInputEl.addEventListener('input', () => {
    if (rankingView.style.display !== 'none') {
      renderRankings();
    }
  });

  rankingView.addEventListener('click', event => {
    const tab = event.target.closest('.ranking-tab');

    if (tab) {
      activeMetric = tab.dataset.metric;
      renderRankings();
      return;
    }

    const row = event.target.closest('.ranking-row');

    if (!row) return;

    const company = companies.find(
      item => item.ticker === row.dataset.ticker
    );

    showDashboard(company);
  });
})();


/* ---- Company Lens: Compare view ---- */
(() => {
  const topbarEl = document.querySelector('.topbar');
  const heroGridEl = document.querySelector('.hero-grid');
  const contentGridEl = document.querySelector('.content-grid');
  const companyView = document.querySelector('#companiesView');
  const rankingView = document.querySelector('#rankingsView');
  const navButtons = document.querySelectorAll('.nav-item');

  const compareView = document.createElement('section');
  compareView.id = 'compareView';
  compareView.style.display = 'none';

  (rankingView || companyView || topbarEl).insertAdjacentElement(
    'afterend',
    compareView
  );

  const compareStyle = document.createElement('style');

  compareStyle.textContent = `
    #compareView {
      display: grid;
      gap: 18px;
    }

    .compare-shell {
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 28px;
      padding: 24px;
      background:
        radial-gradient(
          circle at 8% 0%,
          rgba(221, 186, 97, .13),
          transparent 29%
        ),
        radial-gradient(
          circle at 94% 90%,
          rgba(125, 201, 151, .10),
          transparent 24%
        ),
        linear-gradient(
          145deg,
          rgba(255,255,255,.08),
          rgba(255,255,255,.025)
        );
      box-shadow: var(--shadow);
    }

    .compare-head {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      align-items: end;
      margin-bottom: 22px;
    }

    .compare-head h2 {
      margin: 4px 0 0;
      font-size: clamp(32px, 4vw, 52px);
      letter-spacing: -.06em;
    }

    .compare-head p {
      max-width: 470px;
      margin: 0;
      color: var(--muted);
      line-height: 1.8;
    }

    .compare-picker {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
      gap: 12px;
      align-items: end;
      padding: 18px 0;
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
    }

    .picker-field {
      display: grid;
      gap: 8px;
    }

    .picker-field span {
      color: var(--gold);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .13em;
      text-transform: uppercase;
    }

    .picker-field select {
      width: 100%;
      min-height: 48px;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: rgba(0,0,0,.19);
      color: var(--text);
      padding: 0 13px;
      font: inherit;
      font-weight: 800;
    }

    .swap-button {
      min-height: 48px;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: rgba(255,255,255,.045);
      color: var(--gold);
      padding: 0 16px;
      font: inherit;
      font-weight: 900;
      cursor: pointer;
      transition: transform .18s ease, border-color .18s ease;
    }

    .swap-button:hover {
      transform: translateY(-2px);
      border-color: var(--gold);
    }

    .compare-spotlight {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 82px minmax(0, 1fr);
      gap: 14px;
      align-items: stretch;
      margin: 20px 0;
    }

    .compare-company-card {
      border: 1px solid var(--line);
      border-radius: 22px;
      padding: 20px;
      background: rgba(0,0,0,.13);
    }

    .compare-company-top {
      display: flex;
      justify-content: space-between;
      gap: 14px;
      align-items: flex-start;
    }

    .compare-company-card h3 {
      margin: 7px 0 4px;
      font-size: 28px;
      letter-spacing: -.04em;
    }

    .compare-company-card .company-meta {
      margin: 0;
      color: var(--muted);
      font-size: 14px;
    }

    .compare-score {
      text-align: right;
      white-space: nowrap;
    }

    .compare-score .grade {
      display: inline-block;
      margin-right: 6px;
      font-size: 21px;
    }

    .compare-score strong {
      font-size: 40px;
      letter-spacing: -.07em;
    }

    .compare-score small {
      color: var(--muted);
      font-weight: 800;
    }

    .compare-company-card .company-copy {
      min-height: 52px;
      margin: 17px 0;
      color: var(--soft);
      line-height: 1.75;
    }

    .compare-detail-button {
      border: 1px solid var(--gold);
      border-radius: 12px;
      background: transparent;
      color: var(--gold);
      padding: 10px 13px;
      font: inherit;
      font-weight: 900;
      cursor: pointer;
    }

    .compare-detail-button:hover {
      background: var(--gold);
      color: #17140d;
    }

    .vs-mark {
      display: grid;
      place-items: center;
      align-content: center;
      color: var(--gold);
      font-size: 15px;
      font-weight: 900;
      letter-spacing: .12em;
    }

    .vs-mark::before,
    .vs-mark::after {
      content: "";
      width: 1px;
      height: 32px;
      background: var(--line);
    }

    .compare-insight {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }

    .insight-chip {
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 15px 16px;
      background: rgba(255,255,255,.035);
    }

    .insight-chip span {
      display: block;
      margin-bottom: 6px;
      color: var(--gold);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .13em;
    }

    .insight-chip strong {
      display: block;
      font-size: 16px;
    }

    .insight-chip p {
      margin: 6px 0 0;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.7;
    }

    .compare-metrics {
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 22px;
      background: rgba(0,0,0,.12);
    }

    .compare-metric-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 160px minmax(0, 1fr);
      gap: 16px;
      align-items: center;
      padding: 17px 18px;
      border-bottom: 1px solid var(--line);
    }

    .compare-metric-row:last-child {
      border-bottom: 0;
    }

    .compare-side {
      display: grid;
      gap: 8px;
    }

    .compare-side.right {
      text-align: right;
    }

    .compare-number {
      font-size: 23px;
      font-weight: 900;
      letter-spacing: -.06em;
    }

    .compare-number.is-winner {
      color: var(--gold);
    }

    .compare-bar {
      height: 7px;
      overflow: hidden;
      border-radius: 999px;
      background: rgba(255,255,255,.08);
    }

    .compare-bar span {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: rgba(255,255,255,.35);
    }

    .compare-side .compare-bar span.is-winner {
      background: linear-gradient(90deg, var(--gold), #f3d67f);
    }

    .compare-side.right .compare-bar {
      transform: scaleX(-1);
    }

    .compare-metric-label {
      text-align: center;
    }

    .compare-metric-label span {
      display: block;
      color: var(--text);
      font-weight: 900;
    }

    .compare-metric-label small {
      display: block;
      margin-top: 4px;
      color: var(--muted);
      font-size: 11px;
      letter-spacing: .08em;
    }

    @media (max-width: 820px) {
      .compare-head {
        align-items: flex-start;
        flex-direction: column;
      }

      .compare-picker,
      .compare-spotlight {
        grid-template-columns: 1fr;
      }

      .swap-button {
        width: 100%;
      }

      .vs-mark {
        grid-template-columns: 1fr auto 1fr;
        grid-auto-flow: column;
      }

      .vs-mark::before,
      .vs-mark::after {
        width: 32px;
        height: 1px;
      }

      .compare-metric-row {
        grid-template-columns: minmax(0, 1fr) 90px minmax(0, 1fr);
        gap: 10px;
        padding: 15px 12px;
      }

      .compare-metric-label span {
        font-size: 12px;
      }

      .compare-metric-label small {
        display: none;
      }
    }
  `;

  document.head.appendChild(compareStyle);

  const metrics = [
    {
      key: 'score',
      label: '総合評価',
      english: 'OVERALL'
    },
    {
      key: 'profitability',
      label: '収益性',
      english: 'PROFITABILITY'
    },
    {
      key: 'safety',
      label: '安全性',
      english: 'SAFETY'
    },
    {
      key: 'growth',
      label: '成長性',
      english: 'GROWTH'
    },
    {
      key: 'valuation',
      label: '割安度',
      english: 'VALUATION'
    },
    {
      key: 'shareholder',
      label: '株主還元',
      english: 'RETURN'
    }
  ];

  let leftTicker = '7203';
  let rightTicker = '6758';

  function scoreOf(company, metricKey) {
    return metricKey === 'score'
      ? company.score
      : company.metrics[metricKey];
  }

  function gradeFromScore(score) {
    if (score >= 95) return 'S';
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    return 'C';
  }

  function gradeStyle(grade) {
    if (grade === 'S') return 'grade-s';
    if (grade.includes('A')) return 'grade-a';
    if (grade.includes('B')) return 'grade-b';
    return 'grade-c';
  }

  function optionList(currentTicker) {
    return companies.map(company => `
      <option
        value="${company.ticker}"
        ${company.ticker === currentTicker ? 'selected' : ''}
      >
        ${company.ticker} · ${company.name}
      </option>
    `).join('');
  }

  function resolveCompanies() {
    const left = companies.find(
      company => company.ticker === leftTicker
    ) || companies[0];

    let right = companies.find(
      company => company.ticker === rightTicker
    ) || companies[1];

    if (left.ticker === right.ticker) {
      right = companies.find(
        company => company.ticker !== left.ticker
      ) || companies[0];

      rightTicker = right.ticker;
    }

    return { left, right };
  }

  function biggestStrength(company, other) {
    return metrics
      .filter(metric => metric.key !== 'score')
      .map(metric => ({
        ...metric,
        difference:
          scoreOf(company, metric.key) -
          scoreOf(other, metric.key)
      }))
      .sort((a, b) => b.difference - a.difference)[0];
  }

  function renderCompare() {
    const { left, right } = resolveCompanies();

    const leftStrength = biggestStrength(left, right);
    const rightStrength = biggestStrength(right, left);

    compareView.innerHTML = `
      <article class="compare-shell">
        <div class="compare-head">
          <div>
            <p class="section-label">Comparison Studio</p>
            <h2>2社を並べて見る</h2>
          </div>

          <p>
            同じ評価軸で企業を見比べる。
            それぞれの強みと、企業品質の違いを一目で確認できます。
          </p>
        </div>

        <div class="compare-picker">
          <label class="picker-field">
            <span>LEFT COMPANY</span>
            <select id="compareLeftSelect">
              ${optionList(left.ticker)}
            </select>
          </label>

          <button
            class="swap-button"
            id="swapCompareButton"
            type="button"
          >
            ⇄ 入れ替える
          </button>

          <label class="picker-field">
            <span>RIGHT COMPANY</span>
            <select id="compareRightSelect">
              ${optionList(right.ticker)}
            </select>
          </label>
        </div>

        <div class="compare-spotlight">
          <article class="compare-company-card">
            <div class="compare-company-top">
              <div>
                <p class="section-label">
                  ${left.ticker} · ${left.sector}
                </p>
                <h3>${left.name}</h3>
                <p class="company-meta">${left.jp}</p>
              </div>

              <div class="compare-score">
                <span class="grade ${gradeStyle(left.grade)}">
                  ${left.grade}
                </span>
                <strong>${left.score}</strong>
                <small>/100</small>
              </div>
            </div>

            <p class="company-copy">${left.description}</p>

            <button
              class="compare-detail-button"
              type="button"
              data-company-detail="${left.ticker}"
            >
              詳細を見る
            </button>
          </article>

          <div class="vs-mark">VS</div>

          <article class="compare-company-card">
            <div class="compare-company-top">
              <div>
                <p class="section-label">
                  ${right.ticker} · ${right.sector}
                </p>
                <h3>${right.name}</h3>
                <p class="company-meta">${right.jp}</p>
              </div>

              <div class="compare-score">
                <span class="grade ${gradeStyle(right.grade)}">
                  ${right.grade}
                </span>
                <strong>${right.score}</strong>
                <small>/100</small>
              </div>
            </div>

            <p class="company-copy">${right.description}</p>

            <button
              class="compare-detail-button"
              type="button"
              data-company-detail="${right.ticker}"
            >
              詳細を見る
            </button>
          </article>
        </div>

        <div class="compare-insight">
          <article class="insight-chip">
            <span>${left.name.toUpperCase()} の優位項目</span>
            <strong>${leftStrength.label}</strong>
            <p>
              ${right.name}より
              ${Math.max(leftStrength.difference, 0)}
              ポイント高い評価です。
            </p>
          </article>

          <article class="insight-chip">
            <span>${right.name.toUpperCase()} の優位項目</span>
            <strong>${rightStrength.label}</strong>
            <p>
              ${left.name}より
              ${Math.max(rightStrength.difference, 0)}
              ポイント高い評価です。
            </p>
          </article>
        </div>

        <section class="compare-metrics">
          ${metrics.map(metric => {
            const leftScore = scoreOf(left, metric.key);
            const rightScore = scoreOf(right, metric.key);
            const leftWins = leftScore > rightScore;
            const rightWins = rightScore > leftScore;

            return `
              <article class="compare-metric-row">
                <div class="compare-side left">
                  <strong
                    class="compare-number ${leftWins ? 'is-winner' : ''}"
                  >
                    ${leftScore}
                  </strong>

                  <div class="compare-bar">
                    <span
                      class="${leftWins ? 'is-winner' : ''}"
                      style="width:${leftScore}%"
                    ></span>
                  </div>
                </div>

                <div class="compare-metric-label">
                  <span>${metric.label}</span>
                  <small>${metric.english}</small>
                </div>

                <div class="compare-side right">
                  <strong
                    class="compare-number ${rightWins ? 'is-winner' : ''}"
                  >
                    ${rightScore}
                  </strong>

                  <div class="compare-bar">
                    <span
                      class="${rightWins ? 'is-winner' : ''}"
                      style="width:${rightScore}%"
                    ></span>
                  </div>
                </div>
              </article>
            `;
          }).join('')}
        </section>
      </article>
    `;
  }

  function setCompareHeader() {
    document.querySelector('.eyebrow').textContent =
      'Comparison Studio';

    document.querySelector('.topbar h1').textContent =
      '企業を、比べる。';
  }

  function showCompare() {
    heroGridEl.style.display = 'none';
    contentGridEl.style.display = 'none';

    if (companyView) {
      companyView.style.display = 'none';
    }

    if (rankingView) {
      rankingView.style.display = 'none';
    }

    compareView.style.display = 'grid';

    setCompareHeader();
    renderCompare();
  }

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.section === 'compare') {
        showCompare();
      }
    });
  });

  compareView.addEventListener('change', event => {
    if (event.target.id === 'compareLeftSelect') {
      leftTicker = event.target.value;
      renderCompare();
    }

    if (event.target.id === 'compareRightSelect') {
      rightTicker = event.target.value;
      renderCompare();
    }
  });

  compareView.addEventListener('click', event => {
    const swapButton = event.target.closest('#swapCompareButton');

    if (swapButton) {
      const previousLeft = leftTicker;
      leftTicker = rightTicker;
      rightTicker = previousLeft;
      renderCompare();
      return;
    }

    const detailButton = event.target.closest('[data-company-detail]');

    if (!detailButton) return;

    const company = companies.find(
      item => item.ticker === detailButton.dataset.companyDetail
    );

    renderDetail(company);

    document
      .querySelector('[data-section="dashboard"]')
      .click();
  });
})();
