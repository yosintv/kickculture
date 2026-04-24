(function () {
  const view = document.getElementById("productView");
  if (!view) return;
  const id = new URLSearchParams(window.location.search).get("id");
  const product = id ? Store.findProductById(id) : null;

  if (!product) {
    view.innerHTML = "<p>Product not found.</p>";
    return;
  }

  view.innerHTML = `
    <div>
      <img src="${product.image}" alt="${product.title}" onerror="this.onerror=null;this.src='${product.fallback}'" />
    </div>
    <div>
      <p class="chip ${product.type}">${product.type.toUpperCase()}</p>
      <h1>${product.title}</h1>
      <p class="muted">${product.slotStatus}</p>
      <p class="price">${Store.currency(product.price)}</p>
      <p>Delivery: Worldwide in 5-7 business days.</p>
      <div class="hero-cta" id="checkout">
        <label class="field">
          <span>Size</span>
          <select id="sizeInput">
            <option value="S">S</option>
            <option value="M" selected>M</option>
            <option value="L">L</option>
          </select>
        </label>
        <label class="field">
          <span>Name</span>
          <input id="nameInput" type="text" placeholder="Full name" />
        </label>
        <label class="field">
          <span>Phone Number</span>
          <input id="phoneInput" type="tel" placeholder="Phone with country code" />
        </label>
        <label class="field">
          <span>Country</span>
          <input id="countryInput" type="text" placeholder="Country" />
        </label>
        <label class="field">
          <span>Full Address</span>
          <textarea id="addressInput" rows="3" placeholder="Street, city, state"></textarea>
        </label>
        <label class="field">
          <span>Postcode</span>
          <input id="postcodeInput" type="text" placeholder="Postcode / ZIP" />
        </label>
      </div>
      <div class="hero-cta">
        <button id="buyNowBtn" class="btn btn-solid pulse" type="button">Buy Instantly on WhatsApp</button>
      </div>
    </div>
  `;

  const buyNowBtn = document.getElementById("buyNowBtn");
  const sizeInput = document.getElementById("sizeInput");
  const nameInput = document.getElementById("nameInput");
  const phoneInput = document.getElementById("phoneInput");
  const countryInput = document.getElementById("countryInput");
  const addressInput = document.getElementById("addressInput");
  const postcodeInput = document.getElementById("postcodeInput");

  function getCustomer() {
    return {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      country: countryInput.value.trim(),
      address: addressInput.value.trim(),
      postcode: postcodeInput.value.trim()
    };
  }

  function validCustomer(customer) {
    return (
      customer.name &&
      customer.phone &&
      customer.country &&
      customer.address &&
      customer.postcode
    );
  }

  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", function () {
      const customer = getCustomer();
      if (!validCustomer(customer)) {
        alert("Please fill Name, Phone Number, Country, Full Address and Postcode.");
        return;
      }
      const url = Store.buildSingleProductOrderLink(product, sizeInput.value, customer);
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }
})();
