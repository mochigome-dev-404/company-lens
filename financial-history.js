/* =========================================================
   Company Lens — Financial History v0.1
   Financialsタブに、企業の5年推移を表示する。
   現在はプロトタイプ用のサンプル履歴データ。
   ========================================================= */

(() => {
  const financialsView = document.querySelector('#financialsView');
  const tabs = [...document.querySelectorAll('.detail-panel .tab')];

  if (!financialsView || !tabs.length) return;

  const historyView = document.createElement('section');
  historyView.id = 'financialHistoryView';
  historyView.className = 'financial-history-view';
  historyView.hidden = true;

  financialsView.insertAdjacentElement('afterend', historyView);

  const style = document.createElement('style');

  style.textContent = `
    .financial-history-view {
      display: grid;
      gap: 14px;
      margin-top: 14px;
    }

    .financial-history-view[hidden] {
      display: none !important;
    }

    .history-shell {
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 20px;
      background:
        radial-gradient(
          circle at 96% 0%,
          rgba(221, 186, 97, .14),
          transparent 31%
        ),
        linear-gradient(
          145deg,
          rgba(255,255,255,.06),
          rgba(255,255,255,.02)
        );
    }

    .history-head {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: flex-start;
      padding: 20px;
      border-bottom: 1px solid var(--line);
    }

    .history-head h3 {
      margin: 6px 0 0;
      font-size: 27px;
      letter-spacing: -.05em;
    }

    .history-head p {
      max-width: 350px;
      margin: 0;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.8;
    }

    .history-kpis {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      padding: 18px 20px;
    }

    .history-kpi {
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 15px;
      background: rgba(0,0,0,.13);
    }

    .history-kpi span {
      display: block;
      color: var(--gold);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: .13em;
    }

    .history-kpi strong {
      display: block;
      margin-top: 7px;
      font-size: 24px;
      letter-spacing: -.06em;
    }

    .history-kpi small {
      display: block;
      margin-top: 5px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.55;
    }

    .history-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      padding: 0 20px 18px;
    }

    .history-card {
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 18px;
      background: rgba(0,0,0,.12);
    }

    .history-card-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
      margin-bottom: 14px;
    }

    .history-card h4 {
      margin: 5px 0 0;
      font-size: 18px;
    }

    .history-card-head span {
      color: var(--gold);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: .13em;
    }

    .history-chart {
      display: block;
      width: 100%;
      height: auto;
      overflow: visible;
    }

    .history-gridline {
      stroke: rgba(255,255,255,.10);
      stroke-width: 1;
    }

    .history-axis-label {
      fill: rgba(255,255,255,.46);
      font-size: 11px;
      font-family: inherit;
    }

    .history-revenue-area {
      fill: url(#historyRevenueFill);
    }

    .history-revenue-line {
      fill: none;
      stroke: var(--gold);
      stroke-width: 4;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .history-revenue-point {
      fill: var(--gold);
      stroke: #151411;
      stroke-width: 3;
    }

    .history-roe-line {
      fill: none;
      stroke: var(--gold);
      stroke-width: 4;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .history-equity-line {
      fill: none;
      stroke: #8fd9a5;
      stroke-width: 4;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .history-roe-point {
      fill: var(--gold);
      stroke: #151411;
      stroke-width: 3;
    }

    .history-equity-point {
      fill: #8fd9a5;
      stroke: #151411;
      stroke-width: 3;
    }

    .history-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 12px;
      color: var(--muted);
      font-size: 12px;
    }

    .history-legend span {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .history-legend i {
      width: 9px;
      height: 9px;
      border-radius: 999px;
      background: var(--gold);
    }

    .history-legend i.equity {
      background: #8fd9a5;
    }

    .history-divider {
      height: 1px;
      margin: 0 20px;
      background: var(--line);
    }

    .history-dividend {
      padding: 18px 20px;
    }

    .history-dividend-head {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: flex-end;
      margin-bottom: 14px;
    }

    .history-dividend-head h4 {
      margin: 5px 0 0;
      font-size: 18px;
    }

    .history-dividend-head p {
      margin: 0;
      color: var(--muted);
      font-size: 12px;
    }

    .history-dividend-grid {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 8px;
    }

    .history-dividend-year {
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 12px 10px;
      background: rgba(255,255,255,.025);
      text-align: center;
    }

    .history-dividend-year span {
      display: block;
      color: var(--muted);
      font-size: 11px;
    }

    .history-dividend-year strong {
      display: block;
      margin-top: 6px;
      color: var(--gold);
      font-size: 17px;
      letter-spacing: -.05em;
    }

    .history-note {
      margin: 0;
      padding: 14px 20px 18px;
      border-top: 1px solid var(--line);
      color: var(--muted);
      font-size: 11px;
      line-height: 1.75;
    }

    @media (max-width: 820px) {
      .history-head {
        display: grid;
      }

      .history-kpis,
      .history-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 560px) {
      .history-head,
      .history-kpis,
      .history-grid,
      .history-dividend {
        padding-left: 14px;
        padding-right: 14px;
      }

      .history-divider {
        margin-left: 14px;
        margin-right: 14px;
      }

      .history-note {
        padding-left: 14px;
        padding-right: 14px;
      }

      .history-dividend-grid {
        gap: 5px;
      }

      .history-dividend-year {
        padding: 10px 5px;
      }

      .history-dividend-year strong {
        font-size: 14px;
      }
    }
  `;

  document.head.appendChild(style);

  /*
    数値の単位
    revenue / operatingProfit は「億円」。
    dividend は「1株あたり配当（円）」。
  */
  const historyByTicker = {
    '7203': {
      years: [2021, 2022, 2023, 2024, 2025],
      revenue: [272145, 313795, 371542, 451953, 480367],
      operatingProfit: [21972, 27250, 35295, 53529, 48000],
      roe: [8.4, 9.8, 10.9, 13.6, 12.5],
      equityRatio: [58, 58, 59, 60, 60],
      dividend: [200, 230, 300, 350, 350]
    },

    '6758': {
      years: [2021, 2022, 2023, 2024, 2025],
      revenue: [85800, 91100, 10000, 13020, 13000],
      operatingProfit: [9700, 12080, 12100, 12900, 13200],
      roe: [9.1, 10.2, 10.5, 11.8, 11.5],
      equityRatio: [49, 50, 50, 51, 50],
      dividend: [55, 65, 75, 85, 85]
    },

    '6861': {
      years: [2021, 2022, 2023, 2024, 2025],
      revenue: [5381, 7551, 9224, 9673, 10400],
      operatingProfit: [2781, 3900, 4800, 5000, 5300],
      roe: [15.2, 17.0, 18.1, 18.4, 18.0],
      equityRatio: [89, 90, 90, 90, 90],
      dividend: [180, 230, 280, 310, 340]
    },

    '7974': {
      years: [2021, 2022, 2023, 2024, 2025],
      revenue: [17589, 16953, 16016, 16710, 18800],
      operatingProfit: [6406, 5043, 5044, 5289, 5800],
      roe: [15.8, 13.7, 13.8, 14.1, 14.5],
      equityRatio: [83, 84, 85, 85, 85],
      dividend: [810, 1030, 1170, 1360, 1500]
    },

    '9984': {
      years: [2021, 2022, 2023, 2024, 2025],
      revenue: [56285, 62153, 67048, 67565, 70000],
      operatingProfit: [1496, 1060, 1000, 950, 1100],
      roe: [8.2, 5.9, 4.6, 5.2, 6.0],
      equityRatio: [18, 19, 20, 20, 20],
      dividend: [44, 44, 44, 44, 44]
    },

    '9432': {
      years: [2021, 2022, 2023, 2024, 2025],
      revenue: [118990, 119850, 121560, 131370, 13500],
      operatingProfit: [17950, 18280, 19210, 20130, 20500],
      roe: [8.4, 8.6, 8.9, 9.1, 9.0],
      equityRatio: [49, 49, 50, 50, 50],
      dividend: [4.4, 4.7, 5.0, 5.2, 5.2]
    }
  };

  function formatYenOku(value) {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}兆円`;
    }

    return `${value.toLocaleString('ja-JP')}億円`;
  }

  function percentChange(first, latest) {
    if (!first) return '—';

    const change = ((latest / first) - 1) * 100;
    const sign = change >= 0 ? '+' : '';

    return `${sign}${change.toFixed(0)}%`;
  }

  function pointsFor(values, minimum, maximum) {
    const width = 520;
    const height = 170;
    const left = 18;
    const right = 18;
    const top = 16;
    const bottom = 31;

    const range = Math.max(maximum - minimum, 1);

    return values.map((value, index) => {
      const x =
        left +
        ((width - left - right) / (values.length - 1)) * index;

      const y =
        top +
        ((maximum - value) / range) * (height - top - bottom);

      return {
        x: Number(x.toFixed(1)),
        y: Number(y.toFixed(1)),
        value
      };
    });
  }

  function pointString(points) {
    return points.map(point => `${point.x},${point.y}`).join(' ');
  }

  function labelSvg(years) {
    return years.map((year, index) => {
      const x = 18 + ((484 / (years.length - 1)) * index);

      return `
        <text
          class="history-axis-label"
          x="${x}"
          y="162"
          text-anchor="middle"
        >
          ${String(year).slice(2)}
        </text>
      `;
    }).join('');
  }

  function chartGrid() {
    return `
      <line class="history-gridline" x1="18" y1="32" x2="502" y2="32"></line>
      <line class="history-gridline" x1="18" y1="78" x2="502" y2="78"></line>
      <line class="history-gridline" x1="18" y1="124" x2="502" y2="124"></line>
    `;
  }

  function revenueChart(history) {
    const minimum = Math.min(...history.revenue) * 0.92;
    const maximum = Math.max(...history.revenue) * 1.06;
    const points = pointsFor(history.revenue, minimum, maximum);

    const first = points[0];
    const last = points[points.length - 1];

    const area = `
      ${pointString(points)}
      L ${last.x},139
      L ${first.x},139
      Z
    `;

    return `
      <svg
        class="history-chart"
        viewBox="0 0 520 170"
        role="img"
        aria-label="売上高の5年推移"
      >
        <defs>
          <linearGradient
            id="historyRevenueFill"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stop-color="#ddba61" stop-opacity=".38"></stop>
            <stop offset="100%" stop-color="#ddba61" stop-opacity="0"></stop>
          </linearGradient>
        </defs>

        ${chartGrid()}

        <polygon class="history-revenue-area" points="${area}"></polygon>

        <polyline
          class="history-revenue-line"
          points="${pointString(points)}"
        ></polyline>

        ${points.map(point => `
          <circle
            class="history-revenue-point"
            cx="${point.x}"
            cy="${point.y}"
            r="5"
          ></circle>
        `).join('')}

        ${labelSvg(history.years)}
      </svg>
    `;
  }

  function ratioChart(history) {
    const roePoints = pointsFor(history.roe, 0, 100);
    const equityPoints = pointsFor(history.equityRatio, 0, 100);

    return `
      <svg
        class="history-chart"
        viewBox="0 0 520 170"
        role="img"
        aria-label="ROEと自己資本比率の5年推移"
      >
        ${chartGrid()}

        <polyline
          class="history-roe-line"
          points="${pointString(roePoints)}"
        ></polyline>

        <polyline
          class="history-equity-line"
          points="${pointString(equityPoints)}"
        ></polyline>

        ${roePoints.map(point => `
          <circle
            class="history-roe-point"
            cx="${point.x}"
            cy="${point.y}"
            r="4.5"
          ></circle>
        `).join('')}

        ${equityPoints.map(point => `
          <circle
            class="history-equity-point"
            cx="${point.x}"
            cy="${point.y}"
            r="4.5"
          ></circle>
        `).join('')}

        ${labelSvg(history.years)}
      </svg>
    `;
  }

  function renderHistory(company) {
    const history = historyByTicker[company.ticker];

    if (!history) {
      historyView.innerHTML = `
        <p class="history-note">
          この企業の推移データはまだ用意されていません。
        </p>
      `;
      return;
    }

    const latestRevenue = history.revenue.at(-1);
    const latestOperatingProfit = history.operatingProfit.at(-1);
    const latestRoe = history.roe.at(-1);
    const latestEquityRatio = history.equityRatio.at(-1);

    historyView.innerHTML = `
      <article class="history-shell">
        <div class="history-head">
          <div>
            <p class="section-label">FINANCIAL HISTORY</p>
            <h3>${company.jp}の5年推移</h3>
          </div>

          <p>
            現在のスコアだけではなく、
            売上・利益・資本効率・財務体質が
            どの方向へ進んでいるかを見るためのタイムラインです。
          </p>
        </div>

        <section class="history-kpis">
          <article class="history-kpi">
            <span>REVENUE</span>
            <strong>${formatYenOku(latestRevenue)}</strong>
            <small>
              5年変化 ${percentChange(
                history.revenue[0],
                latestRevenue
              )}
            </small>
          </article>

          <article class="history-kpi">
            <span>OPERATING PROFIT</span>
            <strong>${formatYenOku(latestOperatingProfit)}</strong>
            <small>
              5年変化 ${percentChange(
                history.operatingProfit[0],
                latestOperatingProfit
              )}
            </small>
          </article>

          <article class="history-kpi">
            <span>CAPITAL EFFICIENCY</span>
            <strong>ROE ${latestRoe.toFixed(1)}%</strong>
            <small>
              自己資本比率 ${latestEquityRatio.toFixed(1)}%
            </small>
          </article>
        </section>

        <section class="history-grid">
          <article class="history-card">
            <div class="history-card-head">
              <div>
                <span>REVENUE TREND</span>
                <h4>売上高の推移</h4>
              </div>
            </div>

            ${revenueChart(history)}

            <div class="history-legend">
              <span><i></i> 売上高（億円）</span>
            </div>
          </article>

          <article class="history-card">
            <div class="history-card-head">
              <div>
                <span>QUALITY TREND</span>
                <h4>ROE・自己資本比率</h4>
              </div>
            </div>

            ${ratioChart(history)}

            <div class="history-legend">
              <span><i></i> ROE</span>
              <span><i class="equity"></i> 自己資本比率</span>
            </div>
          </article>
        </section>

        <div class="history-divider"></div>

        <section class="history-dividend">
          <div class="history-dividend-head">
            <div>
              <p class="section-label">SHAREHOLDER RETURN</p>
              <h4>1株あたり配当の推移</h4>
            </div>

            <p>単位：円</p>
          </div>

          <div class="history-dividend-grid">
            ${history.years.map((year, index) => `
              <article class="history-dividend-year">
                <span>${year}</span>
                <strong>¥${history.dividend[index]}</strong>
              </article>
            `).join('')}
          </div>
        </section>

        <p class="history-note">
          ※ 現在はプロトタイプ用のサンプル履歴データです。
          実データ接続後は、有価証券報告書・決算短信・市場データなどをもとに自動更新する設計へ進めます。
        </p>
      </article>
    `;
  }

  function activeTabName() {
    return (
      tabs.find(tab => tab.classList.contains('active'))
        ?.textContent
        .trim() || 'Overview'
    );
  }

  function updateHistoryVisibility(tabName) {
    historyView.hidden = tabName !== 'Financials';
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      updateHistoryVisibility(tab.textContent.trim());
    });
  });

  const previousRenderDetail = renderDetail;

  renderDetail = function(company) {
    previousRenderDetail(company);
    renderHistory(company);
    updateHistoryVisibility(activeTabName());
  };

  renderHistory(selected);
  updateHistoryVisibility('Overview');
})();
