import { getDocumentById, getDocuments } from "../crud/GeneralCRUD";
import React, { useState, useEffect } from 'react';
import { Tabla } from "./words_table";

export function Words(props){
    const {user, isLoading} = props;
    const [userLoaded, setUserLoaded] = useState({});

    useEffect(() => {
        if (!isLoading) {
          getDocuments("Users_Database/" + user.uid + "/Words")
            .then((result) => {
              setUserLoaded(result);
            })
            .catch((error) => {
              console.error(error);
            })
        }
      }, [user, isLoading]);

    if(!isLoading){  
        console.log(userLoaded);


        return(
            <>
                <h1> HOLA MANITO COMO ESTAS {}</h1>
                <h2> NO ME GUSTA TU NOMBRE {}</h2>

                {userLoaded && Object.keys(userLoaded).length > 0 && (
                <Tabla datos={userLoaded}></Tabla>
                )}
            </>
        )
    }else{
        return(
            <>
                <h1>Cargando Manito</h1>
            </>
        )
    }

    
}