(function () {
  const grid = document.getElementById("featuredGrid");
  if (!grid) return;

  async function renderFeatured() {
    const featuredFromStore = Store.getFeaturedProducts();
    const featured = await Store.productsWithImages(featuredFromStore);
    grid.innerHTML = featured
      .map(
        (p) => `
      <article class="product-card">
        <img src="${p.image}" alt="${p.title}" onerror="this.onerror=null;this.src='${p.fallback}'" loading="lazy" />
        <div class="product-body">
          <p class="chip ${p.type}">${p.type.toUpperCase()}</p>
          <h3 class="product-title">${p.title}</h3>
          <p class="price">${Store.currency(p.price)}</p>
          <div class="card-actions">
            <a href="product.html?id=${encodeURIComponent(p.id)}">Details</a>
            <a class="buy" href="product.html?id=${encodeURIComponent(p.id)}#checkout">Buy Now</a>
          </div>
        </div>
      </article>
    `
      )
      .join("");
  }

  renderFeatured();
})();
