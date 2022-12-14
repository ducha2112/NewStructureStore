Vue.component('products', {
    data () {
        return {
            catalogUrl: '',
            products: [],
            filtered: [],
            imgCatalog: 'https://via.placeholder.com/200x150'
        }
    },
    methods:{
        filter(val) {
            let regexp = new RegExp(val, 'i');
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
        }
    },
    mounted() {
        this.$parent.getJson(`/api/getProducts`)
            .then(data => {
                for (let item of data) {
                    this.products.push(item);
                    this.filtered.push(item);
                }
            });

    },
    template: `<div class="products">
                <product v-for="item of filtered" 
                :key="item.id_product"
                :img="imgCatalog"
                :product="item"></product>
               </div>`
});
Vue.component('product', {
    props: ['product', 'img'],
    template: `
            <div class="product-item">
                <img :src="img" alt="Some img">
                <div class="desc">
                    <h3>{{product.product_name}}</h3>
                    <p>{{product.price}}</p>
<!--                    <button class="buy-btn" @click="$parent.$emit('add-product', product)">Купить</button>-->
                        <button class="buy-btn" @click="$root.$refs.cart.addProduct(product)">Купить</button>
                </div>
            </div>
    `
})