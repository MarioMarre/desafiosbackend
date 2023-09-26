/* Realizar una clase de nombre “ProductManager”, el cual permitirá trabajar con múltiples productos. 
Éste debe poder agregar, consultar, modificar y eliminar un producto y manejarlo en persistencia 
de archivos (basado en entregable 1). */
/* Aspectos a inclir
La clase debe contar con una variable this.path, el cual se inicializará desde el 
constructor y debe recibir la ruta a trabajar desde el momento de generar su instancia. */
/* Debe guardar objetos con el siguiente formato:
id (se debe incrementar automáticamente, no enviarse desde el cuerpo)
title (nombre del producto)
description (descripción del producto)
price (precio)
thumbnail (ruta de imagen)
code (código identificador)
stock (número de piezas disponibles) */
/* Debe tener un método addProduct el cual debe recibir un objeto con el formato 
previamente especificado, asignarle un id autoincrementable y guardarlo en el arreglo 
(recuerda siempre guardarlo como un array en el archivo).
Debe tener un método getProducts, el cual debe leer el archivo de productos y devolver 
todos los productos en formato de arreglo.
Debe tener un método getProductById, el cual debe recibir un id, y tras leer el archivo,
 debe buscar el producto con el id especificado y devolverlo en formato objeto */
/*  Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, 
 así también como el campo a actualizar (puede ser el objeto completo, como en una DB),
  y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID 
 Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto 
 que tenga ese id en el archivo. */
 

 const fs = require ("fs");

 class ProductManager {
   constructor(filename) {
     this.filename = filename;
     try {
       const data = readFileSync(this.filename, "utf8");
       this.products = JSON.parse(data);
     } catch (error) {
       this.products = [];
     }
   }
 
   saveProducts() {
     const data = JSON.stringify(this.products);
     fs.writeFileSync(this.filename, data, "utf8");
   }
 
   getProducts() {
     return this.products;
   }
 
   getProductById(id) {
     const product = this.products.find(p => p.id === id);
     if (!product) {
       throw new Error(`Product with id ${id} not found`);
     }
     return product;
   }
 
   addProduct({ title, description, price, thumbnail, code, stock }) {
     if (this.products.some(p => p.code === code)) {
       throw new Error(`Product with code ${code} already exists`);
     }
     const id = this.generateId();
     const product = { id, title, description, price, thumbnail, code, stock };
     this.products.push(product);
     this.saveProducts();
     return product;
   }
 
   updateProduct(id, fields) {
     const productIndex = this.products.findIndex(p => p.id === id);
     if (productIndex < 0) {
       throw new Error(`Product with id ${id} not found`);
     }
     const product = { id, ...fields };
     this.products[productIndex] = product;
     this.saveProducts();
     return product;
   }
 
   deleteProduct(id) {
     const productIndex = this.products.findIndex(p => p.id === id);
     if (productIndex < 0) {
       throw new Error(`Product with id ${id} not found`);
     }
     this.products.splice(productIndex, 1);
     this.saveProducts();
   }
 
   generateId() {
     let id = 1;
     if (this.products.length > 0) {
       id = this.products[this.products.length - 1].id + 1;
     }
     return id;
   }
 }
 
 // Creo instancia de ProductManager
 const manager = new ProductManager("products.json");
 
 // Obtengo productos (devuelve un array con los productos)
 console.log(manager.getProducts());
 
 // Agrego producto
 const product = manager.addProduct({
   title: "producto prueba",
   description: "Este es un producto prueba",
   price: 200,
   thumbnail: "Sin imagen",
   code: "abc123",
   stock: 25,
 });
 console.log(product); //Muestro el objeto producto con id generado
 
 // Obtengo productos (devuelve el array con el producto agregado)
 console.log(manager.getProducts());
 
 // Obtengo producto por id (devuelve el objeto producto)
 console.log(manager.getProductById(product.id));
 
 // Actualizo producto
 const updatedProduct = manager.updateProduct(product.id, { price: 300, stock: 10 });
 console.log(updatedProduct); // Muestro el objeto producto actualizado
 
 // Elimino producto
 manager.deleteProduct(product.id);
 