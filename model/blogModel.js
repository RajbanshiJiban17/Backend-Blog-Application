// moongose vannne modelmagem
const mongoose=require('mongoose')
//table or scheme 
const Scheme = mongoose.Schema

// Objet banaune
const blogSchema=new Scheme({
    title:{
        type:String,
        unique:true
    },
    subtitle:{
        type:String
    },
    description:{
        type:String
    },
    image:{
        type:String
    }
})

//Complete table baneu
const Blog = mongoose.model('Blog',blogSchema)
//Exports gareu hamli
module.exports = Blog
