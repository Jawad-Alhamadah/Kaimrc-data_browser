const fs = require('fs');
const readline = require('readline');
let list_of_lists= []
let column_names = "POS|ClinVar_sept_5_22_CLNSIG|ClinVar_sept_5_22_ID|num_samples|alt_aleele_count|alt_aleele_count|alt_allee_ration|HGVSc|HGVSp|hit_count|Consequence|ClinVar_sept_5_22_CLNREVSTAT|Feature|ClinVar_sept_5_22".toLowerCase()
let column_name_list = column_names.split(/\|/g)

async function processLineByLine() {
  const fileStream = fs.createReadStream(__dirname+"/genome_data_files/merge_vcf_sample-Sun-Oct-23-2022_1666524767200.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
//
  for await (const line of rl) {

    list_of_lists.push(line.split(/\t+/g))
    
  }
 
let search_term = "ENST00000641515.2:c.426G>A"

//search_data(search_term);

let inx =[]

list_of_lists[0].forEach( (col_name,index) => {
    if(column_name_list.includes(col_name.toLowerCase())) inx.push(index)
        
    });
console.log(inx)  

// this line maps a filter to all lines. The filter checks if the column exists in the keep indicies list.
let filtered = list_of_lists.map(  row => row.filter( (_,i) => inx.includes(i) )  )
console.log(filtered[0])

}
processLineByLine()



// function search_data(search_term) {
//     for (let line = 0; line < list_of_lists.length; line++) {
//         // console.log("col name : ",list_of_lists[0][index] , " value:  ",list_of_lists[20][index] )
//         if (list_of_lists[line].includes(search_term)) {

//             //console.log(list_of_lists[index]); 
//             // console.log("col name : ",list_of_lists[0][index] , " value:  ",list_of_lists[20][index] )
//             for (let i = 0; i < list_of_lists[line].length - 2400; i++) {
//                 console.log("col name : ", list_of_lists[0][i], " value:  ", list_of_lists[line][i]);
//             }
//             line = list_of_lists.length;
//         }

//     }
// }
