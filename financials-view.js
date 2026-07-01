/* =========================================================
   Company Lens — Financials View v0.1
   スコア算定に使う基礎指標を、企業詳細の Financials タブで表示する。
   ========================================================= */

(() => {
  const detailPanel = document.querySelector('.detail-panel');
  const metricsEl = document.querySelector('#metrics');
  const analysisCard = document.querySelector('.analysis-card');
  const rationaleView = document.querySelector('#scoreRationale');
  const tabs = [...document.querySelectorAll('.detail-panel .tab')];

  if (!detailPanel || !metricsEl || !analysisCard || !tabs.length) return;

  const financialsView = document.createElement('section');
  financialsView.id = 'financialsView';
  financialsView.className = 'financials-view';
  financialsView.hidden = true;

  metricsEl.insertAdjacentElement('beforebegin', financialsView);

  const style = document.createElement('style');

  style.textContent = `
    .financials-view {
      display: grid;
      gap: 14px;
    }

.financials-view[hidden] {
  display: none !important;
}
    .financials-summary {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: flex-start;
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 18px;
      background: rgba(255,255,255,.035);
    }

    .financials-summary h3 {
      margin: 6px 0 8px;
      font-size: 21px;
      letter-spacing: -.04em;
    }

    .financials-summary p {
      max-width: 530px;
      margin: 0;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.8;
    }

    .financials-quality {
      min-width: 118px;
      text-align: right;
      white-space: nowrap;
    }

    .financials-quality span {
      display: block;
      color: var(--gold);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: .13em;
    }

    .financials-quality strong {
      display: inline-block;
      margin-top: 4px;
      font-size: 38px;
      letter-spacing: -.08em;
    }

    .financials-quality small {
      color: var(--muted);
      font-weight: 800;
    }

    .financials-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .financial-card {
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 17px;
      background: rgba(0,0,0,.13);
    }

    .financial-card-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
      margin-bottom: 13px;
    }

    .financial-card h4 {
      margin: 4px 0 0;
      font-size: 18px;
    }

    .financial-card-head span {
      color: var(--gold);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: .12em;
    }

    .financial-items {
      display: grid;
      gap: 0;
    }

    .financial-item {
      display: flex;
      justify-content: space-between;
      gap: 14px;
      align-items: baseline;
      padding: 10px 0;
      border-top: 1px solid var(--line);
    }

    .financial-item span {
      color: var(--muted);
      font-size: 13px;
    }

    .financial-item strong {
      font-size: 17px;
      letter-spacing: -.04em;
      white-space: nowrap;
    }

    .financial-map {
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 18px;
      background: rgba(0,0,0,.13);
    }

    .financial-map-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      padding: 16px 17px;
      border-bottom: 1px solid var(--line);
    }

    .financial-map-head h4 {
      margin: 4px 0 0;
      font-size: 18px;
    }

    .financial-map-head span {
      color: var(--gold);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: .12em;
    }

    .financial-map-row {
      display: grid;
      grid-template-columns: 112px minmax(0, 1fr) 48px;
      gap: 12px;
      align-items: center;
      padding: 13px 17px;
      border-bottom: 1px solid var(--line);
    }

    .financial-map-row:last-child {
      border-bottom: 0;
    }

    .financial-map-row span {
      font-weight: 800;
    }

    .financial-map-row p {
      margin: 0;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.65;
    }

    .financial-map-row strong {
      color: var(--gold);
      text-align: right;
      font-size: 18px;
      letter-spacing: -.05em;
    }

    .financials-note {
      margin: 0;
      color: var(--muted);
      font-size: 11px;
      line-height: 1.75;
    }

    @media (max-width: 700px) {
      .financials-summary {
        display: grid;
      }

      .financials-quality {
        text-align: left;
      }

      .financials-grid {
        grid-template-columns: 1fr;
      }

      .financial-map-row {
        grid-template-columns: 86px minmax(0, 1fr) 40px;
        gap: 8px;
        padding: 13px;
      }

      .financial-map-row p {
        display: none;
      }
    }
  `;

  document.head.appendChild(style);

  function formatNetDebt(value) {
    if (value < 0) {
      return `ネットキャッシュ ${Math.abs(value).toFixed(1)}×`;
    }

    return `${value.toFixed(1)}×`;
  }

  const groups = [
    {
      eyebrow: 'PROFITABILITY',
      title: '収益性の原データ',
      items: [
        ['ROE', 'roe', value => `${value.toFixed(1)}%`],
        ['営業利益率', 'operatingMargin', value => `${value.toFixed(1)}%`]
      ]
    },
    {
      eyebrow: 'FINANCIAL HEALTH',
      title: '財務安全性の原データ',
      items: [
        ['自己資本比率', 'equityRatio', value => `${value.toFixed(1)}%`],
        ['ネット有利子負債 / EBITDA', 'netDebtToEbitda', formatNetDebt]
      ]
    },
    {
      eyebrow: 'GROWTH',
      title: '3年成長率',
      items: [
        ['売上高 CAGR', 'revenueCagr3y', value => `${value.toFixed(1)}%`],
        ['利益 CAGR', 'profitCagr3y', value => `${value.toFixed(1)}%`]
      ]
    },
    {
      eyebrow: 'MARKET VALUATION',
      title: '市場評価',
      items: [
        ['PER', 'per', value => `${value.toFixed(1)}×`],
        ['PBR', 'pbr', value => `${value.toFixed(1)}×`]
      ]
    },
    {
      eyebrow: 'SHAREHOLDER RETURN',
      title: '株主還元',
      items: [
        ['配当利回り', 'dividendYield', value => `${value.toFixed(1)}%`],
        ['配当性向', 'payoutRatio', value => `${value.toFixed(0)}%`],
        ['自社株買い利回り', 'buybackYield', value => `${value.toFixed(1)}%`]
      ]
    }
  ];

  const scoreMap = [
    ['収益性', 'ROE 50% ＋ 営業利益率 50%', 'profitability'],
    ['安全性', '自己資本比率 55% ＋ ネット有利子負債 / EBITDA 45%', 'safety'],
    ['成長性', '売上高 CAGR 50% ＋ 利益 CAGR 50%', 'growth'],
    ['割安度', 'PER 45% ＋ PBR 35% ＋ 配当利回り 20%', 'valuation'],
    ['株主還元', '配当利回り 35% ＋ 配当性向 40% ＋ 自社株買い 25%', 'shareholder']
  ];

  let activeTab = 'Overview';

  function renderGroup(group, fundamentals) {
    return `
      <article class="financial-card">
        <div class="financial-card-head">
          <div>
            <span>${group.eyebrow}</span>
            <h4>${group.title}</h4>
          </div>
        </div>

        <div class="financial-items">
          ${group.items.map(([label, key, formatter]) => `
            <div class="financial-item">
              <span>${label}</span>
              <strong>${formatter(fundamentals[key])}</strong>
            </div>
          `).join('')}
        </div>
      </article>
    `;
  }

  function renderFinancials(company) {
    const fundamentals = company.fundamentals;

    if (!fundamentals) {
      financialsView.innerHTML = `
        <p class="financials-note">
          この企業の基礎指標データはまだ用意されていません。
        </p>
      `;
      return;
    }

    financialsView.innerHTML = `
      <article class="financials-summary">
        <div>
          <p class="section-label">RAW FUNDAMENTALS</p>
          <h3>${company.jp}の採点に使った数値</h3>
          <p>
            ここでは、Company Lensの各スコアをつくる前段の指標を表示しています。
            数字を確認してから、評価の根拠を読むための画面です。
          </p>
        </div>

        <div class="financials-quality">
          <span>COMPANY QUALITY</span>
          <strong>${company.score}</strong><small>/100</small>
        </div>
      </article>

      <div class="financials-grid">
        ${groups.map(group => renderGroup(group, fundamentals)).join('')}
      </div>

      <article class="financial-map">
        <div class="financial-map-head">
          <div>
            <span>SCORING MAP</span>
            <h4>数値が評価へ変わる仕組み</h4>
          </div>
        </div>

        ${scoreMap.map(([label, formula, key]) => `
          <div class="financial-map-row">
            <span>${label}</span>
            <p>${formula}</p>
            <strong>${company.metrics[key]}</strong>
          </div>
        `).join('')}
      </article>

      <p class="financials-note">
        ※ 現在はプロトタイプ用のサンプル財務データです。実データ接続後は、決算・市場価格の更新にあわせてこの画面も更新されます。
      </p>
    `;
  }

  function showTab(tabName) {
    activeTab = tabName;

    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.textContent.trim() === tabName);
    });

    const isFinancials = tabName === 'Financials';
    const isAnalysis = tabName === 'AI Analysis';

    financialsView.hidden = !isFinancials;
    metricsEl.hidden = isFinancials || isAnalysis;
    analysisCard.hidden = isFinancials;

    if (rationaleView) {
      rationaleView.style.display =
        tabName === 'Overview' ? 'grid' : 'none';
    }

    const label = analysisCard.querySelector('.section-label');

    if (label) {
      label.textContent =
        isAnalysis ? 'AI ANALYSIS' : 'AI Insight';
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      showTab(tab.textContent.trim());
    });
  });

  const previousRenderDetail = renderDetail;

  renderDetail = function(company) {
    previousRenderDetail(company);
    renderFinancials(company);
    showTab(activeTab);
  };

  renderFinancials(selected);
  showTab('Overview');
})();
