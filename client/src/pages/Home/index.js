import Hero from '~/components/Layout/components/Hero';
import Profile from '~/components/Layout/components/Profile';
import Products from '~/components/Layout/components/Products'

function Home() {
    return (
        <div className="w-6/12 m-auto">
            <Hero />
            <Profile />
            <Products />
        </div>
    );
}

export default Home;
