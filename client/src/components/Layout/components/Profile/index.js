import { logo as avatar } from '~/assets';

function Profile() {
    return (
        <div className="flex text-left gap-10 mt-8">
            <div className="w-full">
                <h4 className='font-bold text-xl mb-2'>Nguyen Duc Trung - 23730831 - IOT Developer</h4>
                <p>Digital Marketing - Developer</p>
            </div>
            <div className="relative w-40 h-32 p-1 rounded-full flex bg-white items-center justify-center overflow-auto">
                <img src={avatar} alt="avatar" className="w-full rounded-full h-full object-cover" />
            </div>
        </div>
    );
}

export default Profile;
