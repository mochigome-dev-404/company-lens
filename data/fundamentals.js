/* =========================================================
   Company Lens — Fundamentals Data v0.2

   現在はプロトタイプ用のサンプル財務データ。
   将来はJ-Quantsなどから取得した数値を、
   この同じ形式へ変換して入れる。

   新しい実データ向け項目
   - operatingCashFlowMargin : 営業CF ÷ 売上高
   - salesGrowthYoY          : 売上高の前年比
   - profitGrowthYoY         : 利益の前年比

   legacy項目は旧スコアエンジンとの互換用。
   次の手順で新スコアエンジンへ切り替えたら不要になる。
   ========================================================= */

window.CompanyLensFundamentals = Object.freeze({
  '7203': {
    source: 'prototype',
    roe: 12.5,
    operatingMargin: 13.0,
    equityRatio: 60.0,
    operatingCashFlowMargin: 13.8,
    salesGrowthYoY: 7.0,
    profitGrowthYoY: 8.0,
    per: 10.0,
    pbr: 1.0,
    dividendYield: 2.8,
    payoutRatio: 32,

    /* legacy compatibility */
    netDebtToEbitda: 0.3,
    revenueCagr3y: 7.0,
    profitCagr3y: 8.0,
    buybackYield: 1.1
  },

  '6758': {
    source: 'prototype',
    roe: 11.5,
    operatingMargin: 10.0,
    equityRatio: 50.0,
    operatingCashFlowMargin: 12.4,
    salesGrowthYoY: 7.0,
    profitGrowthYoY: 9.0,
    per: 18.0,
    pbr: 2.3,
    dividendYield: 1.2,
    payoutRatio: 25,

    /* legacy compatibility */
    netDebtToEbitda: 1.2,
    revenueCagr3y: 7.0,
    profitCagr3y: 9.0,
    buybackYield: 0.8
  },

  '6861': {
    source: 'prototype',
    roe: 18.0,
    operatingMargin: 50.0,
    equityRatio: 90.0,
    operatingCashFlowMargin: 44.0,
    salesGrowthYoY: 9.0,
    profitGrowthYoY: 10.0,
    per: 40.0,
    pbr: 6.0,
    dividendYield: 0.5,
    payoutRatio: 30,

    /* legacy compatibility */
    netDebtToEbitda: -0.5,
    revenueCagr3y: 9.0,
    profitCagr3y: 10.0,
    buybackYield: 0.0
  },

  '7974': {
    source: 'prototype',
    roe: 14.5,
    operatingMargin: 35.0,
    equityRatio: 85.0,
    operatingCashFlowMargin: 31.0,
    salesGrowthYoY: 5.0,
    profitGrowthYoY: 5.0,
    per: 22.0,
    pbr: 3.5,
    dividendYield: 3.0,
    payoutRatio: 45,

    /* legacy compatibility */
    netDebtToEbitda: -0.5,
    revenueCagr3y: 5.0,
    profitCagr3y: 5.0,
    buybackYield: 0.2
  },

  '9984': {
    source: 'prototype',
    roe: 6.0,
    operatingMargin: 7.0,
    equityRatio: 20.0,
    operatingCashFlowMargin: 11.0,
    salesGrowthYoY: 8.0,
    profitGrowthYoY: 12.0,
    per: 10.0,
    pbr: 0.8,
    dividendYield: 4.2,
    payoutRatio: 65,

    /* legacy compatibility */
    netDebtToEbitda: 3.5,
    revenueCagr3y: 8.0,
    profitCagr3y: 12.0,
    buybackYield: 0.0
  },

  '9432': {
    source: 'prototype',
    roe: 9.0,
    operatingMargin: 12.0,
    equityRatio: 50.0,
    operatingCashFlowMargin: 21.0,
    salesGrowthYoY: 4.5,
    profitGrowthYoY: 5.0,
    per: 12.0,
    pbr: 1.2,
    dividendYield: 3.3,
    payoutRatio: 42,

    /* legacy compatibility */
    netDebtToEbitda: 1.8,
    revenueCagr3y: 4.5,
    profitCagr3y: 5.0,
    buybackYield: 0.5
  }
});
