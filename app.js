const express=require("express");
const mongoose=require("mongoose");
const ejs=require("ejs");
const bodyParser=require("body-parser");

const app=express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",{useNewUrlParser:true});

const articleSchema={
    title:String,
    content:String
};

const Article=new mongoose.model("article",articleSchema);

//////////////////////Request for all Article/////////////////////////////

app.route("/articles")
.get((req,res)=>{
    Article.find((err,foundArticle)=>{
        if(!err)
            res.send(foundArticle);
        else
            res.send(err);
    })
})
.post((req,res)=>{
    const newArticle=new Article({
        title:req.body.title,
        content:req.body.content
    })
    newArticle.save((err)=>{
        if(!err)
            res.send("successfully added a new article.");
    });
})
.delete((req,res)=>{
      Article.deleteMany((err)=>{
          if(!err)
            res.send("deleted sucessfully");
        else    
            res.send(err);
      })
});

////////////////////Request for specific Article///////////////////////////

app.route("/articles/:userId")
.get((req,res)=>{
    const articleTitle=req.params.userId;
    Article.findOne({title: articleTitle},(err,content)=>{
        if(content)
            res.send(content);
        else
            res.send(`No articles matching ${articleTitle} was found`);
    })
})
.put((req,res)=>{
    const articleTitle=req.params.userId;
    Article.updateOne(
        {title: articleTitle},
        {title: req.body.title,content: req.body.content},
        {upsert: true},
        (err,results)=>{
            if(!err)
                res.send("sucessfully updated")
            else
                res.send(err);
        }
    );
})
.patch((req,res)=>{
    const articleTitle=req.params.userId;
    Article.updateOne(
        {title:articleTitle},
        {$set:req.body},
        (err)=>{
            if(!err)
                res.send("sucessfully updated article");
            else
                res.send(err);
        }
    );
})
.delete((req,res)=>{
    const articleTitle=req.params.userId;
    Article.deleteOne(
        {title:articleTitle},
        (err)=>{
            if(!err)
                res.send("deleted sucessfully");
            else
                res.send(err);
        }
    )
})

app.listen(3000,()=>{
    console.log("server started at 3000 sucessfully");
})