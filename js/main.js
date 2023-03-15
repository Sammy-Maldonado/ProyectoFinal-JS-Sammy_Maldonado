/* CHURULANDIA - CARRITO DE COMPRAS */

//1) Creando arrays de productos, carrito y subiendo los productos desde "json/productos.json" con fetch

let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const stockProductos = "json/productos.json";

fetch(stockProductos)
  .then(response => response.json())
  .then(data => {
    productos = data;
    importarProductos(data);
  })
  .catch(error => console.log(error));

//2) Modificando el DOM para mostrar los productos

const ProductosChurulandia = document.getElementById("ProductosChurulandia");

//3) Creando la función para mostrar los productos

function importarProductos(productos) {
  productos.forEach(producto => {
    const card = document.createElement("div");
    card.classList.add("col-xl-3", "col-md-6", "col-sm-12");
    card.innerHTML =
      `
    <div class ="card rounded-4">
      <img src = "${producto.img}" class = "card-img-top imgProductos" alt="${producto.nombre}">
      <div class="contenedorDescripcion">
        <h2 class="text-center"> ${producto.nombre} </h2>
        <p class="text-center"> $${producto.precio} </p>
        <button class="btn botonCards" id="boton${producto.id}"> Agregar al Carrito </button>
      </div>
    </div>
    `
    ProductosChurulandia.appendChild(card);

    //4) Utilizando Toastify para notificar cuando se agrega un producto al carrito
    const boton = document.getElementById(`boton${producto.id}`);
    boton.addEventListener("click", () => {
      agregarAlCarrito(producto.id);
      Toastify({
        text: "Producto agregado al carrito",
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #008CBA, #FFF",
          color: "black"
        }
      }).showToast();
    })
  })
}

//5) Agregando productos al carrito
const agregarAlCarrito = (id) => {
  const producto = productos.find((producto) => producto.id === id);
  const productoEnCarrito = carrito.find((producto) => producto.id === id);
  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    carrito.push(producto);
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  calcularTotal();
}

//6) Mostrando productos del carrito
const carritoCointainer = document.getElementById("carritoCointainer");
const mostrarCarrito = document.getElementById("mostrarCarrito");

mostrarCarrito.addEventListener("click", () => {
  verCarrito();
});

const verCarrito = () => {
  carritoCointainer.innerHTML = "";
  carrito.forEach(producto => {
    const card = document.createElement("div");
    card.classList.add("col-xl-3", "col-md-6", "col-sm-12");
    card.innerHTML =
      `
    <div class ="card rounded-4">
      <img src = "${producto.img}" class = "card-img-top imgProductos" alt="${producto.nombre}">
      <div class="contenedorDescripcion">
        <h2 class="text-center"> ${producto.nombre} </h2>
        <p class="text-center"> $${producto.precio} </p>
        <p class="text-center"> ${producto.cantidad} </p>
        <button class="btn botonCards" id="eliminar${producto.id}"> Eliminar </button>
        <div class="m-4">
        <button class="btn botonCards me-2" id="aumentar${producto.id}"> + </button>
        <button class="btn botonCards ms-2" id="disminuir${producto.id}"> - </button>
        </div>
      </div>
    </div>
    `
    carritoCointainer.appendChild(card);


    //7) Habilitando botones para aumentar, disminuir y eliminar productos desde el carrito
    const aumentar = document.getElementById(`aumentar${producto.id}`)
    aumentar.addEventListener("click", () => {
      aumentarProducto(producto.id);
    })

    const disminuir = document.getElementById(`disminuir${producto.id}`)
    disminuir.addEventListener("click", () => {
      disminuirProducto(producto.id);
    })

    const eliminar = document.getElementById(`eliminar${producto.id}`);
    eliminar.addEventListener("click", () => {
      eliminarProducto(producto.id);
    })
  })
  calcularTotal();
}

//8) Declarando funciones que aumentan, disminuyen y eliminan los productos del carrito

const aumentarProducto = (id) => {
  const producto = carrito.find((producto) => producto.id === id);
  producto.cantidad++;
  localStorage.setItem("carrito", JSON.stringify(carrito));
  verCarrito();
}

const disminuirProducto = (id) => {
  const producto = carrito.find((producto) => producto.id === id);
  producto.cantidad--;
  if (producto.cantidad === 0) {
    eliminarProducto(id);
    producto.cantidad = 1;
  } else {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
  verCarrito();
}

const eliminarProducto = (id) => {
  const producto = carrito.find(producto => producto.id === id);
  const indice = carrito.indexOf(producto);
  carrito.splice(indice, 1);
  producto.cantidad = 1;
  verCarrito();
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

//9) Calculando el total de la compra

const total = document.getElementById("total");

const calcularTotal = () => {
  let totalCompra = 0;
  carrito.forEach(producto => {
    totalCompra += producto.precio * producto.cantidad;
  })
  total.innerHTML = `$ ${totalCompra}`;
}

//10) Vaciando todo el carrito + Alerta de Sweet Alert

const vaciarCarrito = document.getElementById("vaciarCarrito");

vaciarCarrito.addEventListener("click", () => {
  swal.fire({
    title: "¿Esta seguro que desea vaciar el carrito?",
    icon: "warning",
    confirmButtonText: "Aceptar",
    showCancelButton: true,
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      vaciarTodoElCarrito();
      swal.fire({
        title: "Se ha vaciado el carrito",
        icon: "success",
        confirmButtonText: "Aceptar"
      })
    }
  })
})

//11) Agregando botón para finalizar la compra + Alerta de Sweet Alert

const finalizarCompra = document.getElementById("finalizarCompra");

finalizarCompra.addEventListener("click", () => {
  swal.fire({
    title: "¿Esta seguro que desea confirmar este pedido?",
    icon: "warning",
    confirmButtonText: "Aceptar",
    showCancelButton: true,
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      vaciarTodoElCarrito();
      swal.fire({
        title: "Sus productos han sido enviados!",
        icon: "success",
        confirmButtonText: "Aceptar"
      })
    }
  })
})

const vaciarTodoElCarrito = () => {
  carrito = [];
  verCarrito();

  //Limpiando el localStorage:
  localStorage.clear();
}

//12) Agregando algúnas características de los productos utilizando fetch

const instrucciones = document.getElementById("instrucciones");
const instruccionesProducto = "json/etiquetas.json";

fetch(instruccionesProducto)
  .then(response => response.json())
  .then(datos => {
    datos.forEach(producto => {
      const img = document.createElement("div");
      img.classList.add("instrucciones");
      img.innerHTML =
        `
      <div class="instrucciones2 card rounded-5 col-xl-12 col-md-12 col-sm-12">
        <img class="img-fluid" src="${producto.url}" alt="${producto.nombre}">
      </div>
      `
      instrucciones.appendChild(img);
    })
  })
  .catch(error => console.log(error))
  .finally(() => console.log("El código ha sido ejecutado"));