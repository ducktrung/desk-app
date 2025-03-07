import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { navLinks } from '~/constants';
import { menu, close, logo } from '~/assets';

function Header() {
    const [active, setActive] = useState('');
    const [toggle, setToggle] = useState(false);
    useEffect(() => {});

    return (
        <div className={`w-6/12 flex item-center py-5 fixed top-0 z-20`} >
            <div className="w-full flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2" onClick={() => setActive('')}>
                    <img src={logo} alt="logo" className="w-9 h-9 object-cover rounded-full" />
                    <p className="text-white text-[18px] font-bold cursor-pointer flex">ATRUST | 2005</p>
                </Link>
                <ul className="list-none hidden sm:flex flex-row gap-10">
                    {navLinks.map( nav => (
                        <li
                            key={nav.id}
                            className={`${
                                active === nav.title ? 'text-white' : 'text-secondary'
                            } hover:text-white text-[18px] font-medium cursor-pointer`}
                            onClick={() => setActive(nav.title)}
                        >
                            <a href={`#${nav.id}`}> {nav.title} </a>
                        </li>
                    ))}
                </ul>
                <div className="sm:hidden flex flex-1 justify-end items-center">
                    <img
                        src={toggle ? close : menu}
                        alt="menu"
                        className="w-[28px] h-[28px] object-contain"
                        onClick={() => setToggle(!toggle)}
                    />
                    <div
                        className={`${
                            !toggle ? 'hidden' : 'flex'
                        } p-6 bg-black absolute top-20 right-0 mx-4 min-w-[140px] z-10 rounded-xl `}
                    >
                        <ul className='list-none justify-end items-start flex-1 flex-col gap-4'>
                            {navLinks.map(nav => (
                                <li
                                    key={nav.id}
                                    className={`${
                                        active === nav.title ? 'text-white' : 'text-secondery'
                                    } font-poppins font-medium cursor-pointer text-[16px] mb-4 pb-3 border-b-2`}
                                    onClick={() => {
                                        setActive(nav.title)
                                        setToggle(!toggle)
                                    }}
                                >
                                    <a href={`#${nav.id}`}>{nav.title}</a>
                                </li> 
                            ))}
                        </ul>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
