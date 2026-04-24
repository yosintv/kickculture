(function () {
  const rowsHost = document.getElementById("cartRows");
  const countHost = document.getElementById("cartCount");
  const totalHost = document.getElementById("cartTotal");
  const checkout = document.getElementById("checkoutWhatsApp");
  const nameInput = document.getElementById("nameInput");
  const phoneInput = document.getElementById("phoneInput");
  const countryInput = document.getElementById("countryInput");
  const addressInput = document.getElementById("addressInput");
  const postcodeInput = document.getElementById("postcodeInput");
  if (!rowsHost || !countHost || !totalHost || !checkout) return;

  function getCustomer() {
    return {
      name: (nameInput && nameInput.value.trim()) || "",
      phone: (phoneInput && phoneInput.value.trim()) || "",
      country: (countryInput && countryInput.value.trim()) || "",
      address: (addressInput && addressInput.value.trim()) || "",
      postcode: (postcodeInput && postcodeInput.value.trim()) || ""
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

  function render() {
    const rows = Store.cartRowsWithProducts();
    if (rows.length === 0) {
      rowsHost.innerHTML = '<div class="content-card"><p>Your cart is empty.</p></div>';
      countHost.textContent = "0";
      totalHost.textContent = "$0";
      return;
    }

    rowsHost.innerHTML = rows
      .map(
        (r) => `
        <article class="cart-row">
          <div>
            <strong>${r.product.title}</strong>
            <p class="muted">Qty: ${r.qty} | Size: ${r.size}</p>
          </div>
          <div>
            <p class="price">${Store.currency(r.lineTotal)}</p>
            <button class="btn btn-outline" data-remove="${r.product.id}" data-size="${r.size}" type="button">Remove</button>
          </div>
        </article>
      `
      )
      .join("");

    const count = rows.reduce((sum, r) => sum + r.qty, 0);
    const total = rows.reduce((sum, r) => sum + r.lineTotal, 0);
    countHost.textContent = String(count);
    totalHost.textContent = Store.currency(total);

    rowsHost.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", function () {
        Store.cartRemove(this.getAttribute("data-remove"), this.getAttribute("data-size"));
        render();
      });
    });
  }

  checkout.addEventListener("click", function () {
    const rows = Store.cartRowsWithProducts();
    if (rows.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    const customer = getCustomer();
    if (!validCustomer(customer)) {
      alert("Please fill Name, Phone Number, Country, Full Address and Postcode.");
      return;
    }
    const url = Store.cartWhatsappCheckoutLink(customer);
    window.open(url, "_blank", "noopener,noreferrer");
  });

  render();
})();
