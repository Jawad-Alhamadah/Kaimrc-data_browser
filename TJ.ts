import  {VariantExome}  from "./lib/Classes/ClinvarDataClasses/VariantExome";

console.log(new VariantExome() )
let variant = new VariantExome()
let myJson:{[key: string]: any} ={}
for(let x in variant ){
    console.log(variant[x])
    myJson[x]= variant[x]
}

console.log(myJson)
