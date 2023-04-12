export default function StringToFloat(s){
    if (! typeof s === undefined){
        return parseFloat(s.replace(',','.'))
    } else {
        return undefined
    }
    
}