import Header from '~/components/Layout/components/Header';

function DefaultLayout({ children }) {
    return (
        <div>
            <div className="relative z-1">
                <div className="w-6/12 mx-auto bg-black bg-cover bg-no-repeat bg-center">
                    <Header />
                </div>
            </div>
            <div className="bg-cover bg-no-repeat bg-center">{children}</div>
        </div>
    );
}

export default DefaultLayout;
