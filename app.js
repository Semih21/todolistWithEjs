const express=require('express')
const bodyParser=require('body-parser')
const date=require(__dirname+'/date.js')
const mongoose=require('mongoose')
const _=require('lodash')
const app=express()
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect("mongodb+srv://semih21:12345@cluster0-3i3es.mongodb.net/todolistDB",{useNewUrlParser:true})
// mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true})

const itemsSchema=new mongoose.Schema({
    name:String
})
const Item=mongoose.model('Item',itemsSchema)
const item1=new Item({
    name:"Welcome to your todolist"
})
const item2=new Item({
    name:"Hit the + to add a new item"
})
const item3=new Item({
    name:"<-- hits to delete an item"
})
const defaultItems=[item1,item2,item3]

const listSchema=new mongoose.Schema({
    name:String,
    items:[itemsSchema]
})
const List=mongoose.model('List',listSchema)


app.get('/',(req,res)=>{

    //let day=date()
    
    Item.find({},function(err,foundItems){
        if(foundItems.length===0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err)
                }else{
                    console.log("Items are added successfully")
                }
            })
            res.redirect('/')
        }else{
            res.render('list',{listTitle:"Today",newListItems:foundItems})
        }
        
    })
  
})

// app.get('/work',(req,res)=>{
//     res.render('list',{listTitle:"Work list",newListItems:workItems})
// })
app.get('/:customListName',(req,res)=>{
    const customListName=_.capitalize(req.params.customListName)
 
    List.findOne({name:customListName},function(err,foundlist){
 if(!err){
     if(!foundlist){
        const list=new List({
            name:customListName,
            items:defaultItems
        })
        list.save()
        res.redirect('/'+customListName)
     }else{
        res.render('list',{listTitle:foundlist.name,newListItems:foundlist.items})
     }
 }
       
    })
   
})
app.get('/about',(req,res)=>{
    res.render('about')
})
app.post("/",(req,res)=>{
//   let item=req.body.newItem
//   if(req.body.list==="Work"){
//       workItems.push(item)
//       res.redirect('/work')
//   }else{
//     items.push(item)
//     res.redirect('/')
//   }
const itemName=req.body.newItem
const listName=req.body.list
const item=new Item({
    name:itemName
})
if(listName==="Today"){
    item.save()
    res.redirect('/')
}else{
    List.findOne({name:listName},function(err,foundList){
        foundList.items.push(item)
        foundList.save()
        res.redirect('/'+listName)
    })
   
}

  
})
app.post('/delete',(req,res)=>{
    const checkedItemId=req.body.checkbox
    const listName=req.body.listName

    if(listName==="Today"){
        Item.findByIdAndRemove(checkedItemId,function(err){
            if(!err){
                console.log("Successfuly deleted")
            }
            res.redirect('/')
        })
    }else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
if(!err){
    res.redirect('/'+listName)
}
        })
    }
 
    
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port,()=>{
    console.log("Server has started successfully")
})