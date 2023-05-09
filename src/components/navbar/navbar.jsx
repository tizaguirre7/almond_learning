import React from "react";
import almondImage from "../../assets/Almond.png";
import './navbar.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate, Link } from "react-router-dom";

//FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'


export function Navbar() {

	const navigate = useNavigate();

	const handleLogout = async () => {
		await signOut(auth);
		navigate("/");
	};


    function searchToggle(obj, evt){
        var container = $(obj).closest('.search-wrapper');
            if(!container.hasclassName('active')){
                container.addclassName('active');
                evt.preventDefault();
            }
            else if(container.hasclassName('active') && $(obj).closest('.input-holder').length == 0){
                container.removeclassName('active');
                // clear input
                container.find('.search-input').val('');
            }
    }

	return (
		<nav className="bg-dark navbar navbar-expand-sm  w-100 m-0 text-light" id="neubar">
			<div className="container">
				<a className="navbar-brand" href="/dashboard">
					<img
						src={almondImage}
						height="60"
					/>
				</a>
                <div className="search-wrapper">
					<input type="text" className="search-click" name="" placeholder="search here..." />
					<FontAwesomeIcon className="search-icon text-muted" icon={faMagnifyingGlass} />
				</div>	
                
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNavDropdown"
					aria-controls="navbarNavDropdown"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className=" collapse navbar-collapse" id="navbarNavDropdown">
					<ul className="navbar-nav ms-auto ">
						<li className="nav-item">
							<a
								className="nav-link mx-2 active"
								aria-current="page"
								href="#"
							>
								Home
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link mx-2" href="#">
								About
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link mx-2" href="#">
								Pricing
							</a>
						</li>
                        <li className="nav-item">
							
								
							
                                <Dropdown>
                                    <Dropdown.Toggle id="dropdown-basic">
                                    <FontAwesomeIcon icon={faUser} />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu variant="dark">
                                        <Dropdown.Item href="#/action-1">Your Profile</Dropdown.Item>
                                        <Dropdown.Item href="#/action-2">Settings</Dropdown.Item>
                                        <Dropdown.Item onClick={handleLogout}>Sign Out</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
						</li>
                        

					</ul>
				</div>
			</div>
		</nav>
	);
}
