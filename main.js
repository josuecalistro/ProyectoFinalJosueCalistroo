document.addEventListener('DOMContentLoaded', async () => {
    const { value: email } = await Swal.fire({
        title: "Ingresa tu correo electronico",
        input: "email",
        inputPlaceholder: "ejemplo@gmail.com"
      });
      if (email) {
        Swal.fire(`Entered email: ${email}`);
      }
      const { value: password } = await Swal.fire({
        title: "Ingresa tu Contraseña",
        input: "password",
        inputLabel: "Recuerde lo que ingrese",
        inputPlaceholder: "contraseña",
        inputAttributes: {
          maxlength: "10",
          autocapitalize: "off",
          autocorrect: "off"
        }
      });
      
      

    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const DOMbotonComprar = document.querySelector('#boton-comprar');
    const miLocalStorage = window.localStorage;

    

    function renderizarProductos() {
        baseDeDatos.forEach((info) => {
            
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');
            
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;
            
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);
            
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${info.precio}${divisa}`;
            miNodoPrecio.textContent = `${divisa}${info.precio}`;
    
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = '+';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', añadirProductoAlCarrito);
            
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }
    
   function animacionAñadirAlCarrito(){
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "Producto agregado al carrito de forma correcta"
      });
   }
    function añadirProductoAlCarrito(evento) {
        carrito.push(evento.target.getAttribute('marcador'))

        animacionAñadirAlCarrito();
        renderizarCarrito();      
        guardarCarritoEnLocalStorage();
    }

    function animacionElimiarProductoDelCarrito(evento){
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "error",
            title: "Producto eliminado del carrito de forma correcta"
          });


    }

    function renderizarCarrito() {
        DOMcarrito.textContent = '';
        
        const carritoSinDuplicados = [...new Set(carrito)];
        
        carritoSinDuplicados.forEach((item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => { 
                return itemBaseDatos.id === parseInt(item);
            });
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
               
                return itemId === item ? total += 1 : total;
            }, 0);
            
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
           
            const miBotonVaciar = document.createElement('button');
            miBotonVaciar.classList.add('btn', 'btn-danger', 'mx-5');
            miBotonVaciar.textContent = 'X';
            miBotonVaciar.style.marginLeft = '1rem';
            miBotonVaciar.dataset.item = item;
            miBotonVaciar.addEventListener('click', borrarItemCarrito);
            
            miNodo.appendChild(miBotonVaciar);
            DOMcarrito.appendChild(miNodo);
        });
       
        DOMtotal.textContent = calcularTotal();
    }
   
    
    function borrarItemCarrito(evento){
      
        const id = evento.target.dataset.item;
      
        const index = carrito.findIndex((carritoId) => carritoId === id);
        if(index !== -1){
            carrito.splice(index, 1);
        };
        animacionElimiarProductoDelCarrito();
       
        renderizarCarrito();
        
        guardarCarritoEnLocalStorage();
    }
    
    function calcularTotal() {
        
        return carrito.reduce((total, item) => {
            
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
           
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }
 
    function animacionVaciar() {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
    
        return swalWithBootstrapButtons.fire({
            title: "¿Estás seguro de vaciar el carrito?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, vaciar",
            cancelButtonText: "Cancelar",
            
           
    reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                
                carrito = [];
                
                renderizarCarrito();
                
                localStorage.clear();
            }
            
            })
    return result; 
        };
    
    
    function vaciarCarrito() {
        
        
        animacionVaciar
    animacionVaciar().then((result) => {
            
           
    if (result.isConfirmed) {
               
                carrito = [];
                
    
                renderizarCarrito();
                
                
               
    localStorage.clear();
            }
        });
    }
    function guardarCarritoEnLocalStorage () {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }
    function cargarCarritoDeLocalStorage () {
       
        if (miLocalStorage.getItem('carrito') !== null) {
           
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }
    

    
    function animacionCompra() {
        
        const swalWithBootstrapButtonss = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
          });
          swalWithBootstrapButtonss.fire({
            title: "Estas seguro de realizar esta compra???",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, estoy seguro",
            cancelButtonText: "No, capo no tengo guita",
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              swalWithBootstrapButtonss.fire({
                title: "Perfecto",
                text: "Su compra se realizo con Exito",
                icon: "success"
              });
            } else if (
              
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtonss.fire({
                title: "F",
                text: "Espero que puedas juntar la plata para poder comprarte las camisetas :)",
                icon: "error"
              });
            }
          });
    }
    function comprarCarrito() {
        
        animacionCompra().then((result) => {
            
           
            if (result.isConfirmed) {
                       
                        carrito = [];
                        
            
                        renderizarCarrito();
                        
                        
                       
            localStorage.clear();
                    }
                });
            }
    
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    DOMbotonComprar.addEventListener('click', comprarCarrito);

    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});
