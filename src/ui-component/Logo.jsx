import logoImage from '../../logo_web.png';

const Logo = ({ width, height }) => {
  return <img src={logoImage} alt="Logo" style={{ width: width ? width : '70px', height: height ? height : '70px' }} />;
};

export default Logo;
