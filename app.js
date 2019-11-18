const express=require('express')
const bodyParser=require('body-parser')
const date=require(__dirname+'/date.js')

const app=express()
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
let items=["Buy food","Eat food","Cook food"]
let workItems=[]
app.get('/',(req,res)=>{

    let day=date()
    res.render('list',{listTitle:day,newListItems:items})
  
})

app.get('/work',(req,res)=>{
    res.render('list',{listTitle:"Work list",newListItems:workItems})
})
app.get('/about',(req,res)=>{
    res.render('about')
})
app.post("/",(req,res)=>{
  let item=req.body.newItem
  if(req.body.list==="Work"){
      workItems.push(item)
      res.redirect('/work')
  }else{
    items.push(item)
    res.redirect('/')
  }
  
})
app.post("/work",(req,res)=>{
    let item=req.body.newItem
     workItems.push(item)
      res.redirect('/')
  })

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})