const addToCartBtn = document.querySelectorAll('.book-item-list-btn');
const bookName = document.querySelectorAll('.book-item-list-name');
const initialPrice = document.querySelectorAll('.book-item-list-price');
const shoppingCart = document.querySelector('.shopping-conatiner');
const total = document.querySelector('.total');

const orderArr = [];
const priceArr = [];

addToCartBtn.forEach(btn => {
  btn.addEventListener('click', (e) => {
    let parentEl = Array.from(e.target.closest('ul').children);
    let bookNameText = parentEl.filter(el => el.className === 'book-item-list-name' ? el : null);
    let priceText = parentEl.filter(el => el.className === 'book-item-list-price' ? el : null);
    productObj = {
      idx: orderArr.length + 1,
      book: bookNameText[0].textContent,
      price: priceText[0].textContent,
    };
    e.target.closest('button').disabled = true;
    e.target.closest('button').innerHTML = '&#10004';
    setTimeout(() => {
      e.target.closest('button').disabled = false;
      e.target.closest('button').innerHTML = 'Add to cart';
    }, 5000);

    let filteredOrders = orderArr.some(order => order.book === productObj.book);

    if (!filteredOrders) {
      orderArr.push(productObj);
      renderOrders(productObj, orderArr);
    }
  });
});


const renderOrders = (obj, arr) => {
  let shoppingList = document.createElement('ul');
  shoppingList.setAttribute('class', 'shopping-body');
  shoppingList.setAttribute('id', `${arr.length - 1}`);
  shoppingList.innerHTML = `<li class='index'>${obj.idx}</li>
  <li class="title">${obj.book}</li>
  <li>1</li>
  <li id="price">$${obj.price}</li>
  <li>
    <button class="btn btn-warning">
      <i class="fas fa-minus"></i>
    </button>
    <button class="btn btn-success">
      <i class="fas fa-plus"></i>
    </button>
    <button class="btn btn-danger">
      <i class="fas fa-trash-alt"></i>
    </button>
  </li>`;
  if (arr.length <= 2) {
    priceArr.push([Number(obj.price)]);
  }

  shoppingCart.append(shoppingList);

  total.innerHTML = `Total: $${totalPrice(priceArr)}`;

  let alert = document.createElement('div');
  alert.setAttribute('class', 'notification');
  alert.innerHTML = `You can not enter qty below 0`;

  let removeBtn = shoppingList.querySelector('.btn-danger');
  let minusBtn = shoppingList.querySelector('.btn-warning');
  let plusBtn = shoppingList.querySelector('.btn-success');


  removeBtn.addEventListener('click', removeBtnHandler);

  shoppingCart.addEventListener('click', (e) => {
    let liIndex = shoppingList.querySelector('.index');
    if (e.target.className.includes('fa-trash-alt')) {
      shoppingList.setAttribute('id', `${arr.length - 1}`);
    }
  });

  plusBtn.addEventListener('click', (e) => {
    let a = e.target.closest('ul').id;
    priceArr[a].push(Number(obj.price));
    shoppingList.children[2].innerHTML = priceArr[a].length;
    let priceVal = e.target.closest('ul').children[3];
    total.innerHTML = `Total: $${totalPrice(priceArr)}`;
    priceVal.innerHTML = `$${priceArr[a].reduce((prevVal, curVal) => Number(prevVal += curVal), 0)}`;
  });

  minusBtn.addEventListener('click', (e) => {
    let a = e.target.closest('ul').id;
    let priceVal = e.target.closest('ul').children[3];
    if (priceArr[a].length > 1) {
      priceArr[a].pop(Number(obj.price));
      shoppingList.children[2].innerHTML = priceArr[a].length;
      if (priceArr[a].length === 1) {
        return;
      }
      else {
        priceVal.innerHTML = `$${(priceArr[a].reduce((prevVal, curVal) => Number(prevVal += curVal), 0)) - obj.price}`;
      }
      total.innerHTML = `Total: $${totalPriceMinus(obj.price, totalPrice(priceArr))}`;
    }
  });
};


function removeBtnHandler(e) {
  let target = e.target;
  let placeInArr = target.closest('ul').id;
  let priceVal = target.closest('ul').children[3].textContent;
  let removePrice = Number(priceVal.split('').splice(1, priceVal.length).join(''));
  let placeInPriceArr = priceArr.indexOf(removePrice);
  let grandTotal = Number(total.innerHTML.split('').splice(8, 9).join(''));
  if (target) {
    total.innerHTML = `Total: $${grandTotal - removePrice}`;
    target.closest('ul').remove();
    priceArr[placeInArr].splice(placeInPriceArr, 1);
    priceArr[placeInArr] = [0];
    orderArr.splice(placeInArr, 1);
  }
};


function totalPrice(arr) {
  let sum = arr.map(el => el.reduce((prevVal, curVal) => prevVal += curVal, 0)).reduce((prevVal, curVal) => prevVal += curVal, 0);

  return sum;
}

function totalPriceMinus(price, total) {
  let result = total - price;

  return result;
}







