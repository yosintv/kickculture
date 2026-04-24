(function () {
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;

  const path = window.location.pathname;
  const searchInput = document.getElementById("searchInput");

  const all = Store.getProducts();
  let subset = all;
  if (path.endsWith("home-jerseys.html")) subset = Store.getCountryProducts().filter((p) => p.type === "home");
  if (path.endsWith("away-jerseys.html")) subset = Store.getCountryProducts().filter((p) => p.type === "away");
  if (path.endsWith("club-jerseys.html")) subset = Store.getClubProducts();

  function actionsHtml(p) {
    return `
      <a href="product.html?id=${encodeURIComponent(p.id)}">Details</a>
      <a class="buy" href="product.html?id=${encodeURIComponent(p.id)}#checkout">Buy Now</a>
    `;
  }

  function render(list) {
    grid.innerHTML = list
      .map(
        (p) => `
        <article class="product-card">
          <img src="${p.image}" alt="${p.title}" onerror="this.onerror=null;this.src='${p.fallback}'" loading="lazy" />
          <div class="product-body">
            <p class="chip ${p.type}">${p.type.toUpperCase()}</p>
            <h3 class="product-title">${p.title}</h3>
            <p class="muted">${p.slotStatus}</p>
            <p class="price">${Store.currency(p.price)}</p>
            <div class="card-actions">
              ${actionsHtml(p)}
            </div>
          </div>
        </article>
      `
      )
      .join("");

  }

  async function initialRender() {
    if (path.endsWith("index.html") || path === "/") {
      render(subset);
      if (searchInput) {
        searchInput.addEventListener("input", function () {
          const q = this.value.trim().toLowerCase();
          render(
            subset.filter(
              (p) =>
                p.title.toLowerCase().includes(q) || p.slotStatus.toLowerCase().includes(q)
            )
          );
        });
      }
      return;
    }

    render(subset);
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        const q = this.value.trim().toLowerCase();
        render(
          subset.filter(
            (p) => p.title.toLowerCase().includes(q) || p.slotStatus.toLowerCase().includes(q)
          )
        );
      });
    }
  }

  initialRender();
})();
