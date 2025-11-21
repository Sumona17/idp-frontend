import React from "react";
import { Modal } from "antd";
import { CustomModalContent } from "../../style/components/PopupModal";

const PopupModal = ({ open, onCancel, content, icon, width }) => {
  return (
    <div>
      <div>
        <Modal open={open} onCancel={onCancel} footer={null} width={width}>
          <CustomModalContent>
            <img src={icon}></img>
            {content}
          </CustomModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default PopupModal;
