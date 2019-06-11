const Hapi = require('@hapi/hapi');
const mongooes = require("mongoose");


const server = new Hapi.server({'host': "localhost",'port':3000});

mongooes.connect("mongodb://localhost/todo");
const TodoModel = mongooes.model("todolist",{ 
    name: String,
    description: String
});

server.route({
    method:"POST",
    path:"/todo",
    handler: async(request, h)=> {
        try {
            let todojob =  new TodoModel(request.payload);
            let result  =  await todojob.save();
            return h.response(result);
        }
        catch (err){
            return h.response(err).code(500);
        }

    } 
});

server.route({
    method: "GET",
    path:"/todo",
    handler: async (request, h)=>{
        try{
            let todoJob =  await TodoModel.find().exec();
            return h.response(todoJob);
        }
        catch(err){
            return h.response(err).code(500);
        }
    }
});

server.route({
    method:"PUT",
    path:"/todo",
    handler: async ()=>{}
});

server.route({
    method:"DELETE",
    path:"/todo/{name}",
    handler: async(request, h)=>{
        try {
            let result =  TodoModel.findOneAndDelete({name: request.params.name}).exec(function (err, doc){
                doc.remove();
            });
            return h.response(result);
        }
        catch(err){
            return h.response(err).code(500);
        }
    }
});

server.start();