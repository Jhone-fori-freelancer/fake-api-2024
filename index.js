
const express = require("express");
const app = express();

const traducir = require('node-google-translate-skidz');
const fs = require('fs').promises;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "pug");
app.set("views", "./vistas");

app.get('/', async (req, res) => {
   try {
       const response = await fetch('https://fakestoreapi.com/products');
       const productos = await response.json(); 
      
       // Traducción de los textos de los productos
       for (const producto of productos) {
            producto.title = await traductor(producto.title);
            producto.description = await traductor(producto.description);
            producto.category = await traductor(producto.category);  
        }

        const descuentos = JSON.parse(await fs.readFile("./src/database/db_descuento.json"));
        
       
        for (const producto of productos) {
            const desc = descuentos.find(descuento => descuento.id === producto.id);
            if (desc) {
                producto.descuento = desc.descuento;
            }
        }
        console.log(productos);
        res.render("index", { productos });
   } catch (error) {
       console.log(error);
   }
});

app.listen(3000, () => {
    console.log(`>>>>>>>>>>>> server running on port ${3030}`);
});

async function traductor(text) {
    try {
        const result = await traducir({
            text: text,
            source: 'en',
            target: 'es'
        });
        return result.translation;
    } catch (error) {
        console.error("Error en la traducción:", error);
        // En caso de error, devuelve el texto original
        return text;
    }
}
