import React, { useState } from 'react';
import Header from './Header';
import MobileMenuButton from '../mobile/MobileMenuButton';
import MobileDrawer from '../mobile/MobileDrawer';

export default function NavBar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

    const handleDrawerToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <>
            <div className="hidden relative md:flex flex-col justify-center">
                <Header />
            </div>
            <div className="md:hidden relative flex flex-row mb-4">
                <MobileMenuButton onClick={handleDrawerToggle} />
                <MobileDrawer isOpen={isDrawerOpen} onClose={handleDrawerToggle} />
            </div>
        </>
    );
}