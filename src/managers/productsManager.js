import fs from 'fs';

class ProductsManager {
    constructor(path) {
        this.path = path
    }
    async getProducts(obj) {
        const { limit } = obj
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const products = JSON.parse(data);
                if (!limit) {
                    return products;
                } else {
                    const limitedProducts = products.slice(0, +limit)
                    return limitedProducts;
                }
            } else {
                const products = [];
                await fs.promises.writeFile(this.path, JSON.stringify(products))
                return products;
            }
        } catch (error) {
            return error;
        }
    }

    async addProduct(productData) {
        try {
            const products = await this.getProducts({});
            const { title, description, code, price, status, stock, category, thumbnails } = productData;

            if (!title || !description || !code || !price || !stock || !category) {
                throw new Error('Todos los campos deben estar definidos.');
            }
            if (products.some((product) => product.code === code)) {
                throw new Error('El código del producto ya existe.');
            }
            const newProduct = {
                id: products.length ? products[products.length - 1].id + 1 : 1,
                title,
                description,
                code,
                price,
                status,
                //status: status ? status : true,
                stock,
                category,
                thumbnails,
            };
            products.push(newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(products));
        } catch (error) {
            return error;
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts({});
            const product = products.find((product) => product.id === id);
            return product;
        } catch (error) {
            return error;
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts({});
            const product = products.find((product) => product.id === id);
            if (!product) {
                return console.log(`No se encontro un producto con el ID: ${id}.`);
            }
            const newProducts = products.filter((product) => product.id !== id);
            await fs.promises.writeFile(this.path, JSON.stringify(newProducts));
            return console.log(`Se elimino el producto de ID: ${id}.`)
        } catch (error) {
            return error;
        }
    }

    async updateProduct(id, productData) {
        try {
            const products = await this.getProducts({});
            const index = products.findIndex((product) => product.id === id);
            if (index === -1) {
                return console.log(`No se encontro un producto con el ID: ${id}.`);
            }
            const productUpdated = products[index];
            products[index] = { ...productUpdated, ...productData };
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return console.log(`Se actualizo el producto de ID: ${id}.`);
        } catch (error) {
            return error;
        }
    }
}

export const productsManager = new ProductsManager('products.json');