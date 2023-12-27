// Consigna: realizar una clase “ProductManager” que gestione un conjunto de productos.
// El mismo debe poder agregar, consultar, modificar y eliminar un producto y manejarlo 
// en persistencia de archivos

const fs = require('fs');

function save(param_path, param_products) {
  fs.promises.writeFile(param_path, JSON.stringify(param_products), 'utf-8')
    .then(res => {
      console.log("Producto guardado correctamente");
    })
    .catch(err => {
      console.log(`Hubo un error: ${err}`);
    })
}

class ProductManager {
  constructor(){
    this.products = [];
    this.productId = 1;
    this.path = './files/products.json';
  }

  getProducts() {
    fs.promises.readFile(this.path, 'utf-8')
      .then(data => {
        this.products = JSON.parse(data);
        console.log(this.products);
      })
      .catch(err => `Hubo un error: ${err}`);
  }

  addProduct(title, description, price, thumbnail, code, stock) {

    // Funcion asincrona autoinvocada

    (
      async () => {
        if (!title || !description || !price || !thumbnail || !code || !stock){
          // Este condicional valida que todos los campos hayan sido completados
          console.log("Todos los campos son obligatorios.");
        } else {
          let bandera = true;
          try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            
            do {  
            // Este bucle cumple la funcion de incrementar automaticamente el ID del producto en caso
            // de que encuentre un repetido 
    
              if (!this.products.some(prod => prod.id === this.productId)) {
                // Este condicional valida que no exista ningun producto con el mismo ID que el generado
                bandera = false;
                if (!this.products.some(prod => prod.code === code)){
                  // Este condicional valida que no exista ningun producto con el mismo codigo que el
                  const product = { id: this.productId, title: title, description: description, price: price, thumbnail: thumbnail, code: code, stock: stock };
                  this.products.push(product);
      
                  save(this.path, this.products);
      
                } else {
                  console.log(`Error: ya existe un producto con el codigo ${code}`);
                }
              } else {
                this.productId += 1;
              }
            } while (bandera)
          } catch(err) {
            console.log(`Hubo un error: ${err}`);
          }
        }
      }
    )();
  }

  getProductById(id) {

    // Funcion asincrona autoinvocada

    (
      async () => {
        try {
          const data = await fs.promises.readFile(this.path, 'utf-8');
          this.products = JSON.parse(data);
          const element = this.products.find(e => e.id === id);
          if (element){
            console.log(element);
          } else {
            console.log(`No existe ningun producto con el ID ${id}`);
          }
        } catch(err) {
            console.log(`Hubo un error: ${err}`);
        }
      }
    )();
  }

  updateProduct(id, title, description, price, thumbnail, code, stock) {
    
    // Funcion asincrona autoinvocada

    (
      async () => {
        try {
          const data = await fs.promises.readFile(this.path, 'utf-8');
          this.products = JSON.parse(data);
          const element = this.products.find(e => e.id === id);
          if (element){
            this.products.map((item) => {
              if(item.id === element.id){
                if (!title || !description || !price || !thumbnail || !code || !stock){
                  // Este condicional valida que todos los campos hayan sido completados
                  console.log("Todos los campos son obligatorios.");
                } else {
                  item.title = title;
                  item.description = description;
                  item.price = price;
                  item.thumbnail = thumbnail;
                  item.code = code;
                  item.stock = stock;

                  save(this.path, this.products);

                }
              }
            })
            
          } else {
            console.log(`No existe ningun producto con el ID ${id}`);
          }
        } catch(err) {
            console.log(`Hubo un error: ${err}`);
        }
      }
    )()
  }

  deleteProduct(id) {
    
    // Funcion asincrona autoinvocada
    
    (
      async () => {
        try {
          const data = await fs.promises.readFile(this.path, 'utf-8');
          this.products = JSON.parse(data);
          const element = this.products.find(e => e.id === id);
          if (element){
            const eIndex = this.products.indexOf(element);
            this.products.splice(eIndex, 1);

            fs.promises.writeFile(this.path, JSON.stringify(this.products), 'utf-8')
              .then(res => {
                console.log("Producto ELIMINADO correctamente");
              })
              .catch(err => {
                console.log(`Hubo un error: ${err}`);
              })

          } else {
            console.log(`No existe ningun producto con el ID ${id}`);
          }
        } catch(err) {
            console.log(`Hubo un error: ${err}`);
        }
      }
    )()
  }

}

const pm = new ProductManager();

// pm.getProducts();

// pm.addProduct("TV", "Es una tele", 1999, "https://image.com", 234123, 5);

// pm.addProduct("Monitor", "Es un monitor", 1989, "https://image.com", 234124, 5);

// pm.getProducts();

// pm.getProductById(3);

// pm.updateProduct(2, "Ultrawide", "Es un monitorincic", 1888, "url", 2938294, 10);

// pm.getProducts();

pm.deleteProduct(2);

// pm.getProducts();