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
