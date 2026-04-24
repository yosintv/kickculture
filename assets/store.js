(function () {
  const WHATSAPP_NUMBER = "8109068332943";
  const PRICE = 25;

const countryTeams = [
  { team: "Canada", status: "Host" },
  { team: "Mexico", status: "Host" },
  { team: "United States", status: "Host" },
  { team: "Japan", status: "Qualified Team" },
  { team: "Iran", status: "Qualified Team" },
  { team: "South Korea", status: "Qualified Team" },
  { team: "Uzbekistan", status: "Qualified Team" },
  { team: "Jordan", status: "Qualified Team" },
  { team: "Australia", status: "Qualified Team" },
  { team: "Saudi Arabia", status: "Qualified Team" },
  { team: "Qatar", status: "Qualified Team" },
  { team: "Morocco", status: "Qualified Team" },
  { team: "Tunisia", status: "Qualified Team" },
  { team: "Egypt", status: "Qualified Team" },
  { team: "Algeria", status: "Qualified Team" },
  { team: "Ghana", status: "Qualified Team" },
  { team: "Cape Verde", status: "Qualified Team" },
  { team: "South Africa", status: "Qualified Team" },
  { team: "Senegal", status: "Qualified Team" },
  { team: "Ivory Coast", status: "Qualified Team" },
  { team: "DR Congo", status: "Qualified Team" }, // Play-off Winner
  { team: "Panama", status: "Qualified Team" },
  { team: "Haiti", status: "Qualified Team" },
  { team: "Curaçao", status: "Qualified Team" },
  { team: "Iraq", status: "Qualified Team" }, // Play-off Winner
  { team: "Argentina", status: "Qualified Team" },
  { team: "Brazil", status: "Qualified Team" },
  { team: "Uruguay", status: "Qualified Team" },
  { team: "Colombia", status: "Qualified Team" },
  { team: "Ecuador", status: "Qualified Team" },
  { team: "Paraguay", status: "Qualified Team" },
  { team: "New Zealand", status: "Qualified Team" },
  { team: "England", status: "Qualified Team" },
  { team: "France", status: "Qualified Team" },
  { team: "Germany", status: "Qualified Team" },
  { team: "Spain", status: "Qualified Team" },
  { team: "Portugal", status: "Qualified Team" },
  { team: "Netherlands", status: "Qualified Team" },
  { team: "Belgium", status: "Qualified Team" },
  { team: "Italy", status: "Qualified Team" },
  { team: "Croatia", status: "Qualified Team" },
  { team: "Switzerland", status: "Qualified Team" },
  { team: "Norway", status: "Qualified Team" },
  { team: "Austria", status: "Qualified Team" },
  { team: "Scotland", status: "Qualified Team" },
  { team: "Sweden", status: "Qualified Team" },
  { team: "Türkiye", status: "Qualified Team" },
  { team: "Czech Republic", status: "Qualified Team" }
];


  const clubTeams = [
  { team: "Manchester City", status: "Club Team" },
  { team: "Manchester United", status: "Club Team" }
  ];
  
  
  const featuredProductIds = [
    "country-portugal-home",
    "country-argentina-away",
    "country-argentina-home",
    "club-manchester-city-home"
  ];

  function slugify(v) {
    return v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function placeholderSvg(name, type) {
    const label = `${name} ${type.toUpperCase()}`;
    const bg = type === "home" ? "#c73e1d" : "#0b6e4f";
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='900'><rect width='100%' height='100%' fill='${bg}'/><rect x='70' y='80' width='660' height='740' rx='26' fill='white' opacity='0.92'/><text x='400' y='430' font-family='Arial,sans-serif' font-size='46' text-anchor='middle' fill='#111' font-weight='700'>Add Original Image</text><text x='400' y='500' font-family='Arial,sans-serif' font-size='34' text-anchor='middle' fill='#111'>${label}</text><text x='400' y='560' font-family='Arial,sans-serif' font-size='24' text-anchor='middle' fill='#444'>/images/${slugify(name)}-${type}.jpg</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function imagePath(team, type) {
    return `images/${slugify(team)}-${type}.jpg`;
  }

  function makeProductsFromTeams(teams, jerseyKind) {
    const items = [];
    for (let i = 0; i < teams.length; i += 1) {
      const t = teams[i];
      const slug = slugify(t.team);
      items.push({
        id: `${jerseyKind}-${slug}-home`,
        team: t.team,
        slotStatus: t.status,
        jerseyKind,
        type: "home",
        title: `${t.team} Home Jersey`,
        price: PRICE,
        image: imagePath(t.team, "home"),
        fallback: placeholderSvg(t.team, "home")
      });
      items.push({
        id: `${jerseyKind}-${slug}-away`,
        team: t.team,
        slotStatus: t.status,
        jerseyKind,
        type: "away",
        title: `${t.team} Away Jersey`,
        price: PRICE,
        image: imagePath(t.team, "away"),
        fallback: placeholderSvg(t.team, "away")
      });
    }
    return items;
  }

  function getCountryProducts() {
    return makeProductsFromTeams(countryTeams, "country");
  }

  function getClubProducts() {
    return makeProductsFromTeams(clubTeams, "club");
  }

  const imageExistsCache = {};
  function imageExists(url) {
    if (imageExistsCache[url] !== undefined) {
      return Promise.resolve(imageExistsCache[url]);
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function () {
        imageExistsCache[url] = true;
        resolve(true);
      };
      img.onerror = function () {
        imageExistsCache[url] = false;
        resolve(false);
      };
      img.src = url;
    });
  }

  async function productsWithImages(products) {
    const checks = await Promise.all(
      products.map(async (p) => ({
        product: p,
        ok: await imageExists(p.image)
      }))
    );
    return checks.filter((row) => row.ok).map((row) => row.product);
  }

  function getProducts() {
    return [...getCountryProducts(), ...getClubProducts()];
  }

  function getFeaturedProducts() {
    const all = getProducts();
    const byId = new Map(all.map((p) => [p.id, p]));
    const featured = featuredProductIds.map((id) => byId.get(id)).filter(Boolean);
    if (featured.length > 0) return featured;
    return all.slice(0, 8);
  }

  function findProductById(id) {
    const list = getProducts();
    return list.find((p) => p.id === id) || null;
  }

  function whatsappProductLink(product) {
    const text = `Hi, I want to buy ${product.title} for $${product.price}. Please share size and delivery details.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }

  function buildCustomerBlock(customer) {
    return [
      `Name: ${customer.name}`,
      `Phone: ${customer.phone}`,
      `Country: ${customer.country}`,
      `Full Address: ${customer.address}`,
      `Postcode: ${customer.postcode}`
    ].join("\n");
  }

  function buildSingleProductOrderLink(product, size, customer) {
    const text = [
      "Hi, I want to place this order:",
      `${product.title} x1`,
      `Size: ${size}`,
      `Total: $${product.price}`,
      "",
      "Customer Details:",
      buildCustomerBlock(customer),
      "",
      "Please confirm delivery timeline."
    ].join("\n");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }

  function cartGet() {
    try {
      return JSON.parse(localStorage.getItem("jersey_cart") || "[]");
    } catch (e) {
      return [];
    }
  }

  function cartSet(items) {
    localStorage.setItem("jersey_cart", JSON.stringify(items));
  }

  function cartAdd(productId, size) {
    const selectedSize = size || "M";
    const existing = cartGet();
    const found = existing.find((r) => r.id === productId && r.size === selectedSize);
    if (found) {
      found.qty += 1;
    } else {
      existing.push({ id: productId, qty: 1, size: selectedSize });
    }
    cartSet(existing);
  }

  function cartRowsWithProducts() {
    const list = cartGet();
    return list
      .map((row) => {
        const p = findProductById(row.id);
        if (!p) return null;
        return { product: p, qty: row.qty, size: row.size || "M", lineTotal: p.price * row.qty };
      })
      .filter(Boolean);
  }

  function cartRemove(productId, size) {
    cartSet(cartGet().filter((r) => !(r.id === productId && (r.size || "M") === (size || "M"))));
  }

  function cartWhatsappCheckoutLink(customer) {
    const rows = cartRowsWithProducts();
    if (rows.length === 0) return "#";
    const lines = rows.map((r) => `${r.product.title} x${r.qty} (Size: ${r.size})`);
    const total = rows.reduce((sum, r) => sum + r.lineTotal, 0);
    const text = [
      "Hi, I want to place this order:",
      lines.join("\n"),
      `Total: $${total}`,
      "",
      "Customer Details:",
      buildCustomerBlock(customer),
      "",
      "Please confirm worldwide delivery in 5-7 business days."
    ].join("\n");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }

  function currency(v) {
    return `$${v}`;
  }

  window.Store = {
    getProducts,
    getCountryProducts,
    getClubProducts,
    getFeaturedProducts,
    productsWithImages,
    findProductById,
    whatsappProductLink,
    buildSingleProductOrderLink,
    cartAdd,
    cartRowsWithProducts,
    cartRemove,
    cartWhatsappCheckoutLink,
    currency
  };
})();
