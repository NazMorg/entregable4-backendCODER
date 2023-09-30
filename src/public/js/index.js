const socketClient = io();
const addForm = document.getElementById("addForm");
const deleteForm = document.getElementById("deleteForm");
const inputId = document.getElementById("id");
const inputTitle = document.getElementById("title");
const inputDescription = document.getElementById("description");
const inputCode = document.getElementById("code");
const inputPrice = document.getElementById("price");
const inputStock = document.getElementById("stock");
const inputCategory = document.getElementById("category");

addForm.onsubmit = () => {
    const product = {
        title: inputTitle.value,
        description: inputDescription.value,
        code: inputCode.value,
        price: inputPrice.value,
        stock: inputStock.value,
        category: inputCategory.value,
    };
    socketClient.emit("createProduct", product);
}

socketClient.on("productAdded", (product) => {
    const { id, title, description, price, stock, category } = product;
    const row = `
        <tr>
            <td>${id}</td>
            <td>${title}</td>
            <td>${description}</td>
            <td>${price}</td>
            <td>${stock}</td>
            <td>${category}</td>
        </tr>`;
    table.innerHTML += row;
});

deleteForm.onsubmit = () => {
    const productId = inputId.value;
    socketClient.emit("deleteProduct", productId);
}

socketClient.on("productDeleted", (product) => {
    const { id, title, description, price, stock, category } = product;
    const row = `
        <tr>
            <td>${id}</td>
            <td>${title}</td>
            <td>${description}</td>
            <td>${price}</td>
            <td>${stock}</td>
            <td>${category}</td>
        </tr>`;
    table.innerHTML -= row;
});