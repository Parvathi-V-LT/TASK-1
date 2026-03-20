// const cds = require('@sap/cds');  // Ti is the library which is the main purpose of JS file
// const { INSERT, DELETE } = require('@sap/cds/lib/ql/cds-ql');
// //This will optimize the functionalities of the code 
// //Insert operation like cqn services comes under @sap/cds


//  //!This will say whether custom logics present or not ===>> impl()
// module.exports = cds.service.impl( async function ()
// {
//     const {students,courses} = this . entities;
//    // this.on('READ',students,(req,res)=>{
//      //   return 'data read successfully'
//     //})
//      console.log("Before Triggered");
     
//     this.before('CREATE',students,(req,res)=>{
//         const {course}= req.data;
//         console.log(req.data);
//         console.log(course);
        
//         if(course != 'btech')
//         {
//             req.error('This student is not in this course');
//         }
        
//     })

//     this.before('UPDATE',students,(req)=>{
//         const{course}= req.data;
//         if(course !='bcom')
//         {
//             req.error("This student not in bcom course")
//         }
//     })

//     this.before('DELETE',students,(req,data)=>{
//         const{name}=req.data;
//         if(name=='ramila')
//         {
//             req.error("Sorry , we don't want to delete this")
//         }
//     })
    

//     this.on('DELETE',students,async(req,data)=>{
//         const {id} = req.data;
//         await DELETE.from(students).where({id})
//     })

//     this.on('CREATE',students,async(req,next)=>{
        

//         console.log("On Triggered");
        
//         if(!req.data.id)
//         {
//             req.data.id = cds.utils.uuid();  //! It is one of the library present inside the @sap/cds
//         }
        
//         const reqData = req.data;
//         console.log(reqData);
        
//         /* const insertOperation = await INSERT.into(students).entries(reqData);
//         console.log(insertOperation); */
//         const nextData = await next();  //! we call the generic handler inside the on hooks that's why we use next()

        

//         return nextData;
        
        
//     })

//     this.after('CREATE',students,async(data,req)=>{
//         console.log("AFTer read executed");
//         console.log(data);
//        // req.data.status  ="Student successfully created"
//         await INSERT.into(courses).entries({status:"Students added"})
        
//     })


//     this.after('READ',courses,(each)=>{
//         console.log("  after read running");
        
//         each.studentstatus = each.status === 'Students added' ? 'students added to this course' : "student does not add the course";
//     })
// })   

const cds = require('@sap/cds');
const { INSERT, SELECT, UPDATE } = require('@sap/cds/lib/ql/cds-ql');
 
module.exports = cds.service.impl(async function() {
 
    const {students,courses} = this.entities;
 
    //CREATE
 
    this.before('CREATE', students, req => {
        if(!req.data.name){
            req.error(400, 'Name is mandatory');
        }
    })
 
    this.on('CREATE', students, async req => {
        return await INSERT.into(students).entries(req.data);
    })
 
    this.after('CREATE', students, data => {
        data.message = 'Book Created Successfully';
    })
 
 
    //READ
 
    //To add client filter... with our query
    this.before('READ', students, req => {
 
         //if where doesn't exist, create it...
        // if (!req.query.SELECT.where) {
        //     req.query.SELECT.where = [];
        // }
 
        //req.query.SELECT.where.push('and', {ref : ['quantity']}, '>', {val: 15});
    });
   
 
    this.on('READ', students, async req => {
       
        // return await SELECT.from(Prods).where({stock: { '>': 5 }});
 
        // ----------------------------------- CQL -----------------------------------------------
 
        //To display specific columns
        //return await SELECT('ID', 'name').from(Prods);
 
        //To display using where condition
       //return await SELECT.from(Prods).where({'quantity': {'>' : 20}});
 
        //AND
        //return await SELECT.from(Prods).where({'quantity' : { '>' : 20}, 'price' : { '>' : 500 }} );
 
        //BETWEEN
        //return await SELECT.from(Prods).where({'price' : { between : [10000, 50000] }});
 
        //LIMIT
        //return await SELECT.from(Prods).limit(5);
 
        return await SELECT.from(students)/* .limit(5,5) */;
       
        //ORDERBY
        //SELECT('ID', 'name').from(Prods).orderBy('name');
 
    })
 
    this.on('READ', students, data => {
        data.forEach(d => d.display = d.name + ' ' + d.price);
    })
 
 
    //UPDATE
 
    this.before('UPDATE', students, req => {
        if(req.data.price < 0) req.error(400, 'Invalid price');
    })
 
    this.on('UPDATE',students, async req => {
        return await UPDATE(Prods).set(req.data).where({ID: req.data.ID});
    })
 
    this.after('UPDATE', students, data => {
        data.message = "updated successfully"
    })
 
    //DELETE
 
    this.before('DELETE', students, req => {
        if (req.user.is('Admin')) {
            req.reject(403, 'Not Allowed');
        }
    })
 
    this.on('DELETE', students, async req => {
        return await DELETE.from(students).where({ID: req.data.ID});
    });
 
    this.after('DELETE', students, data => {
        data.message = "Deleted Successfully"
    })

    this.on('READ',courses,async(req)=>{
        return await SELECT.from(courses).where({course_name:{like:'%java%'}})
    })
 
})