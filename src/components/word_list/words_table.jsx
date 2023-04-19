import React, { useState, useEffect } from 'react';
import { getDocumentById, getDocuments } from "../crud/GeneralCRUD";

export function Tabla({ datos }) {
  const [datosTabla, setDatosTabla] = useState([]);

  useEffect(() => {
    setDatosTabla(datos);
  }, [datos]);


    return (
        <table>
          <thead>
            <tr>
              <th>Word</th>
              <th>Example</th>
              <th>Id</th>
            </tr>
          </thead>
          <tbody>
          {datosTabla.map((dato) => (
          <tr key={dato.id}>
            <td>{dato.word}</td>
            <td>{dato.example}</td>
            <td>{dato.id}</td>
          </tr>
        ))}
           </tbody>
        </table>
    );
}