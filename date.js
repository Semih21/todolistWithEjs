module.exports=getDate

function getDate(){
    let today=new Date()
    let day=""
    let options = { weekday: 'long',  month: 'long', day: 'numeric' };
     day=today.toLocaleDateString("en-US",options)

     return day;

}

