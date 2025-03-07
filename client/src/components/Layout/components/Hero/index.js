import { motion } from 'framer-motion';
import { styles } from '~/styles';

import { TokyoCanvas } from '../canvas';

function Hero() {
    return (
        <section className="relative w-full mx-auto">
            <div className="abosulte w-full h-96 ">
                <TokyoCanvas />
            </div>
            <div className="w-full rounded-lg bg-white p-2">
                <span className="text-black-100 text-sm">Hello, I'm a developer or IoT in Vietnam</span>
            </div>
        </section>
    );
}

export default Hero;
