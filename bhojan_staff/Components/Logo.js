import BhojanWithRojanLogo from '../assets/bhojan_with_rojan_logo.png'
import Image from 'next/image';

const Logo = () => {
    return <>
        <div className='logo'>
            <Image src={BhojanWithRojanLogo} alt="" width="160px" height="160px"></Image>
        </div>
    </>
}

export default Logo;