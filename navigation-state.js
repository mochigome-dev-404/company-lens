/* =========================================================
   Company Lens — Navigation State Controller
   画面を切り替える時に、前の画面が残らないように管理する。
   ========================================================= */

(() => {
  const navButtons = [...document.querySelectorAll('.nav-item')];

  const screenViews = {
    companies: document.querySelector('#companiesView'),
    rankings: document.querySelector('#rankingsView'),
    compare: document.querySelector('#compareView'),
    bookmarks: document.querySelector('#bookmarksView')
  };

  const rationaleView = document.querySelector('#scoreRationale');

  function hide(view) {
    if (view) {
      view.style.display = 'none';
    }
  }

  function show(view) {
    if (view) {
      view.style.display = 'grid';
    }
  }

  function closeAllScreensExcept(section) {
    Object.entries(screenViews).forEach(([name, view]) => {
      if (name !== section) {
        hide(view);
      }
    });
  }

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      /*
        ほかの画面側のクリック処理が先に終わってから、
        最後に不要な画面を閉じる。
      */
      window.setTimeout(() => {
        const section = button.dataset.section;

        navButtons.forEach(item => {
          item.classList.toggle('active', item === button);
        });

        if (section === 'dashboard') {
          Object.values(screenViews).forEach(hide);
          show(rationaleView);
          return;
        }

        closeAllScreensExcept(section);

        if (rationaleView) {
          rationaleView.style.display = 'none';
        }
      }, 0);
    });
  });
})();
