import delve from 'dlv';
import Cta from './cta';
import LocalSwitch from './localSwitch';
import Logo from './logo';
import Nav from './nav';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import Link from 'next/link';

const Navigation = ({ navigation, pageData, type }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="text-gray-600 bg-white body-font border-b-2">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Logo
          button={delve(navigation, 'leftButton')}
          locale={delve(pageData, 'attributes.locale')}
        />

        <Nav
          links={delve(navigation, 'links')}
          locale={delve(pageData, 'attributes.locale')}
        />

        {delve(navigation, 'rightButton') && (
          <div className="flex items-center">
            {user?.username != null ? (
              <>
                <span className="mr-5 text-gray-700">Hello, {user.username}</span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth">
                <a className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                  Login / Register
                </a>
              </Link>
            )}
            <div className="ml-4">
              <LocalSwitch pageData={pageData} type={type} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

Navigation.defaultProps = {};

export default Navigation;
