import axios from "axios";

export const API = " https://api.quinn.care/graph";

const requestObject = (token = null, maxCount = "5") => ({
    "requestobjects": [
        {
          "posts": {
            "operationtype": "read",        
            "id": {
              "return": true
            },
            "userid": {
                "searchvalues": ["adbef521-7cf6-4344-af48-a9480df46549"],
                "return": true
            },
            "iscalendarentry": {
                "searchvalues" : ["true"],
              "return": true
            },        
            "media": {
              "return": true
            },
            "rating": {
              "return": true
            },
            "text": {
              "return": true
            },
            "privacy": {
              "searchvalues": [
                18
              ],
              "return": true
            },
            "typeofday": {
              "return": true
            },
            "calendardatetime": { 
              "return": true  ,
              "sort" : "descending" 
            },
            "maxitemcount": maxCount,   
            "continuationtoken": token
          }
        }
      ]
})


export const getTilesData = async (token, maxcount) => {
    const response = await axios.post(API, requestObject(token, maxcount));
    return response.data;
}