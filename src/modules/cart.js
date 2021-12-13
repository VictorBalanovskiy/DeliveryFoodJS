const cart = () => {
  const buttonCart = document.getElementById("cart-button");
  const modalCart = document.querySelector(".modal-cart");
  const buttonClose = document.querySelector(".close");
  const body = modalCart.querySelector(".modal-body");
  const footer = modalCart.querySelector(".modal-footer");
  const buttonSend = modalCart.querySelector(".button-primary");
  const buttonClear = modalCart.querySelector(".clear-cart");

  const resetCart = () => {
    body.innerHTML = "";
    localStorage.removeItem("cart");
    modalCart.classList.remove("is-open");
  };

  const incrementCount = (id) => {
    const cartArray = JSON.parse(localStorage.getItem("cart"));

    cartArray.map((item) => {
      if (item.id === id) {
        item.count++;
      }

      return item;
    });

    localStorage.setItem("cart", JSON.stringify(cartArray));
    renderItems(cartArray);
  };

  const decrementCount = (id) => {
    const cartArray = JSON.parse(localStorage.getItem("cart"));

    cartArray.map((item) => {
      if (item.id === id) {
        item.count = item.count > 0 ? item.count - 1 : 0;
      }

      return item;
    });

    localStorage.setItem("cart", JSON.stringify(cartArray));
    renderItems(cartArray);
  };

  const renderItems = (data) => {
    body.innerHTML = "";

    data.forEach(({ name, price, id, count }) => {
      const cartElem = document.createElement("div");

      cartElem.classList.add("food-row");

      cartElem.innerHTML = `<span class="food-name">${name}</span>
					<strong class="food-price">${price}</strong>
					<div class="food-counter">
						<button class="counter-button btn-dec" data-index=${id}>-</button>
						<span class="counter">${count}</span>
						<button class="counter-button btn-inc" data-index=${id}>+</button>
					</div>`;

      body.append(cartElem);
    });
  };

  const renderTotat = () => {
    const cartArray = JSON.parse(localStorage.getItem("cart"));
    const totalPriceArray = [];

    const arrayPush = (cartArray) => {
      totalPriceArray.length = 0;
      if (localStorage.getItem("cart")) {
        for (let i = 0; i < cartArray.length; i++) {
          totalPriceArray.push(cartArray[i].price * cartArray[i].count);
        }
      }
    };
    arrayPush(cartArray);

    const add = (accumulator, a) => {
      return accumulator + a;
    };
    const sum = totalPriceArray.reduce(add, 0);
    console.log(sum);
    const totalPrice = document.createElement("div");

    totalPrice.classList.add("modal-footer");

    totalPrice.innerHTML = `<span class="modal-pricetag">${sum} ₽</span>`;

    footer.prepend(totalPrice);
  };

  body.addEventListener("click", (e) => {
    e.preventDefault();

    if (e.target.classList.contains("btn-inc")) {
      incrementCount(e.target.dataset.index);
      renderTotat(JSON.parse(localStorage.getItem("cart")));
    } else if (e.target.classList.contains("btn-dec")) {
      decrementCount(e.target.dataset.index);
      renderTotat(JSON.parse(localStorage.getItem("cart")));
    } else if (e.target.classList.contains("clear-cart")) {
      resetCart(e.target.dataset.index);
    }
  });

  buttonSend.addEventListener("click", () => {
    const cartArray = localStorage.getItem("cart");

    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: cartArray,
    })
      .then((response) => {
        if (response.ok) {
          resetCart();
        }
      })
      .catch((e) => {
        console.error(e);
      });
  });

  buttonClear.addEventListener("click", () => {
    resetCart();
  });

  buttonCart.addEventListener("click", () => {
    if (localStorage.getItem("cart")) {
      renderItems(JSON.parse(localStorage.getItem("cart")));
      renderTotat();
    }

    modalCart.classList.add("is-open");
  });

  buttonClose.addEventListener("click", () => {
    modalCart.classList.remove("is-open");
  });
};

export default cart;
