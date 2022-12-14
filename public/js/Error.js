Vue.component('error',{
    data() {
        return {
            text: ''
        }
    },
       method:{
        setError(){
            this.text = error
        }
       },
    template:`
    <div>{{ text }}</div>
    `
})