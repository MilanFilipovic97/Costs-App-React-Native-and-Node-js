const cors = require('cors');
const express = require('express');
const mysql = require('mysql');
require('dotenv').config();

const app = express();
app.use(cors());
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log('server je startovan');
});

const db = mysql.createConnection({
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'bdb246875f1b56',
    password: '90812b3b',
    database: 'heroku_ca5aabe341b095e'
});

db.connect((err) =>{
    if(err){
        throw err;
    }
    console.log('povezan je sa bazom');
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



setInterval(function () {
    db.query('SELECT 1');
}, 5000);


//#region Upiti za vrste rashoda

//select vrste rashoda

app.get('/selectVrsteRashoda', (req,res)=> {
    try{
    let sql = 'SELECT * FROM vrste_rashoda';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
        
    });
}
catch(e)
{
    console.log("greska pri prikazu" +e);
}
});

// obrisi vrstu rashoda 

app.delete('/obrisiVrstuRashoda', (req,res)=> {
   try{
    
    let sql = `Delete from vrste_rashoda where id = ${req.body.ID} `;
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('obrisan je sadrzaj');
    });
}
catch(e)
{
    console.log("greska pri brisanju" +e);
}
}); 
 
// update vrstu rashoda
app.put('/updateVrsteRashoda', (req,res)=> {
    try{
    let sql = 'Update vrste_rashoda set Name = "'+req.body.name +'", Slicica = "'+ req.body.slicica +'" where ID = '+ req.body.ID+'';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err; 
        console.log(result);
        res.send('izmenjen je sadrzaj');
    });
}
catch(e)
{
    console.log("greska pri updejtu" +e);
}
}); 

app.post("/dodajVrstuRashoda", function (req, res) {        
    
    try{
    let sql = 'INSERT INTO vrste_rashoda (Name,Slicica,Color,legendFontColor,legendFontSize) values ("'+req.body.name +'","'+ req.body.slicica +'","'+req.body.color+'","'+ req.body.legendFontColor+'","'+ req.body.legendFontSize+'")';
    
    let query = db.query(sql, (err,result)=>{
        if(err) {/*res.send(err);*/   res.send("Korisnicko ime je zauzeto.");}
        else{
        console.log(result);
        res.send('post 1 dodat');}
});
    }
    catch(e)
{
    console.log("greska pri dodavanju" +e);
}
});

/* OVO MENJAM
app.post("/dodajVrstuRashoda", function (req, res) {        
    
    try{
    let sql = 'INSERT INTO vrste_rashoda (Name,Slicica,Color,legendFontColor,legendFontSize) values ("'+req.body.name +'","'+ req.body.slicica +'","'+req.body.color+'","'+ req.body.legendFontColor+'","'+ req.body.legendFontSize+'")';
    
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('post 1 dodat');
});
    }
    catch(e)
{
    console.log("greska pri dodavanju" +e);
}
});*/

//#endregion

//#region Upiti vrstePrihoda

app.get('/selectVrstePrihoda', (req,res)=> {
    
    let sql = 'SELECT * FROM vrste_prihoda';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
        
    });
});

app.post("/dodajVrstuPrihoda", function (req, res) {        
    
    
    let sql = 'INSERT INTO vrste_prihoda (Name,Slicica,Color,legendFontColor,legendFontSize) values ("'+req.body.name +'","'+ req.body.slicica +'","'+req.body.color+'","'+ req.body.legendFontColor+'","'+ req.body.legendFontSize+'")';
    
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('post 1 dodat');
});
});

app.delete('/obrisiVrstuPrihoda', (req,res)=> {
    
    
    let sql = `Delete from vrste_prihoda where id = ${req.body.ID} `;
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('obrisan je sadrzaj');
    });
}); 

app.put('/updateVrstePrihoda', (req,res)=> {
    
    let sql = 'Update vrste_prihoda set Name = "'+req.body.name +'", Slicica = "'+ req.body.slicica +'" where ID = '+ req.body.ID+'';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err; 
        console.log(result);
        res.send('izmenjen je sadrzaj');
    });
}); 

//#endregion


//#region Upiti za dnevni prikaz


app.post("/dodajVrednostRashoda", function (req, res) {        
    
    let sql = 'INSERT INTO lista_rashoda (Datum,Vrednost,ID_Vrste_Rashoda,ID_Korisnika) values ("'+req.body.Datum +'", "'+ req.body.Vrednost +'","'+ req.body.ID_Vrste_Rashoda +'","'+ req.body.ID_Korisnika +'")';
    let query = db.query(sql, (err,result)=>{
        if(err) {throw err; res.send(req.body.Datum);};
        console.log(result);
        res.send('post 1 dodat');
});
});



//listu troskova vracam na taj dan
app.get('/selectListaRashoda/:datum/:ID_Korisnika', (req,res)=> {
    //console.log(req.params.datum);
    let sql = 'SELECT distinct Name, Slicica FROM lista_rashoda, vrste_rashoda where lista_rashoda.ID_Vrste_rashoda = vrste_rashoda.ID and Datum = "' + req.params.datum +'" and lista_rashoda.ID_Korisnika = "'+req.params.ID_Korisnika+'"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});

//vracam top 5  vrednosti rashoda za grafikon
app.get('/grafikonRashodaDan/:datum/:ID_Korisnika', (req,res)=> {
    //let sql = 'SELECT distinct name,vrednost,color,legendFontColor,legendFontSize FROM lista_rashoda, vrste_rashoda where lista_rashoda.ID_Vrste_rashoda = vrste_rashoda.ID and Datum = "' + req.params.datum +'"order by `vrednost` desc LIMIT 5';
    
    let sql = 'SELECT name,sum(vrednost) as vrednost,color,legendFontColor,legendFontSize FROM lista_rashoda, vrste_rashoda where lista_rashoda.ID_Vrste_rashoda = vrste_rashoda.ID and lista_rashoda.ID_Korisnika = "'+req.params.ID_Korisnika+'" and Datum = "' + req.params.datum +'" group by name order by vrednost desc LIMIT 5';
    
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
        
    });
});


//vraca ukupne prihode na taj dan
app.get('/selectUkupniPrihod/:datum/:ID_Korisnika', (req,res)=> {
    
    let sql = 'SELECT sum(Vrednost) as Vrednost from lista_prihoda WHERE Datum = "' + req.params.datum +'" and lista_prihoda.ID_Korisnika = "'+req.params.ID_Korisnika+'"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});

app.get('/selectUkupniRashod/:datum/:ID_Korisnika', (req,res)=> {
    
    let sql = 'SELECT sum(Vrednost) as Vrednost from lista_rashoda WHERE Datum = "' + req.params.datum +'"and lista_rashoda.ID_Korisnika = "'+req.params.ID_Korisnika+'"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});


// kartica troska
app.get('/selectKarticaRashoda/:rashod/:ID_Korisnika', (req,res)=> {
    //console.log("izvrsava se");
    //console.log(req.params.rashod);
    let sql = 'SELECT DATE_FORMAT(Datum, "%Y-%m-%d") as Datum , Vrednost FROM lista_rashoda, vrste_rashoda where lista_rashoda.ID_Vrste_rashoda = vrste_rashoda.ID and lista_rashoda.ID_Korisnika = "'+req.params.ID_Korisnika+'" and Name = "' + req.params.rashod +'"order by `vrednost` desc';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});

// kartica prihoda na dan
app.get('/selectKarticaPrihoda/:dan/:ID_Korisnika', (req,res)=> {
    //console.log("izvrsava se");
    console.log(req.params.dan);

    let sql = 'SELECT Name, Vrednost, Slicica,lista_prihoda.ID FROM lista_prihoda, vrste_prihoda where lista_prihoda.ID_Vrste_prihoda = vrste_prihoda.ID and lista_prihoda.ID_Korisnika = "'+req.params.ID_Korisnika+'" and Datum = "' + req.params.dan +'"order by `vrednost` desc';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});

app.post("/dodajVrednostPrihoda", function (req, res) {        
    
    let sql = 'INSERT INTO lista_prihoda (Datum,Vrednost,ID_Vrste_Prihoda,ID_Korisnika) values ("'+req.body.Datum +'", "'+ req.body.Vrednost +'","'+ req.body.ID_Vrste_Prihoda +'", "'+ req.body.ID_Korisnika +'")';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('post 1 dodat');
});
});
 
app.delete('/obrisiPrihod', (req,res)=> {
      
    
    let sql = `Delete from lista_prihoda where ID = ${req.body.ID} `;
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('obrisan je sadrzaj');
    });
}); 


//#endregion


//#region Upiti za mesecni prikaz

app.get('/selectMesecniRashod/:mesec/:ID_Korisnika', (req,res)=> { 
    
    let sql = 'SELECT sum(Vrednost) as Vrednost from lista_rashoda WHERE Datum BETWEEN "2020-'+ req.params.mesec +'-01" AND "2020-'+ req.params.mesec+'-31" and lista_rashoda.ID_Korisnika = "'+req.params.ID_Korisnika+'"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});

//vraca ukupne prihode na taj mesec
app.get('/selectMesecniPrihod/:mesec/:ID_Korisnika', (req,res)=> {
    
    let sql = 'SELECT sum(Vrednost) as Vrednost from lista_prihoda WHERE Datum BETWEEN "2020-'+ req.params.mesec +'-01" AND "2020-'+ req.params.mesec+'-31"and lista_prihoda.ID_Korisnika = "'+req.params.ID_Korisnika+'"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});
  
//listu troskova vracam za taj mesec
app.get('/selectListaRashodaMesec/:mesec/:ID_Korisnika', (req,res)=> {
    //console.log(req.params.datum);
    let sql = 'SELECT distinct Name, Slicica FROM lista_rashoda, vrste_rashoda where lista_rashoda.ID_Vrste_rashoda = vrste_rashoda.ID and lista_rashoda.ID_Korisnika = "'+req.params.ID_Korisnika+'" and Datum BETWEEN "2020-'+ req.params.mesec +'-01" AND "2020-'+ req.params.mesec+'-31"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});

app.get('/grafikonRashodaMesec/:mesec/:ID_Korisnika', (req,res)=> {
    //let sql = 'SELECT name,vrednost,color,legendFontColor,legendFontSize FROM lista_rashoda, vrste_rashoda where lista_rashoda.ID_Vrste_rashoda = vrste_rashoda.ID and Datum BETWEEN "2020-'+ req.params.mesec +'-01" AND "2020-'+ req.params.mesec+'-31" order by `vrednost` desc LIMIT 5';
    let sql = 'SELECT name,sum(vrednost) as vrednost,color,legendFontColor,legendFontSize FROM lista_rashoda, vrste_rashoda where lista_rashoda.ID_Vrste_rashoda = vrste_rashoda.ID and lista_rashoda.ID_Korisnika = "'+req.params.ID_Korisnika+'" and Datum BETWEEN "2020-'+ req.params.mesec +'-01" AND "2020-'+ req.params.mesec+'-31" group by name order by vrednost desc LIMIT 5';
    
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
        
    });
});

app.get('/selectKarticaPrihodaMesec/:mesec/:ID_Korisnika', (req,res)=> {

    let sql = 'SELECT Name, Vrednost, Slicica,lista_prihoda.ID FROM lista_prihoda, vrste_prihoda where lista_prihoda.ID_Vrste_prihoda = vrste_prihoda.ID and lista_prihoda.ID_Korisnika = "'+req.params.ID_Korisnika+'" and Datum BETWEEN "2020-'+ req.params.mesec +'-01" AND "2020-'+ req.params.mesec+'-31"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        res.send(result);
   });

});
//#endregion

//#region Upiti za godisnji prikaz

app.get('/selectGodisnjiRashod/:godina/:ID_Korisnika', (req,res)=> { 
    
    let sql = 'SELECT sum(Vrednost) as Vrednost from lista_rashoda WHERE lista_rashoda.ID_Korisnika = "'+req.params.ID_Korisnika+'" and Datum BETWEEN "'+ req.params.godina+'-01-01" AND "'+ req.params.godina+'-12-31"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});

//vraca ukupne prihode na taj mesec
app.get('/selectGodisnjiPrihod/:godina/:ID_Korisnika', (req,res)=> {
    
    let sql = 'SELECT sum(Vrednost) as Vrednost from lista_prihoda WHERE lista_prihoda.ID_Korisnika = "'+req.params.ID_Korisnika+'" and Datum BETWEEN "'+ req.params.godina+'-01-01" AND "'+ req.params.godina+'-12-31"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});

//listu troskova vracam za taj mesec
app.get('/selectListaRashodaGodina/:godina/:ID_Korisnika', (req,res)=> {
    //console.log(req.params.datum);
    let sql = 'SELECT distinct Name, Slicica FROM lista_rashoda, vrste_rashoda where lista_rashoda.ID_Vrste_rashoda = vrste_rashoda.ID and lista_rashoda.ID_Korisnika = "'+req.params.ID_Korisnika+'" and Datum BETWEEN "'+ req.params.godina+'-01-01" AND "'+ req.params.godina+'-12-31"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});

app.get('/grafikonRashodaGodina/:godina/:ID_Korisnika', (req,res)=> {
    
    //let sql = 'SELECT name,vrednost,color,legendFontColor,legendFontSize FROM lista_rashoda, vrste_rashoda where lista_rashoda.ID_Vrste_rashoda = vrste_rashoda.ID and Datum BETWEEN "'+ req.params.godina+'-01-01" AND "'+ req.params.godina+'-12-31" order by `vrednost` desc LIMIT 5';
    let sql = 'SELECT name,sum(vrednost) as vrednost,color,legendFontColor,legendFontSize FROM lista_rashoda, vrste_rashoda where lista_rashoda.ID_Vrste_rashoda = vrste_rashoda.ID and lista_rashoda.ID_Korisnika = "'+req.params.ID_Korisnika+'" and Datum BETWEEN "'+ req.params.godina+'-01-01" AND "'+ req.params.godina+'-12-31" group by name order by vrednost desc LIMIT 5';
    

    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum); 
        
    });
});
 
app.get('/selectKarticaPrihodaGodina/:godina/:ID_Korisnika', (req,res)=> {

    let sql = 'SELECT Name, Vrednost, Slicica,lista_prihoda.ID FROM lista_prihoda, vrste_prihoda where lista_prihoda.ID_Vrste_prihoda = vrste_prihoda.ID and lista_prihoda.ID_Korisnika = "'+req.params.ID_Korisnika+'" and Datum BETWEEN "'+ req.params.godina+'-01-01" AND "'+ req.params.godina+'-12-31"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        res.send(result);
   });

});

//#endregion

// do ovde
//#region - KORISNICI
app.post("/dodajNovogKorisnika", function (req, res) {        
    
    let sql = 'INSERT INTO korisnici (Ime,Prezime,KorisnickoIme,Lozinka) values ("'+req.body.Ime +'", "'+ req.body.Prezime +'","'+ req.body.KorisnickoIme +'" , "'+ req.body.Lozinka +'")';
    let query = db.query(sql, (err,result)=>{
        if(err) {res.send("Korisnicko ime je zauzeto.");}
        else{
        console.log(result);
     
        let sql1 = 'SELECT ID FROM Korisnici where korisnickoIme = "'+req.body.KorisnickoIme +'" and Lozinka = "'+req.body.Lozinka +'";';
        let query = db.query(sql1, (err,result)=>{
        if(err) {res.send("Greska.");}
        else{
        //console.log(result);
        res.send(result);
                
        }
        });
        
    }
});
});

app.get('/selectKorisnik/:korisnickoIme/:lozinka', (req,res)=> {
    
    //as IDKorisnika
    let sql = 'SELECT ID FROM Korisnici where KorisnickoIme =  "' + req.params.korisnickoIme +'" and Lozinka = "' + req.params.lozinka +'"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
        
   });
});



//#endregion
