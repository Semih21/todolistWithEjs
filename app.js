const express=require('express')
const bodyParser=require('body-parser')

const app=express()
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
var items=["Buy food","Eat food","Cook food"]
app.get('/',(req,res)=>{

    var today=new Date()
    var day=""
    var options = { weekday: 'long',  month: 'long', day: 'numeric' };
     day=today.toLocaleDateString("en-US",options)

    res.render('list',{kindOfDay:day,newTodoItems:items})
  
})
app.post("/",(req,res)=>{
  var item=req.body.newTodo
   items.push(item)
    res.redirect('/')
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})