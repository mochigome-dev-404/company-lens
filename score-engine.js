/* =========================================================
   Company Lens — Score Engine v0.2

   J-Quants Freeなどで取得しやすい財務サマリーを前提にした
   企業品質スコアの計算エンジン。

   企業品質
   - 収益性 35%
   - 安全性 30%
   - 成長性 20%
   - 株主還元 15%

   割安度は、企業品質とは分けて表示する。
   ========================================================= */

(() => {
  const fundamentalsByTicker = window.CompanyLensFundamentals;

  if (!fundamentalsByTicker) {
    console.warn(
      'CompanyLensFundamentals が読み込まれていません。'
    );
    return;
  }

  const labels = {
    profitability: '収益性',
    safety: '安全性',
    growth: '成長性',
    valuation: '割安度',
    shareholder: '株主還元'
  };

  function toNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, minimum = 0, maximum = 100) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function round(value) {
    return Math.round(value);
  }

  function higherIsBetter(value, low, high) {
    return clamp(
      ((toNumber(value) - low) / (high - low)) * 100
    );
  }

  function lowerIsBetter(value, best, worst) {
    return clamp(
      ((worst - toNumber(value)) / (worst - best)) * 100
    );
  }

  function targetScore(value, ideal, tolerance) {
    return clamp(
      100 -
        (Math.abs(toNumber(value) - ideal) / tolerance) * 100
    );
  }

  function gradeFromScore(score) {
    if (score >= 94) return 'S';
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';

    return 'C';
  }

  function calculateMetrics(financials) {
    /*
      収益性
      ROEと営業利益率が高い企業ほど高評価。
    */
    const profitability = round(
      higherIsBetter(financials.roe, 4, 16) * 0.55 +
        higherIsBetter(financials.operatingMargin, 1, 20) * 0.45
    );

    /*
      安全性
      自己資本比率と、売上に対する営業CFの強さで見る。
    */
    const safety = round(
      higherIsBetter(financials.equityRatio, 20, 60) * 0.6 +
        higherIsBetter(
          financials.operatingCashFlowMargin,
          1,
          18
        ) * 0.4
    );

    /*
      成長性
      売上と利益の前年比を使用。
      利益成長の方を少し重くする。
    */
    const growth = round(
      higherIsBetter(financials.salesGrowthYoY, -5, 15) * 0.45 +
        higherIsBetter(financials.profitGrowthYoY, -10, 25) * 0.55
    );

    /*
      割安度
      PER・PBRが低いほど、配当利回りが高いほど高評価。
      ただし企業品質スコアには直接入れない。
    */
    const valuation = round(
      lowerIsBetter(financials.per, 8, 35) * 0.45 +
        lowerIsBetter(financials.pbr, 0.6, 5) * 0.35 +
        higherIsBetter(financials.dividendYield, 0, 4) * 0.2
    );

    /*
      株主還元
      配当利回りと、無理のない配当性向を評価する。
      配当性向は45%前後を最も高く評価。
    */
    const shareholder = round(
      higherIsBetter(financials.dividendYield, 0, 4) * 0.45 +
        targetScore(financials.payoutRatio, 45, 35) * 0.55
    );

    return {
      profitability,
      safety,
      growth,
      valuation,
      shareholder
    };
  }

  function qualityScore(metrics) {
    const rawScore =
      metrics.profitability * 0.35 +
      metrics.safety * 0.3 +
      metrics.growth * 0.2 +
      metrics.shareholder * 0.15;

    /*
      プロトタイプ段階では、スコアの見やすさを優先して
      45〜100点へ補正している。
      全上場企業を扱う段階で、業種比較・偏差値型へ進化させる。
    */
    return round(45 + rawScore * 0.55);
  }

  function strongestMetric(metrics) {
    return Object.entries(metrics)
      .filter(([key]) => key !== 'valuation')
      .sort((a, b) => b[1] - a[1])[0];
  }

  function weakestMetric(metrics) {
    return Object.entries(metrics)
      .filter(([key]) => key !== 'valuation')
      .sort((a, b) => a[1] - b[1])[0];
  }

  function valuationMessage(score) {
    if (score >= 80) {
      return '市場評価とのバランスにも魅力がある可能性があります。';
    }

    if (score >= 60) {
      return '市場から一定の期待を受けており、価格面は中立的な評価です。';
    }

    return '企業品質に対して、株価には高い期待が織り込まれている可能性があります。';
  }

  function buildInsight(company) {
    const strongest = strongestMetric(company.metrics);
    const weakest = weakestMetric(company.metrics);

    return (
      `${company.jp}は${labels[strongest[0]]}が` +
      `企業品質を支える企業です。` +
      `${labels[weakest[0]]}は相対的に慎重に確認したい項目です。` +
      valuationMessage(company.metrics.valuation)
    );
  }

  function calculateCompany(company) {
    const fundamentals =
      fundamentalsByTicker[company.ticker];

    if (!fundamentals) {
      return;
    }

    const metrics = calculateMetrics(fundamentals);
    const score = qualityScore(metrics);

    company.fundamentals = fundamentals;
    company.metrics = metrics;
    company.score = score;
    company.grade = gradeFromScore(score);
    company.marketAttractiveness = metrics.valuation;
    company.insight = buildInsight(company);
  }

  companies.forEach(calculateCompany);

  window.CompanyLensScore = Object.freeze({
    version: '0.2',

    methodology: {
      quality: {
        profitability: 35,
        safety: 30,
        growth: 20,
        shareholder: 15
      },

      valuation: 'separate'
    },

    fundamentalsByTicker,
    calculateMetrics,
    calculateCompany
  });

  function updateMethodologyCopy() {
    const rationale = document.querySelector(
      '#scoreRationale'
    );

    if (!rationale) {
      return;
    }

    const headingText = rationale.querySelector(
      '.rationale-head p'
    );

    if (headingText) {
      headingText.textContent =
        '企業品質は、収益性・安全性・成長性・株主還元の4要素から計算します。安全性には自己資本比率と営業キャッシュフロー率、成長性には売上・利益の前年比を使います。割安度は企業品質とは別に、価格面の魅力として読む設計です。';
    }

    const scoreLabel = rationale.querySelector(
      '.rationale-score-card span'
    );

    if (scoreLabel) {
      scoreLabel.textContent = 'COMPANY QUALITY';
    }

    const note = rationale.querySelector(
      '.rationale-note'
    );

    if (note) {
      note.textContent =
        '※ 現在はプロトタイプ用のサンプル財務データによる計算結果です。実際の投資判断では、決算資料・適時開示・市場価格などの一次情報を確認してください。';
    }
  }

  const previousRenderDetail = renderDetail;

  renderDetail = function(company) {
    previousRenderDetail(company);

    requestAnimationFrame(() => {
      updateMethodologyCopy();
    });
  };

  window.setTimeout(() => {
    renderDetail(selected);
  }, 0);
})();
