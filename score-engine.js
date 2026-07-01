/* =========================================================
   Company Lens — Score Engine v0.1
   現在はプロトタイプ用のサンプル財務データです。
   実データAPI接続後、この入力部分を置き換えます。
   ========================================================= */

(() => {
  const sampleFundamentals = {
    '7203': {
      roe: 12.5,
      operatingMargin: 13.0,
      equityRatio: 60,
      netDebtToEbitda: 0.3,
      revenueCagr3y: 7.0,
      profitCagr3y: 8.0,
      per: 10.0,
      pbr: 1.0,
      dividendYield: 2.8,
      payoutRatio: 32,
      buybackYield: 1.1
    },

    '6758': {
      roe: 11.5,
      operatingMargin: 10.0,
      equityRatio: 50,
      netDebtToEbitda: 1.2,
      revenueCagr3y: 7.0,
      profitCagr3y: 9.0,
      per: 18.0,
      pbr: 2.3,
      dividendYield: 1.2,
      payoutRatio: 25,
      buybackYield: 0.8
    },

    '6861': {
      roe: 18.0,
      operatingMargin: 50.0,
      equityRatio: 90,
      netDebtToEbitda: -0.5,
      revenueCagr3y: 9.0,
      profitCagr3y: 10.0,
      per: 40.0,
      pbr: 6.0,
      dividendYield: 0.5,
      payoutRatio: 30,
      buybackYield: 0.0
    },

    '7974': {
      roe: 14.5,
      operatingMargin: 35.0,
      equityRatio: 85,
      netDebtToEbitda: -0.5,
      revenueCagr3y: 5.0,
      profitCagr3y: 5.0,
      per: 22.0,
      pbr: 3.5,
      dividendYield: 3.0,
      payoutRatio: 45,
      buybackYield: 0.2
    },

    '9984': {
      roe: 6.0,
      operatingMargin: 7.0,
      equityRatio: 20,
      netDebtToEbitda: 3.5,
      revenueCagr3y: 8.0,
      profitCagr3y: 12.0,
      per: 10.0,
      pbr: 0.8,
      dividendYield: 4.2,
      payoutRatio: 65,
      buybackYield: 0.0
    },

    '9432': {
      roe: 9.0,
      operatingMargin: 12.0,
      equityRatio: 50,
      netDebtToEbitda: 1.8,
      revenueCagr3y: 4.5,
      profitCagr3y: 5.0,
      per: 12.0,
      pbr: 1.2,
      dividendYield: 3.3,
      payoutRatio: 42,
      buybackYield: 0.5
    }
  };

  const labels = {
    profitability: '収益性',
    safety: '安全性',
    growth: '成長性',
    valuation: '割安度',
    shareholder: '株主還元'
  };

  function clamp(value, minimum = 0, maximum = 100) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function round(value) {
    return Math.round(value);
  }

  function higherIsBetter(value, low, high) {
    return clamp(((value - low) / (high - low)) * 100);
  }

  function lowerIsBetter(value, best, worst) {
    return clamp(((worst - value) / (worst - best)) * 100);
  }

  function targetScore(value, ideal, tolerance) {
    return clamp(
      100 - (Math.abs(value - ideal) / tolerance) * 100
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
    const profitability = round(
      higherIsBetter(financials.roe, 4, 14) * 0.5 +
      higherIsBetter(financials.operatingMargin, 2, 14) * 0.5
    );

    const safety = round(
      higherIsBetter(financials.equityRatio, 20, 60) * 0.55 +
      lowerIsBetter(financials.netDebtToEbitda, -0.5, 3.5) * 0.45
    );

    const growth = round(
      higherIsBetter(financials.revenueCagr3y, 0, 8) * 0.5 +
      higherIsBetter(financials.profitCagr3y, 0, 12) * 0.5
    );

    const valuation = round(
      lowerIsBetter(financials.per, 9, 35) * 0.45 +
      lowerIsBetter(financials.pbr, 0.7, 5) * 0.35 +
      higherIsBetter(financials.dividendYield, 0, 4) * 0.2
    );

    const shareholder = round(
      higherIsBetter(financials.dividendYield, 0, 4) * 0.35 +
      targetScore(financials.payoutRatio, 45, 45) * 0.4 +
      higherIsBetter(financials.buybackYield, 0, 3) * 0.25
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
      metrics.safety * 0.30 +
      metrics.growth * 0.20 +
      metrics.shareholder * 0.15;

    /*
      企業品質が一定水準を下回らないようにするための
      プロトタイプ用のスケール補正。
      後で全上場企業データが入ったら、
      業界・市場全体に対する偏差値型へ進化させる。
    */
    return round(55 + rawScore * 0.45);
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

  function buildInsight(company) {
    const strongest = strongestMetric(company.metrics);
    const weakest = weakestMetric(company.metrics);
    const valuation = company.metrics.valuation;

    let valuationMessage = '';

    if (valuation >= 80) {
      valuationMessage =
        '市場評価とのバランスにも比較的魅力がある可能性があります。';
    } else if (valuation >= 60) {
      valuationMessage =
        '市場から一定の期待を受けており、価格面は中立的な評価です。';
    } else {
      valuationMessage =
        '企業品質に対して株価には高い期待が織り込まれている可能性があります。';
    }

    return `${company.jp}は${labels[strongest[0]]}が企業品質を支える企業です。` +
      `${labels[weakest[0]]}は相対的に慎重に確認したい項目です。` +
      valuationMessage;
  }

  function calculateCompany(company) {
    const fundamentals = sampleFundamentals[company.ticker];

    if (!fundamentals) return;

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

  /*
    後で実データAPIをつなぐ時は、
    sampleFundamentals の代わりに
    APIから受け取った数値を calculateCompany に渡す。
  */
  window.CompanyLensScore = Object.freeze({
    version: '0.1',
    methodology: {
      quality: {
        profitability: 35,
        safety: 30,
        growth: 20,
        shareholder: 15
      },
      valuation: 'separate'
    },
    sampleFundamentals,
    calculateMetrics,
    calculateCompany
  });

  function updateMethodologyCopy() {
    const rationale = document.querySelector('#scoreRationale');

    if (!rationale) return;

    const headingText = rationale.querySelector('.rationale-head p');

    if (headingText) {
      headingText.textContent =
        '企業品質は、収益性・安全性・成長性・株主還元の4要素から計算します。割安度は、企業そのものの品質とは分けて、価格面の魅力として読む設計です。';
    }

    const scoreLabel = rationale.querySelector(
      '.rationale-score-card span'
    );

    if (scoreLabel) {
      scoreLabel.textContent = 'COMPANY QUALITY';
    }

    const note = rationale.querySelector('.rationale-note');

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
