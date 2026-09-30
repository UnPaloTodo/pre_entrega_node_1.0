console.log("Inicio del programa");

async function obtener_datos() {
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erros. No se obtuvieron productos:", error);
        return null;
    }
}

async function obtener_datos_por_id(id) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const texto = await response.text();
        if (!texto) {
            throw new Error(`No existe un producto con id ${id}`);
        }

        return JSON.parse(texto);
    } catch (error) {
        console.error(`Error. No se obtuvo el producto ${id}:`, error.message);
        return null;
    }
}

async function crear_entrada(producto) {
    try {
        const response = await fetch("https://fakestoreapi.com/products", {
            method: "POST",
            body: JSON.stringify(producto),
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return await response.json();

    } catch (error) {
        console.error("Error al crear el producto:", error);
        return null;
    }
}

async function borrar_entrada(id) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const texto = await response.text();
        if (!texto) {
            throw new Error(`No se pudo eliminar el producto ${id}`);
        }

        return JSON.parse(texto);
    } catch (error) {
        console.error(`Error. No se pudo eliminar el producto ${id}:`, error.message);
        return null;
    }
}

switch (process.argv[2]) {
    case "GET": {
        const argumento = process.argv[3];
        let datos;

        if (argumento) {
            const [recurso, id] = argumento.split("/");

            if (recurso === "products") {
                if (id) {
                    datos = await obtener_datos_por_id(id);
                } else {
                    datos = await obtener_datos();
                }
            } else {
                console.log("Recurso inválido");
            }
        } else {
            console.log("Comando incompleto");
        }

        if (datos) {
            console.log(datos);
        }
        break;
    }

    case "POST": {
        const recurso = process.argv[3];

        if (recurso === "products" && process.argv[4] && process.argv[5] && process.argv[6]) {
            const producto = {
                title: process.argv[4],
                price: Number(process.argv[5]),
                category: process.argv[6]
            };

            const datos = await crear_entrada(producto);
            if (datos) {
                console.log("Producto creado:", datos);
            }
        } else {
            console.error("Error. Faltan argumentos o recurso inválido");
        }
        break;
    }

    case "DELETE": {
        const argumento = process.argv[3];

        if (argumento) {
            const [recurso, id] = argumento.split("/");

            if (recurso === "products") {
                if (id) {
                    const datos = await borrar_entrada(id);
                    if (datos) {
                        console.log("Producto eliminado:", datos);
                    }
                } else {
                    console.log("Falta el id del producto a eliminar");
                }
            } else {
                console.log("Recurso inválido");
            }
        } else {
            console.log("Comando incompleto");
        }
        break;
    }
    default:
        console.log("Comando incompleto o inválido");
}

console.log("Fin del programa");

/* async function actualizar_entrada(id, producto) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
            method: "PUT",
            body: JSON.stringify(producto),
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        return null;
    }
}
*/
