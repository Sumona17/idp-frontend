import { Drawer } from "antd";
import { CustomDrawerContent } from "../../styles/components/PopupModal";

const PopupModalRight = ({ open, onCancel, content }) => {
  return (
    <Drawer
      open={open}
      onClose={onCancel}
      placement="right"
      width={450}
      closable = {false}
      bodyStyle={{
        padding: "16px",
      }}
    >
      <CustomDrawerContent>{content}</CustomDrawerContent>
    </Drawer>
  );
};

export default PopupModalRight;
