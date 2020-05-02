// Compile all functions
function OrganizeData() {
    // General Variables
      const spreadSheetId = '1zIK97eZ3BRsJjYHuVKyrxkPawPBVGQHrDah0R58kRB8';
      const totalTercero = 'TOTAL POR TERCERO';
      const organizedName = ' ORGANIZED';
      const dataStartOnCell = 8;
      const organizedDataTitleRow = 2;
      // Celdas de Entradada - El archivo que se va leer
      // Comienzan desde 0
      // fourD & sixD tienen el mismo valor porque de hay se sacan los codigos 
      const inputColumns={
      fourD:{col:0},
      sixD:{col:0},
      companyID:{col:2},
      date:{col:8},
      typeDoc:{col:6},
      doc:{col:5},
      desc:{col:7},
      name:{col:4},
      debito:{col:9},
      credito:{col:10}
      };
      // Celdas de Salida = El archivo con el formato
      const organizedColumn= {
      fourD:{col:1, name:'Cuenta a 4 digitos'},
      sixD:{col:2, name:'Cuenta a 6 digitos'},
      date:{col:3, name:'Fecha'},
      typeDoc:{col:4, name:'Tipo de Documento'},
      doc:{col:5, name:'Documento'},
      desc:{col:6, name:'Concepto'},
      id:{col:7, name:'Cedula/NIT'},
      name:{col:8, name:'Nombre'},
      debito:{col:9, name:'Debito'},
      credito:{col:10, name:'Credito'},
      saldo:{col: 11, name:'Saldo'}
      };
      
    // Open the document
      const spreadSheet = SpreadsheetApp.openById(spreadSheetId);
      
    // Get all Sheets in the document

const sheets = spreadSheet.getSheets();
  
  
// Loop Throught tabs creating the organized version of each one and 
// if create one jump the new created the next loop - It jumps because var was created before the loop
for(let i = 0; i < 1/*sheets.length*/ ; i++){
  
    /* JUST IN DEVELOPMENT */
    // Deleted the sheet created before to evalute new code
    if(spreadSheet.getSheetByName(sheets[i].getName()+organizedName)){
      spreadSheet.deleteSheet(spreadSheet.getSheetByName(sheets[i].getName()+organizedName));
    }
  
  
    // Check if exists an Organized Version tab or else create it 
    if(!spreadSheet.getSheetByName(sheets[i].getName()+organizedName)){
      // Create the organized Sheet
      spreadSheet.insertSheet(sheets[i].getName()+organizedName);
      // Get sheets to work 
      let initialSheet = spreadSheet.getSheetByName(sheets[i].getName()) ;
      let organizedSheet = spreadSheet.getSheetByName(sheets[i].getName()+organizedName) ;
      
      // Data to Eval
      
      const data = initialSheet.getDataRange();
      const values = data.getValues();
      const rowsInitialSheet = data.getLastRow();
      
      let currentRowOrganizedSheet = 2;
      
      let current4Digits, debito4Digits=0, credito4Digits =0, current4DigitsRow,
          current6Digits, debito6Digits=0, credito6Digits=0, current6DigitsRow,
          currentCompany, debitoCurrentCompany=0, creditoCurrentCompany=0, currentCompanyRow;
      let current6DigitsName;
      
      
      // Loop throught all data
      for(let r = dataStartOnCell; r < rowsInitialSheet ; r++){
      
      // If is near to fill all rows append a new one
      Logger.log(organizedSheet.getMaxRows()-currentRowOrganizedSheet);
      if((organizedSheet.getMaxRows()-currentRowOrganizedSheet) < 10){ // r < 10 ){//
        Logger.log('Inser Rows', ' rest: ',organizedSheet.getMaxRows()-r)
        organizedSheet.insertRows(currentRowOrganizedSheet, 100);
      }
      
      // Col 1 and 2 have to have data to work
      // Jump Totals 
        let eval1 = parseInt(values[r][inputColumns.debito.col]);
        let eval2 = parseInt(values[r][inputColumns.credito.col]);
       
      // TODO CHANGES THIS VALUES TO BE PARAMETRIC
      if(values[r][0] && values[r][1] && (!isNaN(eval1) || !isNaN(eval2))){
      
        // Set Titles
        if(currentRowOrganizedSheet === organizedDataTitleRow){
          let titles = Object.entries(organizedColumn);
          for(let u = 0; u< titles.length; u++){
            organizedSheet.getRange(currentRowOrganizedSheet, titles[u][1].col).setValue(titles[u][1].name.toUpperCase()).setWrap(true).setHorizontalAlignment("center").setFontWeight('bold');
          }
          currentRowOrganizedSheet += 2;
        }
        // Valores temporales de codigo y nombre 
        let tempCurrent4Digits = values[r][inputColumns.fourD.col].split(' ')[0].slice(0,4);
        let tempCurrent6Digits = values[r][inputColumns.sixD.col].split(' ')[0].slice(0,6);
        let tempCurrentCompany = values[r][inputColumns.companyID.col];//values[r][1].trim(' ').split(' ').filter(el=>el!=null).join(' ').replace(/\s+/, '\x01').split('\x01');
       
       
        // Checkear si el valor es diferente al anterior - en cuentas a 4 digitos y 6 digitos 
        // Checkear 4 digitos
        if(current4Digits == null){
          current4Digits = tempCurrent4Digits;
          current4DigitsRow = currentRowOrganizedSheet;
          organizedSheet.getRange(current4DigitsRow,organizedColumn.fourD.col).setValue(current4Digits).setHorizontalAlignment("center").setFontWeight('bold');
          organizedSheet.getRange(current4DigitsRow, organizedColumn.fourD.col,1,organizedColumn.saldo.col).setBorder(true, true, true, true, false, false).setBackground('#C7E1B5');
          currentRowOrganizedSheet += 2;
        }
        
         // Checkear 6 digitos
        if(current6Digits == null){
          current6Digits = tempCurrent6Digits;
          current6DigitsRow = currentRowOrganizedSheet;
          organizedSheet.getRange(current6DigitsRow,organizedColumn.sixD.col).setValue(current6Digits).setHorizontalAlignment("center").setFontWeight('bold');
          current6DigitsName = values[r][inputColumns.sixD.col].trim(' ').replace(/\s+/, '\x01').split('\x01')[1];
          organizedSheet.getRange(current6DigitsRow, organizedColumn.sixD.col+1,1,organizedColumn.name.col-(organizedColumn.sixD.col)).merge().setHorizontalAlignment('left').setFontWeight('bold').setValue(current6DigitsName);
          organizedSheet.getRange(current6DigitsRow, organizedColumn.fourD.col,1,organizedColumn.saldo.col).setBorder(true, true, true, true, false, false);
          currentRowOrganizedSheet += 2;
        }
       
        
        // Checkear Company
        if(currentCompany == null){
        currentCompany = tempCurrentCompany;    
        }
        
          if(currentCompany !== tempCurrentCompany){
          // Leave Values
          organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.date.col,1,6).merge().setHorizontalAlignment('left').setFontWeight('bold').setValue(totalTercero);
          organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.debito.col).setValue(debitoCurrentCompany).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
          organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.credito.col).setValue(creditoCurrentCompany).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
          organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.saldo.col).setValue(debitoCurrentCompany-creditoCurrentCompany).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
          debitoCurrentCompany = 0;
          creditoCurrentCompany = 0;
          
          currentCompany = tempCurrentCompany;
          currentRowOrganizedSheet += 2;
          }
        
        if(tempCurrent4Digits !== current4Digits){
          // Set accumulated Values
          organizedSheet.getRange(current4DigitsRow,organizedColumn.debito.col).setValue(debito4Digits).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
          organizedSheet.getRange(current4DigitsRow,organizedColumn.credito.col).setValue(credito4Digits).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
          organizedSheet.getRange(current4DigitsRow,organizedColumn.saldo.col).setValue(debito4Digits-credito4Digits).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
          debito4Digits=0;
          credito4Digits=0;
          
           // Dejar Valores almacenados en company
             if(currentCompany == tempCurrentCompany  && debitoCurrentCompany != 0 || creditoCurrentCompany != 0){
             organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.date.col,1,6).merge().setHorizontalAlignment('left').setFontWeight('bold').setValue(totalTercero);
             organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.debito.col).setValue(debitoCurrentCompany).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
             organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.credito.col).setValue(creditoCurrentCompany).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
             organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.saldo.col).setValue(debitoCurrentCompany-creditoCurrentCompany).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
             debitoCurrentCompany = 0;
             creditoCurrentCompany = 0;
             currentCompany = tempCurrentCompany;
             currentRowOrganizedSheet += 2;
             }
           
          // Set new name
          current4DigitsRow = currentRowOrganizedSheet;
          current4Digits = tempCurrent4Digits;
          organizedSheet.getRange(current4DigitsRow,organizedColumn.fourD.col).setValue(current4Digits).setHorizontalAlignment("center").setFontWeight('bold');
          organizedSheet.getRange(current4DigitsRow, organizedColumn.fourD.col,1,organizedColumn.saldo.col).setBorder(true, true, true, true, false, false).setBackground('#C7E1B5');
          currentRowOrganizedSheet += 2;
        }
        
        if(tempCurrent6Digits !== current6Digits){
             // Set accumulated Values
             organizedSheet.getRange(current6DigitsRow,organizedColumn.debito.col).setValue(debito6Digits).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
             organizedSheet.getRange(current6DigitsRow,organizedColumn.credito.col).setValue(credito6Digits).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
             organizedSheet.getRange(current6DigitsRow,organizedColumn.saldo.col).setValue(debito6Digits-credito6Digits).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
             debito6Digits=0;
             credito6Digits=0;
             
             // Dejar Valores almacenados en company
             if(currentCompany == tempCurrentCompany && debitoCurrentCompany != 0 || creditoCurrentCompany != 0 ){
             organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.date.col,1,6).merge().setHorizontalAlignment('left').setFontWeight('bold').setValue(totalTercero);
             organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.debito.col).setValue(debitoCurrentCompany).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
             organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.credito.col).setValue(creditoCurrentCompany).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
             organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.saldo.col).setValue(debitoCurrentCompany-creditoCurrentCompany).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
             debitoCurrentCompany = 0;
             creditoCurrentCompany = 0;
             currentCompany = tempCurrentCompany;
             currentRowOrganizedSheet += 2;
             }
             
             // Set new name
             current6DigitsRow = currentRowOrganizedSheet;
             current6Digits = tempCurrent6Digits;
             organizedSheet.getRange(current6DigitsRow,organizedColumn.sixD.col).setValue(current6Digits).setHorizontalAlignment("center").setFontWeight('bold');
             current6DigitsName = values[r][inputColumns.sixD.col].trim(' ').replace(/\s+/, '\x01').split('\x01')[1];
             organizedSheet.getRange(current6DigitsRow, organizedColumn.sixD.col+1,1,organizedColumn.name.col-(organizedColumn.sixD.col)).merge().setHorizontalAlignment('left').setFontWeight('bold').setValue(current6DigitsName);
             organizedSheet.getRange(current6DigitsRow, organizedColumn.fourD.col,1,organizedColumn.saldo.col).setBorder(true, true, true, true, false, false);
             currentRowOrganizedSheet += 2;
           }
        
        
        // set most fields
           // Avoid adding strings
        let val1,val2;
        
        val1 =typeof values[r][inputColumns.debito.col] == 'string' ? parseInt(values[r][inputColumns.debito.col]) : values[r][inputColumns.debito.col];
        val2 =typeof values[r][inputColumns.credito.col] == 'string' ? parseInt(values[r][inputColumns.credito.col]) : values[r][inputColumns.credito.col];
        // Avoid nulls
        if(!val1 || !val2){Logger.log('Repor error on cell: ', r)}
        val1 = val1 ? val1:0;
        val2 = val2 ? val2:0;
        
          organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.date.col).setValue(values[r][inputColumns.date.col]).setHorizontalAlignment("center");
          organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.typeDoc.col).setValue(values[r][inputColumns.typeDoc.col].trim(' ')).setHorizontalAlignment("center");
          organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.doc.col).setValue(values[r][inputColumns.doc.col].trim(' ')).setHorizontalAlignment("center");
          organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.desc.col).setValue(values[r][inputColumns.desc.col].toString().trim(' ')).setHorizontalAlignment("center");
          organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.id.col).setValue(currentCompany).setHorizontalAlignment("center");
          organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.name.col).setValue(values[r][inputColumns.name.col].toString().trim(' ')).setHorizontalAlignment("center");
          organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.debito.col).setValue(val1).setHorizontalAlignment("center").setNumberFormat("#,###;(#,###); - ");
          organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.credito.col).setValue(val2).setHorizontalAlignment("center").setNumberFormat("#,###;(#,###); - ");
          organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.saldo.col).setValue(val1 -val2).setHorizontalAlignment("center").setNumberFormat("#,###;(#,###); - ");
          
          // Sumas 
          // Company Level
     
            debitoCurrentCompany += val1;
            creditoCurrentCompany += val2;
            // 6 Digits Level
            debito6Digits += val1;
            credito6Digits += val2;
            // 4 Digits Level
            debito4Digits += val1;
            credito4Digits += val2;
            
          currentRowOrganizedSheet++;
          
        
        
      }
        // If end of loop - anotate
        // If last row set values accumulated
        if(parseInt(r) == parseInt(rowsInitialSheet)-1){
        // set 4 Digits
          organizedSheet.getRange(current4DigitsRow,organizedColumn.debito.col).setValue(debito4Digits).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
          organizedSheet.getRange(current4DigitsRow,organizedColumn.credito.col).setValue(credito4Digits).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
          organizedSheet.getRange(current4DigitsRow,organizedColumn.saldo.col).setValue(debito4Digits-credito4Digits).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
          debito4Digits=0;
          credito4Digits=0;
        // set 6 Digits
          organizedSheet.getRange(current6DigitsRow,organizedColumn.debito.col).setValue(debito6Digits).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
          organizedSheet.getRange(current6DigitsRow,organizedColumn.credito.col).setValue(credito6Digits).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
          organizedSheet.getRange(current6DigitsRow,organizedColumn.saldo.col).setValue(debito6Digits-credito6Digits).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
          debito6Digits=0;
          credito6Digits=0;
        // Set Company accumulated
          organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.date.col,1,6).merge().setHorizontalAlignment('left').setFontWeight('bold').setValue(totalTercero);
          organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.debito.col).setValue(debitoCurrentCompany).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
          organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.credito.col).setValue(creditoCurrentCompany).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
          organizedSheet.getRange(currentRowOrganizedSheet,organizedColumn.saldo.col).setValue(debitoCurrentCompany-creditoCurrentCompany).setHorizontalAlignment("center").setFontWeight('bold').setNumberFormat("#,###;(#,###); - ");
          debitoCurrentCompany = 0;
          creditoCurrentCompany = 0;
          
        // Set Columns autofit width
        let columnsWidth = Object.entries(organizedColumn);
          for(let u = 3; u< columnsWidth.length; u++){
            
            organizedSheet.autoResizeColumn(parseInt(columnsWidth[u][1].col));
          }
         
        
        }
      
      }
      
    }

}


}