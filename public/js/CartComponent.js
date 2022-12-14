Vue.component('cart', {
    data(){
        return {
            imgCart: 'https://via.placeholder.com/50x100',
            cartUrl: '/getBasket.json',
            cartItems: [],
            show: false,
        }
    },
    methods:{
        addProduct(product){//product - это объект с товаром, который добавим в корзину
            let change = this.cartItems.find(el => el.id_product === product.id_product);
            if(change){
                this.$parent.putJson(`/api/putProduct/${change.id_product}`, {quantity: 1});
                change.quantity++;
            } else {
                let prod = Object.assign({quantity: 1}, product);
                this.$parent.postJson('/api/postProduct', prod)
                    .then(data => {
                        if (data.result === 1) {
                            this.cartItems.push(prod);
                        }
                    });
            }
        },
        remove(item) {
            let change = this.cartItems.find(el => el.id_product === item.id_product);
            this.$parent.deleteJson(`/api/deleteProduct/${change.id_product}`)
                .then(data => {
                    if(data.result === 1) {
                        this.cartItems = data.cartItems.contents
                        console.log(this.cartItems)
                    }
                })
        },
    },
    mounted(){
        this.$parent.getJson('/api/getCart')
            .then(data=>{
                for(let item of data.contents){
                    this.cartItems.push(item);
                }
            });
    },

template: `
    <div>
        <button class="btn-cart" type="button" @click="show = !show">Корзина</button>
            <div class="cart-block" v-show="show">
                <p v-if="!cartItems.length">Корзина пуста</p>
                <cart-item class="cart-item" 
                v-for="item of cartItems" 
                :key="item.id_product"
                :cart-item="item" 
                :img="imgCart"
                @remove="remove">
                </cart-item>
            </div>
    </div>
    `
})

Vue.component('cart-item', {
    props: ['cartItem', 'img'],
    template: `
    <div class="cart-item">
        <img src="https://via.placeholder.com/200x150" class="cart-img"/>
        <div class="cart-text">
            <h3>{{ cartItem.product_name }}</h3>
            <p>{{ cartItem.price }}₽</p>
            <p>товар {{ cartItem.quantity }}</p>
        </div>
        <button class="del-btn" @click="$parent.remove(cartItem)">&times;</button>
    </div>
    `
})