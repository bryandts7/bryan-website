import { Menu } from "antd";

const LeftMenu = ({ mode } : any) => {
  return (
    <Menu mode={mode}>
      <Menu.Item key="about" className="bg-gray-900 hover:bg-white transition-colors duration-300">
        <a className="!text-white hover:!text-black" href="/">About Me</a>
      </Menu.Item>

      <Menu.Item key="experiences" className="bg-gray-900 hover:bg-white transition-colors duration-300">
        <a className="!text-white hover:!text-black" href="/experiences">Experiences</a>
      </Menu.Item>

      <Menu.Item key="contact" className="bg-gray-900 hover:bg-white transition-colors duration-300">
        <a className="!text-white hover:!text-black" href="/portfolio">Projects</a>
      </Menu.Item>
      <Menu.Item key="blogs" className="bg-gray-900 hover:bg-white transition-colors duration-300">
        <a className="!text-white hover:!text-black" href="/blogs">Blog</a>
      </Menu.Item>
    </Menu>
  );
};

export default LeftMenu;