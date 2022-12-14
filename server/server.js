const  express = require('express')
const  fs = require('fs')
const app = express()

const PRODUTS_URL = './server/db/products.json';
const CART_URL = './server/db/cart.json';

app.use(express.json()) // сообщаем серверу, чтобы он настраивался на прием запросов json
app.use('/',express.static('./public')) // говорим серверу запускать файл index.html

// Products API
app.get('/api/getProducts', (req,res)=>{
    fs.readFile(PRODUTS_URL, 'utf-8',(err,data)=>{
        if(err){
            res.send({
                result: 0,
                err,
            })
        }else{
            res.send(data);
        }
    })
})

//Cart API

app.get('/api/getCart', (req,res)=>{
    fs.readFile(CART_URL, 'utf-8',(err,data)=>{
        if(err){
            res.send({
                result: 0,
                err,
            })
        }else{
            res.send(data);
        }
    })
})

app.post('/api/postProduct', (req, res) => {
    fs.readFile(CART_URL, 'utf-8', (err, data) => {
        if(err){
            res.send({
                result: 0,
                err,
            })
        } else {
            const cart = JSON.parse(data)
            cart.contents.push(req.body)

            fs.writeFile(CART_URL, JSON.stringify(cart), { encoding: "utf-8" }, (err) => {
                if(err){
                    res.send({
                        result: 0,
                        err,
                    })
                } else res.send({ result: 1 })
            })
        }
    })
})

    app.put('/api/putProduct/:id', (req, res) => {
        fs.readFile(CART_URL, 'utf-8', (err, data) => {
            if(err){
                res.send({
                    result: 0,
                    err,
                })
            }
            else {
                const cart = JSON.parse(data)
                const change = cart.contents.find((good) => {
                    return good.id_product === +req.params.id
                })
                change.quantity += req.body.quantity

                fs.writeFile(CART_URL, JSON.stringify(cart,null,4), 'utf-8', (err, data) => {
                    if(err){
                        res.send({
                            result: 0,
                            err,
                        })
                    }
                    else res.send({
                        result: 1,
                    })
                })
            }

        })
    })

app.delete('/api/deleteProduct/:id', (req, res) => {
    fs.readFile(CART_URL, 'utf-8', (err, data) => {
        if(err){
            res.send({
                result: 0,
                err,
            })
        }
        else {
            const cart = JSON.parse(data)
            const newContents = []
            cart.contents.forEach(good => {
                if(good.id_product === +req.params.id) {
                    if (good.quantity !== 1) {
                        good.quantity -= 1
                        newContents.push(good)
                    }
                } else newContents.push(good)
            })
            cart.contents = newContents

            fs.writeFile(CART_URL, JSON.stringify(cart), 'utf-8', (err, data) => {
                if(err){
                    res.send({
                        result: 0,
                        err,
                    })
                }
                else res.send({
                    result: 1,
                    cartItems: cart
                })
            })
        }

    })
})

app.listen(3000, () => {
    console.log('Server started!')
})
