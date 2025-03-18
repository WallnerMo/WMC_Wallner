class Pizza {
    constructor(name, price, isVeggie) {
        this.name = name;
        this.price = price;
        this.isVeggie = isVeggie;
    }
}

let arr = [];
arr.push(new Pizza("Salami", 8.50, false));
arr.push(new Pizza("Gemüse", 7.50, true));
arr.push(new Pizza("Schinken", 8.00, false));
arr.push(new Pizza("Hawaii", 10.00, true));
arr.push(new Pizza("Margarita", 6.50, true));
arr.push(new Pizza("Thunfisch", 9.00, false));


function compare_price(pizza_a, pizza_b) {
    return pizza_a.price - pizza_b.price;
}

console.log("Pizza:", arr);

arr.reverse();
console.log("Pizzas reverse", arr);

//arr.sort((pizza_a, pizza_b) => {return pizza_a.price - pizza_b.price; });
arr.sort(compare_price);
console.log("Pizzas sort price", arr);

arr.sort((pizza_a, pizza_b) => pizza_a.name.localeCompare(pizza_b.name));
console.log("Pizzas sort name", arr);

let veggie = arr.filter(pizza => pizza.isVeggie);
console.log("Veggie Pizzas", veggie);

