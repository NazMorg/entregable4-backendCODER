import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from './utils.js';
import viewsRouter from './router/views.router.js';
import { productsManager } from './managers/productsManager.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

//handlebars:
app.engine('handlebars', engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//routers:
app.use('/', viewsRouter);

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando puerto ${PORT}...`);
})

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on("createProduct", async (product) => {
        const newProduct = await productsManager.addProduct(product);
        socketServer.emit("productAdded", newProduct);
    })

    socket.on("deleteProduct", async (id) => {
        const deletedProduct = await productsManager.deleteProduct(+id);
        socket.emit("productDeleted", deletedProduct);
        console.log(deletedProduct)
    })
})