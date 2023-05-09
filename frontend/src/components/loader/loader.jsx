import React from 'react'
import './loader.css'
import almondImage from './Almond.png'


export function Loader() {

  return (
    <div className="loader-wrapper">
    <div className="containerLoader">
      <div className="spinner"></div>
      <img className="img" src={almondImage} alt="Almond" />
    </div>
  </div>
    
  )
}
