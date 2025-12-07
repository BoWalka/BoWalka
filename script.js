fetch('products.json')
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById('products');
    products.forEach(p => {
      container.innerHTML += `
        <div class="product">
          <img src="${p.image}" alt="${p.title}">
          <h3>${p.title}</h3>
          <p>${p.price}</p>
          <a href="${p.link}" class="buy-btn">Buy Now</a>
        </div>
      `;
    });
  });
