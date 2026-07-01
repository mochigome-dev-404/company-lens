/* =========================================================
   Company Lens — AI Analysis View v0.1
   現在は財務スコアをもとにしたルールベースの自動分析です。
   将来、実データと生成AIへ差し替えられる構造にしています。
   ========================================================= */

(() => {
  const detailPanel = document.querySelector('.detail-panel');
  const metricsEl = document.querySelector('#metrics');
  const analysisCard = document.querySelector('.analysis-card');
  const rationaleView = document.querySelector('#scoreRationale');
  const tabs = [...document.querySelectorAll('.detail-panel .tab')];

  if (!detailPanel || !metricsEl || !analysisCard || !tabs.length) return;

  const aiAnalysisView = document.createElement('section');
  aiAnalysisView.id = 'aiAnalysisView';
  aiAnalysisView.className = 'ai-analysis-view';
  aiAnalysisView.hidden = true;

  analysisCard.insertAdjacentElement('afterend', aiAnalysisView);

  const style = document.createElement('style');

  style.textContent = `
    .ai-analysis-view {
      display: grid;
      gap: 14px;
    }

    .ai-analysis-view[hidden] {
      display: none !important;
    }

    .ai-analysis-shell {
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 20px;
      background:
        radial-gradient(
          circle at 96% 0%,
          rgba(221, 186, 97, .14),
          transparent 30%
        ),
        linear-gradient(
          145deg,
          rgba(255,255,255,.06),
          rgba(255,255,255,.02)
        );
    }

    .ai-analysis-head {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: flex-start;
      padding: 20px;
      border-bottom: 1px solid var(--line);
    }

    .ai-analysis-head h3 {
      margin: 6px 0 0;
      font-size: 28px;
      letter-spacing: -.05em;
    }

    .ai-analysis-head p {
      max-width: 315px;
      margin: 0;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.8;
    }

    .ai-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      border: 1px solid rgba(221,186,97,.46);
      border-radius: 999px;
      padding: 8px 11px;
      color: var(--gold);
      background: rgba(221,186,97,.08);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .1em;
      white-space: nowrap;
    }

    .ai-verdict {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(160px, .42fr);
      gap: 14px;
      padding: 18px 20px;
    }

    .ai-verdict-copy,
    .ai-verdict-score {
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 18px;
      background: rgba(0,0,0,.14);
    }

    .ai-verdict-copy h4 {
      margin: 6px 0 10px;
      font-size: 22px;
      letter-spacing: -.04em;
    }

    .ai-verdict-copy p {
      margin: 0;
      color: var(--soft);
      line-height: 1.8;
    }

    .ai-verdict-score {
      display: grid;
      align-content: center;
      text-align: center;
    }

    .ai-verdict-score span {
      color: var(--gold);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: .13em;
    }

    .ai-verdict-score strong {
      display: block;
      margin-top: 4px;
      font-size: 50px;
      letter-spacing: -.09em;
      line-height: 1;
    }

    .ai-verdict-score small {
      color: var(--muted);
      font-weight: 800;
    }

    .ai-signal-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      padding: 0 20px 18px;
    }

    .ai-signal-card {
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 16px;
      background: rgba(255,255,255,.03);
    }

    .ai-signal-card span {
      display: block;
      margin-bottom: 7px;
      color: var(--gold);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: .13em;
    }

    .ai-signal-card strong {
      display: block;
      font-size: 16px;
    }

    .ai-signal-card p {
      margin: 6px 0 0;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.75;
    }

    .ai-columns {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      padding: 0 20px 18px;
    }

    .ai-column-card {
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 18px;
      background: rgba(0,0,0,.12);
    }

    .ai-column-card h4 {
      margin: 6px 0 12px;
      font-size: 19px;
    }

    .ai-list {
      display: grid;
      gap: 10px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .ai-list li {
      position: relative;
      padding-left: 17px;
      color: var(--soft);
      font-size: 13px;
      line-height: 1.75;
    }

    .ai-list li::before {
      content: "";
      position: absolute;
      top: .72em;
      left: 0;
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: var(--gold);
    }

    .ai-column-card.watch li::before {
      background: #d6a264;
    }

    .ai-what-changes {
      margin: 0 20px 18px;
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 18px;
      background: rgba(255,255,255,.03);
    }

    .ai-what-changes h4 {
      margin: 6px 0 7px;
      font-size: 18px;
    }

    .ai-what-changes p {
      margin: 0;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.8;
    }

    .ai-analysis-note {
      margin: 0;
      padding: 14px 20px 18px;
      border-top: 1px solid var(--line);
      color: var(--muted);
      font-size: 11px;
      line-height: 1.75;
    }

    @media (max-width: 850px) {
      .ai-analysis-head,
      .ai-verdict {
        grid-template-columns: 1fr;
      }

      .ai-analysis-head {
        display: grid;
      }

      .ai-signal-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 620px) {
      .ai-columns {
        grid-template-columns: 1fr;
      }

      .ai-analysis-head,
      .ai-verdict,
      .ai-signal-grid,
      .ai-columns {
        padding-left: 14px;
        padding-right: 14px;
      }

      .ai-what-changes {
        margin-left: 14px;
        margin-right: 14px;
      }

      .ai-analysis-note {
        padding-left: 14px;
        padding-right: 14px;
      }
    }
  `;

  document.head.appendChild(style);

  const dimensionLabels = {
    profitability: '収益性',
    safety: '安全性',
    growth: '成長性',
    valuation: '割安度',
    shareholder: '株主還元'
  };

  function scoreOf(company, key) {
    return company.metrics?.[key] ?? 0;
  }

  function sortedDimensions(company, includeValuation = true) {
    const keys = [
      'profitability',
      'safety',
      'growth',
      'valuation',
      'shareholder'
    ].filter(key => includeValuation || key !== 'valuation');

    return keys
      .map(key => ({
        key,
        label: dimensionLabels[key],
        score: scoreOf(company, key)
      }))
      .sort((a, b) => b.score - a.score);
  }

  function companyProfile(company) {
    const quality = company.score;
    const profitability = scoreOf(company, 'profitability');
    const safety = scoreOf(company, 'safety');
    const growth = scoreOf(company, 'growth');
    const shareholder = scoreOf(company, 'shareholder');

    if (quality >= 90 && profitability >= 85 && safety >= 85) {
      return '高品質・安定複利型';
    }

    if (quality >= 85 && growth >= 85) {
      return '高品質・成長重視型';
    }

    if (safety >= 85 && shareholder >= 80) {
      return '安定還元・守備型';
    }

    if (growth >= 85) {
      return '成長期待・変化型';
    }

    return 'バランス評価型';
  }

  function valuationRead(company) {
    const valuation = scoreOf(company, 'valuation');

    if (valuation >= 80) {
      return '価格面にも魅力がある可能性';
    }

    if (valuation >= 60) {
      return '価格面はおおむね中立';
    }

    return '価格面は期待を織り込み済み';
  }

  function strengthSentence(company, metric) {
    const f = company.fundamentals || {};

    if (metric.key === 'profitability') {
      return `ROE ${f.roe?.toFixed(1) ?? '-'}%・営業利益率 ${f.operatingMargin?.toFixed(1) ?? '-'}%を背景に、事業の収益力が企業品質を支えています。`;
    }

    if (metric.key === 'safety') {
      return `自己資本比率 ${f.equityRatio?.toFixed(1) ?? '-'}% と、ネット有利子負債 / EBITDA ${f.netDebtToEbitda?.toFixed(1) ?? '-'}×が、財務基盤の強さを示しています。`;
    }

    if (metric.key === 'growth') {
      return `3年の売上高CAGR ${f.revenueCagr3y?.toFixed(1) ?? '-'}%・利益CAGR ${f.profitCagr3y?.toFixed(1) ?? '-'}%が、成長余地を支える材料です。`;
    }

    if (metric.key === 'shareholder') {
      return `配当利回り ${f.dividendYield?.toFixed(1) ?? '-'}% と配当性向 ${f.payoutRatio?.toFixed(0) ?? '-'}%から、株主還元への姿勢を評価しています。`;
    }

    return `PER ${f.per?.toFixed(1) ?? '-'}×・PBR ${f.pbr?.toFixed(1) ?? '-'}×をもとに、企業品質と市場評価のバランスを確認しています。`;
  }

  function watchSentence(company, metric) {
    const f = company.fundamentals || {};

    if (metric.key === 'profitability') {
      return '利益率や資本効率の変化は、企業品質の見直しにつながりやすい項目です。';
    }

    if (metric.key === 'safety') {
      return `自己資本比率 ${f.equityRatio?.toFixed(1) ?? '-'}%・ネット有利子負債 / EBITDA ${f.netDebtToEbitda?.toFixed(1) ?? '-'}×の推移を継続して確認したい領域です。`;
    }

    if (metric.key === 'growth') {
      return `売上高CAGR ${f.revenueCagr3y?.toFixed(1) ?? '-'}%・利益CAGR ${f.profitCagr3y?.toFixed(1) ?? '-'}%が鈍化する場合、成長評価の見直しが必要です。`;
    }

    if (metric.key === 'shareholder') {
      return '還元方針は資本政策で変化しうるため、配当・自社株買いの継続性を確認したい項目です。';
    }

    return `PER ${f.per?.toFixed(1) ?? '-'}×・PBR ${f.pbr?.toFixed(1) ?? '-'}×が上昇すると、企業品質に対する価格面の魅力は低下します。`;
  }

  function whatCouldChange(company, weakest) {
    const f = company.fundamentals || {};

    if (weakest.key === 'growth') {
      return `売上高・利益の伸びが現在の3年CAGR（${f.revenueCagr3y?.toFixed(1) ?? '-'}% / ${f.profitCagr3y?.toFixed(1) ?? '-'}%）を上回るかが、次の評価改善の焦点です。`;
    }

    if (weakest.key === 'safety') {
      return '負債水準の低下、自己資本の積み上がり、または安定したキャッシュ創出が見えれば、安全性の評価は改善しやすくなります。';
    }

    if (weakest.key === 'profitability') {
      return '営業利益率とROEの改善が確認できれば、企業品質全体の見え方を大きく変える可能性があります。';
    }

    if (weakest.key === 'shareholder') {
      return '配当方針・自社株買い・資本配分の変化は、株主還元の評価を直接動かす材料になります。';
    }

    return '利益成長が続く一方で株価指標が落ち着けば、企業品質と市場評価のバランスは改善する可能性があります。';
  }

  function analysisSummary(company, strongest, weakest) {
    const profile = companyProfile(company);
    const valuation = valuationRead(company);

    return `${company.jp}は「${profile}」として読む企業です。${strongest.label}が強みとして企業品質を支え、${weakest.label}は今後の確認ポイントです。${valuation}と見ています。`;
  }

  function renderAiAnalysis(company) {
    if (!company) return;

    const ranked = sortedDimensions(company, false);
    const strongest = ranked[0];
    const weakest = ranked[ranked.length - 1];
    const valuation = {
      key: 'valuation',
      label: '割安度',
      score: scoreOf(company, 'valuation')
    };

    aiAnalysisView.innerHTML = `
      <article class="ai-analysis-shell">
        <div class="ai-analysis-head">
          <div>
            <p class="section-label">RULE-BASED AI ANALYSIS</p>
            <h3>${company.jp}をどう読むか</h3>
          </div>

          <div class="ai-pill">
            <span>PROFILE</span>
            ${companyProfile(company)}
          </div>
        </div>

        <section class="ai-verdict">
          <article class="ai-verdict-copy">
            <p class="section-label">COMPANY LENS VIEW</p>
            <h4>${analysisSummary(company, strongest, weakest)}</h4>
            <p>
              現在の分析は、採点エンジンの数値を文章へ変換したものです。
              数字と結論を行き来しながら、企業の性格を読むために使います。
            </p>
          </article>

          <article class="ai-verdict-score">
            <span>COMPANY QUALITY</span>
            <strong>${company.score}</strong>
            <small>/100</small>
          </article>
        </section>

        <section class="ai-signal-grid">
          <article class="ai-signal-card">
            <span>STRONGEST SIGNAL</span>
            <strong>${strongest.label} · ${strongest.score}/100</strong>
            <p>${strengthSentence(company, strongest)}</p>
          </article>

          <article class="ai-signal-card">
            <span>PRICE READ</span>
            <strong>${valuationRead(company)}</strong>
            <p>${strengthSentence(company, valuation)}</p>
          </article>

          <article class="ai-signal-card">
            <span>WATCH CLOSELY</span>
            <strong>${weakest.label} · ${weakest.score}/100</strong>
            <p>${watchSentence(company, weakest)}</p>
          </article>
        </section>

        <section class="ai-columns">
          <article class="ai-column-card">
            <p class="section-label">WHY IT STANDS OUT</p>
            <h4>強みとして読むポイント</h4>
            <ul class="ai-list">
              ${ranked.slice(0, 3).map(metric => `
                <li>
                  <strong>${metric.label} ${metric.score}/100。</strong>
                  ${strengthSentence(company, metric)}
                </li>
              `).join('')}
            </ul>
          </article>

          <article class="ai-column-card watch">
            <p class="section-label">WHAT TO MONITOR</p>
            <h4>次の決算で確認したいこと</h4>
            <ul class="ai-list">
              <li>${watchSentence(company, weakest)}</li>
              <li>${whatCouldChange(company, weakest)}</li>
              <li>市場評価は${valuation.score}/100です。企業品質だけでなく、価格と期待値の変化もあわせて確認します。</li>
            </ul>
          </article>
        </section>

        <section class="ai-what-changes">
          <p class="section-label">WHAT WOULD CHANGE THE VIEW</p>
          <h4>評価が変わるとしたら</h4>
          <p>${whatCouldChange(company, weakest)}</p>
        </section>

        <p class="ai-analysis-note">
          ※ 現在は生成AI APIではなく、Company Lensのスコアとサンプル財務データから作るルールベースの自動分析です。
          実データ接続後は、決算要約・業界比較・ニュース要因を加えた分析へ拡張します。投資判断は一次情報も確認してください。
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

  function updateAiVisibility(tabName) {
    const isAiAnalysis = tabName === 'AI Analysis';

    aiAnalysisView.hidden = !isAiAnalysis;

    if (isAiAnalysis) {
      analysisCard.hidden = true;
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.textContent.trim();
      updateAiVisibility(tabName);
    });
  });

  const previousRenderDetail = renderDetail;

  renderDetail = function(company) {
    previousRenderDetail(company);
    renderAiAnalysis(company);
    updateAiVisibility(activeTabName());
  };

  renderAiAnalysis(selected);
  updateAiVisibility('Overview');
})();
