# Vue.js, CouchDB Single Page Application for Library Management
This is a Single Page Library Management Application based on Vue.js and CouchDB Hosted on [DigitalOcean Server](https://m.do.co/c/50622a336635). I developed this application to demonstrate my potential skills with CouchDB Nosql and Vue.js SPA development.
This system consisting of features such as Manage Book Lending, CRUD Books, Manage Members of the Library, Manage Users and Roles etc..

Features:
- Login
- Registration (only for readers)
- Librarian portal
- Admin portal
- Reader Portal
 
There are 3 types of users: Admin, Librarian & Reader
 
Admin: General web app admin
- Create/Activate/Deactivate users (Librarians and Readers)
- Add and manage user roles
- Can do everything librarian can do
  
Librarian: Library admin
- Perform CRUD operations on books
- Search books
- Assign books to registered users
 
Reader: Person who is interested in reading and checking out books from the library
- Search library database
- Checkout/Return books
- Rate/Comment on books

**Please note that this application is based on Two Tier Architecture directly working with CouchDB inbuilt restApi to execute query against database. Primary reason is this is a practical Task, however in real world application, we must have a middle Layer such as Node.JS (Express) or Any other Programming Language**

**Hosted Demo URL**
[http://libraryspa.techalyst.com](http://libraryspa.techalyst.com)


**Admin Credentials**

- username: admin
- password: admin 


if you want to test in your computer, Please make sure to define the following 
-----------------------------------------------------------------------------

Define the following in the config/prod.env or dev.env, depending on your enviroment 

  ```
  COUCHDB_URL: '"http://111.222.220.339:5984"',   //couchdb server ip and port no, default port is 5984     
  DB_NAME : '"library"',   //database name     
  DB_DESIGN_DOCUMENT : '"main_design"',  //you must create one design document in the database       
  PAGINATION_SIZE: 10,    //size of pagination scroller     
  SERVER_ADMIN_USERNAME : '"admin"',   //user name of couchdb server admin     
  SERVER_ADMIN_PASSWORD : '"admin"'	//password of couchdb server admin 
  ``` 
  
  The purpose of defining the admin credential in env file is just for demonstration to overcome certain limitation with couchdb for non admin party users, such as when we work with user documents only Admin Part have full authority, in such places I am doing http basic authentication using admin credentials, so that in real life this is not the file to define password,  we should handle it through a middle layer.  
  
  **make sure to create a document with "_id" as user-count and "type" as user-count, this is needed for generating auto increment numbers, however such auto increment id with couch db may not always be reliable since it is more into a distributed architecture**

****create the following design document in the database***
```
{
  "_id": "_design/main_design",
  "updates": {
    "counter": "function (doc, req){if (doc.type == 'user-count'){if (!doc.count) doc.count = 0;doc.count++;return [doc, toJSON(doc.count)];}}"
  },
  "language": "javascript"
}
```

**create the following view in the database, it is used to calculate user ratings on book**

Give index name as -> `avg_rating`

Paste the following Under Map function
----------------------------------------------
```
function (doc) {  
    if (doc.type == 'rating') {      
      emit(doc.bookId, doc.ratingSelected);   
    } 
}
```

Paste the following Under Reduce
------------------------------------------
```
function(keys, values, rereduce) {
    if (!rereduce) {
        var ratercount = values.length
        return [sum(values) / ratercount, ratercount]
    } else {
        var ratercount = sum(values.map(function(v){return v[1]}));
        var avg = sum(values.map(function(v){
            return v[0] * (v[1] / ratercount)
        }));
        return [avg, ratercount]
    }
}
```

If you have any Questions Please contact me here or through my blog [https://www.techalyst.com](https://www.techalyst.com)
