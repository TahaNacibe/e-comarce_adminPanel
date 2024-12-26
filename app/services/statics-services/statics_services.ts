export default class StaticsServices {

    //* get statics data
    getShopStaticsAndData = async () => {
        try {
            const response = await fetch("/api/dashboard", {
            method:"GET"
            })
            
            if (response.ok) {
                const data = await response.json()
                return data
            }
            return 
        } catch (error) {
            console.log(error)
        }
    }

}