const fs = require('fs');
const csv = require('@fast-csv/parse');

let filepath, codeColumn, companyNameColumn, debitoColumn, creditoColumn, based;
const values={};
let currentCode;


// Funcion Analisis
function Analisis(filepath,codeColumn,companyNameColumn,debitoColumn,creditoColumn,based, display){
    fs.createReadStream(filepath)
    .pipe(csv.parse())
    .on('error', error => console.error(error))
    .on('data', row => {
        //Discover based 8 digits
        if(row[codeColumn] !== ''){
            let name = row[codeColumn].split(' ');
            if(name[0].length===based){
                currentCode=name[0];
                values[name[0]]={
                    codigo:name[0],
                    nombre:row[codeColumn].split(' ').splice(1,row[codeColumn].length).join(''),
                    valor:0
                };
            }
        }
        //Adding values if Name
        //DEBITO
        if(row[companyNameColumn] !== ''){
            

            let name = row[codeColumn].split(' ');
            //console.log(name);
           if( name[0].length>based && name[0].length < based+4|| row[codeColumn] === ''){
                //DEBITO
                let debito = row[debitoColumn].replace(/,/g,'').replace(/-/g,'').replace(/\$/g,'');
                if(!isNaN(parseInt(debito))){
                    //Add Value
                    values[currentCode]['valor']+= parseInt(debito);
                    //console.log(parseInt(number));
                }
                //CREDITO
                let credito = row[creditoColumn].replace(/,/g,'').replace(/-/g,'').replace(/\$/g,'');
                if(!isNaN(parseInt(credito))){
                    //Substract Value
                    values[currentCode]['valor']-= parseInt(credito);
                    //console.log(parseInt(number));
                }
            }
        }

    })
    .on('end', rowCount => {
        if(display){
            console.log('Valores: ',values);
        }
      
    });
}

// 61 Gasto 2017
// filepath = './61gasto2017.csv';
// codeColumn = 0;
// companyNameColumn=3;
// debitoColumn =7;
// creditoColumn =8;
// based = 8;
// Analisis(filepath,codeColumn,companyNameColumn,debitoColumn,creditoColumn,based,true);

// // COSTO 2017
// filepath = './costo2017.csv';
// codeColumn = 0;
// companyNameColumn=5;
// debitoColumn =6;
// creditoColumn =7;
// based = 8;
// Analisis(filepath,codeColumn,companyNameColumn,debitoColumn,creditoColumn,based,true);

// 51 Gasto 2017
filepath = './51gasto2017.csv';
codeColumn = 0;
companyNameColumn=3;
debitoColumn =7;
creditoColumn =8;
based = 4;
Analisis(filepath,codeColumn,companyNameColumn,debitoColumn,creditoColumn,based,true);

// // // GASTO 2017
// filepath = './gasto2017.csv';
// codeColumn = 0;
// companyNameColumn=5;
// debitoColumn =6;
// creditoColumn =7;
// based = 4;
// Analisis(filepath,codeColumn,companyNameColumn,debitoColumn,creditoColumn,based,true);