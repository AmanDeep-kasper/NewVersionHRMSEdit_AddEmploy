import React from "react";
import toast from "react-hot-toast";
import { MdCopyAll } from "react-icons/md";

const CopyToClipboard = ({ content }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success(`( ${content} ) Copied to clipboard!`);
  };

  return (
    <>
      {content && (
        <span className="copy-button" onClick={handleCopy}>
          <MdCopyAll className="fs-5" />
        </span>
      )}
    </>
  );
};

export default CopyToClipboard;
