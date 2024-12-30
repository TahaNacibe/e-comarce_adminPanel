export default class StaticsServices {

    //* get statics data
    getShopStaticsAndData = async () => {
        try {
            const response = await fetch("/api/dashboard", {
            method:"GET"
            })
            
            if (response.ok) {
                const data = await response.json()
                return {succuss:true, message:"data loaded!",data:data}
            }
            return {succuss:false, message:"Couldn't load data",data:"something went wrong!"}
        } catch (error:any) {
            return {succuss:false, message:"Error while loading data",data:error.message}
        }
    }

}