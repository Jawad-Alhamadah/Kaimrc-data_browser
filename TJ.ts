import  {VariantExome}  from "./lib/Classes/ClinvarDataClasses/VariantExome";

// console.log(new VariantExome() )
// let variant = new VariantExome()
// let myJson:{[key: string]: any} ={}
// for(let x in variant ){
//     console.log(variant[x])
//     myJson[x]= variant[x]
// }

// console.log(myJson)

let myarray = new Array(100)
let myarray_2 =new Array(100)
console.time("list.length method timer")
for (let index = 0; index < 1000; index++) {
    myarray[myarray.length]="filled"
    
}
console.timeEnd("list.length method timer")

console.time("push method")
for (let index = 0; index < 1000; index++) {
    myarray_2.push("filled")
    
}
console.timeEnd("push method")
