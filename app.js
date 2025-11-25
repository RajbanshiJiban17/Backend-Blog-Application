require('dotenv').config()
const express =require('express')
const connectToDatabase = require('./database')
const Blog = require('./model/blogModel')
const app = express()
app.use(express.json())
const {multer,storage}=require("./middleware/multerConfig")
const upload = multer({storage : storage})
const fs = require('fs')
//const { subtle } = require('crypto')
connectToDatabase()

app.get("/",(req,res)=>{
    res.json({
        message:"This is Home Page"
    })
})
app.post("/blog",upload.single('image'),async(req,res)=>{
    // const title = req.body.title
    // const subtitle = req.body.subtitle
    // const description = req.body.description
    // const image = req.body.image
     const {title,description,image,subtitle} = req.body
     const filename = req.file.filename
     if(!title || !subtitle || !description){ 
      return res.status(400).json({
            message: 'Please provide title,subtitle,description'
        })
    }
     await Blog.create({
        title : title,
        description : description,
        subtitle : subtitle,
        image : filename

     })



    console.log(req.body)
    console.log(req.file)
    res.status(200).json({
        message:"Blog api hit sucessfully!"
    })
})
// api create garne and select garne
app.get('/blog',async (req,res)=>{
   const blogs = await Blog.find() // return array
   //console.log(blogs)
   res.status(200).json({
    message:"Blogs fetched sucessfully",
    data:blogs
   })
    
})

app.get("/blog/:id",async (req,res)=>{
    const id = req.params.id
    const blog= await Blog.findById(id) // object
    
    if(!blog){
       return res.status(404).json({
         message:"no data found"   
        })
    }
    res.status(200).json({
    message:" fetched sucessfully",
    data:blog
   })
})
//delete api 
//app.delete("/blog/:id",async (req,res)=>{
//     const id = req.params.id
//     const blog = await Blog.findById(id)
//     const imageName = blog.image
//     fs.unlink(`storage/${imageName}`,(err)=>{
//     if(err){
//         console.log(err)
//     }else{
//          console.log("File delete sucessfully!")
//     }

//    })
//    await Blog.findByIdAndDelete(id)
   
//    res.status(200).json({
//     message:"Blog delete sucessfull!"
//    })
// })

app.delete("/blog/:id",async (req,res)=>{
    const id = req.params.id
    const blog = await Blog.findById(id)
    const imageName = blog.image
    // dynamic delete garne 
    fs.unlink(`storage/${imageName}`,(err)=>{
        if(err){
            console.log(err)
        }else{
            console.log("File delete Sucessfull")
        }
    })
    await Blog.findByIdAndDelete(id)
    res.status(200).json({
        message:"Blog Delete Sucessfull"
    })
})

// app.patch("/blog/:id",async (req,res)=>{
//     const id = req.params.id
//     const {title,substitle,description} = req.body
//     let imageName;
//     if(req.file){
//         imageName=req.file.filename
//         const blog = await Blog.findById(id)
//         const imageName = blog.image
//         fs.unlink(`storage/${imageName}`,(err)=>{
//             if(err){
//                 console.log(err)
//             }else{
//                 console.log("File delete sucessfully")

//             }
//         })
//     }
//     await Blog.findByIdAndUpdate(id,{
//         title : title,
//         subtitle : subtitle,
//         description : description,
//         image : imageName
//     })
//     res.status(200).json({
//         message: "Blog update sucessfully"
//     })
// })
app.patch('/blog/:id',upload.single('image'), async (req,res)=>{
    const id = req.params.id
    const {title,subtitle,description} = req.body
    let imageName;
    if(req.file){
        imageName = req.file.filename
        const blog = await Blog.findById(id)
        const oldImageName = blog.image

        fs.unlink(`storage/${oldImageName}`,(err)=>{
            if(err){
                console.log(err)
            }else{
                console.log("File delete sucessfully")
            }
        })
    }

    await Blog.findByIdAndUpdate(id,{
        title : title,
        subtitle : subtitle,
        description : description,
        image : imageName
    })
    res.status(200).json({
        message : "Blog Update Sucessfull!"
    })

})




app.use(express.static('./storage'))

app.listen(process.env.PORT,()=>{
    console.log("Nodejs Project Started..")
})






//mongodb+srv://root:<db_password>@cluster0.tnf4wss.mongodb.net/?appName=Cluster0